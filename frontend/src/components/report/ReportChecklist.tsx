import type { InspectionReport } from "../../types/report";

interface Props {
    report: InspectionReport;
}

export default function ReportChecklist({ report }: Props) {
    return (
        <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-blue-900 mb-4 sm:mb-6">
                Inspection Checklist
            </h2>

            <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 min-w-[500px]">
                    <thead>
                        <tr className="bg-blue-900 text-white">
                            <th className="border p-3 w-16 sm:w-20 text-sm sm:text-base">
                                Sl. No.
                            </th>
                            <th className="border p-3 text-left text-sm sm:text-base">
                                Inspection Point
                            </th>
                            <th className="border p-3 w-28 sm:w-40 text-sm sm:text-base">
                                Result
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {report.results.map((item, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                                <td className="border p-3 text-center text-sm sm:text-base">
                                    {index + 1}
                                </td>
                                <td className="border p-3 text-sm sm:text-base">
                                    {item.field_name}
                                </td>
                                <td className="border p-3 text-center">
                                    <span
                                        className={`font-bold text-sm sm:text-base ${
                                            item.result === "Pass"
                                                ? "text-green-600"
                                                : "text-red-600"
                                        }`}
                                    >
                                        {item.result}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}