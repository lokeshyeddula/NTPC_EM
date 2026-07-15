import api from "../api/axios";
import ENDPOINTS from "../api/endpoints";

import type {
    LoginRequest,
    LoginResponse,
} from "../types/auth";

class AuthService {

    async login(data: LoginRequest): Promise<LoginResponse> {

        const response = await api.post(
            ENDPOINTS.LOGIN,
            data
        );

        return response.data;
    }

    async getProfile() {

        const response = await api.get(
            ENDPOINTS.PROFILE
        );

        return response.data;
    }

    async changePassword(data: any) {

        const response = await api.post(
            ENDPOINTS.CHANGE_PASSWORD,
            data
        );

        return response.data;
    }

    logout() {

        localStorage.removeItem("access");
        localStorage.removeItem("refresh");

        window.location.href = "/";
    }

}

export default new AuthService();