import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
    AlertCircle,
    FileText,
    LoaderCircle,
} from "lucide-react";

import inspectionService from "../../services/inspectionService";

import ReportHeader from "../../components/report/ReportHeader";
import ReportInfo from "../../components/report/ReportInfo";
import ReportSummary from "../../components/report/ReportSummary";
import ReportChecklist from "../../components/report/ReportChecklist";
import ReportRemarks from "../../components/report/ReportRemarks";
import ReportFooter from "../../components/report/ReportFooter";
import ReportActions from "../../components/report/ReportActions";

import type {
    InspectionReport as InspectionReportType,
} from "../../types/report";


interface InspectionReportProps {
    inspectionNumber?: string;
    embedded?: boolean;
}


export default function InspectionReport({
    inspectionNumber: propInspectionNumber,
    embedded = false,
}: InspectionReportProps) {

    const {
        inspectionNumber: routeInspectionNumber,
    } = useParams();


    const inspectionNumber =
        propInspectionNumber ||
        routeInspectionNumber;


    const [report, setReport] =
        useState<InspectionReportType | null>(null);


    const [loading, setLoading] =
        useState(true);


    const [error, setError] =
        useState(false);


    // =========================================================
    // LOAD REPORT
    // =========================================================

    useEffect(() => {

        if (inspectionNumber) {
            loadReport();
        } else {
            setLoading(false);
        }

    }, [inspectionNumber]);


    async function loadReport() {

        try {

            setLoading(true);
            setError(false);

            const data =
                await inspectionService
                    .getInspectionReport(
                        inspectionNumber!
                    );

            setReport(data);

        } catch (error) {

            console.error(
                "Error loading inspection report:",
                error
            );

            setReport(null);
            setError(true);

        } finally {

            setLoading(false);

        }
    }


    // =========================================================
    // LOADING STATE
    // =========================================================

    if (loading) {

        return (

            <div
                className={`
                    flex
                    min-h-[300px]
                    flex-col
                    items-center
                    justify-center
                    gap-4
                    bg-white

                    ${
                        embedded
                            ? "rounded-xl border border-slate-200"
                            : "min-h-[60vh]"
                    }
                `}
            >

                <div className="
                    flex
                    h-12
                    w-12
                    items-center
                    justify-center
                    rounded-xl
                    bg-blue-50
                    text-blue-600
                ">

                    <LoaderCircle
                        size={25}
                        className="animate-spin"
                    />

                </div>


                <div className="text-center">

                    <p className="
                        text-sm
                        font-bold
                        text-slate-800
                    ">
                        Loading Inspection Report
                    </p>

                    <p className="
                        mt-1
                        text-xs
                        text-slate-500
                    ">
                        Please wait while the report is retrieved.
                    </p>

                </div>

            </div>

        );
    }


    // =========================================================
    // REPORT NOT FOUND / ERROR
    // =========================================================

    if (!report) {

        return (

            <div
                className={`
                    flex
                    min-h-[300px]
                    flex-col
                    items-center
                    justify-center
                    px-5
                    text-center
                    bg-white

                    ${
                        embedded
                            ? "rounded-xl border border-slate-200"
                            : "min-h-[60vh]"
                    }
                `}
            >

                <div className="
                    flex
                    h-14
                    w-14
                    items-center
                    justify-center
                    rounded-2xl
                    bg-red-50
                    text-red-500
                ">

                    <AlertCircle
                        size={27}
                    />

                </div>


                <h2 className="
                    mt-4
                    text-base
                    font-bold
                    text-slate-800
                ">
                    {error
                        ? "Unable to Load Report"
                        : "Report Not Found"
                    }
                </h2>


                <p className="
                    mt-1
                    max-w-md
                    text-sm
                    leading-6
                    text-slate-500
                ">

                    {error
                        ? "There was a problem retrieving this inspection report. Please try again."
                        : "The requested inspection report could not be found."
                    }

                </p>


                {inspectionNumber && (

                    <div className="
                        mt-4
                        inline-flex
                        items-center
                        gap-2
                        rounded-lg
                        border
                        border-slate-200
                        bg-slate-50
                        px-3
                        py-2
                        text-xs
                        font-semibold
                        text-slate-600
                    ">

                        <FileText
                            size={14}
                        />

                        {inspectionNumber}

                    </div>

                )}

            </div>

        );
    }


    // =========================================================
    // REPORT CONTENT
    // =========================================================

    const reportContent = (

        <div
            className={`
                print-report
                mx-auto
                w-full
                max-w-6xl
                overflow-hidden
                bg-white

                ${
                    embedded
                        ? `
                            rounded-xl
                            border
                            border-slate-200
                            shadow-sm
                          `
                        : `
                            rounded-2xl
                            border
                            border-slate-200
                            shadow-lg
                          `
                }
            `}
        >

            {/* =================================================
                REPORT BODY
            ================================================== */}

            <div className="
                p-4

                sm:p-6

                md:p-8

                lg:p-10
            ">

                {/* =================================================
                    ACTION BAR
                ================================================== */}

                <div className="
                    mb-5
                    print:hidden
                ">

                    <ReportActions
                        inspectionNumber={
                            report.inspection_number
                        }
                    />

                </div>


                {/* =================================================
                    REPORT HEADER
                ================================================== */}

                <div className="
                    overflow-hidden
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                ">

                    <ReportHeader />

                </div>


                {/* =================================================
                    REPORT INFORMATION
                ================================================== */}

                <section className="
                    mt-5
                    overflow-hidden
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                ">

                    <ReportInfo
                        report={report}
                    />

                </section>


                {/* =================================================
                    SUMMARY
                ================================================== */}

                <section className="
                    mt-5
                    overflow-hidden
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                ">

                    <ReportSummary
                        report={report}
                    />

                </section>


                {/* =================================================
                    CHECKLIST
                ================================================== */}

                <section className="
                    mt-5
                    overflow-hidden
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                ">

                    <ReportChecklist
                        report={report}
                    />

                </section>


                {/* =================================================
                    REMARKS
                ================================================== */}

                <section className="
                    mt-5
                    overflow-hidden
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                ">

                    <ReportRemarks
                        report={report}
                    />

                </section>


                {/* =================================================
                    FOOTER
                ================================================== */}

                <div className="
                    mt-5
                    overflow-hidden
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                ">

                    <ReportFooter />

                </div>

            </div>

        </div>

    );


    // =========================================================
    // EMBEDDED / FULL PAGE
    // =========================================================

    if (embedded) {

        return (

            <div className="
                w-full
            ">

                {reportContent}

            </div>

        );
    }


    return (

        <div className="
            min-h-full
            w-full
            bg-slate-50
            px-0
            py-0

            sm:px-4
            sm:py-5

            lg:px-6
            lg:py-6
        ">

            {reportContent}

        </div>

    );
}