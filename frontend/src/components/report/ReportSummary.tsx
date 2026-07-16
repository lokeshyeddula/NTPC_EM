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

        <div className="bg-white rounded-lg shadow p-6 mb-6">

            <h2 className="text-2xl font-bold text-blue-900 mb-6">

                Inspection Summary

            </h2>

            <div className="grid grid-cols-4 gap-6">

                <div className="border rounded-lg p-5 text-center">

                    <p className="text-gray-500">

                        Total Checkpoints

                    </p>

                    <p className="text-3xl font-bold">

                        {total}

                    </p>

                </div>

                <div className="border rounded-lg p-5 text-center">

                    <p className="text-gray-500">

                        Passed

                    </p>

                    <p className="text-3xl font-bold text-green-600">

                        {passed}

                    </p>

                </div>

                <div className="border rounded-lg p-5 text-center">

                    <p className="text-gray-500">

                        Failed

                    </p>

                    <p className="text-3xl font-bold text-red-600">

                        {failed}

                    </p>

                </div>

                <div className="border rounded-lg p-5 text-center">

                    <p className="text-gray-500">

                        Operational Status

                    </p>

                    <p
                        className={`text-2xl font-bold ${
                            report.operational_status === "Fit"
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