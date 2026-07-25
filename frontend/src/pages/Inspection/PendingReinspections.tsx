import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import inspectionService, { type PendingVehicle } from "../../services/inspectionService";
import useAuth from "../../hooks/useAuth";

export default function PendingReinspections() {
    const [vehicles, setVehicles] = useState<PendingVehicle[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const { user } = useAuth();
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        loadPending();
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    async function loadPending() {
        try {
            setLoading(true);
            const data = await inspectionService.getPendingReinspections();
            setVehicles(data);
        } catch (error) {
            console.error("Error loading pending reinspections:", error);
        } finally {
            setLoading(false);
        }
    }

    const formattedDate = currentTime.toLocaleDateString("en-GB", {
        day: "2-digit", month: "2-digit", year: "numeric",
    });

    const formattedTime = currentTime.toLocaleTimeString("en-US", {
        hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true,
    });

    const getShift = (date: Date) => {
        const hour = date.getHours();
        if (hour >= 6 && hour < 14) return "Morning";
        if (hour >= 14 && hour < 22) return "Evening";
        return "Night";
    };

    return (
        <div className="space-y-6">
            {/* Top Card: Meta Data */}
            <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-gray-800">
                    Re-Inspection
                </h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-500 mb-1">Inspection Date</label>
                        <div className="font-medium text-gray-900">{formattedDate}</div>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-500 mb-1">Inspection Time</label>
                        <div className="font-medium text-gray-900">{formattedTime}</div>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-500 mb-1">Shift</label>
                        <div className="font-medium text-gray-900">{getShift(currentTime)}</div>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-500 mb-1">Inspection Engineer</label>
                        <div className="font-medium text-gray-900">{user?.full_name || "N/A"}</div>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-500 mb-1">Designation</label>
                        <div className="font-medium text-gray-900">{user?.designation || "N/A"}</div>
                    </div>
                </div>
            </div>

            {/* Bottom Card: Table Data */}
            <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                {loading ? (
                    <div className="text-gray-500 font-medium">Loading pending reinspections...</div>
                ) : (
                    <div className="overflow-x-auto rounded-lg border border-gray-200">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-100 text-gray-700 uppercase text-sm border-b">
                                    <th className="p-4 font-semibold">Machine Type</th>
                                    <th className="p-4 font-semibold text-center">Door Number</th>
                                    <th className="p-4 font-semibold text-center">Failed On</th>
                                    <th className="p-4 font-semibold text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {vehicles.length > 0 ? (
                                    vehicles.map((item) => (
                                        <tr key={item.vehicle_id} className="border-b hover:bg-gray-50 transition-colors last:border-0">
                                            <td className="p-4 font-medium text-gray-900">{item.machinery_name}</td>
                                            <td className="p-4 text-center font-bold text-gray-800">{item.machine_number}</td>
                                            <td className="p-4 text-center text-gray-600">{item.last_inspection_date}</td>
                                            <td className="p-4 text-center">
                                                <button
                                                    onClick={() => navigate(`/inspection?machine_id=${item.machinery_type_id}&vehicle_id=${item.vehicle_id}`)}
                                                    className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-4 py-1.5 rounded transition-colors shadow-sm"
                                                >
                                                    Re-Inspect
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="p-8 text-center text-green-600 font-medium bg-green-50/50">
                                                All clear! No vehicles currently require reinspection.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}