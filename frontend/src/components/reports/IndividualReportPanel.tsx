import React, { useEffect, useState } from "react";
import inspectionService from "../../services/inspectionService";
import InspectionReport from "../../pages/Reports/InspectionReport";

interface Inspection {
    id: number;
    inspection_number: string;
    inspection_date: string;
    vehicle: string;
    shift: string;
    engineer: string;
    operational_status: string;
}

export default function IndividualReportPanel() {
    const [inspections, setInspections] = useState<Inspection[]>([]);

    const [searchEngineer, setSearchEngineer] = useState("");
    const [searchVehicle, setSearchVehicle] = useState("");
    const [searchDate, setSearchDate] = useState("");

    const [selectedInspection, setSelectedInspection] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        try {
            setLoading(true);
            const data = await inspectionService.getInspectionHistory();
            setInspections(data);
        } catch (error) {
            console.error("Error loading inspection history:", error);
        } finally {
            setLoading(false);
        }
    }

    const hasActiveFilter =
        searchEngineer.trim() !== "" ||
        searchVehicle.trim() !== "" ||
        searchDate !== "";

    const filteredInspections = hasActiveFilter
        ? inspections.filter((item) => {
              const engineerMatch = item.engineer
                  .toLowerCase()
                  .includes(searchEngineer.toLowerCase());

              const vehicleMatch = item.vehicle
                  .toLowerCase()
                  .includes(searchVehicle.toLowerCase());

              const dateMatch =
                  searchDate === "" || item.inspection_date === searchDate;

              return engineerMatch && vehicleMatch && dateMatch;
          })
        : [];

    const handleToggleReport = (inspectionNum: string) => {
        setSelectedInspection((prev) =>
            prev === inspectionNum ? null : inspectionNum
        );
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center p-8 sm:p-12 text-gray-500 font-medium">
                Loading...
            </div>
        );
    }

    return (
        <div className="w-full">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-800">
                Individual Inspection Report
            </h2>

            {/* Responsive Search Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <div>
                    <label className="block text-sm font-medium mb-1.5 text-gray-700">
                        Engineer Name
                    </label>
                    <input
                        type="text"
                        value={searchEngineer}
                        onChange={(e) => setSearchEngineer(e.target.value)}
                        placeholder="Search Engineer Name"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1.5 text-gray-700">
                        Vehicle
                    </label>
                    <input
                        type="text"
                        value={searchVehicle}
                        onChange={(e) => setSearchVehicle(e.target.value)}
                        placeholder="Search Vehicle"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1.5 text-gray-700">
                        Date
                    </label>
                    <input
                        type="date"
                        value={searchDate}
                        onChange={(e) => setSearchDate(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                </div>
            </div>

            {/* Mobile View: Card Layout */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
                {filteredInspections.length > 0 ? (
                    filteredInspections.map((item) => (
                        <div
                            key={item.id}
                            className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm"
                        >
                            <div className="flex justify-between items-center border-b pb-3 mb-3">
                                <span className="font-bold text-gray-800 text-lg">
                                    {item.inspection_number}
                                </span>
                                <span
                                    className={`px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider ${
                                        item.operational_status.toLowerCase() === "pass" ||
                                        item.operational_status.toLowerCase() === "fit"
                                            ? "bg-green-100 text-green-700"
                                            : item.operational_status.toLowerCase() === "fail" ||
                                              item.operational_status.toLowerCase() === "unfit"
                                            ? "bg-red-100 text-red-700"
                                            : "bg-gray-100 text-gray-700"
                                    }`}
                                >
                                    {item.operational_status}
                                </span>
                            </div>

                            <div className="text-sm text-gray-700 space-y-2 mb-4">
                                <div className="flex justify-between">
                                    <span className="font-medium text-gray-500">
                                        Engineer
                                    </span>
                                    <span className="font-semibold text-gray-900 truncate pl-4">
                                        {item.engineer}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium text-gray-500">
                                        Vehicle
                                    </span>
                                    <span className="font-semibold text-gray-900">
                                        {item.vehicle}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium text-gray-500">
                                        Date
                                    </span>
                                    <span>{item.inspection_date}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium text-gray-500">
                                        Shift
                                    </span>
                                    <span>{item.shift}</span>
                                </div>
                            </div>

                            <button
                                onClick={() => handleToggleReport(item.inspection_number)}
                                className={`w-full font-semibold py-2.5 rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                                    selectedInspection === item.inspection_number
                                        ? "bg-gray-200 hover:bg-gray-300 text-gray-800"
                                        : "bg-blue-600 hover:bg-blue-700 text-white"
                                }`}
                            >
                                {selectedInspection === item.inspection_number
                                    ? "Close Report"
                                    : "View Report"}
                            </button>

                            {selectedInspection === item.inspection_number && (
                                <div className="mt-4 border-t border-gray-200 pt-4">
                                    <InspectionReport
                                        inspectionNumber={selectedInspection}
                                        embedded={true}
                                    />
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="text-center p-6 bg-white rounded-lg border text-gray-500">
                        {!hasActiveFilter
                            ? "Enter an Engineer Name, Vehicle, or Date to search."
                            : "No inspections found matching your criteria."}
                    </div>
                )}
            </div>

            {/* Desktop View: Table Layout */}
            <div className="hidden md:block overflow-x-auto bg-white border border-gray-200 rounded-lg shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-800 text-white">
                        <tr>
                            <th className="p-4 font-semibold text-sm">Inspection No</th>
                            <th className="p-4 font-semibold text-sm">Engineer</th>
                            <th className="p-4 font-semibold text-sm">Vehicle</th>
                            <th className="p-4 font-semibold text-sm">Date</th>
                            <th className="p-4 font-semibold text-sm">Shift</th>
                            <th className="p-4 font-semibold text-sm">Status</th>
                            <th className="p-4 font-semibold text-sm text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredInspections.length > 0 ? (
                            filteredInspections.map((item) => (
                                <React.Fragment key={item.id}>
                                    <tr
                                        className={`border-b border-gray-100 transition-colors ${
                                            selectedInspection === item.inspection_number
                                                ? "bg-blue-50"
                                                : "hover:bg-gray-50"
                                        }`}
                                    >
                                        <td className="p-4 font-medium text-gray-900">
                                            {item.inspection_number}
                                        </td>
                                        <td className="p-4 text-gray-700 truncate max-w-[150px]">
                                            {item.engineer}
                                        </td>
                                        <td className="p-4 text-gray-700">
                                            {item.vehicle}
                                        </td>
                                        <td className="p-4 text-gray-700">
                                            {item.inspection_date}
                                        </td>
                                        <td className="p-4 text-gray-700">
                                            {item.shift}
                                        </td>
                                        <td className="p-4">
                                            <span
                                                className={`px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider ${
                                                    item.operational_status.toLowerCase() === "pass" ||
                                                    item.operational_status.toLowerCase() === "fit"
                                                        ? "bg-green-100 text-green-700"
                                                        : item.operational_status.toLowerCase() === "fail" ||
                                                          item.operational_status.toLowerCase() === "unfit"
                                                        ? "bg-red-100 text-red-700"
                                                        : "bg-gray-100 text-gray-700"
                                                }`}
                                            >
                                                {item.operational_status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-center">
                                            <button
                                                onClick={() => handleToggleReport(item.inspection_number)}
                                                className={`px-4 py-1.5 rounded font-medium transition-colors focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                                                    selectedInspection === item.inspection_number
                                                        ? "bg-gray-200 hover:bg-gray-300 text-gray-800"
                                                        : "bg-blue-600 hover:bg-blue-700 text-white"
                                                }`}
                                            >
                                                {selectedInspection === item.inspection_number
                                                    ? "Close"
                                                    : "View"}
                                            </button>
                                        </td>
                                    </tr>

                                    {selectedInspection === item.inspection_number && (
                                        <tr>
                                            <td colSpan={7} className="p-0 border-b-2 border-blue-200">
                                                <div className="bg-gray-50 p-6 shadow-inner">
                                                    <InspectionReport
                                                        inspectionNumber={selectedInspection}
                                                        embedded={true}
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={7} className="p-8 text-center text-gray-500">
                                    {!hasActiveFilter
                                        ? "Enter an Engineer Name, Vehicle, or Date to search."
                                        : "No inspections found matching your criteria."}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}