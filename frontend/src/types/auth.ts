export interface User {
    id: number;
    emp_id: string;
    full_name: string;
    designation: string;
    email: string;
    is_admin: boolean;
    is_first_login: boolean;
}

export interface LoginRequest {
    emp_id: string;
    password: string;
}

export interface LoginResponse {
    access: string;
    refresh: string;
    user: User;
}

export interface ChangePasswordRequest {
    old_password: string;
    new_password: string;
    confirm_password: string;
}

export interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data?: T;
}