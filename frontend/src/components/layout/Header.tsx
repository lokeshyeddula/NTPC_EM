import useAuth from "../../hooks/useAuth";

export default function Header() {
    const { user, logout } = useAuth();

    return (
        <header className="bg-[#0b3366] border-b border-[#08254a] shadow-md px-4 sm:px-6 py-3 sm:py-0 sm:h-16 flex flex-col sm:flex-row justify-between gap-3 sm:gap-0">

            {/* Title Section */}
            {/* pl-12 ensures the text doesn't hide under the hamburger menu on mobile */}
            <div className="w-full sm:w-auto pl-12 sm:pl-0 flex items-center pt-1.5 sm:pt-0">
                <h1 className="text-lg sm:text-xl font-bold text-white leading-tight">
                    NTPC E&M Inspection System
                </h1>
            </div>

            {/* User Info & Actions Section */}
            <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto border-t sm:border-0 border-[#1a4b8c] pt-3 sm:pt-0 mt-1 sm:mt-0">

                <div className="text-left sm:text-right mr-4 overflow-hidden">
                    <div className="font-semibold text-sm text-white truncate">
                        {user?.full_name}
                    </div>
                    <div className="text-xs text-blue-200 truncate">
                        {user?.designation}
                    </div>
                </div>

                <button
                    onClick={logout}
                    className="bg-white text-red-600 hover:bg-red-50 px-4 py-1.5 rounded-lg text-sm font-bold shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#0b3366]"
                >
                    Logout
                </button>

            </div>

        </header>
    );
}