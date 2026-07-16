import type {
    InspectionReport,
} from "../../types/report";

interface Props {

    report: InspectionReport;

}

export default function ReportInfo({

    report,

}: Props) {

    return (

        <div className="bg-white rounded-lg shadow mb-6 p-6">

            <h2 className="text-2xl font-bold text-blue-900 mb-6">

                Inspection Information

            </h2>

            <div className="grid grid-cols-2 gap-x-16 gap-y-4">

                <div>

                    <p className="text-gray-500">

                        Inspection Number

                    </p>

                    <p className="font-semibold text-lg">

                        {report.inspection_number}

                    </p>

                </div>

                <div>

                    <p className="text-gray-500">

                        Inspection Date

                    </p>

                    <p className="font-semibold text-lg">

                        {report.inspection_date}

                    </p>

                </div>

                <div>

                    <p className="text-gray-500">

                        Shift

                    </p>

                    <p className="font-semibold text-lg">

                        {report.shift}

                    </p>

                </div>

                <div>

                    <p className="text-gray-500">

                        Relay

                    </p>

                    <p className="font-semibold text-lg">

                        {report.relay}

                    </p>

                </div>

                <div>

                    <p className="text-gray-500">

                        Engineer

                    </p>

                    <p className="font-semibold text-lg">

                        {report.engineer}

                    </p>

                </div>

                <div>

                    <p className="text-gray-500">

                        Designation

                    </p>

                    <p className="font-semibold text-lg">

                        {report.designation}

                    </p>

                </div>

                <div>

                    <p className="text-gray-500">

                        Vehicle Number

                    </p>

                    <p className="font-semibold text-lg">

                        {report.vehicle}

                    </p>

                </div>

                <div>

                    <p className="text-gray-500">

                        Machinery Type

                    </p>

                    <p className="font-semibold text-lg">

                        {report.machinery_type}

                    </p>

                </div>

            </div>

        </div>

    );

}