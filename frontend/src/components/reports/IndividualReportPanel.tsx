import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
    const [searchInspection, setSearchInspection] = useState("");
    const [searchVehicle, setSearchVehicle] = useState("");
    const [searchDate, setSearchDate] = useState("");
    const [selectedInspection, setSelectedInspection] =
    useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        try {
            const data = await inspectionService.getInspectionHistory();
            setInspections(data);
        } catch (error) {
            console.error("Error loading inspection history:", error);
        } finally {
            setLoading(false);
        }
    }

    // This MUST be inside the component to access state variables
    const filteredInspections = inspections.filter((item) => {
        const inspectionMatch = item.inspection_number
            .toLowerCase()
            .includes(searchInspection.toLowerCase());

        const vehicleMatch = item.vehicle
            .toLowerCase()
            .includes(searchVehicle.toLowerCase());

        const dateMatch = searchDate === "" || item.inspection_date === searchDate;

        return inspectionMatch && vehicleMatch && dateMatch;
    });

    if (loading) {
        return <p className="text-gray-500">Loading...</p>;
    }

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">
                Individual Inspection Report
            </h2>

            <div className="grid grid-cols-3 gap-4 mb-6">
                <div>
                    <label className="block text-sm font-medium mb-1">
                        Inspection Number
                    </label>
                    <input
                        type="text"
                        value={searchInspection}
                        onChange={(e) => setSearchInspection(e.target.value)}
                        placeholder="Search Inspection"
                        className="w-full border rounded-lg px-3 py-2"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">
                        Vehicle
                    </label>
                    <input
                        type="text"
                        value={searchVehicle}
                        onChange={(e) => setSearchVehicle(e.target.value)}
                        placeholder="Search Vehicle"
                        className="w-full border rounded-lg px-3 py-2"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">
                        Date
                    </label>
                    <input
                        type="date"
                        value={searchDate}
                        onChange={(e) => setSearchDate(e.target.value)}
                        className="w-full border rounded-lg px-3 py-2"
                    />
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full border">
                    <thead className="bg-slate-800 text-white text-left">
                        <tr>
                            <th className="p-3 font-medium">Inspection No</th>
                            <th className="p-3 font-medium">Vehicle</th>
                            <th className="p-3 font-medium">Date</th>
                            <th className="p-3 font-medium">Shift</th>
                            <th className="p-3 font-medium">Status</th>
                            <th className="p-3 font-medium">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredInspections.length > 0 ? (
                            filteredInspections.map((item) => (
                                <tr key={item.id} className="border-b hover:bg-gray-50">
                                    <td className="p-3">{item.inspection_number}</td>
                                    <td className="p-3">{item.vehicle}</td>
                                    <td className="p-3">{item.inspection_date}</td>
                                    <td className="p-3">{item.shift}</td>
                                    <td className="p-3">
                                        <span className={`px-2 py-1 rounded text-sm font-medium ${
                                            item.operational_status === "FIT"
                                                ? "bg-green-100 text-green-700"
                                                : item.operational_status === "UNFIT"
                                                ? "bg-red-100 text-red-700"
                                                : "bg-gray-100 text-gray-700"
                                        }`}>
                                            {item.operational_status}
                                        </span>
                                    </td>
                                    <td className="p-3">
                                       <button
    onClick={() =>
        setSelectedInspection(item.inspection_number)
    }
    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
>
    View
</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="p-4 text-center text-gray-500">
                                    No inspections found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
                {selectedInspection && (

    <div className="mt-10 border-t pt-8">

        <InspectionReport
    inspectionNumber={selectedInspection}
    embedded={true}
/>

    </div>

)}
            </div>
        </div>
    );
}