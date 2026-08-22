import {
    ClipboardCheck,
    Clock3,
    FileBarChart,
    ShieldCheck,
    ArrowRight,
    Activity,
    CalendarDays,
    AlertTriangle,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

export default function Dashboard() {

    const navigate = useNavigate();
    const { user } = useAuth();

    const initials =
        user?.full_name
            ?.split(" ")
            .map((name) => name[0])
            .join("")
            .toUpperCase() || "U";

    return (
        <div className="space-y-5 sm:space-y-6">

            {/* =====================================================
                HERO / WELCOME
            ====================================================== */}

            <section className="
                relative
                overflow-hidden
                rounded-2xl
                bg-gradient-to-r
                from-[#07102f]
                via-[#10296b]
                to-[#2147c7]
                px-5
                py-6
                text-white
                shadow-sm

                sm:px-7
                sm:py-7
            ">

                {/* Decorative glow */}

                <div className="
                    pointer-events-none
                    absolute
                    -right-16
                    -top-20
                    h-56
                    w-56
                    rounded-full
                    bg-blue-400/10
                    blur-3xl
                />

                <div className="
                    pointer-events-none
                    absolute
                    -bottom-20
                    right-24
                    h-40
                    w-40
                    rounded-full
                    bg-indigo-300/10
                    blur-3xl
                />


                <div className="
                    relative
                    flex
                    flex-col
                    gap-6

                    md:flex-row
                    md:items-center
                    md:justify-between
                ">

                    {/* Welcome */}

                    <div>

                        <div className="
                            mb-2
                            flex
                            items-center
                            gap-2
                        ">

                            <ShieldCheck
                                size={18}
                                className="text-blue-300"
                            />

                            <span className="
                                text-xs
                                font-bold
                                uppercase
                                tracking-[0.18em]
                                text-blue-200
                            ">
                                NIRIKSHAN
                            </span>

                        </div>


                        <h1 className="
                            text-2xl
                            font-extrabold
                            tracking-tight

                            sm:text-3xl
                        ">
                            Good to see you,{" "}
                            {user?.full_name || "Engineer"}
                        </h1>


                        <p className="
                            mt-2
                            max-w-2xl
                            text-sm
                            leading-6
                            text-blue-100

                            sm:text-base
                        ">
                            Machinery safety inspection management
                            at your fingertips.
                        </p>

                    </div>


                    {/* User */}

                    <div className="
                        flex
                        items-center
                        gap-3
                        rounded-xl
                        border
                        border-white/15
                        bg-white/10
                        px-4
                        py-3
                        backdrop-blur-sm
                    ">

                        <div className="
                            flex
                            h-11
                            w-11
                            shrink-0
                            items-center
                            justify-center
                            rounded-full
                            bg-blue-600
                            text-sm
                            font-bold
                            text-white
                            ring-4
                            ring-white/10
                        ">
                            {initials}
                        </div>


                        <div>

                            <p className="
                                text-sm
                                font-bold
                                text-white
                            ">
                                {user?.full_name || "User"}
                            </p>

                            <p className="
                                text-xs
                                text-blue-200
                            ">
                                {user?.designation || "Engineer"}
                            </p>

                        </div>

                    </div>

                </div>

            </section>


            {/* =====================================================
                QUICK ACTIONS
            ====================================================== */}

            <section>

                <div className="
                    mb-3
                    flex
                    items-center
                    justify-between
                ">

                    <div>

                        <h2 className="
                            text-base
                            font-bold
                            text-slate-900

                            sm:text-lg
                        ">
                            Quick Actions
                        </h2>

                        <p className="
                            text-xs
                            text-slate-500
                            sm:text-sm
                        ">
                            Start your next task
                        </p>

                    </div>

                </div>


                <div className="
                    grid
                    grid-cols-1
                    gap-3

                    sm:grid-cols-2
                    lg:grid-cols-3
                ">

                    {/* New Inspection */}

                    <QuickAction
                        icon={
                            <ClipboardCheck
                                size={21}
                            />
                        }
                        title="New Inspection"
                        description="Start a machinery safety inspection."
                        onClick={() =>
                            navigate("/inspection")
                        }
                        primary
                    />


                    {/* Re-inspection */}

                    <QuickAction
                        icon={
                            <AlertTriangle
                                size={21}
                            />
                        }
                        title="Re-Inspection"
                        description="Review vehicles requiring re-inspection."
                        onClick={() =>
                            navigate("/Re-Inspection")
                        }
                    />


                    {/* Reports */}

                    <QuickAction
                        icon={
                            <FileBarChart
                                size={21}
                            />
                        }
                        title="Reports"
                        description="Search and view completed inspections."
                        onClick={() =>
                            navigate("/reports")
                        }
                    />

                </div>

            </section>


            {/* =====================================================
                DASHBOARD METRICS
            ====================================================== */}

            <section>

                <div className="
                    mb-3
                    flex
                    items-center
                    justify-between
                ">

                    <div>

                        <h2 className="
                            text-base
                            font-bold
                            text-slate-900

                            sm:text-lg
                        ">
                            Inspection Overview
                        </h2>

                        <p className="
                            text-xs
                            text-slate-500
                            sm:text-sm
                        ">
                            Operational metrics will appear here
                        </p>

                    </div>

                    <Activity
                        size={19}
                        className="text-blue-600"
                    />

                </div>


                <div className="
                    grid
                    grid-cols-2
                    gap-3

                    lg:grid-cols-4
                ">

                    <MetricCard
                        icon={
                            <ClipboardCheck
                                size={19}
                            />
                        }
                        label="Total Inspections"
                        value="—"
                        description="Coming soon"
                    />


                    <MetricCard
                        icon={
                            <ShieldCheck
                                size={19}
                            />
                        }
                        label="FIT"
                        value="—"
                        description="Coming soon"
                        positive
                    />


                    <MetricCard
                        icon={
                            <AlertTriangle
                                size={19}
                            />
                        }
                        label="UNFIT"
                        value="—"
                        description="Coming soon"
                        warning
                    />


                    <MetricCard
                        icon={
                            <Clock3
                                size={19}
                            />
                        }
                        label="Pending"
                        value="—"
                        description="Coming soon"
                    />

                </div>

            </section>


            {/* =====================================================
                TODAY'S ACTIVITY + SYSTEM STATUS
            ====================================================== */}

            <section className="
                grid
                grid-cols-1
                gap-4

                lg:grid-cols-2
            ">

                {/* Today's Activity */}

                <div className="
                    overflow-hidden
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    shadow-sm
                ">

                    <div className="
                        flex
                        items-center
                        gap-3
                        border-b
                        border-slate-100
                        px-5
                        py-4
                    ">

                        <div className="
                            flex
                            h-9
                            w-9
                            items-center
                            justify-center
                            rounded-lg
                            bg-blue-50
                            text-blue-600
                        ">

                            <CalendarDays
                                size={18}
                            />

                        </div>


                        <div>

                            <h3 className="
                                text-sm
                                font-bold
                                text-slate-900
                            ">
                                Today's Activity
                            </h3>

                            <p className="
                                text-xs
                                text-slate-500
                            ">
                                Inspection activity summary
                            </p>

                        </div>

                    </div>


                    <div className="px-5 py-6">

                        <div className="
                            rounded-xl
                            border
                            border-dashed
                            border-slate-200
                            bg-slate-50
                            px-4
                            py-6
                            text-center
                        ">

                            <Activity
                                size={24}
                                className="
                                    mx-auto
                                    text-slate-300
                                "
                            />

                            <p className="
                                mt-2
                                text-sm
                                font-semibold
                                text-slate-600
                            ">
                                Activity metrics coming soon
                            </p>

                            <p className="
                                mt-1
                                text-xs
                                text-slate-400
                            ">
                                Today's inspection statistics
                                will appear here.
                            </p>

                        </div>

                    </div>

                </div>


                {/* System Status */}

                <div className="
                    overflow-hidden
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    shadow-sm
                ">

                    <div className="
                        flex
                        items-center
                        gap-3
                        border-b
                        border-slate-100
                        px-5
                        py-4
                    ">

                        <div className="
                            flex
                            h-9
                            w-9
                            items-center
                            justify-center
                            rounded-lg
                            bg-green-50
                            text-green-600
                        ">

                            <ShieldCheck
                                size={18}
                            />

                        </div>


                        <div>

                            <h3 className="
                                text-sm
                                font-bold
                                text-slate-900
                            ">
                                System Status
                            </h3>

                            <p className="
                                text-xs
                                text-slate-500
                            ">
                                NIRIKSHAN application status
                            </p>

                        </div>

                    </div>


                    <div className="p-5">

                        <div className="
                            flex
                            items-center
                            justify-between
                            rounded-xl
                            border
                            border-green-100
                            bg-green-50
                            px-4
                            py-4
                        ">

                            <div className="
                                flex
                                items-center
                                gap-3
                            ">

                                <span className="
                                    h-2.5
                                    w-2.5
                                    rounded-full
                                    bg-green-500
                                    shadow-[0_0_0_4px_rgba(34,197,94,0.12)]
                                " />

                                <div>

                                    <p className="
                                        text-sm
                                        font-bold
                                        text-green-800
                                    ">
                                        System Operational
                                    </p>

                                    <p className="
                                        mt-0.5
                                        text-xs
                                        text-green-700
                                    ">
                                        NIRIKSHAN is ready for use.
                                    </p>

                                </div>

                            </div>


                            <span className="
                                rounded-full
                                bg-green-100
                                px-2.5
                                py-1
                                text-[10px]
                                font-bold
                                uppercase
                                tracking-wide
                                text-green-700
                            ">
                                Online
                            </span>

                        </div>

                    </div>

                </div>

            </section>

        </div>
    );
}


/* ================================================================
   QUICK ACTION COMPONENT
================================================================ */

interface QuickActionProps {

    icon: React.ReactNode;

    title: string;

    description: string;

    onClick: () => void;

    primary?: boolean;

}


function QuickAction({
    icon,
    title,
    description,
    onClick,
    primary = false,
}: QuickActionProps) {

    return (

        <button
            type="button"
            onClick={onClick}
            className={`
                group
                flex
                items-center
                gap-4
                rounded-2xl
                border
                p-4
                text-left
                shadow-sm
                transition-all
                duration-200

                ${
                    primary
                        ? `
                            border-blue-600
                            bg-blue-600
                            text-white
                            hover:bg-blue-700
                            hover:shadow-md
                        `
                        : `
                            border-slate-200
                            bg-white
                            text-slate-900
                            hover:border-blue-200
                            hover:bg-blue-50/40
                            hover:shadow-md
                        `
                }
            `}
        >

            <div
                className={`
                    flex
                    h-11
                    w-11
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl

                    ${
                        primary
                            ? "bg-white/15 text-white"
                            : "bg-blue-50 text-blue-600"
                    }
                `}
            >
                {icon}
            </div>


            <div className="min-w-0 flex-1">

                <h3 className="
                    text-sm
                    font-bold
                ">
                    {title}
                </h3>


                <p
                    className={`
                        mt-1
                        text-xs
                        leading-5

                        ${
                            primary
                                ? "text-blue-100"
                                : "text-slate-500"
                        }
                    `}
                >
                    {description}
                </p>

            </div>


            <ArrowRight
                size={17}
                className={`
                    shrink-0
                    transition-transform
                    group-hover:translate-x-1

                    ${
                        primary
                            ? "text-blue-200"
                            : "text-slate-400"
                    }
                `}
            />

        </button>

    );
}


/* ================================================================
   METRIC CARD COMPONENT
================================================================ */

interface MetricCardProps {

    icon: React.ReactNode;

    label: string;

    value: string;

    description: string;

    positive?: boolean;

    warning?: boolean;

}


function MetricCard({
    icon,
    label,
    value,
    description,
    positive = false,
    warning = false,
}: MetricCardProps) {

    return (

        <div className="
            rounded-2xl
            border
            border-slate-200
            bg-white
            p-4
            shadow-sm

            sm:p-5
        ">

            <div className="
                flex
                items-start
                justify-between
                gap-2
            ">

                <div
                    className={`
                        flex
                        h-9
                        w-9
                        items-center
                        justify-center
                        rounded-lg

                        ${
                            positive
                                ? "bg-green-50 text-green-600"
                                : warning
                                    ? "bg-red-50 text-red-600"
                                    : "bg-blue-50 text-blue-600"
                        }
                    `}
                >
                    {icon}
                </div>


                <span className="
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-wide
                    text-slate-400
                ">
                    {description}
                </span>

            </div>


            <div className="mt-4">

                <p className="
                    text-xs
                    font-semibold
                    text-slate-500
                ">
                    {label}
                </p>


                <p className="
                    mt-1
                    text-2xl
                    font-extrabold
                    tracking-tight
                    text-slate-900
                ">
                    {value}
                </p>

            </div>

        </div>

    );
}