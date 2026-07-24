import { useEffect, useState } from "react";

import useAuth from "../../hooks/useAuth";

export default function InspectionHeader() {

    const { user } = useAuth();

    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {

        const timer = setInterval(() => {

            setCurrentTime(new Date());

        }, 1000);

        return () => clearInterval(timer);

    }, []);

    function getShift() {

        const hour = currentTime.getHours();

        if (hour >= 6 && hour < 14) return "Morning";

        if (hour >= 14 && hour < 22) return "Evening";

        return "Night";

    }

    function formatDate() {

        return currentTime.toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
            }
        );

    }

    function formatTime() {

        return currentTime.toLocaleTimeString(
            "en-IN"
        );

    }

return (
    <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 mb-6">

        <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-6">
            Random Machinery Inspection
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

            <div>
                <label className="block text-sm text-gray-500 mb-1">
                    Inspection Date
                </label>

                <p className="font-semibold text-slate-800">
                    {formatDate()}
                </p>
            </div>

            <div>
                <label className="block text-sm text-gray-500 mb-1">
                    Inspection Time
                </label>

                <p className="font-semibold text-slate-800">
                    {formatTime()}
                </p>
            </div>

            <div>
                <label className="block text-sm text-gray-500 mb-1">
                    Shift
                </label>

                <p className="font-semibold text-slate-800">
                    {getShift()}
                </p>
            </div>

            <div>
                <label className="block text-sm text-gray-500 mb-1">
                    Inspection Engineer
                </label>

                <p className="font-semibold text-slate-800 break-words">
                    {user?.full_name}
                </p>
            </div>

            <div>
                <label className="block text-sm text-gray-500 mb-1">
                    Designation
                </label>

                <p className="font-semibold text-slate-800 break-words">
                    {user?.designation}
                </p>
            </div>

        </div>

    </div>
);

}