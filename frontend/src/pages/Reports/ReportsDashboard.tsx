import { useState } from "react";
import {
    BarChart3,
    CalendarDays,
    ClipboardList,
    FileBarChart,
    FileText,
    Layers3,
} from "lucide-react";

import IndividualReportPanel from "../../components/reports/IndividualReportPanel";
import ShiftReportPanel from "../../components/reports/ShiftReportPanel";
import DailyReportPanel from "../../components/reports/DailyReportPanel";
import MonthlySummaryPanel from "../../components/reports/MonthlySummaryPanel";

type ReportId =
    | "individual"
    | "shift"
    | "daily"
    | "monthly";

interface ReportOption {
    id: ReportId;
    title: string;
    description: string;
    icon: typeof ClipboardList;
}

const reports: ReportOption[] = [
    {
        id: "individual",
        title: "Individual Inspection",
        description: "View a specific machinery inspection",
        icon: ClipboardList,
    },
    {
        id: "shift",
        title: "Shift Wise",
        description: "Review inspections by shift",
        icon: Layers3,
    },
    {
        id: "daily",
        title: "Daily Report",
        description: "View inspection activity for a day",
        icon: CalendarDays,
    },
    {
        id: "monthly",
        title: "Monthly Summary",
        description: "Analyse monthly inspection records",
        icon: BarChart3,
    },
];

