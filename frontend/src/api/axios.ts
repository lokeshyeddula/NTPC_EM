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
// REQUEST INTERCEPTOR
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

    (error) => {

        return Promise.reject(error);

    }

);


// ============================================================
// RESPONSE INTERCEPTOR
// ============================================================

api.interceptors.response.use(

    (response) => {

        return response;

    },


    async (error: AxiosError) => {

        const originalRequest =
            error.config as
            (InternalAxiosRequestConfig & {
                _retry?: boolean;
            }) | undefined;


        // ----------------------------------------------------
        // No request information
        // ----------------------------------------------------

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
        // Never refresh the refresh-token request itself
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


        // ----------------------------------------------------
        // No refresh token
        // ----------------------------------------------------

        if (!refresh) {

            localStorage.removeItem("access");

            localStorage.removeItem("refresh");

            window.location.href = "/login";

            return Promise.reject(error);

        }


        try {

            // ------------------------------------------------
            // Use plain axios here.
            //
            // DO NOT use `api.post()` because that would
            // trigger this interceptor again.
            // ------------------------------------------------

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
                    "No access token returned."
                );

            }


            // ------------------------------------------------
            // Save new access token
            // ------------------------------------------------

            localStorage.setItem(
                "access",
                newAccess
            );


            // ------------------------------------------------
            // Update original request
            // ------------------------------------------------

            originalRequest.headers.Authorization =
                `Bearer ${newAccess}`;


            // ------------------------------------------------
            // Retry original request
            // ------------------------------------------------

            return api(originalRequest);


        } catch (refreshError) {

            console.error(
                "Token refresh failed:",
                refreshError
            );


            // ------------------------------------------------
            // Refresh token is invalid/expired.
            // NOW logout.
            // ------------------------------------------------

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