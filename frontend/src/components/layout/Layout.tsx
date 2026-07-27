import { useState, type ReactNode } from "react";

import Sidebar from "./Sidebar";
import Header from "./Header";

interface Props {
    children: ReactNode;
}

export default function Layout({ children }: Props) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="h-screen bg-slate-100 flex overflow-hidden">

            {/* ================= Overlay ================= */}

            {isSidebarOpen && (
                <div
                    onClick={() => setIsSidebarOpen(false)}
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden transition-all"
                />
            )}

            {/* ================= Sidebar ================= */}

            <div
                className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0
                ${
                    isSidebarOpen
                        ? "translate-x-0"
                        : "-translate-x-full"
                }`}
            >
                <Sidebar onClose={() => setIsSidebarOpen(false)} />
            </div>

            {/* ================= Main ================= */}

            <div className="flex flex-1 flex-col min-w-0 overflow-hidden">



                {/* Header */}

                <Header onMenuClick={() => setIsSidebarOpen(true)} />

                {/* Content */}

                <main className="flex-1 overflow-y-auto">

                    <div className="p-4 md:p-6 lg:p-8">

                        <div className="min-h-full rounded-3xl bg-white shadow-sm border border-slate-200 p-6">

                            {children}

                        </div>

                    </div>

                </main>

            </div>

        </div>
    );
}