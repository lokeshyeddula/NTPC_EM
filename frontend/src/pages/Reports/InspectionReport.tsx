import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Layout from "../../components/layout/Layout";

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

    const inspectionNumber =
        propInspectionNumber || routeInspectionNumber;

    const [report, setReport] =
        useState<InspectionReportType | null>(null);

    const [loading, setLoading] =
        useState(true);

    useEffect(() => {

        if (inspectionNumber) {

            loadReport();

        }

    }, [inspectionNumber]);

    async function loadReport() {

        try {

            const data =
                await inspectionService.getInspectionReport(
                    inspectionNumber!
                );

            setReport(data);

        }

        catch (error) {

            console.error(error);

        }

        finally {

            setLoading(false);

        }

    }

    const reportContent = loading ? (

        <div className="p-10">
            Loading Report...
        </div>

    ) : !report ? (

        <div className="p-10">
            Report not found.
        </div>

    ) : (

        <div className="max-w-6xl mx-auto print-report">

            <ReportActions
    inspectionNumber={report.inspection_number}
/>

            <ReportHeader />

            <ReportInfo report={report} />

            <ReportSummary report={report} />

            <ReportChecklist report={report} />

            <ReportRemarks report={report} />

            <ReportFooter />

        </div>

    );

    if (embedded) {

        return reportContent;

    }

    return (

        <Layout>

            {reportContent}

        </Layout>

    );

}