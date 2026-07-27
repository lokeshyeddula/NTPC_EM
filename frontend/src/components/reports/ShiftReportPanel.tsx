import  { useEffect, useState } from "react";
import inspectionService from "../../services/inspectionService";
import api from "../../api/axios";
import ntpcLogo from "../../assets/Ntpc_logo.png";
import nmlLogo from "../../assets/nml_logo.png";
interface Inspection {
    id: number;
    inspection_number: string;
    inspection_date: string;
    vehicle: string;
    machinery_type?: string;
    shift: string;
    engineer: string;
    operational_status: string;
    failed_items?: string[];
    remarks?: string;
}

export default function ShiftReportPanel() {
    const [inspections, setInspections] = useState<Inspection[]>([]);
    const [loading, setLoading] = useState(true);
    const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

    const today = new Date().toISOString().split("T")[0];
    const [filterDate, setFilterDate] = useState(today);
    const [filterShift, setFilterShift] = useState("");

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

    // 1. Initial filter based on Date and Shift
    const baseFilteredInspections = inspections.filter((item) => {
        const dateMatch = filterDate === "" || item.inspection_date === filterDate;
        const shiftMatch = filterShift === "" || item.shift.toLowerCase() === filterShift.toLowerCase();
        return dateMatch && shiftMatch;
    });

    // 2. Deduplicate Vehicles: Keep only the latest inspection per vehicle
    const latestInspectionsMap = new Map<string, Inspection>();
    baseFilteredInspections.forEach((item) => {
        const existing = latestInspectionsMap.get(item.vehicle);
        // If it doesn't exist yet, or if the current item is newer (higher ID), replace it.
        if (!existing || item.id > existing.id) {
            latestInspectionsMap.set(item.vehicle, item);
        }
    });

    // 3. Convert back to array and sort chronologically by ID
    const finalInspections = Array.from(latestInspectionsMap.values()).sort((a, b) => a.id - b.id);

    const formattedDate = filterDate
        ? new Date(filterDate).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
          })
        : "N/A";

    const handleDownloadPdf = async () => {
        try {
            setIsGeneratingPdf(true);
            const response = await api.get(`/reports/pdf/shift/?date=${filterDate}&shift=${filterShift}`, {
                responseType: 'blob'
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Shift_Report_${filterDate}_${filterShift}.pdf`);
            document.body.appendChild(link);
            link.click();

            link.parentNode?.removeChild(link);
            window.URL.revokeObjectURL(url);

        } catch (error) {
            console.error("Failed to download PDF:", error);
            alert("Failed to generate PDF. Please ensure records exist for this shift.");
        } finally {
            setIsGeneratingPdf(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center p-8 sm:p-12 text-gray-500 font-medium">
                Loading Shift Data...
            </div>
        );
    }

    return (
        <div className="w-full">
{/* Non-printable Control Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-6 bg-white p-5 rounded-xl shadow-sm border border-slate-200 print:hidden gap-4">
                <div className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto">

                    {/* Improved Date Picker */}
                    <div className="relative">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                            Select Date
                        </label>
                        <input
                            type="date"
                            value={filterDate}
                            onChange={(e) => setFilterDate(e.target.value)}
                            className="w-full sm:w-44 bg-slate-50 border border-slate-300 text-slate-700 py-2.5 px-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-slate-400 transition-colors cursor-pointer shadow-sm"
                        />
                    </div>

                    {/* Improved Custom Dropdown */}
                    <div className="relative">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                            Select Shift
                        </label>
                        <div className="relative w-full sm:w-44">
                            <select
                                value={filterShift}
                                onChange={(e) => setFilterShift(e.target.value)}
                                // appearance-none removes the ugly default OS dropdown styling
                                className="w-full appearance-none bg-slate-50 border border-slate-300 text-slate-700 py-2.5 px-3 pr-8 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-slate-400 transition-colors cursor-pointer shadow-sm"
                            >
                                <option value="" className="text-gray-500">-- All Shifts --</option>
                                <option value="Morning" className="text-gray-900">Morning Shift</option>
                                <option value="Evening" className="text-gray-900">Evening Shift</option>
                                <option value="Night" className="text-gray-900">Night Shift</option>
                                <option value="General" className="text-gray-900">General Shift</option>
                            </select>

                            {/* Custom SVG Dropdown Arrow */}
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Download Button */}
                <button
                    onClick={handleDownloadPdf}
                    disabled={filterShift === "" || isGeneratingPdf}
                    className="w-full sm:w-auto bg-[#1a365d] hover:bg-[#122644] disabled:bg-slate-400 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-lg text-sm font-bold shadow-md transition-colors flex items-center justify-center min-w-[160px]"
                >
                    {isGeneratingPdf ? "Generating PDF..." : "Download PDF"}
                </button>
            </div>

            {/* Live Dashboard Report Canvas */}
            {filterShift ? (
                <div className="bg-white p-2 sm:p-8 rounded-lg shadow-sm border border-gray-200 w-full max-w-5xl mx-auto">
                    <div className="flex justify-between items-center border-b-2 border-[#1a365d] pb-4 mb-4">
                            <img
                                   src={ntpcLogo}
                                   alt="NTPC Logo"
                                   className="h-14 sm:h-20 w-auto object-contain"
                            />

                        <div className="text-center flex-1 px-2 sm:px-4">
                            <h1 className="text-xl sm:text-3xl font-extrabold text-[#1a365d] tracking-wide mb-1 uppercase">
                                NTPC Mining Limited
                            </h1>
                            <p className="text-xs sm:text-sm font-semibold text-gray-700">
                                (A Subsidiary of NTPC Limited)
                            </p>
                            <p className="text-xs sm:text-base font-medium text-gray-800 mt-0.5">
                                Talaipalli Coal Mining Project
                            </p>
                        </div>

                        <img
                                   src={nmlLogo}
                                   alt="NML Logo"
                                   className="h-14 sm:h-20 w-auto object-contain"
                            />
                    </div>

                    <h2 className="text-lg sm:text-xl font-bold text-center text-[#1a365d] mb-4 uppercase">
                        Random Inspection Report
                    </h2>

                    <div className="border border-gray-400 rounded-md p-3 sm:p-4 mb-6 grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-8 text-sm sm:text-base text-gray-800">
                        <div className="flex">
                            <span className="font-bold w-28 sm:w-32">Report Type</span>
                            <span className="mr-2">:</span>
                            <span className="font-medium">Shift-wise</span>
                        </div>
                        <div className="flex">
                            <span className="font-bold w-28 sm:w-32">Date</span>
                            <span className="mr-2">:</span>
                            <span className="font-medium">{formattedDate}</span>
                        </div>
                        <div className="flex">
                            <span className="font-bold w-28 sm:w-32">Project</span>
                            <span className="mr-2">:</span>
                            <span className="font-medium">Talaipalli</span>
                        </div>
                        <div className="flex">
                            <span className="font-bold w-28 sm:w-32">Shift</span>
                            <span className="mr-2">:</span>
                            <span className="font-medium capitalize">{filterShift} Shift</span>
                        </div>
                    </div>

                    <div className="overflow-x-auto rounded border border-gray-400 mb-6">
                        <table className="w-full text-left border-collapse min-w-[800px]">
                            <thead className="bg-[#1a365d] text-white">
                                <tr>
                                    <th className="p-3 border-r border-gray-400 font-semibold text-sm text-center w-16">Sl. No.</th>
                                    <th className="p-3 border-r border-gray-400 font-semibold text-sm w-40">Engineer</th>
                                    <th className="p-3 border-r border-gray-400 font-semibold text-sm text-center w-28">Vehicle No.</th>
                                    <th className="p-3 border-r border-gray-400 font-semibold text-sm text-center w-36">Machinery Type</th>
                                    <th className="p-3 border-r border-gray-400 font-semibold text-sm text-center w-32">Status</th>
                                    <th className="p-3 border-r border-gray-400 font-semibold text-sm w-48">Flagged Defects</th>
                                    <th className="p-3 font-semibold text-sm">Remarks</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {finalInspections.length > 0 ? (
                                    finalInspections.map((item, index) => {
                                        const isFit = item.operational_status.toLowerCase() === "pass" || item.operational_status.toLowerCase() === "fit";

                                        return (
                                            <tr key={item.id} className="border-b border-gray-400 hover:bg-gray-50">
                                                <td className="p-3 border-r border-gray-400 text-center font-medium">
                                                    {index + 1}
                                                </td>
                                                <td className="p-3 border-r border-gray-400 font-medium text-gray-800">
                                                    {item.engineer}
                                                </td>
                                                <td className="p-3 border-r border-gray-400 text-center font-semibold text-gray-900">
                                                    {item.vehicle}
                                                </td>
                                                <td className="p-3 border-r border-gray-400 text-center text-gray-700">
                                                    {item.machinery_type || "N/A"}
                                                </td>
                                                <td className={`p-3 border-r border-gray-400 text-center font-bold ${isFit ? 'text-green-600' : 'text-red-600'}`}>
                                                    {isFit ? "Fit" : "Unfit"}
                                                </td>
                                                <td className="p-3 border-r border-gray-400 text-gray-800">
                                                    {!isFit && item.failed_items && item.failed_items.length > 0
                                                        ? item.failed_items.join(", ")
                                                        : "-"}
                                                </td>
                                                <td className="p-3 text-gray-800 text-xs sm:text-sm">
                                                    {!isFit ? (
                                                        item.remarks || "Unfit for operations pls repair it"
                                                    ) : (
                                                        "Fit for operations"
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="p-10 text-center text-gray-500 font-medium italic">
                                            No inspections recorded for this shift yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Footer Signature Box (Totals Removed) */}
                    <div className="flex justify-end pt-4 pr-4">
                        <div className="text-center">
                            <div className="w-64 border-b border-gray-800 mx-auto mb-2"></div>
                            <div className="font-bold text-gray-800 text-sm">Shift In-charge / Engineer</div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-center p-12 bg-white rounded-lg border border-gray-200 text-gray-500 font-medium">
                    Please select a Shift to view the progressive report.
                </div>
            )}
        </div>
    );
}