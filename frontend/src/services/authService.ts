import api from "../api/axios";
import ENDPOINTS from "../api/endpoints";

import type {
    LoginRequest,
    LoginResponse,
    RegisterRequest,
    User,
    ChangePasswordRequest,
} from "../types/auth";

class AuthService {

    async login(
        data: LoginRequest
    ): Promise<LoginResponse> {

        const response = await api.post(
            ENDPOINTS.LOGIN,
            data
        );

        return response.data;
    }

async register(
    data: RegisterRequest
): Promise<LoginResponse> {

    const response = await api.post(
        ENDPOINTS.REGISTER,
        data
    );

    return response.data;
}

    async getProfile(): Promise<User> {

        const response = await api.get(
            ENDPOINTS.PROFILE
        );

        return response.data;
    }

    async updateProfile(
        data: Partial<User>
    ) {

        const response = await api.put(
            ENDPOINTS.PROFILE,
            data
        );

        return response.data;
    }

    async changePassword(
        data: ChangePasswordRequest
    ) {

        const response = await api.post(
            ENDPOINTS.CHANGE_PASSWORD,
            data
        );

        return response.data;
    }

    logout() {

        localStorage.clear();

        window.location.href = "/login";
    }

}

export default new AuthService();