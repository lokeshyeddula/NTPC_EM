import { Navigate } from "react-router-dom";

import useAuth from "../hooks/useAuth";

interface Props {
    children: JSX.Element;
}

export default function ProtectedRoute({
    children,
}: Props) {

    const {
        loading,
        isAuthenticated,
    } = useAuth();

    if (loading) {

        return (

            <div className="min-h-screen flex items-center justify-center bg-slate-100">

                <div className="text-center">

                    <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-blue-900 border-t-transparent"></div>

                    <p className="mt-4 text-gray-600 font-medium">
                        Loading...
                    </p>

                </div>

            </div>

        );

    }

    if (!isAuthenticated) {

        return <Navigate to="/login" replace />;

    }

    return children;

}