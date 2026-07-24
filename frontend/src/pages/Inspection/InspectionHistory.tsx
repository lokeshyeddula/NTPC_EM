import { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import inspectionService from "../../services/inspectionService";

interface InspectionHistory {
    id: number;
    inspection_number: string;
    inspection_date: string;
    shift: string;
    relay: string;
    vehicle: string;
    engineer: string;
    operational_status: string;
}

export default function InspectionHistory() {
    const [history, setHistory] = useState<InspectionHistory[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadHistory();
    }, []);

    async function loadHistory() {
        try {
            setLoading(true);
            const data = await inspectionService.getInspectionHistory();
            setHistory(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Layout>
            <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">
                    Inspection History
                </h1>

                {loading ? (
                    <div className="text-gray-500 font-medium">Loading history...</div>
                ) : history.length === 0 ? (
                    <div className="text-gray-500">No inspection history found.</div>
                ) : (
                    <>
                        {/* Mobile View: Card Layout */}
                        <div className="grid grid-cols-1 gap-4 md:hidden">
                            {history.map((item) => (
                                <div
                                    key={item.id}
                                    className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm"
                                >
                                    <div className="flex justify-between items-center border-b pb-3 mb-3">
                                        <span className="font-bold text-gray-800 text-lg">
                                            {item.inspection_number}
                                        </span>
                                        <span
                                            className={`px-3 py-1 rounded-full text-white text-xs font-bold uppercase tracking-wide ${
                                                item.operational_status === "Fit"
                                                    ? "bg-green-600"
                                                    : "bg-red-600"
                                            }`}
                                        >
                                            {item.operational_status}
                                        </span>
                                    </div>

                                    <div className="text-sm text-gray-700 space-y-2 mb-4">
                                        <div className="flex justify-between">
                                            <span className="font-semibold text-gray-500">Date</span>
                                            <span>{item.inspection_date}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="font-semibold text-gray-500">Shift</span>
                                            <span>{item.shift}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="font-semibold text-gray-500">Vehicle</span>
                                            <span className="font-medium text-gray-900">{item.vehicle}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="font-semibold text-gray-500">Engineer</span>
                                            <span>{item.engineer}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Desktop View: Table Layout */}
                        <div className="hidden md:block overflow-x-auto rounded-lg border border-gray-200">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-100 text-gray-700 uppercase text-sm border-b">
                                        <th className="p-4 font-semibold">Inspection No</th>
                                        <th className="p-4 font-semibold text-center">Date</th>
                                        <th className="p-4 font-semibold text-center">Shift</th>
                                        <th className="p-4 font-semibold text-center">Vehicle</th>
                                        <th className="p-4 font-semibold text-center">Engineer</th>
                                        <th className="p-4 font-semibold text-center">Status</th>
                                        <th className="p-4 font-semibold text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {history.map((item) => (
                                        <tr
                                            key={item.id}
                                            className="border-b hover:bg-gray-50 transition-colors last:border-0"
                                        >
                                            <td className="p-4 font-medium text-gray-900">
                                                {item.inspection_number}
                                            </td>
                                            <td className="p-4 text-center text-gray-600">
                                                {item.inspection_date}
                                            </td>
                                            <td className="p-4 text-center text-gray-600">
                                                {item.shift}
                                            </td>
                                            <td className="p-4 text-center font-medium text-gray-800">
                                                {item.vehicle}
                                            </td>
                                            <td className="p-4 text-center text-gray-600">
                                                {item.engineer}
                                            </td>
                                            <td className="p-4 text-center">
                                                <span
                                                    className={`px-3 py-1 rounded-full text-white text-xs font-bold uppercase tracking-wider ${
                                                        item.operational_status === "Fit"
                                                            ? "bg-green-600"
                                                            : "bg-red-600"
                                                    }`}
                                                >
                                                    {item.operational_status}
                                                </span>
                                            </td>
                                            <td className="p-4 text-center">
                                                <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-1.5 rounded transition-colors">
                                                    View
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>
        </Layout>
    );
}