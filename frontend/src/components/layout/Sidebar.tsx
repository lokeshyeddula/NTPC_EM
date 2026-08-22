import { NavLink } from "react-router-dom";

import {
    LayoutDashboard,
    ClipboardCheck,
    RefreshCw,
    FileText,
    History,
    ShieldCheck,
    UserCircle,
    X,
    ChevronRight,
    Activity,
} from "lucide-react";

interface Props {
    onClose?: () => void;
}

const menu = [
    {
        name: "Dashboard",
        path: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        name: "Inspection",
        path: "/inspection",
        icon: ClipboardCheck,
    },
    {
        name: "Re-Inspection",
        path: "/Re-Inspection",
        icon: RefreshCw,
    },
    {
        name: "Reports",
        path: "/reports",
        icon: FileText,
    },
    {
        name: "History",
        path: "/inspection-history",
        icon: History,
    },
    {
        name: "Admin",
        path: "/admin",
        icon: ShieldCheck,
    },
    {
        name: "Profile",
        path: "/profile",
        icon: UserCircle,
    },
];

export default function Sidebar({ onClose }: Props) {
    return (
        <aside className="flex h-screen w-72 flex-col bg-slate-950 border-r border-slate-800">

            {/* =====================================================
                BRAND HEADER
            ====================================================== */}

            <div className="border-b border-slate-800 px-5 py-5">

                <div className="flex items-center justify-between">

                    <div className="flex items-center gap-3">

                        {/* NIRIKSHAN Icon */}

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-900/30">

                            <Activity
                                size={24}
                                className="text-white"
                                strokeWidth={2.5}
                            />

                        </div>


                        {/* Brand */}

                        <div>

                            <h1 className="text-xl font-bold tracking-wide text-white">
                                NIRIKSHAN
                            </h1>

                            <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-slate-400">
                                Inspection System
                            </p>

                        </div>

                    </div>


                    {/* Mobile Close */}

                    <button
                        onClick={onClose}
                        className="md:hidden rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition"
                        aria-label="Close menu"
                    >

                        <X size={22} />

                    </button>

                </div>


                {/* Organisation */}

                <div className="mt-5 rounded-xl border border-slate-800 bg-slate-900/70 px-4 py-3">

                    <p className="text-[10px] font-semibold uppercase tracking-widest text-blue-400">
                        NML TALAIPALLI
                    </p>

                    <p className="mt-1 text-sm font-semibold text-white">
                        E&M Division
                    </p>

                </div>

            </div>


            {/* =====================================================
                NAVIGATION
            ====================================================== */}

            <div className="flex-1 overflow-y-auto py-6">

                <div className="px-5">

                    <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
                        MAIN MENU
                    </p>

                </div>


                <nav className="space-y-1.5 px-3">

                    {menu.map((item) => {

                        const Icon = item.icon;

                        return (

                            <NavLink
                                key={item.path}
                                to={item.path}
                                onClick={onClose}

                                className={({ isActive }) =>

                                    `group relative flex items-center justify-between rounded-xl px-4 py-3.5 transition-all duration-200 ${
                                        isActive
                                            ? "bg-blue-600 text-white shadow-lg shadow-blue-950/30"
                                            : "text-slate-300 hover:bg-slate-900 hover:text-white"
                                    }`

                                }
                            >

                                {({ isActive }) => (

                                    <>

                                        {/* Active indicator */}

                                        {isActive && (

                                            <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-white/90" />

                                        )}


                                        <div className="flex items-center gap-3">

                                            <div
                                                className={
                                                    isActive
                                                        ? "text-white"
                                                        : "text-slate-400 group-hover:text-blue-400"
                                                }
                                            >

                                                <Icon
                                                    size={20}
                                                    strokeWidth={2}
                                                />

                                            </div>


                                            <span className="text-sm font-medium">

                                                {item.name}

                                            </span>

                                        </div>


                                        <ChevronRight
                                            size={17}
                                            className={
                                                isActive
                                                    ? "text-white/80"
                                                    : "opacity-0 text-slate-500 transition-all group-hover:translate-x-0.5 group-hover:opacity-100"
                                            }
                                        />

                                    </>

                                )}

                            </NavLink>

                        );

                    })}

                </nav>

            </div>


            {/* =====================================================
                FOOTER / SYSTEM INFO
            ====================================================== */}

            <div className="border-t border-slate-800 p-4">

                <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">

                    <div className="flex items-center gap-3">

                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600/15">

                            <ShieldCheck
                                size={19}
                                className="text-blue-400"
                            />

                        </div>


                        <div>

                            <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
                                System
                            </p>

                            <p className="text-sm font-semibold text-white">
                                NIRIKSHAN
                            </p>

                        </div>

                    </div>


                    <div className="mt-3 border-t border-slate-800 pt-3">

                        <p className="text-xs text-slate-400">
                            Digital Machinery Inspection
                        </p>

                        <p className="mt-1 text-[10px] text-slate-600">
                            NML Talaipalli • E&M
                        </p>

                    </div>

                </div>

            </div>

        </aside>
    );
}