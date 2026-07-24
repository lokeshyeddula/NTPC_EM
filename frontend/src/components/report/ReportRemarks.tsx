import type { InspectionReport } from "../../types/report";

interface Props {
    report: InspectionReport;
}

export default function ReportRemarks({ report }: Props) {
    const failedItems = report.results.filter(
        item => item.result === "Fail"
    );

    return (
        <>
            {/* Flagged Defects */}
            <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-red-700 mb-4 sm:mb-5">
                    Flagged Defects
                </h2>
                {failedItems.length === 0 ? (
                    <p className="text-green-600 font-semibold text-sm sm:text-base">
                        No defects found.
                    </p>
                ) : (
                    <ul className="list-disc pl-5 sm:pl-6 space-y-1 sm:space-y-2">
                        {failedItems.map((item, index) => (
                            <li key={index} className="text-red-600 font-medium text-sm sm:text-base">
                                {item.field_name}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Remarks */}
            <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-blue-900 mb-4 sm:mb-5">
                    Engineer Remarks
                </h2>
                {report.remarks ? (
                    <p className="text-gray-800 text-sm sm:text-base leading-relaxed">
                        {report.remarks}
                    </p>
                ) : (
                    <p className="italic text-gray-500 text-sm sm:text-base">
                        No remarks provided.
                    </p>
                )}
            </div>
        </>
    );
}