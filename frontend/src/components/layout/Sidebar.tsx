import { Link } from "react-router-dom";
import { X } from "lucide-react";

interface Props {
    // Optional prop so it doesn't break your existing desktop layout
    onClose?: () => void;
}

export default function Sidebar({ onClose }: Props) {
    return (
        <aside className="w-64 md:w-64 w-72 bg-slate-900 text-white h-screen flex flex-col shadow-2xl md:shadow-none">

            {/* Header Section */}
            <div className="flex items-center justify-between px-6 py-6 border-b border-slate-700">
                <h2 className="text-2xl font-bold truncate">
                    NTPC E&M
                </h2>

                {/* Mobile Close Button */}
                <button
                    onClick={onClose}
                    className="md:hidden p-2 -mr-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500 transition-colors"
                    aria-label="Close Sidebar"
                >
                    <X size={24} />
                </button>
            </div>

            {/* Navigation Section */}
            <nav className="flex-1 overflow-y-auto mt-4 py-2">
                <ul className="space-y-1">
                    <li>
                        <Link
                            to="/dashboard"
                            onClick={onClose}
                            className="block px-6 py-3.5 md:py-3 hover:bg-slate-800 transition-colors font-medium"
                        >
                            Dashboard
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/inspection"
                            onClick={onClose}
                            className="block px-6 py-3.5 md:py-3 hover:bg-slate-800 transition-colors font-medium"
                        >
                            Random Inspection
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/inspection-history"
                            onClick={onClose}
                            className="block px-6 py-3.5 md:py-3 hover:bg-slate-800 transition-colors font-medium"
                        >
                            Inspection History
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/reports"
                            onClick={onClose}
                            className="block px-6 py-3.5 md:py-3 hover:bg-slate-800 transition-colors font-medium"
                        >
                            Reports
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/profile"
                            onClick={onClose}
                            className="block px-6 py-3.5 md:py-3 hover:bg-slate-800 transition-colors font-medium"
                        >
                            Profile
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/admin"
                            onClick={onClose}
                            className="block px-6 py-3.5 md:py-3 hover:bg-slate-800 transition-colors font-medium"
                        >
                            Admin
                        </Link>
                    </li>
                </ul>
            </nav>

        </aside>
    );
}