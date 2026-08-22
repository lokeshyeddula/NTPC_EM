import { useState, type ReactNode } from "react";

import Sidebar from "./Sidebar";
import Header from "./Header";

interface Props {
    children: ReactNode;
}

export default function Layout({ children }: Props) {

    const [isSidebarOpen, setIsSidebarOpen] =
        useState(false);

    return (

        <div
            className="
                min-h-[100dvh]
                bg-slate-100
                flex
                overflow-x-hidden
                relative
            "
        >

            {/* =====================================================
                MOBILE OVERLAY
            ====================================================== */}

            {isSidebarOpen && (

                <div
                    onClick={() =>
                        setIsSidebarOpen(false)
                    }
                    className="
                        fixed
                        inset-0
                        z-40
                        bg-black/40
                        backdrop-blur-sm
                        md:hidden
                    "
                />

            )}


            {/* =====================================================
                SIDEBAR
            ====================================================== */}

            <div
                className={`
                    fixed
                    inset-y-0
                    left-0
                    z-50
                    transition-transform
                    duration-300
                    ease-in-out

                    md:relative
                    md:translate-x-0

                    ${
                        isSidebarOpen
                            ? "translate-x-0"
                            : "-translate-x-full"
                    }
                `}
            >

                <Sidebar
                    onClose={() =>
                        setIsSidebarOpen(false)
                    }
                />

            </div>


            {/* =====================================================
                MAIN APPLICATION AREA
            ====================================================== */}

            <div
                className="
                    flex
                    min-w-0
                    flex-1
                    flex-col

                    min-h-[100dvh]
                "
            >


                {/* =================================================
                    HEADER
                ================================================= */}

                <Header
                    onMenuClick={() =>
                        setIsSidebarOpen(true)
                    }
                />


                {/* =================================================
                    CONTENT
                ================================================= */}

                <main
                    className="
                        flex-1

                        bg-slate-100

                        overflow-y-auto
                        overflow-x-hidden

                        overscroll-contain

                        scroll-smooth

                        [-webkit-overflow-scrolling:touch]
                    "
                >

                    <div
                        className="
                            w-full

                            px-3
                            py-4

                            sm:px-5
                            sm:py-5

                            lg:px-8
                            lg:py-6

                            pb-24
                            sm:pb-8
                        "
                    >

                        {children}

                    </div>

                </main>

            </div>

        </div>
    );
}