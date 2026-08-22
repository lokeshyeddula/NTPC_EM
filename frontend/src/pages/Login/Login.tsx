import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    Eye,
    EyeOff,
    LogIn,
    ShieldCheck,
} from "lucide-react";

import ntpcLogo from "../../assets/Ntpc_logo.png";
import nmlLogo from "../../assets/nml_logo.png";

import useAuth from "../../hooks/useAuth";

export default function Login() {

    const navigate = useNavigate();
    const { login } = useAuth();

    const [empId, setEmpId] = useState("");
    const [password, setPassword] = useState("");

    const [showPassword, setShowPassword] =
        useState(false);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");


    async function handleSubmit(
        e: React.FormEvent<HTMLFormElement>
    ) {

        e.preventDefault();

        setError("");


        if (!empId.trim()) {

            setError(
                "Employee ID is required."
            );

            return;
        }


        if (!password.trim()) {

            setError(
                "Password is required."
            );

            return;
        }


        try {

            setLoading(true);

            await login({
                emp_id: empId.trim(),
                password,
            });

            navigate(
                "/dashboard",
                { replace: true }
            );

        } catch {

            setError(
                "Invalid Employee ID or Password."
            );

        } finally {

            setLoading(false);

        }
    }


    return (

        <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4 py-8">

            <div className="w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-2xl border border-slate-200">


                {/* =================================================
                    TOP BRANDING
                ================================================= */}

                <div className="bg-gradient-to-r from-slate-950 via-blue-950 to-blue-900 px-6 py-6 sm:px-10">

                    <div className="flex items-center justify-between gap-4">


                        {/* NTPC */}

                        <div className="flex h-14 items-center rounded-xl bg-white px-3 shadow-md">

                            <img
                                src={ntpcLogo}
                                alt="NTPC"
                                className="h-10 w-auto"
                            />

                        </div>


                        {/* NIRIKSHAN */}

                        <div className="text-center">

                            <div className="flex items-center justify-center gap-2">

                                <ShieldCheck
                                    size={22}
                                    className="text-blue-300"
                                />

                                <h1 className="text-xl sm:text-2xl font-extrabold tracking-wider text-white">
                                    NIRIKSHAN
                                </h1>

                            </div>

                            <p className="mt-1 text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.18em] text-blue-200">
                                Digital Machinery Inspection
                            </p>

                        </div>


                        {/* NML */}

                        <div className="flex h-14 items-center rounded-xl bg-white px-3 shadow-md">

                            <img
                                src={nmlLogo}
                                alt="NML"
                                className="h-10 w-auto"
                            />

                        </div>

                    </div>

                </div>


                {/* =================================================
                    LOGIN AREA
                ================================================= */}

                <div className="grid grid-cols-1 lg:grid-cols-2">


                    {/* LEFT INFORMATION PANEL */}

                    <div className="hidden lg:flex flex-col justify-center bg-gradient-to-br from-blue-950 to-slate-900 p-10 text-white">

                        <div className="max-w-md">

                            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 shadow-lg shadow-blue-950/40">

                                <ShieldCheck
                                    size={30}
                                    strokeWidth={2}
                                />

                            </div>


                            <h2 className="text-3xl font-bold leading-tight">

                                Machinery Inspection
                                <span className="block text-blue-400">
                                    Management System
                                </span>

                            </h2>


                            <p className="mt-5 text-sm leading-6 text-slate-300">

                                A digital platform for machinery
                                inspection, checklist management,
                                re-inspection tracking and inspection
                                reporting.

                            </p>


                            <div className="mt-8 space-y-3">

                                <div className="flex items-center gap-3">

                                    <span className="h-2 w-2 rounded-full bg-green-400" />

                                    <span className="text-sm text-slate-300">
                                        Digital Inspection Records
                                    </span>

                                </div>


                                <div className="flex items-center gap-3">

                                    <span className="h-2 w-2 rounded-full bg-green-400" />

                                    <span className="text-sm text-slate-300">
                                        Machinery Safety Checklists
                                    </span>

                                </div>


                                <div className="flex items-center gap-3">

                                    <span className="h-2 w-2 rounded-full bg-green-400" />

                                    <span className="text-sm text-slate-300">
                                        Re-Inspection Tracking
                                    </span>

                                </div>


                                <div className="flex items-center gap-3">

                                    <span className="h-2 w-2 rounded-full bg-green-400" />

                                    <span className="text-sm text-slate-300">
                                        Reports & Inspection History
                                    </span>

                                </div>

                            </div>


                            <div className="mt-10 border-t border-slate-700 pt-5">

                                <p className="text-xs font-semibold uppercase tracking-wider text-blue-300">
                                    NML Talaipalli
                                </p>

                                <p className="mt-1 text-xs text-slate-400">
                                    E&M Division
                                </p>

                            </div>

                        </div>

                    </div>


                    {/* LOGIN FORM */}

                    <div className="p-6 sm:p-10 lg:p-12">


                        <div className="mb-8">

                            <p className="text-xs font-bold uppercase tracking-widest text-blue-600">
                                Welcome Back
                            </p>

                            <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-slate-900">
                                Sign in to NIRIKSHAN
                            </h2>

                            <p className="mt-2 text-sm text-slate-500">
                                Enter your employee credentials
                                to continue.
                            </p>

                        </div>


                        {/* ERROR */}

                        {error && (

                            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">

                                {error}

                            </div>

                        )}


                        <form
                            onSubmit={handleSubmit}
                            className="space-y-5"
                        >


                            {/* EMPLOYEE ID */}

                            <div>

                                <label className="mb-2 block text-sm font-semibold text-slate-700">

                                    Employee ID

                                </label>

                                <input
                                    type="text"
                                    autoComplete="username"
                                    value={empId}
                                    onChange={(e) =>
                                        setEmpId(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Enter Employee ID"
                                    className="
                                        w-full
                                        rounded-xl
                                        border border-slate-300
                                        bg-slate-50
                                        px-4 py-3
                                        text-sm
                                        text-slate-900
                                        outline-none
                                        transition
                                        placeholder:text-slate-400
                                        focus:border-blue-600
                                        focus:bg-white
                                        focus:ring-4
                                        focus:ring-blue-100
                                    "
                                />

                            </div>


                            {/* PASSWORD */}

                            <div>

                                <label className="mb-2 block text-sm font-semibold text-slate-700">

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
                                        className="
                                            w-full
                                            rounded-xl
                                            border border-slate-300
                                            bg-slate-50
                                            px-4 py-3 pr-12
                                            text-sm
                                            text-slate-900
                                            outline-none
                                            transition
                                            placeholder:text-slate-400
                                            focus:border-blue-600
                                            focus:bg-white
                                            focus:ring-4
                                            focus:ring-blue-100
                                        "
                                    />


                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(
                                                !showPassword
                                            )
                                        }
                                        className="
                                            absolute
                                            right-3
                                            top-1/2
                                            -translate-y-1/2
                                            rounded-lg
                                            p-1.5
                                            text-slate-400
                                            transition
                                            hover:bg-blue-50
                                            hover:text-blue-700
                                        "
                                        aria-label={
                                            showPassword
                                                ? "Hide password"
                                                : "Show password"
                                        }
                                    >

                                        {showPassword ? (

                                            <EyeOff size={19} />

                                        ) : (

                                            <Eye size={19} />

                                        )}

                                    </button>

                                </div>

                            </div>


                            {/* LOGIN BUTTON */}

                            <button
                                type="submit"
                                disabled={loading}
                                className="
                                    flex
                                    w-full
                                    items-center
                                    justify-center
                                    gap-2
                                    rounded-xl
                                    bg-blue-700
                                    px-4 py-3.5
                                    font-semibold
                                    text-white
                                    shadow-lg
                                    shadow-blue-900/20
                                    transition
                                    hover:bg-blue-800
                                    active:scale-[0.99]
                                    disabled:cursor-not-allowed
                                    disabled:opacity-60
                                "
                            >

                                <LogIn size={18} />

                                {loading
                                    ? "Signing In..."
                                    : "Sign In"}

                            </button>

                        </form>


                        {/* DIVIDER */}

                        <div className="my-7 flex items-center">

                            <div className="h-px flex-1 bg-slate-200" />

                            <span className="px-4 text-xs font-medium uppercase tracking-wider text-slate-400">
                                Or
                            </span>

                            <div className="h-px flex-1 bg-slate-200" />

                        </div>


                        {/* REGISTER */}

                        <div className="text-center">

                            <p className="text-sm text-slate-500">
                                Don't have an account?
                            </p>

                            <Link
                                to="/register"
                                className="
                                    mt-2
                                    inline-block
                                    font-semibold
                                    text-blue-700
                                    hover:text-blue-900
                                    hover:underline
                                "
                            >
                                Create New Account
                            </Link>

                        </div>


                        {/* FOOTER */}

                        <div className="mt-8 border-t border-slate-200 pt-5 text-center">

                            <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                                NIRIKSHAN
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                                NML Talaipalli • E&M
                            </p>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );
}