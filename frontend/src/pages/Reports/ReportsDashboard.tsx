import  { useState } from "react";

import IndividualReportPanel from "../../components/reports/IndividualReportPanel";
import ShiftReportPanel from "../../components/reports/ShiftReportPanel";
import DailyReportPanel from "../../components/reports/DailyReportPanel";
import MonthlySummaryPanel from "../../components/reports/MonthlySummaryPanel";

const reports = [
    { id: "individual", title: "Individual Inspection" },
    { id: "shift", title: "Shift Wise" },
    { id: "daily", title: "Daily Report" },
    { id: "monthly", title: "Monthly Summary" },
];

export default function ReportsDashboard() {
    const [selectedReport, setSelectedReport] = useState("individual");

    return (
        // Added bg-slate-50 here to give the whole section a soft, premium background
        <div className="sm:p-6 min-h-screen bg-white sm:bg-slate-50 sm:space-y-6 sm:rounded-2xl">

            {/* Header and Navigation Tabs */}
            <div className="bg-white sm:rounded-xl sm:shadow-sm border-b sm:border border-slate-200 py-4 sm:p-6">
                <h1 className="text-2xl sm:text-3xl font-extrabold mb-5 text-gray-900 tracking-tight">
                    Reports Dashboard
                </h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    {reports.map((report) => {
                        const isActive = selectedReport === report.id;

                        return (
                            <button
                                key={report.id}
                                type="button"
                                onClick={() => setSelectedReport(report.id)}
                                className={`relative px-4 py-3.5 rounded-lg border font-semibold text-sm sm:text-base text-center transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                                    isActive
                                        ? "bg-blue-600 text-white border-blue-600 shadow-md transform scale-[1.02]"
                                        : "bg-white text-gray-600 border-gray-200 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50"
                                }`}
                            >
                                {report.title}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Dynamic Report Panel Canvas */}
            <div className="bg-white sm:rounded-xl sm:shadow-sm sm:border border-slate-200 pt-4 sm:p-6 min-h-[500px]">
                {selectedReport === "individual" && <IndividualReportPanel />}
                {selectedReport === "shift" && <ShiftReportPanel />}
                {selectedReport === "daily" && <DailyReportPanel />}
                {selectedReport === "monthly" && <MonthlySummaryPanel />}
            </div>
        </div>
    );
}