import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Request Interceptor
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("access");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor
api.interceptors.response.use(
    (response) => response,

    async (error) => {

        const originalRequest = error.config;

        if (
            error.response?.status === 401 &&
            !originalRequest._retry
        ) {

            originalRequest._retry = true;

            const refresh = localStorage.getItem("refresh");

            if (!refresh) {

                localStorage.clear();

                window.location.href = "/login";

                return Promise.reject(error);
            }

            try {

                const response = await axios.post(

                    `${import.meta.env.VITE_API_URL}/auth/token/refresh/`,

                    {
                        refresh,
                    }

                );

                const access = response.data.access;

                localStorage.setItem(
                    "access",
                    access
                );

                originalRequest.headers.Authorization =
                    `Bearer ${access}`;

                return api(originalRequest);

            } catch {

                localStorage.clear();

                window.location.href = "/login";
            }
        }

        return Promise.reject(error);
    }
);

export default api;