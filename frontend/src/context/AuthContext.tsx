import {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from "react";

import authService from "../services/authService";

import type {
    LoginRequest,
    User,
} from "../types/auth";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    isAuthenticated: boolean;
    login: (data: LoginRequest) => Promise<void>;
    logout: () => void;
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

    async function login(data: LoginRequest) {

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

    function logout() {

        localStorage.removeItem("access");

        localStorage.removeItem("refresh");

        setUser(null);

    }

    return (

        <AuthContext.Provider
            value={{
                user,
                loading,
                isAuthenticated: !!user,
                login,
                logout,
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