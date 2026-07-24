import type { InspectionReport } from "../../types/report";

interface Props {
    report: InspectionReport;
}

export default function ReportSummary({ report }: Props) {
    const total = report.results.length;
    const passed = report.results.filter(
        item => item.result === "Pass"
    ).length;
    const failed = report.results.filter(
        item => item.result === "Fail"
    ).length;

    return (
        <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-blue-900 mb-4 sm:mb-6">
                Inspection Summary
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
                <div className="border rounded-lg p-4 sm:p-5 text-center flex flex-col justify-center">
                    <p className="text-gray-500 text-xs sm:text-sm font-medium mb-1">
                        Total Checkpoints
                    </p>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-800">
                        {total}
                    </p>
                </div>

                <div className="border rounded-lg p-4 sm:p-5 text-center flex flex-col justify-center">
                    <p className="text-gray-500 text-xs sm:text-sm font-medium mb-1">
                        Passed
                    </p>
                    <p className="text-2xl sm:text-3xl font-bold text-green-600">
                        {passed}
                    </p>
                </div>

                <div className="border rounded-lg p-4 sm:p-5 text-center flex flex-col justify-center">
                    <p className="text-gray-500 text-xs sm:text-sm font-medium mb-1">
                        Failed
                    </p>
                    <p className="text-2xl sm:text-3xl font-bold text-red-600">
                        {failed}
                    </p>
                </div>

                <div className="border rounded-lg p-4 sm:p-5 text-center flex flex-col justify-center bg-gray-50">
                    <p className="text-gray-500 text-xs sm:text-sm font-medium mb-1">
                        Operational Status
                    </p>
                    <p
                        className={`text-xl sm:text-2xl font-bold uppercase tracking-wide ${
                            report.operational_status === "Fit" || report.operational_status === "Pass"
                                ? "text-green-600"
                                : "text-red-600"
                        }`}
                    >
                        {report.operational_status}
                    </p>
                </div>
            </div>
        </div>
    );
}