import { Menu, LogOut, ShieldCheck } from "lucide-react";

import useAuth from "../../hooks/useAuth";

interface Props {
    onMenuClick?: () => void;
}

export default function Header({
    onMenuClick,
}: Props) {

    const { user, logout } = useAuth();


    const initials =
        user?.full_name
            ?.trim()
            .split(/\s+/)
            .filter(Boolean)
            .map((name) => name[0])
            .join("")
            .slice(0, 2)
            .toUpperCase() || "U";


    return (

        <header
            className="
                sticky
                top-0
                z-30

                w-full

                border-b
                border-slate-200

                bg-white/95
                backdrop-blur-md

                shadow-sm
            "
        >

            <div
                className="
                    flex
                    h-[68px]
                    items-center
                    justify-between

                    px-3

                    sm:h-[72px]
                    sm:px-5

                    lg:px-6
                "
            >


                {/* =================================================
                    LEFT SIDE
                ================================================= */}

                <div
                    className="
                        flex
                        min-w-0
                        items-center
                        gap-3
                    "
                >


                    {/* MOBILE MENU */}

                    <button
                        type="button"
                        onClick={onMenuClick}
                        aria-label="Open menu"
                        className="
                            flex
                            h-11
                            w-11
                            shrink-0
                            items-center
                            justify-center

                            rounded-xl

                            bg-blue-600
                            text-white

                            shadow-md
                            shadow-blue-900/20

                            transition

                            hover:bg-blue-700

                            active:scale-95

                            md:hidden
                        "
                    >

                        <Menu size={23} />

                    </button>


                    {/* =================================================
                        MOBILE NIRIKSHAN BRAND
                    ================================================= */}

                    <div
                        className="
                            flex
                            items-center
                            gap-2

                            md:hidden
                        "
                    >

                        <div
                            className="
                                flex
                                h-9
                                w-9
                                items-center
                                justify-center

                                rounded-lg

                                bg-blue-50
                                text-blue-700
                            "
                        >

                            <ShieldCheck size={21} />

                        </div>


                        <span
                            className="
                                text-[19px]
                                font-extrabold
                                tracking-tight
                                text-slate-900
                            "
                        >
                            NIRIKSHAN
                        </span>

                    </div>


                    {/* =================================================
                        DESKTOP BRAND
                    ================================================= */}

                    <div
                        className="
                            hidden
                            items-center
                            gap-4
                            md:flex
                        "
                    >

                        <div
                            className="
                                flex
                                h-10
                                w-10
                                items-center
                                justify-center
                                rounded-xl
                                bg-blue-50
                                text-blue-700
                            "
                        >

                            <ShieldCheck size={22} />

                        </div>


                        <div>

                            <h1
                                className="
                                    text-xl
                                    font-extrabold
                                    tracking-tight
                                    text-slate-900
                                "
                            >
                                NIRIKSHAN
                            </h1>

                            <p
                                className="
                                    text-xs
                                    font-medium
                                    text-slate-500
                                "
                            >
                                Digital Machinery Inspection
                            </p>

                        </div>

                    </div>

                </div>


                {/* =================================================
                    RIGHT SIDE
                ================================================= */}

                <div
                    className="
                        flex
                        items-center
                        gap-2

                        sm:gap-4
                    "
                >


                    {/* =================================================
                        DESKTOP USER
                    ================================================= */}

                    <div
                        className="
                            hidden
                            items-center
                            gap-3
                            md:flex
                        "
                    >

                        <div
                            className="
                                flex
                                h-11
                                w-11
                                items-center
                                justify-center

                                rounded-full

                                bg-blue-600

                                text-sm
                                font-bold
                                text-white

                                shadow-sm
                            "
                        >
                            {initials}
                        </div>


                        <div className="min-w-0">

                            <p
                                className="
                                    truncate
                                    max-w-[160px]
                                    text-sm
                                    font-bold
                                    text-slate-900
                                "
                            >
                                {user?.full_name || "User"}
                            </p>

                            <p
                                className="
                                    truncate
                                    max-w-[160px]
                                    text-xs
                                    font-medium
                                    text-slate-500
                                "
                            >
                                {user?.designation || "Employee"}
                            </p>

                        </div>

                    </div>


                    {/* =================================================
                        LOGOUT
                    ================================================= */}

                    <button
                        type="button"
                        onClick={logout}
                        aria-label="Logout"
                        className="
                            flex
                            h-11
                            w-11
                            shrink-0
                            items-center
                            justify-center

                            rounded-xl

                            border
                            border-red-200

                            bg-red-50
                            text-red-600

                            transition

                            hover:bg-red-100
                            hover:text-red-700

                            active:scale-95

                            md:h-auto
                            md:w-auto
                            md:gap-2
                            md:px-4
                            md:py-2.5

                            md:bg-red-600
                            md:text-white

                            md:border-transparent

                            md:hover:bg-red-700
                            md:hover:text-white
                        "
                    >

                        <LogOut size={20} />

                        <span
                            className="
                                hidden
                                md:inline
                                font-semibold
                            "
                        >
                            Logout
                        </span>

                    </button>

                </div>

            </div>

        </header>

    );
}