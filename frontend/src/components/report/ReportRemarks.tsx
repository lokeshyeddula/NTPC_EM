import {
    AlertTriangle,
    CheckCircle2,
    MessageSquareText,
} from "lucide-react";

import type { InspectionReport } from "../../types/report";

interface Props {
    report: InspectionReport;
}

export default function ReportRemarks({ report }: Props) {

    const failedItems = report.results.filter(
        (item) => item.result === "Fail"
    );

    const hasDefects = failedItems.length > 0;


    return (
        <div className="space-y-5">

            {/* =====================================================
                FLAGGED DEFECTS
            ====================================================== */}

            <div className="
                overflow-hidden
                rounded-xl
                border
                border-slate-200
                bg-white
            ">

                {/* Header */}

                <div className={`
                    flex
                    items-center
                    justify-between
                    gap-3
                    border-b
                    px-4
                    py-4

                    sm:px-5

                    ${
                        hasDefects
                            ? "border-red-100 bg-red-50/50"
                            : "border-green-100 bg-green-50/50"
                    }
                `}>

                    <div className="
                        flex
                        items-center
                        gap-3
                    ">

                        <div className={`
                            flex
                            h-9
                            w-9
                            shrink-0
                            items-center
                            justify-center
                            rounded-lg

                            ${
                                hasDefects
                                    ? "bg-red-100 text-red-600"
                                    : "bg-green-100 text-green-600"
                            }
                        `}>

                            {hasDefects ? (
                                <AlertTriangle
                                    size={19}
                                />
                            ) : (
                                <CheckCircle2
                                    size={19}
                                />
                            )}

                        </div>


                        <div>

                            <h2 className="
                                text-base
                                font-bold
                                text-slate-900

                                sm:text-lg
                            ">
                                Flagged Defects
                            </h2>

                            <p className="
                                mt-0.5
                                text-xs
                                text-slate-500
                            ">
                                Inspection points requiring attention
                            </p>

                        </div>

                    </div>


                    {/* Defect count */}

                    <span className={`
                        shrink-0
                        rounded-full
                        px-3
                        py-1.5
                        text-xs
                        font-bold

                        ${
                            hasDefects
                                ? "bg-red-100 text-red-700"
                                : "bg-green-100 text-green-700"
                        }
                    `}>

                        {failedItems.length}{" "}
                        {failedItems.length === 1
                            ? "Defect"
                            : "Defects"
                        }

                    </span>

                </div>


                {/* Defect content */}

                <div className="p-4 sm:p-5">

                    {failedItems.length === 0 ? (

                        <div className="
                            flex
                            items-center
                            gap-3
                            rounded-xl
                            border
                            border-green-200
                            bg-green-50
                            px-4
                            py-3.5
                        ">

                            <CheckCircle2
                                size={19}
                                className="
                                    shrink-0
                                    text-green-600
                                "
                            />

                            <div>

                                <p className="
                                    text-sm
                                    font-bold
                                    text-green-800
                                ">
                                    No defects found
                                </p>

                                <p className="
                                    mt-0.5
                                    text-xs
                                    text-green-700
                                ">
                                    All inspection checkpoints were satisfactory.
                                </p>

                            </div>

                        </div>

                    ) : (

                        <div className="
                            space-y-2
                        ">

                            {failedItems.map(
                                (item, index) => (

                                    <div
                                        key={index}
                                        className="
                                            flex
                                            items-start
                                            gap-3
                                            rounded-lg
                                            border
                                            border-red-100
                                            bg-red-50/50
                                            px-3
                                            py-3

                                            sm:px-4
                                        "
                                    >

                                        <span className="
                                            mt-0.5
                                            flex
                                            h-5
                                            w-5
                                            shrink-0
                                            items-center
                                            justify-center
                                            rounded-full
                                            bg-red-100
                                            text-[10px]
                                            font-bold
                                            text-red-700
                                        ">
                                            {index + 1}
                                        </span>


                                        <p className="
                                            text-sm
                                            font-medium
                                            leading-5
                                            text-red-800
                                        ">
                                            {item.field_name}
                                        </p>

                                    </div>

                                )
                            )}

                        </div>

                    )}

                </div>

            </div>


            {/* =====================================================
                ENGINEER REMARKS
            ====================================================== */}

            <div className="
                overflow-hidden
                rounded-xl
                border
                border-slate-200
                bg-white
            ">

                {/* Header */}

                <div className="
                    flex
                    items-center
                    gap-3
                    border-b
                    border-slate-200
                    px-4
                    py-4

                    sm:px-5
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

                        <MessageSquareText
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
                            Engineer Remarks
                        </h2>

                        <p className="
                            mt-0.5
                            text-xs
                            text-slate-500
                        ">
                            Additional observations recorded during inspection
                        </p>

                    </div>

                </div>


                {/* Remarks */}

                <div className="p-4 sm:p-5">

                    {report.remarks ? (

                        <div className="
                            rounded-xl
                            border
                            border-slate-200
                            bg-slate-50
                            px-4
                            py-4

                            sm:px-5
                            sm:py-5
                        ">

                            <p className="
                                whitespace-pre-wrap
                                text-sm
                                leading-6
                                text-slate-700

                                sm:text-base
                            ">
                                {report.remarks}
                            </p>

                        </div>

                    ) : (

                        <div className="
                            rounded-xl
                            border
                            border-dashed
                            border-slate-300
                            bg-slate-50
                            px-4
                            py-5
                            text-center
                        ">

                            <MessageSquareText
                                size={22}
                                className="
                                    mx-auto
                                    text-slate-300
                                "
                            />

                            <p className="
                                mt-2
                                text-sm
                                italic
                                text-slate-400
                            ">
                                No remarks provided.
                            </p>

                        </div>

                    )}

                </div>

            </div>

        </div>
    );
}