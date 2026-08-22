import {
    CheckCircle2,
    ClipboardCheck,
    XCircle,
} from "lucide-react";

import type { InspectionReport } from "../../types/report";

interface Props {
    report: InspectionReport;
}

export default function ReportChecklist({ report }: Props) {

    const total = report.results.length;

    const passed = report.results.filter(
        (item) => item.result === "Pass"
    ).length;

    const failed = report.results.filter(
        (item) => item.result === "Fail"
    ).length;


    return (
        <div className="bg-white">

            {/* =====================================================
                SECTION HEADER
            ====================================================== */}

            <div className="
                flex
                flex-col
                gap-3
                border-b
                border-slate-200
                px-4
                py-4

                sm:flex-row
                sm:items-center
                sm:justify-between
                sm:px-5
                sm:py-4
            ">

                <div className="
                    flex
                    items-center
                    gap-3
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

                        <ClipboardCheck
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
                            Inspection Checklist
                        </h2>

                        <p className="
                            mt-0.5
                            text-xs
                            text-slate-500
                        ">
                            Detailed inspection checkpoints and results
                        </p>

                    </div>

                </div>


                {/* Quick count */}

                <div className="
                    flex
                    items-center
                    gap-2
                    pl-12

                    sm:pl-0
                ">

                    <span className="
                        rounded-full
                        bg-slate-100
                        px-2.5
                        py-1
                        text-[10px]
                        font-bold
                        text-slate-600
                    ">
                        {total} Checkpoints
                    </span>


                    <span className="
                        rounded-full
                        bg-green-50
                        px-2.5
                        py-1
                        text-[10px]
                        font-bold
                        text-green-700
                    ">
                        {passed} Pass
                    </span>


                    {failed > 0 && (

                        <span className="
                            rounded-full
                            bg-red-50
                            px-2.5
                            py-1
                            text-[10px]
                            font-bold
                            text-red-700
                        ">
                            {failed} Fail
                        </span>

                    )}

                </div>

            </div>


            {/* =====================================================
                CHECKLIST TABLE
            ====================================================== */}

            <div className="
                overflow-x-auto
            ">

                <table className="
                    w-full
                    min-w-[560px]
                    border-collapse
                ">

                    {/* =================================================
                        TABLE HEADER
                    ================================================== */}

                    <thead>

                        <tr className="
                            border-b
                            border-slate-200
                            bg-slate-50
                        ">

                            <th className="
                                w-16
                                border-r
                                border-slate-200
                                px-3
                                py-3
                                text-center
                                text-[10px]
                                font-bold
                                uppercase
                                tracking-wider
                                text-slate-500

                                sm:w-20
                                sm:px-4
                            ">
                                Sl. No.
                            </th>


                            <th className="
                                border-r
                                border-slate-200
                                px-4
                                py-3
                                text-left
                                text-[10px]
                                font-bold
                                uppercase
                                tracking-wider
                                text-slate-500

                                sm:px-5
                            ">
                                Inspection Point
                            </th>


                            <th className="
                                w-28
                                px-3
                                py-3
                                text-center
                                text-[10px]
                                font-bold
                                uppercase
                                tracking-wider
                                text-slate-500

                                sm:w-36
                                sm:px-4
                            ">
                                Result
                            </th>

                        </tr>

                    </thead>


                    {/* =================================================
                        TABLE BODY
                    ================================================== */}

                    <tbody>

                        {report.results.map(
                            (item, index) => {

                                const isPass =
                                    item.result === "Pass";


                                return (

                                    <tr
                                        key={index}
                                        className="
                                            border-b
                                            border-slate-100
                                            transition
                                            last:border-0
                                            hover:bg-slate-50/70
                                        "
                                    >

                                        {/* =================================================
                                            SERIAL NUMBER
                                        ================================================== */}

                                        <td className="
                                            border-r
                                            border-slate-100
                                            px-3
                                            py-3.5
                                            text-center
                                            text-xs
                                            font-semibold
                                            text-slate-400

                                            sm:px-4
                                            sm:py-4
                                            sm:text-sm
                                        ">
                                            {index + 1}
                                        </td>


                                        {/* =================================================
                                            INSPECTION POINT
                                        ================================================== */}

                                        <td className="
                                            border-r
                                            border-slate-100
                                            px-4
                                            py-3.5
                                            text-sm
                                            font-medium
                                            leading-6
                                            text-slate-700

                                            sm:px-5
                                            sm:py-4
                            ">
                                            {item.field_name}
                                        </td>


                                        {/* =================================================
                                            RESULT
                                        ================================================== */}

                                        <td className="
                                            px-3
                                            py-3.5
                                            text-center

                                            sm:px-4
                                            sm:py-4
                                        ">

                                            <span
                                                className={`
                                                    inline-flex
                                                    min-w-[82px]
                                                    items-center
                                                    justify-center
                                                    gap-1.5
                                                    rounded-full
                                                    border
                                                    px-3
                                                    py-1.5
                                                    text-xs
                                                    font-bold

                                                    ${
                                                        isPass
                                                            ? `
                                                                border-green-200
                                                                bg-green-50
                                                                text-green-700
                                                              `
                                                            : `
                                                                border-red-200
                                                                bg-red-50
                                                                text-red-700
                                                              `
                                                    }
                                                `}
                                            >

                                                {isPass ? (
                                                    <CheckCircle2
                                                        size={14}
                                                    />
                                                ) : (
                                                    <XCircle
                                                        size={14}
                                                    />
                                                )}

                                                {item.result}

                                            </span>

                                        </td>

                                    </tr>

                                );

                            }
                        )}

                    </tbody>

                </table>

            </div>


            {/* =====================================================
                EMPTY STATE
            ====================================================== */}

            {report.results.length === 0 && (

                <div className="
                    px-5
                    py-10
                    text-center
                ">

                    <ClipboardCheck
                        size={28}
                        className="
                            mx-auto
                            text-slate-300
                        "
                    />

                    <p className="
                        mt-3
                        text-sm
                        font-medium
                        text-slate-500
                    ">
                        No checklist results available.
                    </p>

                </div>

            )}

        </div>
    );
}