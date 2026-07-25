import { useState, type ReactNode } from "react";
import { Menu } from "lucide-react";

import Sidebar from "./Sidebar";
import Header from "./Header";

interface Props {
    children: ReactNode;
}

export default function Layout({ children }: Props) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden">

            {/* Mobile Sidebar Backdrop */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 transition-opacity md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                    aria-hidden="true"
                />
            )}

            {/* Sidebar Container */}
            <div
                className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
                    isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <Sidebar onClose={() => setIsSidebarOpen(false)} />
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">

                {/* Mobile Hamburger Trigger Button */}
                <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="md:hidden absolute top-3.5 left-4 z-50 p-1 bg-transparent text-white rounded focus:outline-none active:bg-[#1a4b8c]"
                    aria-label="Open sidebar"
                >
                    <Menu size={26} />
                </button>

                <Header />

                {/* Scrollable Main Area */}
                <main className="flex-1 bg-gray-100 p-4 sm:p-6 overflow-y-auto">
                    {children}
                </main>

            </div>

        </div>
    );
}