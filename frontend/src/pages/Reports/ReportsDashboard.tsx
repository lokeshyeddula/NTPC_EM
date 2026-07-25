import { useState } from "react";

import IndividualReportPanel from "../../components/reports/IndividualReportPanel";
import ShiftReportPanel from "../../components/reports/ShiftReportPanel";
import DailyReportPanel from "../../components/reports/DailyReportPanel";
import DateRangeReportPanel from "../../components/reports/DateRangeReportPanel";
import MonthlySummaryPanel from "../../components/reports/MonthlySummaryPanel";

const reports = [
    { id: "individual", title: "Individual Inspection" },
    { id: "shift", title: "Shift Wise" },
    { id: "daily", title: "Daily Report" },
    { id: "date-range", title: "Date Range" },
    { id: "monthly", title: "Monthly Summary" },
];

export default function ReportsDashboard() {
    const [selectedReport, setSelectedReport] = useState("individual");

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-gray-800">
                    Reports
                </h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                    {reports.map((report) => (
                        <button
                            key={report.id}
                            onClick={() => setSelectedReport(report.id)}
                            className={`rounded-lg border p-4 transition-all text-left ${
                                selectedReport === report.id
                                    ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                                    : "bg-white text-gray-700 hover:border-blue-500"
                            }`}
                        >
                            <h2 className="font-semibold text-sm">
                                {report.title}
                            </h2>
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4 sm:p-6 min-h-[500px]">
                {selectedReport === "individual" && <IndividualReportPanel />}
                {selectedReport === "shift" && <ShiftReportPanel />}
                {selectedReport === "daily" && <DailyReportPanel />}
                {selectedReport === "date-range" && <DateRangeReportPanel />}
                {selectedReport === "monthly" && <MonthlySummaryPanel />}
            </div>
        </div>
    );
}