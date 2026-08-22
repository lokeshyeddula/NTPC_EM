import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import type { ReactNode } from "react";

import authService from "../services/authService";

import type {
    LoginRequest,
    RegisterRequest,
    User,
} from "../types/auth";


interface AuthContextType {

    user: User | null;

    loading: boolean;

    isAuthenticated: boolean;

    login: (data: LoginRequest) => Promise<void>;

    register: (data: RegisterRequest) => Promise<void>;

    logout: () => void;

    setUser: React.Dispatch<
        React.SetStateAction<User | null>
    >;
}


const AuthContext = createContext<
    AuthContextType | undefined
>(undefined);


interface Props {
    children: ReactNode;
}


export function AuthProvider({
    children,
}: Props) {

    const [user, setUser] =
        useState<User | null>(null);

    const [loading, setLoading] =
        useState(true);


    useEffect(() => {

        const access =
            localStorage.getItem("access");

        const refresh =
            localStorage.getItem("refresh");


        // No tokens = not logged in
        if (!access && !refresh) {

            setLoading(false);

            return;
        }


        loadProfile();

    }, []);


    async function loadProfile() {

        try {

            const profile =
                await authService.getProfile();

            setUser(profile);

        } catch (error) {

            console.error(
                "Unable to load user profile:",
                error
            );

            /*
             * IMPORTANT:
             *
             * Do NOT logout here.
             *
             * Axios interceptor already handles
             * access-token refresh.
             *
             * A temporary API/network error should
             * never destroy the user's session.
             */

            const access =
                localStorage.getItem("access");

            const refresh =
                localStorage.getItem("refresh");


            /*
             * Only consider the user unauthenticated
             * if BOTH tokens are missing.
             */

            if (!access && !refresh) {

                setUser(null);

            }

        } finally {

            setLoading(false);

        }
    }


    async function login(
        data: LoginRequest
    ) {

        const response =
            await authService.login(data);


        localStorage.setItem(
            "access",
            response.access
        );


        localStorage.setItem(
            "refresh",
            response.refresh
        );


        setUser(response.user);

    }


    async function register(
        data: RegisterRequest
    ) {

        const response =
            await authService.register(data);


        localStorage.setItem(
            "access",
            response.access
        );


        localStorage.setItem(
            "refresh",
            response.refresh
        );


        setUser(response.user);

    }


    function logout() {

        /*
         * Explicit user logout only.
         */

        localStorage.removeItem("access");

        localStorage.removeItem("refresh");

        setUser(null);

        window.location.href = "/login";

    }


    return (

        <AuthContext.Provider
            value={{
                user,

                loading,

                isAuthenticated:
                    !!user,

                login,

                register,

                logout,

                setUser,
            }}
        >

            {children}

        </AuthContext.Provider>

    );

}


export function useAuth() {

    const context =
        useContext(AuthContext);


    if (!context) {

        throw new Error(
            "useAuth must be used inside AuthProvider"
        );

    }


    return context;

}