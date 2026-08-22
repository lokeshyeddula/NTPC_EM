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

        <div className="flex h-screen overflow-hidden bg-slate-100">

            {/* =====================================================
                MOBILE SIDEBAR OVERLAY
            ====================================================== */}

            {isSidebarOpen && (

                <div
                    onClick={() =>
                        setIsSidebarOpen(false)
                    }
                    className="
                        fixed inset-0 z-40
                        bg-slate-950/50
                        backdrop-blur-[2px]
                        md:hidden
                    "
                />

            )}


            {/* =====================================================
                SIDEBAR
            ====================================================== */}

            <div
                className={`
                    fixed inset-y-0 left-0 z-50
                    transform
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

            <div className="flex min-w-0 flex-1 flex-col overflow-hidden">


                {/* =================================================
                    HEADER
                ================================================== */}

                <Header
                    onMenuClick={() =>
                        setIsSidebarOpen(true)
                    }
                />


                {/* =================================================
                    PAGE CONTENT
                ================================================== */}

                <main
                    className="
                        flex-1
                        overflow-y-auto
                        bg-slate-100
                    "
                >

                    <div
                        className="
                            min-h-full
                            w-full
                            px-0
                            py-0

                            sm:px-5
                            sm:py-5

                            lg:px-7
                            lg:py-6
                        "
                    >

                        {children}

                    </div>

                </main>

            </div>

        </div>

    );
}