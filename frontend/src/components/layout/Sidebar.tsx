import { Link } from "react-router-dom";
import { X } from "lucide-react";

interface Props {
    onClose?: () => void;
}

export default function Sidebar({ onClose }: Props) {
    return (
        <aside className="w-72 md:w-64 bg-slate-900 text-white h-screen flex flex-col shadow-2xl md:shadow-none">
            {/* Header Branding */}
            <div className="flex items-center justify-between px-6 py-6 border-b border-slate-800">
                <h2 className="text-2xl font-bold tracking-wider truncate">NTPC E&M</h2>
                <button
                    onClick={onClose}
                    className="md:hidden p-2 -mr-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none"
                    aria-label="Close Sidebar"
                >
                    <X size={24} />
                </button>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 overflow-y-auto mt-4 py-2">
                <ul className="space-y-1">
                    <li>
                        <Link to="/dashboard" onClick={onClose} className="block px-6 py-3.5 hover:bg-slate-800 font-medium transition-colors">
                            Dashboard
                        </Link>
                    </li>
                    <li>
                        <Link to="/inspection" onClick={onClose} className="block px-6 py-3.5 hover:bg-slate-800 font-medium transition-colors">
                            Random Inspection
                        </Link>
                    </li>
                    <li>
                        <Link to="/Re-Inspection" onClick={onClose} className="block px-6 py-3.5 hover:bg-slate-800 font-medium transition-colors">
                            Re-Inspection
                        </Link>
                    </li>
                    <li>
                        <Link to="/reports" onClick={onClose} className="block px-6 py-3.5 hover:bg-slate-800 font-medium transition-colors">
                            Reports
                        </Link>
                    </li>
                    <li>
                        <Link to="/inspection-history" onClick={onClose} className="block px-6 py-3.5 hover:bg-slate-800 font-medium transition-colors">
                            History
                        </Link>
                    </li>
                    <li>
                        <Link to="/admin" onClick={onClose} className="block px-6 py-3.5 hover:bg-slate-800 font-medium transition-colors">
                            Admin
                        </Link>
                    </li>
                    <li>
                        <Link to="/profile" onClick={onClose} className="block px-6 py-3.5 hover:bg-slate-800 font-medium transition-colors">
                            Profile
                        </Link>
                    </li>
                </ul>
            </nav>
        </aside>
    );
}