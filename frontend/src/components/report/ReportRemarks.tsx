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

            <div className="bg-white rounded-lg shadow p-6 mb-6">

                <h2 className="text-2xl font-bold text-red-700 mb-5">

                    Flagged Defects

                </h2>

                {

                    failedItems.length === 0 ?

                        <p className="text-green-600 font-semibold">

                            No defects found.

                        </p>

                        :

                        <ul className="list-disc pl-6 space-y-2">

                            {

                                failedItems.map((item, index) => (

                                    <li
                                        key={index}
                                        className="text-red-600 font-medium"
                                    >

                                        {item.field_name}

                                    </li>

                                ))

                            }

                        </ul>

                }

            </div>

            {/* Remarks */}

            <div className="bg-white rounded-lg shadow p-6 mb-6">

                <h2 className="text-2xl font-bold text-blue-900 mb-5">

                    Engineer Remarks

                </h2>

                {

                    report.remarks ?

                        <p>

                            {report.remarks}

                        </p>

                        :

                        <p className="italic text-gray-500">

                            No remarks provided.

                        </p>

                }

            </div>

        </>

    );

}