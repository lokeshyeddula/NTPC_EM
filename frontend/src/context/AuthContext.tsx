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


    // ========================================================
    // CHECK EXISTING LOGIN
    // ========================================================

    useEffect(() => {

        const access =
            localStorage.getItem("access");

        const refresh =
            localStorage.getItem("refresh");


        if (!access && !refresh) {

            setLoading(false);

            return;
        }


        loadProfile();

    }, []);


    // ========================================================
    // LOAD PROFILE
    // ========================================================

    async function loadProfile() {

        try {

            const profile =
                await authService.getProfile();

            setUser(profile);

        } catch (error) {

            console.error(
                "Unable to load profile:",
                error
            );

            /*
             * IMPORTANT:
             *
             * DO NOT CALL logout() HERE.
             *
             * Axios interceptor handles:
             *
             * 401
             *   ↓
             * refresh token
             *   ↓
             * retry request
             *
             * A temporary API/network problem must
             * not destroy the user's session.
             */

            const access =
                localStorage.getItem("access");

            const refresh =
                localStorage.getItem("refresh");


            /*
             * If tokens still exist, keep the session.
             */

            if (access || refresh) {

                console.log(
                    "Authentication tokens still exist."
                );

            } else {

                setUser(null);

            }

        } finally {

            setLoading(false);

        }

    }


    // ========================================================
    // LOGIN
    // ========================================================

    async function login(
        data: LoginRequest
    ) {

        const response =
            await authService.login(data);


        /*
         * Save tokens BEFORE setting user.
         */

        localStorage.setItem(
            "access",
            response.access
        );


        localStorage.setItem(
            "refresh",
            response.refresh
        );


        /*
         * Login response already contains
         * user information.
         *
         * Therefore no additional profile
         * request is required here.
         */

        setUser(response.user);

    }


    // ========================================================
    // REGISTER
    // ========================================================

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


    // ========================================================
    // LOGOUT
    // ========================================================

    function logout() {

        /*
         * Only remove authentication tokens.
         *
         * Do NOT use localStorage.clear().
         */

        localStorage.removeItem("access");

        localStorage.removeItem("refresh");


        setUser(null);


        window.location.href =
            "/login";

    }


    // ========================================================
    // CONTEXT
    // ========================================================

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


// ============================================================
// USE AUTH
// ============================================================

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