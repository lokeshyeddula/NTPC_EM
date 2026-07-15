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

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">

            <h2 className="text-2xl font-bold text-slate-800 mb-6">

                Random Machinery Inspection

            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">

                <div>

                    <label className="text-gray-500 text-sm">

                        Inspection Date

                    </label>

                    <p className="font-semibold">

                        {formatDate()}

                    </p>

                </div>

                <div>

                    <label className="text-gray-500 text-sm">

                        Inspection Time

                    </label>

                    <p className="font-semibold">

                        {formatTime()}

                    </p>

                </div>

                <div>

                    <label className="text-gray-500 text-sm">

                        Shift

                    </label>

                    <p className="font-semibold">

                        {getShift()}

                    </p>

                </div>

                <div>

                    <label className="text-gray-500 text-sm">

                        Inspection Engineer

                    </label>

                    <p className="font-semibold">

                        {user?.full_name}

                    </p>

                </div>

                <div>

                    <label className="text-gray-500 text-sm">

                        Designation

                    </label>

                    <p className="font-semibold">

                        {user?.designation}

                    </p>

                </div>

            </div>

        </div>

    );

}