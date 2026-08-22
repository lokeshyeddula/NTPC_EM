import axios, {
    type AxiosError,
    type InternalAxiosRequestConfig,
} from "axios";

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});


// ============================================================
// REQUEST
// ============================================================

api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {

        const access =
            localStorage.getItem("access");

        if (access) {

            config.headers.Authorization =
                `Bearer ${access}`;

        }

        return config;
    },

    (error) =>
        Promise.reject(error)
);


// ============================================================
// RESPONSE
// ============================================================

api.interceptors.response.use(

    (response) => response,

    async (error: AxiosError) => {

        const originalRequest =
            error.config as
            (InternalAxiosRequestConfig & {
                _retry?: boolean;
            }) | undefined;


        if (!originalRequest) {
            return Promise.reject(error);
        }


        // ----------------------------------------------------
        // Only handle 401
        // ----------------------------------------------------

        if (
            error.response?.status !== 401 ||
            originalRequest._retry
        ) {

            return Promise.reject(error);

        }


        // ----------------------------------------------------
        // Never intercept refresh request
        // ----------------------------------------------------

        if (
            originalRequest.url?.includes(
                "/auth/token/refresh/"
            )
        ) {

            return Promise.reject(error);

        }


        originalRequest._retry = true;


        const refresh =
            localStorage.getItem("refresh");


        if (!refresh) {

            console.error(
                "No refresh token available."
            );

            localStorage.removeItem("access");
            localStorage.removeItem("refresh");

            window.location.href =
                "/login";

            return Promise.reject(error);

        }


        try {

            console.log(
                "Access token expired. Refreshing..."
            );


            const refreshResponse =
                await axios.post(

                    `${API_BASE_URL}/auth/token/refresh/`,

                    {
                        refresh,
                    },

                    {
                        headers: {
                            "Content-Type":
                                "application/json",
                        },
                    }

                );


            const newAccess =
                refreshResponse.data.access;


            if (!newAccess) {

                throw new Error(
                    "Refresh response did not contain access token."
                );

            }


            localStorage.setItem(
                "access",
                newAccess
            );


            originalRequest.headers.Authorization =
                `Bearer ${newAccess}`;


            console.log(
                "Token refreshed successfully."
            );


            return api(originalRequest);


        } catch (refreshError) {

            console.error(
                "Refresh token failed:",
                refreshError
            );


            localStorage.removeItem("access");
            localStorage.removeItem("refresh");


            window.location.href =
                "/login";


            return Promise.reject(
                refreshError
            );

        }

    }

);


export default api;