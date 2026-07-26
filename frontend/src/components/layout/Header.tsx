import { Menu, LogOut } from "lucide-react";
import useAuth from "../../hooks/useAuth";

import ntpcLogo from "../../assets/Ntpc_logo.png";
import nmlLogo from "../../assets/nml_logo.png";

interface Props {
    onMenuClick?: () => void;
}

export default function Header({ onMenuClick }: Props) {

    const { user, logout } = useAuth();

    const initials =
        user?.full_name
            ?.split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase() || "U";

    return (

        <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-sm">

            <div className="h-18 px-4 lg:px-6">

                <div className="flex h-[72px] items-center justify-between">

                    {/* LEFT */}

                    <div className="flex items-center gap-4">

                        {/* Mobile Menu */}

                        <button
                            onClick={onMenuClick}
                            className="md:hidden flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg"
                        >
                            <Menu size={24} />
                        </button>

                        {/* Logos */}

                        <img
                            src={ntpcLogo}
                            className="h-10 w-auto"
                            alt="NTPC"
                        />

                        <img
                            src={nmlLogo}
                            className="h-10 w-auto"
                            alt="NML"
                        />

                        {/* Title */}

                        <div className="hidden lg:block">

                            <h1 className="text-2xl font-bold text-slate-800">

                                NTPC E&M

                            </h1>

                            <p className="text-sm text-slate-500">

                                NML Talaipalli

                            </p>

                        </div>

                    </div>

                    {/* RIGHT */}

                    <div className="flex items-center gap-5">

                        {/* User */}

                        <div className="hidden md:flex items-center gap-3">

                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white font-bold text-lg">

                                {initials}

                            </div>

                            <div>

                                <h3 className="font-semibold text-slate-800">

                                    {user?.full_name}

                                </h3>

                                <p className="text-sm text-slate-500">

                                    {user?.designation}

                                </p>

                            </div>

                        </div>

                        {/* Desktop Logout */}

                        <button
                            onClick={logout}
                            className="hidden md:flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-white font-semibold hover:bg-red-700 transition"
                        >

                            <LogOut size={18} />

                            Logout

                        </button>

                        {/* Mobile Logout */}

                        <button
                            onClick={logout}
                            className="md:hidden flex h-12 w-12 items-center justify-center rounded-2xl bg-red-600 text-white shadow-lg"
                        >

                            <LogOut size={22} />

                        </button>

                    </div>

                </div>

            </div>

        </header>

    );

}