import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, LogIn } from "lucide-react";

import ntpcLogo from "../../assets/ntpc_logo.png";
import nmlLogo from "../../assets/nml_logo.png";

import useAuth from "../../hooks/useAuth";

export default function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [empId, setEmpId] = useState("");
    const [password, setPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(
        e: React.FormEvent<HTMLFormElement>
    ) {
        e.preventDefault();

        setError("");

        if (!empId.trim()) {
            setError("Employee ID is required.");
            return;
        }

        if (!password.trim()) {
            setError("Password is required.");
            return;
        }

        try {
            setLoading(true);

            await login({
                emp_id: empId.trim(),
                password,
            });

            navigate("/dashboard");
        } catch {
            setError("Invalid Employee ID or Password.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-100 flex items-center justify-center px-4 py-6">

            <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl border border-gray-200 overflow-hidden">

                {/* Header */}

                <div className="bg-blue-900 px-6 py-5">

                    <div className="flex items-center justify-between">

                        <img
                            src={ntpcLogo}
                            alt="NTPC"
                            className="h-12 w-auto sm:h-14"
                        />

                        <img
                            src={nmlLogo}
                            alt="NML"
                            className="h-12 w-auto sm:h-14"
                        />

                    </div>

                </div>

                {/* Body */}

                <div className="p-6 sm:p-8">

                    <div className="text-center mb-8">

                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                            NTPC E&M
                        </h1>

                        <p className="mt-2 text-sm sm:text-base text-gray-600">
                            Random  Inspection System
                        </p>

                    </div>

                    {error && (

                        <div className="mb-5 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">

                            {error}

                        </div>

                    )}

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5"
                    >

                        {/* Employee ID */}

                        <div>

                            <label className="mb-2 block text-sm font-semibold text-gray-700">

                                Employee ID

                            </label>

                            <input
                                type="text"
                                autoComplete="username"
                                value={empId}
                                onChange={(e) =>
                                    setEmpId(e.target.value)
                                }
                                placeholder="Enter Employee ID"
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200"
                            />

                        </div>

                        {/* Password */}

                        <div>

                            <label className="mb-2 block text-sm font-semibold text-gray-700">

                                Password

                            </label>

                            <div className="relative">

                                <input
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    autoComplete="current-password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Enter Password"
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-12 text-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200"
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(
                                            !showPassword
                                        )
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-700"
                                >

                                    {showPassword ? (
                                        <EyeOff size={20} />
                                    ) : (
                                        <Eye size={20} />
                                    )}

                                </button>

                            </div>

                        </div>

                        {/* Login Button */}

                        <button
                            type="submit"
                            disabled={loading}
                            className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-900 px-4 py-3 font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
                        >

                            <LogIn size={18} />

                            {loading
                                ? "Signing In..."
                                : "Login"}

                        </button>

                    </form>

                    {/* Divider */}

                    <div className="my-6 flex items-center">

                        <div className="h-px flex-1 bg-gray-300" />

                        <span className="px-3 text-sm text-gray-500">
                            OR
                        </span>

                        <div className="h-px flex-1 bg-gray-300" />

                    </div>

                    {/* Register */}

                    <div className="text-center">

                        <p className="text-sm text-gray-600">

                            Don't have an account?

                        </p>

                        <Link
                            to="/register"
                            className="mt-2 inline-block font-semibold text-blue-700 hover:underline"
                        >
                            Create New Account
                        </Link>

                    </div>

                </div>

            </div>

        </div>
    );
}