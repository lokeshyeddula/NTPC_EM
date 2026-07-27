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

    setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(
    undefined
);

interface Props {
    children: ReactNode;
}

export function AuthProvider({ children }: Props) {

    const [user, setUser] = useState<User | null>(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const token = localStorage.getItem("access");

        if (!token) {

            setLoading(false);

            return;

        }

        loadProfile();

    }, []);

    async function loadProfile() {

        try {

            const profile = await authService.getProfile();

            setUser(profile);

        } catch {

            logout();

        } finally {

            setLoading(false);

        }

    }

    async function login(
        data: LoginRequest
    ) {

        const response = await authService.login(data);

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

        authService.logout();

        setUser(null);

    }

    return (

        <AuthContext.Provider
            value={{
                user,
                loading,
                isAuthenticated: !!user,
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

    const context = useContext(AuthContext);

    if (!context) {

        throw new Error(
            "useAuth must be used inside AuthProvider"
        );

    }

    return context;

}