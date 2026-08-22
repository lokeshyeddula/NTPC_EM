import {
    CheckCircle2,
    ClipboardList,
    XCircle,
    AlertTriangle,
} from "lucide-react";

import type { InspectionReport } from "../../types/report";

interface Props {
    report: InspectionReport;
}

export default function ReportSummary({ report }: Props) {

    const total = report.results.length;

    const passed = report.results.filter(
        (item) => item.result === "Pass"
    ).length;

    const failed = report.results.filter(
        (item) => item.result === "Fail"
    ).length;

    const isFit =
        report.operational_status === "Fit";


    return (
        <div className="bg-white">

            {/* =====================================================
                SECTION HEADER
            ====================================================== */}

            <div className="
                flex
                items-center
                gap-3
                border-b
                border-slate-200
                px-4
                py-4

                sm:px-5
                sm:py-4
            ">

                <div className="
                    flex
                    h-9
                    w-9
                    shrink-0
                    items-center
                    justify-center
                    rounded-lg
                    bg-blue-50
                    text-blue-700
                ">

                    <ClipboardList
                        size={19}
                    />

                </div>


                <div>

                    <h2 className="
                        text-base
                        font-bold
                        text-slate-900

                        sm:text-lg
                    ">
                        Inspection Summary
                    </h2>

                    <p className="
                        mt-0.5
                        text-xs
                        text-slate-500
                    ">
                        Overall checklist performance and operational status
                    </p>

                </div>

            </div>


            {/* =====================================================
                SUMMARY CONTENT
            ====================================================== */}

            <div className="p-4 sm:p-5">

                <div className="
                    grid
                    grid-cols-2
                    gap-3

                    lg:grid-cols-4
                ">


                    {/* =================================================
                        TOTAL
                    ================================================== */}

                    <div className="
                        rounded-xl
                        border
                        border-slate-200
                        bg-slate-50
                        p-4
                        text-center

                        sm:p-5
                    ">

                        <div className="
                            mx-auto
                            flex
                            h-9
                            w-9
                            items-center
                            justify-center
                            rounded-lg
                            bg-white
                            text-slate-600
                            shadow-sm
                        ">

                            <ClipboardList
                                size={18}
                            />

                        </div>


                        <p className="
                            mt-3
                            text-[10px]
                            font-bold
                            uppercase
                            tracking-wider
                            text-slate-400

                            sm:text-xs
                        ">
                            Total Checkpoints
                        </p>


                        <p className="
                            mt-1
                            text-2xl
                            font-extrabold
                            text-slate-800

                            sm:text-3xl
                        ">
                            {total}
                        </p>

                    </div>


                    {/* =================================================
                        PASSED
                    ================================================== */}

                    <div className="
                        rounded-xl
                        border
                        border-green-200
                        bg-green-50/60
                        p-4
                        text-center

                        sm:p-5
                    ">

                        <div className="
                            mx-auto
                            flex
                            h-9
                            w-9
                            items-center
                            justify-center
                            rounded-lg
                            bg-green-100
                            text-green-700
                        ">

                            <CheckCircle2
                                size={18}
                            />

                        </div>


                        <p className="
                            mt-3
                            text-[10px]
                            font-bold
                            uppercase
                            tracking-wider
                            text-green-600

                            sm:text-xs
                        ">
                            Passed
                        </p>


                        <p className="
                            mt-1
                            text-2xl
                            font-extrabold
                            text-green-700

                            sm:text-3xl
                        ">
                            {passed}
                        </p>

                    </div>


                    {/* =================================================
                        FAILED
                    ================================================== */}

                    <div className="
                        rounded-xl
                        border
                        border-red-200
                        bg-red-50/60
                        p-4
                        text-center

                        sm:p-5
                    ">

                        <div className="
                            mx-auto
                            flex
                            h-9
                            w-9
                            items-center
                            justify-center
                            rounded-lg
                            bg-red-100
                            text-red-700
                        ">

                            {failed > 0 ? (
                                <XCircle
                                    size={18}
                                />
                            ) : (
                                <CheckCircle2
                                    size={18}
                                />
                            )}

                        </div>


                        <p className="
                            mt-3
                            text-[10px]
                            font-bold
                            uppercase
                            tracking-wider
                            text-red-600

                            sm:text-xs
                        ">
                            Failed
                        </p>


                        <p className="
                            mt-1
                            text-2xl
                            font-extrabold
                            text-red-700

                            sm:text-3xl
                        ">
                            {failed}
                        </p>

                    </div>


                    {/* =================================================
                        OPERATIONAL STATUS
                    ================================================== */}

                    <div
                        className={`
                            relative
                            overflow-hidden
                            rounded-xl
                            border
                            p-4
                            text-center

                            sm:p-5

                            ${
                                isFit
                                    ? `
                                        border-green-300
                                        bg-green-600
                                        text-white
                                      `
                                    : `
                                        border-red-300
                                        bg-red-600
                                        text-white
                                      `
                            }
                        `}
                    >

                        {/* Decorative background */}

                        <div className="
                            pointer-events-none
                            absolute
                            -right-5
                            -top-5
                            h-20
                            w-20
                            rounded-full
                            bg-white/10
                        " />


                        <div className="
                            relative
                            mx-auto
                            flex
                            h-9
                            w-9
                            items-center
                            justify-center
                            rounded-lg
                            bg-white/15
                        ">

                            {isFit ? (
                                <CheckCircle2
                                    size={20}
                                />
                            ) : (
                                <AlertTriangle
                                    size={20}
                                />
                            )}

                        </div>


                        <p className="
                            relative
                            mt-3
                            text-[10px]
                            font-bold
                            uppercase
                            tracking-wider
                            text-white/80

                            sm:text-xs
                        ">
                            Operational Status
                        </p>


                        <p className="
                            relative
                            mt-1
                            text-xl
                            font-extrabold
                            uppercase
                            tracking-wide

                            sm:text-2xl
                        ">
                            {report.operational_status}
                        </p>

                    </div>

                </div>


                {/* =====================================================
                    RESULT MESSAGE
                ====================================================== */}

                <div
                    className={`
                        mt-4
                        flex
                        items-start
                        gap-3
                        rounded-xl
                        border
                        px-4
                        py-3

                        ${
                            isFit
                                ? `
                                    border-green-200
                                    bg-green-50
                                    text-green-800
                                  `
                                : `
                                    border-red-200
                                    bg-red-50
                                    text-red-800
                                  `
                        }
                    `}
                >

                    <div className="
                        mt-0.5
                        shrink-0
                    ">

                        {isFit ? (
                            <CheckCircle2
                                size={18}
                                className="text-green-600"
                            />
                        ) : (
                            <AlertTriangle
                                size={18}
                                className="text-red-600"
                            />
                        )}

                    </div>


                    <div>

                        <p className="
                            text-sm
                            font-bold
                        ">

                            {isFit
                                ? "Inspection Result: FIT"
                                : "Inspection Result: UNFIT"
                            }

                        </p>


                        <p className="
                            mt-0.5
                            text-xs
                            leading-5
                            opacity-80
                        ">

                            {isFit
                                ? "All mandatory inspection requirements have been satisfactorily met."
                                : "One or more inspection checkpoints have failed and require corrective action."
                            }

                        </p>

                    </div>

                </div>

            </div>

        </div>
    );
}