export default function ReportsDashboard() {

    const [selectedReport, setSelectedReport] =
        useState<ReportId>("individual");


    const activeReport =
        reports.find(
            (report) =>
                report.id === selectedReport
        ) || reports[0];


    return (

        <div className="
            w-full
            space-y-4
            sm:space-y-6
        ">


            {/* =====================================================
                PAGE HEADER
            ====================================================== */}

            <section className="
                overflow-hidden
                rounded-2xl
                border
                border-slate-200
                bg-white
                shadow-sm
            ">

                {/* Header Banner */}

                <div className="
                    bg-gradient-to-r
                    from-slate-950
                    via-blue-950
                    to-blue-800
                    px-4
                    py-5

                    sm:px-6
                    sm:py-6
                ">

                    <div className="
                        flex
                        items-center
                        gap-3
                    ">

                        <div className="
                            flex
                            h-11
                            w-11
                            shrink-0
                            items-center
                            justify-center
                            rounded-xl
                            bg-white/10
                            text-blue-200
                            ring-1
                            ring-white/20
                        ">

                            <FileBarChart
                                size={23}
                            />

                        </div>


                        <div>

                            <div className="
                                text-[11px]
                                font-bold
                                uppercase
                                tracking-[0.18em]
                                text-blue-200
                            ">
                                NIRIKSHAN
                            </div>


                            <h1 className="
                                mt-0.5
                                text-xl
                                font-bold
                                text-white

                                sm:text-2xl
                            ">
                                Reports Centre
                            </h1>


                            <p className="
                                mt-1
                                text-xs
                                text-blue-100/80

                                sm:text-sm
                            ">
                                Inspection reports and operational summaries
                            </p>

                        </div>

                    </div>

                </div>


                {/* =================================================
                    REPORT NAVIGATION
                ================================================== */}

                <div className="
                    border-t
                    border-slate-100
                    p-3

                    sm:p-5
                ">

                    <div className="
                        grid
                        grid-cols-2
                        gap-2

                        sm:grid-cols-2
                        sm:gap-3

                        lg:grid-cols-4
                    ">

                        {reports.map(
                            (report) => {

                                const isActive =
                                    selectedReport ===
                                    report.id;

                                const Icon =
                                    report.icon;


                                return (

                                    <button
                                        key={report.id}
                                        type="button"
                                        onClick={() =>
                                            setSelectedReport(
                                                report.id
                                            )
                                        }
                                        className={`
                                            group
                                            relative
                                            flex
                                            min-h-[104px]
                                            flex-col
                                            items-start
                                            justify-between

                                            rounded-xl
                                            border
                                            p-3
                                            text-left

                                            transition-all
                                            duration-200

                                            sm:min-h-[118px]
                                            sm:p-4

                                            focus:outline-none
                                            focus:ring-2
                                            focus:ring-blue-500
                                            focus:ring-offset-2

                                            ${
                                                isActive
                                                    ? `
                                                        border-blue-600
                                                        bg-blue-600
                                                        text-white
                                                        shadow-md
                                                      `
                                                    : `
                                                        border-slate-200
                                                        bg-white
                                                        text-slate-700
                                                        hover:border-blue-300
                                                        hover:bg-blue-50/50
                                                      `
                                            }
                                        `}
                                    >

                                        {/* Icon */}

                                        <div className={`
                                            flex
                                            h-9
                                            w-9
                                            items-center
                                            justify-center
                                            rounded-lg

                                            sm:h-10
                                            sm:w-10

                                            ${
                                                isActive
                                                    ? "bg-white/15 text-white"
                                                    : "bg-blue-50 text-blue-600"
                                            }
                                        `}>

                                            <Icon
                                                size={19}
                                            />

                                        </div>


                                        {/* Text */}

                                        <div className="
                                            mt-3
                                            min-w-0
                                        ">

                                            <p className={`
                                                text-xs
                                                font-bold

                                                sm:text-sm

                                                ${
                                                    isActive
                                                        ? "text-white"
                                                        : "text-slate-800"
                                                }
                                            `}>
                                                {report.title}
                                            </p>


                                            <p className={`
                                                mt-0.5
                                                line-clamp-2
                                                text-[10px]
                                                leading-4

                                                sm:text-xs

                                                ${
                                                    isActive
                                                        ? "text-blue-100"
                                                        : "text-slate-500"
                                                }
                                            `}>
                                                {report.description}
                                            </p>

                                        </div>


                                        {/* Active indicator */}

                                        {isActive && (

                                            <div className="
                                                absolute
                                                right-2
                                                top-2
                                                h-2
                                                w-2
                                                rounded-full
                                                bg-white
                                            " />

                                        )}

                                    </button>

                                );

                            }
                        )}

                    </div>

                </div>

            </section>


            {/* =====================================================
                ACTIVE REPORT INFORMATION
            ====================================================== */}

            <div className="
                flex
                items-center
                gap-3

                rounded-xl
                border
                border-blue-100
                bg-blue-50/60
                px-4
                py-3

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
                    bg-blue-100
                    text-blue-700
                ">

                    <FileText
                        size={17}
                    />

                </div>


                <div className="min-w-0">

                    <p className="
                        text-[10px]
                        font-bold
                        uppercase
                        tracking-wider
                        text-blue-500
                    ">
                        Selected Report
                    </p>

                    <p className="
                        truncate
                        text-sm
                        font-bold
                        text-blue-900
                    ">
                        {activeReport.title}
                    </p>

                </div>

            </div>


            {/* =====================================================
                REPORT PANEL
            ====================================================== */}

            <section className="
                overflow-hidden
                rounded-2xl
                border
                border-slate-200
                bg-white
                shadow-sm
            ">

                <div className="
                    border-b
                    border-slate-100
                    px-4
                    py-3

                    sm:px-6
                    sm:py-4
                ">

                    <div className="
                        flex
                        items-center
                        gap-2
                    ">

                        <BarChart3
                            size={18}
                            className="text-blue-600"
                        />

                        <h2 className="
                            text-sm
                            font-bold
                            text-slate-800

                            sm:text-base
                        ">
                            {activeReport.title}
                        </h2>

                    </div>

                </div>


                <div className="
                    min-h-[400px]
                    p-3

                    sm:p-6
                ">

                    {selectedReport ===
                        "individual" && (
                        <IndividualReportPanel />
                    )}


                    {selectedReport ===
                        "shift" && (
                        <ShiftReportPanel />
                    )}


                    {selectedReport ===
                        "daily" && (
                        <DailyReportPanel />
                    )}


                    {selectedReport ===
                        "monthly" && (
                        <MonthlySummaryPanel />
                    )}

                </div>

            </section>

        </div>
    );
}