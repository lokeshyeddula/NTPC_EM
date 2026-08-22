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
        <div className="
            flex
            h-screen
            min-h-0
            overflow-hidden
            bg-slate-100
        ">

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

            <div className="
                flex
                min-h-0
                min-w-0
                flex-1
                flex-col
                overflow-hidden
            ">

                {/* =================================================
                    HEADER
                ================================================== */}

                <Header
                    onMenuClick={() =>
                        setIsSidebarOpen(true)
                    }
                />


                {/* =================================================
                    SCROLLABLE CONTENT AREA
                ================================================== */}

                <main className="
                    min-h-0
                    min-w-0
                    flex-1
                    overflow-y-auto
                    overflow-x-hidden
                    bg-white
                    sm:bg-slate-100

                    overscroll-contain
                ">

                    <div className="
                        w-full
                        min-h-full
                        px-0
                        py-0

                        sm:px-5
                        sm:py-4

                        lg:px-8
                        lg:py-5
                    ">

                        {children}

                    </div>

                </main>

            </div>

        </div>
    );
}