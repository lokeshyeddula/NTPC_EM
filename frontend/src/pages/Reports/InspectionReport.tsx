import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import inspectionService from "../../services/inspectionService";

import ReportHeader from "../../components/report/ReportHeader";
import ReportInfo from "../../components/report/ReportInfo";
import ReportSummary from "../../components/report/ReportSummary";
import ReportChecklist from "../../components/report/ReportChecklist";
import ReportRemarks from "../../components/report/ReportRemarks";
import ReportFooter from "../../components/report/ReportFooter";
import ReportActions from "../../components/report/ReportActions";

import type { InspectionReport as InspectionReportType } from "../../types/report";

interface InspectionReportProps {
    inspectionNumber?: string;
    embedded?: boolean;
}

export default function InspectionReport({
    inspectionNumber: propInspectionNumber,
    embedded = false,
}: InspectionReportProps) {
    const { inspectionNumber: routeInspectionNumber } = useParams();
    const inspectionNumber = propInspectionNumber || routeInspectionNumber;

    const [report, setReport] = useState<InspectionReportType | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (inspectionNumber) {
            loadReport();
        }
    }, [inspectionNumber]);

    async function loadReport() {
        try {
            setLoading(true);
            const data = await inspectionService.getInspectionReport(inspectionNumber!);
            setReport(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const reportContent = loading ? (
        <div className="flex justify-center items-center p-8 sm:p-12 text-gray-500 font-medium text-sm sm:text-base bg-white rounded-lg shadow-sm border border-gray-100">
            Loading Report...
        </div>
    ) : !report ? (
        <div className="flex justify-center items-center p-8 sm:p-12 text-red-500 font-medium text-sm sm:text-base bg-white rounded-lg shadow-sm border border-gray-100">
            Report not found.
        </div>
    ) : (
        <div className="max-w-6xl mx-auto print-report bg-white rounded-xl shadow-sm sm:shadow-lg border border-gray-200 overflow-hidden">
            <div className="p-4 sm:p-6 md:p-10 space-y-6 sm:space-y-8">
                <ReportActions inspectionNumber={report.inspection_number} />
                <ReportHeader />
                <ReportInfo report={report} />
                <ReportSummary report={report} />
                <ReportChecklist report={report} />
                <ReportRemarks report={report} />
                <ReportFooter />
            </div>
        </div>
    );

    if (embedded) {
        return reportContent;
    }

    return (
        <div className="w-full pb-6 sm:py-6">
            {reportContent}
        </div>
    );
}