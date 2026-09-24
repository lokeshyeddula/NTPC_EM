import { useState, type ReactNode } from "react";

import Sidebar from "./Sidebar";
import Header from "./Header";

interface Props {
    children: ReactNode;
}

export default function Layout({ children }: Props) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex h-dvh w-full overflow-hidden bg-slate-100">

            {/* =====================================================
                MOBILE OVERLAY
            ====================================================== */}

            {isSidebarOpen && (
                <div
                    onClick={() => setIsSidebarOpen(false)}
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

            <aside
                className={`
                    fixed
                    inset-y-0
                    left-0
                    z-50
                    h-dvh
                    transform
                    transition-transform
                    duration-300
                    ease-in-out

                    md:relative
                    md:z-auto
                    md:block
                    md:translate-x-0

                    ${
                        isSidebarOpen
                            ? "translate-x-0"
                            : "-translate-x-full"
                    }
                `}
            >
                <Sidebar
                    onClose={() => setIsSidebarOpen(false)}
                />
            </aside>

            {/* =====================================================
                MAIN APPLICATION SHELL
            ====================================================== */}

            <div
                className="
                    flex
                    h-dvh
                    min-h-0
                    min-w-0
                    flex-1
                    flex-col
                    overflow-hidden
                "
            >

                {/* =================================================
                    HEADER
                ================================================== */}

                <div className="shrink-0">
                    <Header
                        onMenuClick={() => setIsSidebarOpen(true)}
                    />
                </div>

                {/* =================================================
                    SCROLLABLE PAGE AREA

                    IMPORTANT:
                    This is the ONLY vertical scroll container.
                ================================================== */}

                <main
                    className="
                        min-h-0
                        min-w-0
                        flex-1
                        overflow-x-hidden
                        overflow-y-auto
                        overscroll-y-contain
                        bg-white
                        sm:bg-slate-100
                    "
                    style={{
                        WebkitOverflowScrolling: "touch",
                    }}
                >
                    <div
                        className="
                            w-full
                            min-w-0
                            px-0
                            py-0

                            sm:px-5
                            sm:py-4

                            lg:px-8
                            lg:py-5
                        "
                    >
                        {children}
                    </div>
                </main>

            </div>
        </div>
    );
}
