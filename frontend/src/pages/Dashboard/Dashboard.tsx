import {
    ClipboardCheck,
    AlertTriangle,
    FileBarChart,
    ArrowRight,
    Activity,
    ShieldCheck,
    Clock3,
} from "lucide-react";

import useAuth from "../../hooks/useAuth";

export default function Dashboard() {
    const { user } = useAuth();

    const name = user?.full_name || "User";

    return (
        <div
            style={{
                width: "100%",
                maxWidth: "100%",
                minWidth: 0,
                overflowX: "hidden",
                boxSizing: "border-box",
            }}
            className="space-y-6"
        >

            {/* =====================================================
                WELCOME
            ====================================================== */}

            <section
                style={{
                    width: "100%",
                    maxWidth: "100%",
                    minWidth: 0,
                    boxSizing: "border-box",
                }}
                className="
                    overflow-hidden
                    rounded-2xl
                    bg-gradient-to-r
                    from-slate-950
                    via-blue-950
                    to-blue-700
                    text-white
                    shadow-md
                "
            >
                <div className="box-border w-full px-5 py-7 sm:px-8 sm:py-9">

                    <div className="mb-3 flex items-center gap-2">

                        <ShieldCheck
                            size={18}
                            className="shrink-0 text-blue-300"
                        />

                        <span className="text-xs font-bold tracking-[0.18em] text-blue-200 sm:text-sm">
                            NIRIKSHAN
                        </span>

                    </div>

                    <h1 className="break-words text-3xl font-extrabold leading-tight sm:text-4xl">
                        Welcome {name}
                    </h1>

                </div>
            </section>


            {/* =====================================================
                QUICK ACTIONS
            ====================================================== */}

            <section
                style={{
                    width: "100%",
                    maxWidth: "100%",
                    minWidth: 0,
                }}
            >

                <div className="mb-4">

                    <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
                        Quick Actions
                    </h2>

                    <p className="mt-1 text-sm text-slate-500 sm:text-base">
                        Start your next task
                    </p>

                </div>


                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        width: "100%",
                        maxWidth: "100%",
                        minWidth: 0,
                        gap: "16px",
                    }}
                    className="md:grid md:grid-cols-3"
                >

                    {/* NEW INSPECTION */}

                    <button
                        type="button"
                        onClick={() => {
                            window.location.href = "/inspection";
                        }}
                        style={{
                            width: "100%",
                            maxWidth: "100%",
                            minWidth: 0,
                            boxSizing: "border-box",
                        }}
                        className="
                            flex
                            items-center
                            rounded-2xl
                            bg-blue-600
                            p-5
                            text-left
                            text-white
                            shadow-sm
                            transition-colors
                            hover:bg-blue-700
                            sm:p-6
                        "
                    >

                        <div className="flex w-full min-w-0 items-center gap-4">

                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/15">
                                <ClipboardCheck size={25} />
                            </div>

                            <div className="min-w-0 flex-1">

                                <div className="flex items-center justify-between gap-3">

                                    <h3 className="text-lg font-bold sm:text-xl">
                                        New Inspection
                                    </h3>

                                    <ArrowRight
                                        size={24}
                                        className="shrink-0"
                                    />

                                </div>

                                <p className="mt-1 text-sm text-blue-100">
                                    Start a machinery safety inspection.
                                </p>

                            </div>

                        </div>

                    </button>


                    {/* RE-INSPECTION */}

                    <button
                        type="button"
                        onClick={() => {
                            window.location.href = "/re-inspection";
                        }}
                        style={{
                            width: "100%",
                            maxWidth: "100%",
                            minWidth: 0,
                            boxSizing: "border-box",
                        }}
                        className="
                            flex
                            items-center
                            rounded-2xl
                            border
                            border-slate-200
                            bg-white
                            p-5
                            text-left
                            shadow-sm
                            transition-colors
                            hover:bg-slate-50
                            sm:p-6
                        "
                    >

                        <div className="flex w-full min-w-0 items-center gap-4">

                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                <AlertTriangle size={25} />
                            </div>

                            <div className="min-w-0 flex-1">

                                <div className="flex items-center justify-between gap-3">

                                    <h3 className="text-lg font-bold text-slate-900 sm:text-xl">
                                        Re-Inspection
                                    </h3>

                                    <ArrowRight
                                        size={24}
                                        className="shrink-0 text-slate-400"
                                    />

                                </div>

                                <p className="mt-1 text-sm text-slate-500">
                                    Review vehicles requiring re-inspection.
                                </p>

                            </div>

                        </div>

                    </button>


                    {/* REPORTS */}

                    <button
                        type="button"
                        onClick={() => {
                            window.location.href = "/reports";
                        }}
                        style={{
                            width: "100%",
                            maxWidth: "100%",
                            minWidth: 0,
                            boxSizing: "border-box",
                        }}
                        className="
                            flex
                            items-center
                            rounded-2xl
                            border
                            border-slate-200
                            bg-white
                            p-5
                            text-left
                            shadow-sm
                            transition-colors
                            hover:bg-slate-50
                            sm:p-6
                        "
                    >

                        <div className="flex w-full min-w-0 items-center gap-4">

                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                <FileBarChart size={25} />
                            </div>

                            <div className="min-w-0 flex-1">

                                <div className="flex items-center justify-between gap-3">

                                    <h3 className="text-lg font-bold text-slate-900 sm:text-xl">
                                        Reports
                                    </h3>

                                    <ArrowRight
                                        size={24}
                                        className="shrink-0 text-slate-400"
                                    />

                                </div>

                                <p className="mt-1 text-sm text-slate-500">
                                    Search and view completed inspections.
                                </p>

                            </div>

                        </div>

                    </button>

                </div>

            </section>


            {/* =====================================================
                INSPECTION OVERVIEW
            ====================================================== */}

            <section
                style={{
                    width: "100%",
                    maxWidth: "100%",
                    minWidth: 0,
                }}
            >

                <div className="mb-4 flex items-start justify-between">

                    <div className="min-w-0">

                        <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
                            Inspection Overview
                        </h2>

                        <p className="mt-1 text-sm text-slate-500 sm:text-base">
                            Operational metrics will appear here
                        </p>

                    </div>

                    <Activity
                        size={25}
                        className="ml-3 hidden shrink-0 text-blue-600 sm:block"
                    />

                </div>


                {/* =================================================
                    MOBILE: FORCED SINGLE COLUMN
                ================================================== */}

                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        width: "100%",
                        maxWidth: "100%",
                        minWidth: 0,
                        gap: "16px",
                    }}
                    className="md:grid md:grid-cols-2 xl:grid-cols-4"
                >

                    {/* TOTAL */}

                    <OverviewCard
                        icon={<ClipboardCheck size={23} />}
                        iconClass="bg-blue-50 text-blue-600"
                        title="Total Inspections"
                    />


                    {/* FIT */}

                    <OverviewCard
                        icon={<ShieldCheck size={23} />}
                        iconClass="bg-green-50 text-green-600"
                        title="FIT"
                    />


                    {/* UNFIT */}

                    <OverviewCard
                        icon={<AlertTriangle size={23} />}
                        iconClass="bg-red-50 text-red-600"
                        title="UNFIT"
                    />


                    {/* PENDING */}

                    <OverviewCard
                        icon={<Clock3 size={23} />}
                        iconClass="bg-blue-50 text-blue-600"
                        title="Pending"
                    />

                </div>

            </section>


            {/* =====================================================
                BOTTOM PANELS
            ====================================================== */}

            <section
                style={{
                    width: "100%",
                    maxWidth: "100%",
                    minWidth: 0,
                }}
                className="flex flex-col gap-4 lg:grid lg:grid-cols-2"
            >

                {/* TODAY'S ACTIVITY */}

                <div
                    style={{
                        width: "100%",
                        maxWidth: "100%",
                        minWidth: 0,
                        boxSizing: "border-box",
                    }}
                    className="
                        overflow-hidden
                        rounded-2xl
                        border
                        border-slate-200
                        bg-white
                        shadow-sm
                    "
                >

                    <div className="border-b border-slate-100 px-5 py-5 sm:px-6">

                        <div className="flex items-center gap-3">

                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                <Activity size={21} />
                            </div>

                            <div className="min-w-0">

                                <h3 className="font-bold text-slate-900">
                                    Today's Activity
                                </h3>

                                <p className="text-sm text-slate-500">
                                    Inspection activity summary
                                </p>

                            </div>

                        </div>

                    </div>

                    <div className="p-5 sm:p-6">

                        <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">

                            <Activity
                                size={27}
                                className="mx-auto mb-3 text-slate-300"
                            />

                            <p className="font-semibold text-slate-600">
                                Activity metrics coming soon
                            </p>

                            <p className="mt-1 text-sm text-slate-400">
                                Today's inspection statistics will appear here.
                            </p>

                        </div>

                    </div>

                </div>


                {/* SYSTEM */}

                <div
                    style={{
                        width: "100%",
                        maxWidth: "100%",
                        minWidth: 0,
                        boxSizing: "border-box",
                    }}
                    className="
                        overflow-hidden
                        rounded-2xl
                        border
                        border-slate-200
                        bg-white
                        shadow-sm
                    "
                >

                    <div className="border-b border-slate-100 px-5 py-5 sm:px-6">

                        <div className="flex items-center gap-3">

                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-600">
                                <ShieldCheck size={21} />
                            </div>

                            <div className="min-w-0">

                                <h3 className="font-bold text-slate-900">
                                    Inspection System
                                </h3>

                                <p className="text-sm text-slate-500">
                                    NIRIKSHAN operational overview
                                </p>

                            </div>

                        </div>

                    </div>

                    <div className="p-5 sm:p-6">

                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">

                            <div className="flex items-center gap-3">

                                <span className="h-3 w-3 shrink-0 rounded-full bg-green-500" />

                                <div className="min-w-0">

                                    <p className="font-bold text-slate-800">
                                        System Ready
                                    </p>

                                    <p className="mt-1 text-sm text-slate-500">
                                        Inspection system is ready for use.
                                    </p>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </section>

        </div>
    );
}


/* =============================================================
   OVERVIEW CARD
============================================================= */

interface OverviewCardProps {
    icon: React.ReactNode;
    iconClass: string;
    title: string;
}

function OverviewCard({
    icon,
    iconClass,
    title,
}: OverviewCardProps) {
    return (
        <div
            style={{
                width: "100%",
                maxWidth: "100%",
                minWidth: 0,
                boxSizing: "border-box",
                flex: "0 0 auto",
            }}
            className="
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-5
                shadow-sm
                sm:p-6
            "
        >

            <div className="flex items-center justify-between">

                <div
                    className={`
                        flex
                        h-11
                        w-11
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        ${iconClass}
                    `}
                >
                    {icon}
                </div>

                <span className="text-[10px] font-bold uppercase tracking-wide text-slate-400 sm:text-xs">
                    Coming Soon
                </span>

            </div>

            <p className="mt-5 text-sm font-semibold text-slate-500">
                {title}
            </p>

            <p className="mt-2 text-3xl font-extrabold text-slate-900">
                —
            </p>

        </div>
    );
}