import { Link } from "react-router-dom";

export default function Sidebar() {
    return (
        <aside className="w-64 bg-slate-900 text-white h-screen">

            <div className="text-center py-6 border-b border-slate-700">
                <h2 className="text-2xl font-bold">
                    NTPC E&M
                </h2>
            </div>

            <nav className="mt-4">

                <ul>

                    <li>
                        <Link
                            to="/dashboard"
                            className="block px-6 py-3 hover:bg-slate-800"
                        >
                            Dashboard
                        </Link>
                    </li>

                    <li>
                        <Link
                            to="/inspection"
                            className="block px-6 py-3 hover:bg-slate-800"
                        >
                            Random Inspection
                        </Link>
                    </li>

                    <li>
                        <Link
                            to="/reports"
                            className="block px-6 py-3 hover:bg-slate-800"
                        >
                            Reports
                        </Link>
                    </li>

                    <li>
                        <Link
                            to="/profile"
                            className="block px-6 py-3 hover:bg-slate-800"
                        >
                            Profile
                        </Link>
                    </li>

                    <li>
                        <Link
                            to="/admin"
                            className="block px-6 py-3 hover:bg-slate-800"
                        >
                            Admin
                        </Link>
                    </li>

                </ul>

            </nav>

        </aside>
    );
}