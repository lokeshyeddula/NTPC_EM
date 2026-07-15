import useAuth from "../../hooks/useAuth";

export default function Header() {
    const { user, logout } = useAuth();

    return (
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm">

            <div>
                <h1 className="text-2xl font-bold text-slate-800">
                    NTPC E&M Inspection System
                </h1>
            </div>

            <div className="flex items-center gap-4">

                <div className="text-right">

                    <div className="font-semibold">
                        {user?.full_name}
                    </div>

                    <div className="text-sm text-gray-500">
                        {user?.designation}
                    </div>

                </div>

                <button
                    onClick={logout}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                    Logout
                </button>

            </div>

        </header>
    );
}