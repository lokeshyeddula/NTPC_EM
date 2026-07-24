export interface User {
    id: string;

    emp_id: string;

    full_name: string;

    designation: string;

    department: string;

    company: string;

    email: string;

    mobile_number: string;

    is_admin: boolean;

    is_first_login: boolean;
}

export interface LoginRequest {
    emp_id: string;

    password: string;
}

export interface RegisterRequest {
    emp_id: string;

    full_name: string;

    designation: string;

    department: string;

    company: string;

    email: string;

    mobile_number: string;

    password: string;

    confirm_password: string;
}

export interface LoginResponse {
    access: string;

    refresh: string;

    user: User;

    message: string;
}

export interface ChangePasswordRequest {
    old_password: string;

    new_password: string;
}

export interface ApiResponse<T> {
    success: boolean;

    message?: string;

    data?: T;
}