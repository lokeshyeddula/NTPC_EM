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
        <div className="w-full min-w-0 overflow-x-hidden space-y-6">

            {/* =========================================================
                WELCOME HEADER
            ========================================================= */}

            <section className="w-full rounded-2xl bg-gradient-to-r from-slate-950 via-blue-950 to-blue-700 text-white shadow-md overflow-hidden">
                <div className="px-5 py-7 sm:px-8 sm:py-9 lg:px-10 lg:py-10">

                    <div className="flex items-center gap-2 mb-3">
                        <ShieldCheck
                            size={18}
                            className="text-blue-300 shrink-0"
                        />

                        <span className="text-xs sm:text-sm font-bold tracking-[0.18em] text-blue-200">
                            NIRIKSHAN
                        </span>
                    </div>

                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight">
                        Welcome {name}
                    </h1>

                </div>
            </section>


            {/* =========================================================
                QUICK ACTIONS
            ========================================================= */}

            <section className="w-full">

                <div className="mb-4">
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                        Quick Actions
                    </h2>

                    <p className="text-sm sm:text-base text-slate-500 mt-1">
                        Start your next task
                    </p>
                </div>


                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                    {/* NEW INSPECTION */}

                    <button
                        type="button"
                        onClick={() => {
                            window.location.href = "/inspection";
                        }}
                        className="
                            group
                            w-full
                            min-w-0
                            bg-blue-600
                            hover:bg-blue-700
                            text-white
                            rounded-2xl
                            p-5
                            sm:p-6
                            shadow-sm
                            transition-all
                            duration-200
                            text-left
                        "
                    >
                        <div className="flex items-center gap-4">

                            <div className="
                                w-12
                                h-12
                                sm:w-14
                                sm:h-14
                                rounded-xl
                                bg-white/15
                                flex
                                items-center
                                justify-center
                                shrink-0
                            ">
                                <ClipboardCheck
                                    size={25}
                                    strokeWidth={2}
                                />
                            </div>

                            <div className="flex-1 min-w-0">

                                <div className="flex items-center justify-between gap-3">

                                    <h3 className="font-bold text-lg sm:text-xl">
                                        New Inspection
                                    </h3>

                                    <ArrowRight
                                        size={24}
                                        className="
                                            shrink-0
                                            transition-transform
                                            group-hover:translate-x-1
                                        "
                                    />

                                </div>

                                <p className="text-sm sm:text-base text-blue-100 mt-1">
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
                        className="
                            group
                            w-full
                            min-w-0
                            bg-white
                            hover:bg-slate-50
                            text-slate-900
                            rounded-2xl
                            p-5
                            sm:p-6
                            border
                            border-slate-200
                            shadow-sm
                            transition-all
                            duration-200
                            text-left
                        "
                    >
                        <div className="flex items-center gap-4">

                            <div className="
                                w-12
                                h-12
                                sm:w-14
                                sm:h-14
                                rounded-xl
                                bg-blue-50
                                text-blue-600
                                flex
                                items-center
                                justify-center
                                shrink-0
                            ">
                                <AlertTriangle
                                    size={25}
                                    strokeWidth={2}
                                />
                            </div>

                            <div className="flex-1 min-w-0">

                                <div className="flex items-center justify-between gap-3">

                                    <h3 className="font-bold text-lg sm:text-xl">
                                        Re-Inspection
                                    </h3>

                                    <ArrowRight
                                        size={24}
                                        className="
                                            shrink-0
                                            text-slate-400
                                            transition-transform
                                            group-hover:translate-x-1
                                        "
                                    />

                                </div>

                                <p className="text-sm sm:text-base text-slate-500 mt-1">
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
                        className="
                            group
                            w-full
                            min-w-0
                            bg-white
                            hover:bg-slate-50
                            text-slate-900
                            rounded-2xl
                            p-5
                            sm:p-6
                            border
                            border-slate-200
                            shadow-sm
                            transition-all
                            duration-200
                            text-left
                        "
                    >
                        <div className="flex items-center gap-4">

                            <div className="
                                w-12
                                h-12
                                sm:w-14
                                sm:h-14
                                rounded-xl
                                bg-blue-50
                                text-blue-600
                                flex
                                items-center
                                justify-center
                                shrink-0
                            ">
                                <FileBarChart
                                    size={25}
                                    strokeWidth={2}
                                />
                            </div>

                            <div className="flex-1 min-w-0">

                                <div className="flex items-center justify-between gap-3">

                                    <h3 className="font-bold text-lg sm:text-xl">
                                        Reports
                                    </h3>

                                    <ArrowRight
                                        size={24}
                                        className="
                                            shrink-0
                                            text-slate-400
                                            transition-transform
                                            group-hover:translate-x-1
                                        "
                                    />

                                </div>

                                <p className="text-sm sm:text-base text-slate-500 mt-1">
                                    Search and view completed inspections.
                                </p>

                            </div>

                        </div>
                    </button>

                </div>

            </section>


            {/* =========================================================
                INSPECTION OVERVIEW
            ========================================================= */}

            <section className="w-full">

                <div className="flex items-start justify-between mb-4">

                    <div>
                        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                            Inspection Overview
                        </h2>

                        <p className="text-sm sm:text-base text-slate-500 mt-1">
                            Operational metrics will appear here
                        </p>
                    </div>

                    <Activity
                        size={25}
                        className="text-blue-600 hidden sm:block shrink-0"
                    />

                </div>


                {/* IMPORTANT:
                    1 column mobile
                    2 columns tablet
                    4 columns desktop
                */}

                <div className="
                    grid
                    grid-cols-1
                    sm:grid-cols-2
                    xl:grid-cols-4
                    gap-4
                ">


                    {/* TOTAL INSPECTIONS */}

                    <div className="
                        w-full
                        min-w-0
                        bg-white
                        rounded-2xl
                        border
                        border-slate-200
                        shadow-sm
                        p-5
                        sm:p-6
                    ">

                        <div className="flex items-center justify-between">

                            <div className="
                                w-11
                                h-11
                                rounded-xl
                                bg-blue-50
                                text-blue-600
                                flex
                                items-center
                                justify-center
                            ">
                                <ClipboardCheck
                                    size={23}
                                />
                            </div>

                            <span className="
                                text-[10px]
                                sm:text-xs
                                font-bold
                                uppercase
                                tracking-wide
                                text-slate-400
                            ">
                                Coming Soon
                            </span>

                        </div>

                        <p className="mt-5 text-sm font-semibold text-slate-500">
                            Total Inspections
                        </p>

                        <p className="mt-2 text-3xl font-extrabold text-slate-900">
                            —
                        </p>

                    </div>


                    {/* FIT */}

                    <div className="
                        w-full
                        min-w-0
                        bg-white
                        rounded-2xl
                        border
                        border-slate-200
                        shadow-sm
                        p-5
                        sm:p-6
                    ">

                        <div className="flex items-center justify-between">

                            <div className="
                                w-11
                                h-11
                                rounded-xl
                                bg-green-50
                                text-green-600
                                flex
                                items-center
                                justify-center
                            ">
                                <ShieldCheck
                                    size={23}
                                />
                            </div>

                            <span className="
                                text-[10px]
                                sm:text-xs
                                font-bold
                                uppercase
                                tracking-wide
                                text-slate-400
                            ">
                                Coming Soon
                            </span>

                        </div>

                        <p className="mt-5 text-sm font-semibold text-slate-500">
                            FIT
                        </p>

                        <p className="mt-2 text-3xl font-extrabold text-slate-900">
                            —
                        </p>

                    </div>


                    {/* UNFIT */}

                    <div className="
                        w-full
                        min-w-0
                        bg-white
                        rounded-2xl
                        border
                        border-slate-200
                        shadow-sm
                        p-5
                        sm:p-6
                    ">

                        <div className="flex items-center justify-between">

                            <div className="
                                w-11
                                h-11
                                rounded-xl
                                bg-red-50
                                text-red-600
                                flex
                                items-center
                                justify-center
                            ">
                                <AlertTriangle
                                    size={23}
                                />
                            </div>

                            <span className="
                                text-[10px]
                                sm:text-xs
                                font-bold
                                uppercase
                                tracking-wide
                                text-slate-400
                            ">
                                Coming Soon
                            </span>

                        </div>

                        <p className="mt-5 text-sm font-semibold text-slate-500">
                            UNFIT
                        </p>

                        <p className="mt-2 text-3xl font-extrabold text-slate-900">
                            —
                        </p>

                    </div>


                    {/* PENDING */}

                    <div className="
                        w-full
                        min-w-0
                        bg-white
                        rounded-2xl
                        border
                        border-slate-200
                        shadow-sm
                        p-5
                        sm:p-6
                    ">

                        <div className="flex items-center justify-between">

                            <div className="
                                w-11
                                h-11
                                rounded-xl
                                bg-blue-50
                                text-blue-600
                                flex
                                items-center
                                justify-center
                            ">
                                <Clock3
                                    size={23}
                                />
                            </div>

                            <span className="
                                text-[10px]
                                sm:text-xs
                                font-bold
                                uppercase
                                tracking-wide
                                text-slate-400
                            ">
                                Coming Soon
                            </span>

                        </div>

                        <p className="mt-5 text-sm font-semibold text-slate-500">
                            Pending
                        </p>

                        <p className="mt-2 text-3xl font-extrabold text-slate-900">
                            —
                        </p>

                    </div>

                </div>

            </section>


            {/* =========================================================
                BOTTOM INFORMATION
            ========================================================= */}

            <section className="
                grid
                grid-cols-1
                lg:grid-cols-2
                gap-4
                pb-6
            ">

                {/* TODAY'S ACTIVITY */}

                <div className="
                    w-full
                    min-w-0
                    bg-white
                    rounded-2xl
                    border
                    border-slate-200
                    shadow-sm
                    overflow-hidden
                ">

                    <div className="
                        px-5
                        sm:px-6
                        py-5
                        border-b
                        border-slate-100
                    ">

                        <div className="flex items-center gap-3">

                            <div className="
                                w-10
                                h-10
                                rounded-xl
                                bg-blue-50
                                text-blue-600
                                flex
                                items-center
                                justify-center
                            ">
                                <Activity
                                    size={21}
                                />
                            </div>

                            <div>

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

                        <div className="
                            rounded-xl
                            border
                            border-dashed
                            border-slate-200
                            bg-slate-50
                            p-8
                            text-center
                        ">

                            <Activity
                                size={27}
                                className="
                                    mx-auto
                                    mb-3
                                    text-slate-300
                                "
                            />

                            <p className="
                                font-semibold
                                text-slate-600
                            ">
                                Activity metrics coming soon
                            </p>

                            <p className="
                                text-sm
                                text-slate-400
                                mt-1
                            ">
                                Today's inspection statistics will appear here.
                            </p>

                        </div>

                    </div>

                </div>


                {/* MOBILE FRIENDLY EMPTY SPACE / FUTURE PANEL */}

                <div className="
                    w-full
                    min-w-0
                    bg-white
                    rounded-2xl
                    border
                    border-slate-200
                    shadow-sm
                    overflow-hidden
                ">

                    <div className="
                        px-5
                        sm:px-6
                        py-5
                        border-b
                        border-slate-100
                    ">

                        <div className="flex items-center gap-3">

                            <div className="
                                w-10
                                h-10
                                rounded-xl
                                bg-green-50
                                text-green-600
                                flex
                                items-center
                                justify-center
                            ">
                                <ShieldCheck
                                    size={21}
                                />
                            </div>

                            <div>

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

                        <div className="
                            rounded-xl
                            border
                            border-slate-200
                            bg-slate-50
                            p-5
                        ">

                            <div className="flex items-center gap-3">

                                <div className="
                                    w-3
                                    h-3
                                    rounded-full
                                    bg-green-500
                                    shrink-0
                                />

                                <div>

                                    <p className="
                                        font-bold
                                        text-slate-800
                                    ">
                                        System Ready
                                    </p>

                                    <p className="
                                        text-sm
                                        text-slate-500
                                        mt-1
                                    ">
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