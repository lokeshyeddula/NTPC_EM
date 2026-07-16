import type { InspectionReport } from "../../types/report";

interface Props {
    report: InspectionReport;
}

export default function ReportChecklist({ report }: Props) {

    return (

        <div className="bg-white rounded-lg shadow p-6 mb-6">

            <h2 className="text-2xl font-bold text-blue-900 mb-6">

                Inspection Checklist

            </h2>

            <table className="w-full border-collapse border border-gray-300">

                <thead>

                    <tr className="bg-blue-900 text-white">

                        <th className="border p-3 w-20">

                            Sl. No.

                        </th>

                        <th className="border p-3 text-left">

                            Inspection Point

                        </th>

                        <th className="border p-3 w-40">

                            Result

                        </th>

                    </tr>

                </thead>

                <tbody>

                    {report.results.map((item, index) => (

                        <tr
                            key={index}
                            className="hover:bg-gray-50"
                        >

                            <td className="border p-3 text-center">

                                {index + 1}

                            </td>

                            <td className="border p-3">

                                {item.field_name}

                            </td>

                            <td className="border p-3 text-center">

                                <span
                                    className={`font-bold ${
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

    );

}