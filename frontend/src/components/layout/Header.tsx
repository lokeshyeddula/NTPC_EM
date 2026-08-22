import {
    Menu,
    LogOut,
    ShieldCheck,
} from "lucide-react";

import useAuth from "../../hooks/useAuth";

import ntpcLogo from "../../assets/Ntpc_logo.png";
import nmlLogo from "../../assets/nml_logo.png";


interface Props {
    onMenuClick?: () => void;
}


export default function Header({
    onMenuClick,
}: Props) {

    const {
        user,
        logout,
    } = useAuth();


    const initials =
        user?.full_name
            ?.split(" ")
            .filter(Boolean)
            .map(
                (name) =>
                    name[0]
            )
            .join("")
            .toUpperCase()
            .slice(0, 2) || "U";


    return (

        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-sm">

            <div className="px-4 sm:px-5 lg:px-7">

                <div className="flex h-[72px] items-center justify-between">


                    {/* =================================================
                        LEFT SECTION
                    ================================================= */}

                    <div className="flex min-w-0 items-center gap-3 sm:gap-4">


                        {/* Mobile Menu */}

                        <button
                            type="button"
                            onClick={onMenuClick}
                            aria-label="Open menu"
                            className="md:hidden flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-700 text-white shadow-md shadow-blue-900/20 transition hover:bg-blue-800 active:scale-95"
                        >

                            <Menu size={22} />

                        </button>


                        {/* Organisation Logos */}

                        <div className="hidden sm:flex items-center gap-2.5">

                            <div className="flex h-11 items-center rounded-lg border border-slate-200 bg-white px-2 shadow-sm">

                                <img
                                    src={ntpcLogo}
                                    className="h-8 w-auto"
                                    alt="NTPC"
                                />

                            </div>


                            <div className="flex h-11 items-center rounded-lg border border-slate-200 bg-white px-2 shadow-sm">

                                <img
                                    src={nmlLogo}
                                    className="h-8 w-auto"
                                    alt="NML"
                                />

                            </div>

                        </div>


                        {/* Divider */}

                        <div className="hidden sm:block h-9 w-px bg-slate-200" />


                        {/* NIRIKSHAN Branding */}

                        <div className="min-w-0">

                            <div className="flex items-center gap-2">

                                <h1 className="truncate text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">

                                    NIRIKSHAN

                                </h1>


                                <span className="hidden lg:inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-700">

                                    E&M

                                </span>

                            </div>


                            <p className="hidden sm:block truncate text-xs sm:text-sm text-slate-500">

                                Digital Machinery Inspection Management System

                            </p>

                        </div>

                    </div>


                    {/* =================================================
                        RIGHT SECTION
                    ================================================= */}

                    <div className="flex shrink-0 items-center gap-2 sm:gap-4">


                        {/* User Profile */}

                        <div className="hidden md:flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">

                            {/* Avatar */}

                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-blue-800 text-sm font-bold text-white shadow-sm">

                                {initials}

                            </div>


                            {/* User Details */}

                            <div className="max-w-[190px]">

                                <p className="truncate text-sm font-bold text-slate-800">

                                    {user?.full_name || "User"}

                                </p>


                                <div className="flex items-center gap-1.5">

                                    <ShieldCheck
                                        size={13}
                                        className="shrink-0 text-blue-600"
                                    />

                                    <p className="truncate text-xs font-medium text-slate-500">

                                        {user?.designation || "Engineer"}

                                    </p>

                                </div>

                            </div>

                        </div>


                        {/* Divider */}

                        <div className="hidden md:block h-8 w-px bg-slate-200" />


                        {/* Desktop Logout */}

                        <button
                            type="button"
                            onClick={logout}
                            className="hidden md:flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:border-red-300 hover:bg-red-100 hover:text-red-700 active:scale-[0.98]"
                        >

                            <LogOut size={17} />

                            <span>
                                Logout
                            </span>

                        </button>


                        {/* Mobile Logout */}

                        <button
                            type="button"
                            onClick={logout}
                            aria-label="Logout"
                            className="md:hidden flex h-11 w-11 items-center justify-center rounded-xl border border-red-200 bg-red-50 text-red-600 shadow-sm transition hover:bg-red-100 active:scale-95"
                        >

                            <LogOut size={20} />

                        </button>

                    </div>

                </div>

            </div>

        </header>

    );

}