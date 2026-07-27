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

export default function DailyReportPanel() {
    const [inspections, setInspections] = useState<Inspection[]>([]);
    const [loading, setLoading] = useState(true);
    const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

    // Initialize with today's date
    const today = new Date().toISOString().split("T")[0];
    const [filterDate, setFilterDate] = useState(today);

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

    // 1. Filter by Selected Date
    const baseFilteredInspections = inspections.filter((item) => {
        return item.inspection_date === filterDate;
    });

    // 2. Deduplicate Vehicles: Keep only the latest inspection per vehicle for the day
    const latestInspectionsMap = new Map<string, Inspection>();
    baseFilteredInspections.forEach((item) => {
        const existing = latestInspectionsMap.get(item.vehicle);
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
            const response = await api.get(`/reports/pdf/daily/?date=${filterDate}`, {
                responseType: 'blob'
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Daily_Report_${filterDate}.pdf`);
            document.body.appendChild(link);
            link.click();

            link.parentNode?.removeChild(link);
            window.URL.revokeObjectURL(url);

        } catch (error) {
            console.error("Failed to download PDF:", error);
            alert("Failed to generate PDF. Please ensure records exist for this date or backend endpoint is configured.");
        } finally {
            setIsGeneratingPdf(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center p-8 sm:p-12 text-slate-500 font-medium">
                Loading Daily Data...
            </div>
        );
    }

    return (
        <div className="w-full">
            {/* Immersive Control Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-6 print:hidden gap-4 max-w-5xl mx-auto w-full">
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                            Select Date
                        </label>
                        <input
                            type="date"
                            value={filterDate}
                            onChange={(e) => setFilterDate(e.target.value)}
                            className="w-full sm:w-48 bg-white border border-slate-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none shadow-sm text-sm font-medium text-slate-700"
                        />
                    </div>
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                    <button
                        onClick={handleDownloadPdf}
                        disabled={filterDate === "" || isGeneratingPdf}
                        className="w-full sm:w-auto bg-[#1a365d] hover:bg-[#122644] disabled:bg-slate-400 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-lg text-sm font-bold shadow-md transition-colors flex items-center justify-center min-w-[160px]"
                    >
                        {isGeneratingPdf ? "Generating PDF..." : "Download PDF"}
                    </button>
                </div>
            </div>

            {/* Live Dashboard Report Canvas (Virtual Desk Paper style) */}
            {filterDate ? (
                <div className="bg-white p-6 sm:p-10 rounded-sm shadow-xl border border-slate-200 w-full max-w-5xl mx-auto print:shadow-none print:border-none print:p-0 print:max-w-none">
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
                            <p className="text-xs sm:text-sm font-semibold text-slate-700">
                                (A Subsidiary of NTPC Limited)
                            </p>
                            <p className="text-xs sm:text-base font-medium text-slate-800 mt-0.5">
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
                        Daily Inspection Report
                    </h2>

                    <div className="border border-slate-300 rounded-md p-3 sm:p-4 mb-6 grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-8 text-sm sm:text-base text-slate-800 bg-slate-50/50">
                        <div className="flex">
                            <span className="font-bold w-32">Report Type</span>
                            <span className="mr-2">:</span>
                            <span className="font-medium">Daily Inspection Report</span>
                        </div>
                        <div className="flex">
                            <span className="font-bold w-32">Date</span>
                            <span className="mr-2">:</span>
                            <span className="font-medium">{formattedDate}</span>
                        </div>
                        <div className="flex">
                            <span className="font-bold w-32">Project</span>
                            <span className="mr-2">:</span>
                            <span className="font-medium">Talaipalli</span>
                        </div>
                        <div className="flex">
                            <span className="font-bold w-32">Total Vehicles</span>
                            <span className="mr-2">:</span>
                            <span className="font-medium">{finalInspections.length} Inspected</span>
                        </div>
                    </div>

                    <div className="overflow-x-auto rounded border border-slate-300 mb-6">
                        <table className="w-full text-left border-collapse min-w-[1000px]">
                            <thead className="bg-[#1a365d] text-white">
                                <tr>
                                    <th className="p-3 border-r border-slate-300 font-semibold text-sm text-center w-12">Sl. No.</th>
                                    <th className="p-3 border-r border-slate-300 font-semibold text-sm w-32">Engineer</th>
                                    <th className="p-3 border-r border-slate-300 font-semibold text-sm text-center w-24">Vehicle No.</th>
                                    <th className="p-3 border-r border-slate-300 font-semibold text-sm w-32">Machinery Type</th>
                                    <th className="p-3 border-r border-slate-300 font-semibold text-sm w-28">Last Shift</th>
                                    <th className="p-3 border-r border-slate-300 font-semibold text-sm text-center w-24">EOD Status</th>
                                    <th className="p-3 border-r border-slate-300 font-semibold text-sm w-48">Flagged Defects</th>
                                    <th className="p-3 font-semibold text-sm">Remarks</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {finalInspections.length > 0 ? (
                                    finalInspections.map((item, index) => {
                                        const isFit = item.operational_status.toLowerCase() === "pass" || item.operational_status.toLowerCase() === "fit";

                                        return (
                                            <tr key={item.id} className="border-b border-slate-200 hover:bg-slate-50">
                                                <td className="p-3 border-r border-slate-200 text-center font-medium text-slate-700">
                                                    {index + 1}
                                                </td>
                                                <td className="p-3 border-r border-slate-200 text-slate-800">
                                                    {item.engineer}
                                                </td>
                                                <td className="p-3 border-r border-slate-200 text-center font-bold text-slate-900">
                                                    {item.vehicle}
                                                </td>
                                                <td className="p-3 border-r border-slate-200 text-slate-800">
                                                    {item.machinery_type || "N/A"}
                                                </td>
                                                <td className="p-3 border-r border-slate-200 text-slate-700">
                                                    {item.shift}
                                                </td>
                                                <td className={`p-3 border-r border-slate-200 text-center font-bold ${isFit ? 'text-green-600' : 'text-red-600'}`}>
                                                    {isFit ? "Fit" : "Unfit"}
                                                </td>
                                                <td className="p-3 border-r border-slate-200 text-slate-800">
                                                    {!isFit && item.failed_items && item.failed_items.length > 0
                                                        ? item.failed_items.join(", ")
                                                        : "-"}
                                                </td>
                                                <td className="p-3 text-slate-800 text-xs sm:text-sm">
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
                                        <td colSpan={8} className="p-10 text-center text-slate-500 font-medium italic">
                                            No inspections recorded for this date.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Footer Signature Box */}
                    <div className="flex justify-end pt-4 pr-4 mt-8">
                        <div className="text-center">
                            <div className="w-64 border-b border-slate-800 mx-auto mb-2"></div>
                            <div className="font-bold text-slate-800 text-sm">Colliery Engineer / Mine Manager</div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-center p-12 bg-white rounded-lg border border-slate-200 text-slate-500 font-medium max-w-5xl mx-auto shadow-sm">
                    Please select a Date to view the daily report.
                </div>
            )}
        </div>
    );
}