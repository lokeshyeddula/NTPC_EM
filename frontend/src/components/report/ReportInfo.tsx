import type { InspectionReport } from "../../types/report";

interface Props {
    report: InspectionReport;
}

export default function ReportInfo({ report }: Props) {
    return (
        <div className="bg-white rounded-lg shadow mb-4 sm:mb-6 p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold text-blue-900 mb-4 sm:mb-6">
                Inspection Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 sm:gap-x-16 gap-y-4">
                <div className="flex justify-between sm:block border-b sm:border-0 pb-2 sm:pb-0">
                    <p className="text-gray-500 text-sm sm:text-base">Inspection Number</p>
                    <p className="font-semibold text-base sm:text-lg">{report.inspection_number}</p>
                </div>
                <div className="flex justify-between sm:block border-b sm:border-0 pb-2 sm:pb-0">
                    <p className="text-gray-500 text-sm sm:text-base">Inspection Date</p>
                    <p className="font-semibold text-base sm:text-lg">{report.inspection_date}</p>
                </div>
                <div className="flex justify-between sm:block border-b sm:border-0 pb-2 sm:pb-0">
                    <p className="text-gray-500 text-sm sm:text-base">Shift</p>
                    <p className="font-semibold text-base sm:text-lg">{report.shift}</p>
                </div>
                <div className="flex justify-between sm:block border-b sm:border-0 pb-2 sm:pb-0">
                    <p className="text-gray-500 text-sm sm:text-base">Relay</p>
                    <p className="font-semibold text-base sm:text-lg">{report.relay}</p>
                </div>
                <div className="flex justify-between sm:block border-b sm:border-0 pb-2 sm:pb-0">
                    <p className="text-gray-500 text-sm sm:text-base">Engineer</p>
                    <p className="font-semibold text-base sm:text-lg">{report.engineer}</p>
                </div>
                <div className="flex justify-between sm:block border-b sm:border-0 pb-2 sm:pb-0">
                    <p className="text-gray-500 text-sm sm:text-base">Designation</p>
                    <p className="font-semibold text-base sm:text-lg text-right sm:text-left">{report.designation}</p>
                </div>
                <div className="flex justify-between sm:block border-b sm:border-0 pb-2 sm:pb-0">
                    <p className="text-gray-500 text-sm sm:text-base">Vehicle Number</p>
                    <p className="font-semibold text-base sm:text-lg">{report.vehicle}</p>
                </div>
                <div className="flex justify-between sm:block border-b sm:border-0 pb-2 sm:pb-0">
                    <p className="text-gray-500 text-sm sm:text-base">Machinery Type</p>
                    <p className="font-semibold text-base sm:text-lg text-right sm:text-left">{report.machinery_type}</p>
                </div>
            </div>
        </div>
    );
}