import { Navigate } from "react-router-dom";

import useAuth from "../hooks/useAuth";

import type { ReactNode } from "react";

interface Props {
    children: ReactNode;
}

export default function ProtectedRoute({ children }: Props) {

    const {
        loading,
        isAuthenticated,
    } = useAuth();

    if (loading) {

        return <h2>Loading...</h2>;

    }

    if (!isAuthenticated) {

        return <Navigate to="/" replace />;

    }

    return children;

}