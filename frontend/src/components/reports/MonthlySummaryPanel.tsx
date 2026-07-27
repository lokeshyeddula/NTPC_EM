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

export default function MonthlySummaryPanel() {
    const [inspections, setInspections] = useState<Inspection[]>([]);
    const [loading, setLoading] = useState(true);
    const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

    // Initialize with current YYYY-MM
    const today = new Date();
    const currentMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
    const [filterMonth, setFilterMonth] = useState(currentMonth);

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

    // 1. Filter by Selected Month (YYYY-MM)
    const baseFilteredInspections = inspections.filter((item) => {
        return item.inspection_date.startsWith(filterMonth);
    });

    // 2. Deduplicate Vehicles and Count Unfit Instances
    const latestInspectionsMap = new Map<string, Inspection>();
    const unfitCounts = new Map<string, number>();

    baseFilteredInspections.forEach((item) => {
        // Increment unfit count if the machine failed
        const isUnfit = item.operational_status.toLowerCase() === "fail" || item.operational_status.toLowerCase() === "unfit";
        if (isUnfit) {
            const currentUnfit = unfitCounts.get(item.vehicle) || 0;
            unfitCounts.set(item.vehicle, currentUnfit + 1);
        }

        // Keep latest inspection for EOM status
        const existing = latestInspectionsMap.get(item.vehicle);
        if (!existing || item.id > existing.id) {
            latestInspectionsMap.set(item.vehicle, item);
        }
    });

    // 3. Convert back to array and sort chronologically by ID
    const finalInspections = Array.from(latestInspectionsMap.values()).sort((a, b) => a.id - b.id);

    // Format Month for Display (e.g., "July 2026")
    const formattedMonth = filterMonth
        ? new Date(filterMonth + "-01").toLocaleDateString("en-GB", {
              month: "long",
              year: "numeric",
          })
        : "N/A";

    const handleDownloadPdf = async () => {
        try {
            setIsGeneratingPdf(true);
            const response = await api.get(`/reports/pdf/monthly/?month=${filterMonth}`, {
                responseType: "blob",
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `Monthly_Summary_${filterMonth}.pdf`);
            document.body.appendChild(link);
            link.click();

            link.parentNode?.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Failed to download PDF:", error);
            alert("Failed to generate PDF. Please ensure records exist for this month.");
        } finally {
            setIsGeneratingPdf(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center p-8 sm:p-12 text-gray-500 font-medium">
                Loading Monthly Data...
            </div>
        );
    }

    return (
        <div className="w-full">
            {/* Control Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200 print:hidden gap-4">
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                    <div>
                        <label className="block text-sm font-semibold mb-1.5 text-gray-700">
                            Select Month
                        </label>
                        <input
                            type="month"
                            value={filterMonth}
                            onChange={(e) => setFilterMonth(e.target.value)}
                            className="w-full sm:w-48 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                    </div>
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                    <button
                        onClick={handleDownloadPdf}
                        disabled={filterMonth === "" || isGeneratingPdf}
                        className="w-full sm:w-auto bg-[#1a365d] hover:bg-[#122644] disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-lg text-sm font-bold shadow-md transition-colors flex items-center justify-center min-w-[160px]"
                    >
                        {isGeneratingPdf ? "Generating PDF..." : "Download PDF"}
                    </button>
                </div>
            </div>

            {/* Report Canvas */}
            {filterMonth ? (
                <div className="bg-white p-2 sm:p-8 rounded-lg shadow-sm border border-gray-200 w-full max-w-5xl mx-auto print:shadow-none print:border-none print:p-0 print:max-w-none">
                    <div className="flex justify-between items-center border-b-2 border-[#1a365d] pb-4 mb-4">
                        <img src={ntpcLogo} alt="NTPC Logo" className="h-14 sm:h-20 w-auto object-contain" />
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
                        <img src={nmlLogo} alt="NML Logo" className="h-14 sm:h-20 w-auto object-contain" />
                    </div>

                    <h2 className="text-lg sm:text-xl font-bold text-center text-[#1a365d] mb-4 uppercase">
                        Monthly Inspection Summary
                    </h2>

                    <div className="border border-gray-400 rounded-md p-3 sm:p-4 mb-6 grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-8 text-sm sm:text-base text-gray-800">
                        <div className="flex">
                            <span className="font-bold w-36">Report Type</span>
                            <span className="mr-2">:</span>
                            <span className="font-medium">Monthly Summary</span>
                        </div>
                        <div className="flex">
                            <span className="font-bold w-32">Month</span>
                            <span className="mr-2">:</span>
                            <span className="font-medium">{formattedMonth}</span>
                        </div>
                        <div className="flex">
                            <span className="font-bold w-36">Project</span>
                            <span className="mr-2">:</span>
                            <span className="font-medium">Talaipalli</span>
                        </div>
                        <div className="flex">
                            <span className="font-bold w-32">Active Vehicles</span>
                            <span className="mr-2">:</span>
                            <span className="font-medium">{finalInspections.length}</span>
                        </div>
                    </div>

                    <div className="overflow-x-auto rounded border border-gray-400 mb-6">
                        <table className="w-full text-left border-collapse min-w-[900px]">
                            <thead className="bg-[#1a365d] text-white">
                                <tr>
                                    <th className="p-3 border-r border-gray-400 font-semibold text-sm text-center w-12">Sl. No.</th>
                                    <th className="p-3 border-r border-gray-400 font-semibold text-sm text-center w-28">Vehicle No.</th>
                                    <th className="p-3 border-r border-gray-400 font-semibold text-sm w-36">Machinery Type</th>
                                    <th className="p-3 border-r border-gray-400 font-semibold text-sm text-center w-24">Unfit Instances</th>
                                    <th className="p-3 border-r border-gray-400 font-semibold text-sm text-center w-24">EOM Status</th>
                                    <th className="p-3 border-r border-gray-400 font-semibold text-sm w-48">Latest Flagged Defects</th>
                                    <th className="p-3 font-semibold text-sm">Remarks</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {finalInspections.length > 0 ? (
                                    finalInspections.map((item, index) => {
                                        const isFit = item.operational_status.toLowerCase() === "pass" || item.operational_status.toLowerCase() === "fit";
                                        const unfitCount = unfitCounts.get(item.vehicle) || 0;

                                        return (
                                            <tr key={item.id} className="border-b border-gray-400 hover:bg-gray-50">
                                                <td className="p-3 border-r border-gray-400 text-center font-medium">
                                                    {index + 1}
                                                </td>
                                                <td className="p-3 border-r border-gray-400 text-center font-bold text-gray-900">
                                                    {item.vehicle}
                                                </td>
                                                <td className="p-3 border-r border-gray-400 text-gray-800">
                                                    {item.machinery_type || "N/A"}
                                                </td>
                                                <td className={`p-3 border-r border-gray-400 text-center font-bold ${unfitCount > 0 ? 'text-red-600 bg-red-50' : 'text-gray-700'}`}>
                                                    {unfitCount}
                                                </td>
                                                <td className={`p-3 border-r border-gray-400 text-center font-bold ${isFit ? "text-green-600" : "text-red-600"}`}>
                                                    {isFit ? "Fit" : "Unfit"}
                                                </td>
                                                <td className="p-3 border-r border-gray-400 text-gray-800">
                                                    {!isFit && item.failed_items && item.failed_items.length > 0
                                                        ? item.failed_items.join(", ")
                                                        : "-"}
                                                </td>
                                                <td className="p-3 text-gray-800 text-xs sm:text-sm">
                                                    {!isFit ? item.remarks || "Requires maintenance" : "Operational"}
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="p-10 text-center text-gray-500 font-medium italic">
                                            No inspections recorded for this month.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex justify-end pt-4 pr-4 mt-8">
                        <div className="text-center">
                            <div className="w-64 border-b border-gray-800 mx-auto mb-2"></div>
                            <div className="font-bold text-gray-800 text-sm"> Colliery Engineer/ Mine Manager</div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-center p-12 bg-white rounded-lg border border-gray-200 text-gray-500 font-medium">
                    Please select a Month to view the summary.
                </div>
            )}
        </div>
    );
}