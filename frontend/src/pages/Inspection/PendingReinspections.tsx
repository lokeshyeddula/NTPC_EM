import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    AlertTriangle,
    CalendarDays,
    Clock3,
    RefreshCcw,
    RotateCcw,
    ShieldAlert,
    Truck,
    UserRound,
    FileText,
    ChevronRight,
} from "lucide-react";

import inspectionService, {
    type PendingVehicle,
} from "../../services/inspectionService";

import useAuth from "../../hooks/useAuth";


export default function PendingReinspections() {

    const [vehicles, setVehicles] =
        useState<PendingVehicle[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [refreshing, setRefreshing] =
        useState(false);

    const navigate =
        useNavigate();

    const { user } =
        useAuth();

    const [currentTime, setCurrentTime] =
        useState(new Date());


    // =========================================================
    // INITIAL LOAD + CLOCK
    // =========================================================

    useEffect(() => {

        loadPending();

        const timer =
            setInterval(
                () => {
                    setCurrentTime(
                        new Date()
                    );
                },
                1000
            );

        return () =>
            clearInterval(timer);

    }, []);


    // =========================================================
    // LOAD PENDING
    // =========================================================

    async function loadPending() {

        try {

            setLoading(true);

            const data =
                await inspectionService
                    .getPendingReinspections();

            setVehicles(data);

        } catch (error) {

            console.error(
                "Error loading pending reinspections:",
                error
            );

        } finally {

            setLoading(false);

        }
    }


    // =========================================================
    // REFRESH
    // =========================================================

    async function handleRefresh() {

        try {

            setRefreshing(true);

            const data =
                await inspectionService
                    .getPendingReinspections();

            setVehicles(data);

        } catch (error) {

            console.error(
                "Error refreshing pending reinspections:",
                error
            );

        } finally {

            setRefreshing(false);

        }
    }


    // =========================================================
    // DATE
    // =========================================================

    const formattedDate =
        currentTime.toLocaleDateString(
            "en-GB",
            {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
            }
        );


    // =========================================================
    // TIME
    // =========================================================

    const formattedTime =
        currentTime.toLocaleTimeString(
            "en-US",
            {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: true,
            }
        );


    // =========================================================
    // SHIFT
    // =========================================================

    const getShift =
        (date: Date) => {

            const hour =
                date.getHours();

            if (
                hour >= 6 &&
                hour < 14
            ) {
                return "Morning";
            }

            if (
                hour >= 14 &&
                hour < 22
            ) {
                return "Evening";
            }

            return "Night";
        };


    const currentShift =
        getShift(currentTime);


    // =========================================================
    // SHIFT STYLE
    // =========================================================

    const getShiftStyle =
        (shift: string) => {

            if (
                shift === "Morning"
            ) {
                return "bg-blue-50 text-blue-700 border-blue-100";
            }

            if (
                shift === "Evening"
            ) {
                return "bg-orange-50 text-orange-700 border-orange-100";
            }

            return "bg-indigo-50 text-indigo-700 border-indigo-100";
        };


    // =========================================================
    // RE-INSPECTION
    // =========================================================

    function handleReinspection(
        item: PendingVehicle
    ) {

        navigate(
            `/inspection?machine_id=${item.machinery_type_id}` +
            `&vehicle_id=${item.vehicle_id}` +
            `&reinspection=true` +
            `&original_inspection_id=${item.original_inspection_id}`
        );

    }


    // =========================================================
    // PAGE
    // =========================================================

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
                border-orange-200
                bg-white
                shadow-sm
            ">

                <div className="
                    bg-gradient-to-r
                    from-slate-950
                    via-orange-950
                    to-orange-700
                    px-4
                    py-5

                    sm:px-6
                    sm:py-6
                ">

                    <div className="
                        flex
                        flex-col
                        gap-5

                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                    ">


                        {/* TITLE */}

                        <div className="
                            flex
                            items-start
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
                                ring-1
                                ring-white/20
                            ">

                                <ShieldAlert
                                    size={23}
                                    className="text-orange-200"
                                />

                            </div>


                            <div>

                                <div className="
                                    text-[11px]
                                    font-bold
                                    uppercase
                                    tracking-[0.18em]
                                    text-orange-200
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
                                    Re-Inspection
                                </h1>


                                <p className="
                                    mt-1
                                    text-xs
                                    leading-5
                                    text-orange-100/80

                                    sm:text-sm
                                ">
                                    Review and re-inspect machines
                                    requiring corrective action.
                                </p>

                            </div>

                        </div>


                        {/* REFRESH */}

                        <button
                            type="button"
                            onClick={handleRefresh}
                            disabled={refreshing}
                            className="
                                flex
                                h-10
                                items-center
                                justify-center
                                gap-2

                                rounded-xl
                                border
                                border-white/15
                                bg-white/10

                                px-4

                                text-sm
                                font-semibold
                                text-white

                                transition

                                hover:bg-white/20

                                disabled:cursor-not-allowed
                                disabled:opacity-60
                            "
                        >

                            <RefreshCcw
                                size={17}
                                className={
                                    refreshing
                                        ? "animate-spin"
                                        : ""
                                }
                            />

                            {refreshing
                                ? "Refreshing..."
                                : "Refresh"
                            }

                        </button>

                    </div>

                </div>


                {/* =================================================
                    META INFORMATION
                ================================================== */}

                <div className="
                    grid
                    grid-cols-2
                    divide-x
                    divide-y
                    divide-slate-100

                    sm:grid-cols-4
                    sm:divide-y-0
                ">


                    {/* DATE */}

                    <div className="
                        flex
                        items-center
                        gap-3
                        p-4
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
                            bg-slate-100
                            text-slate-600
                        ">

                            <CalendarDays
                                size={17}
                            />

                        </div>


                        <div>

                            <p className="
                                text-[10px]
                                font-bold
                                uppercase
                                tracking-wide
                                text-slate-400
                            ">
                                Date
                            </p>

                            <p className="
                                mt-0.5
                                text-sm
                                font-semibold
                                text-slate-800
                            ">
                                {formattedDate}
                            </p>

                        </div>

                    </div>


                    {/* TIME */}

                    <div className="
                        flex
                        items-center
                        gap-3
                        p-4
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
                            text-blue-600
                        ">

                            <Clock3
                                size={17}
                            />

                        </div>


                        <div>

                            <p className="
                                text-[10px]
                                font-bold
                                uppercase
                                tracking-wide
                                text-slate-400
                            ">
                                Time
                            </p>

                            <p className="
                                mt-0.5
                                text-sm
                                font-semibold
                                text-slate-800
                            ">
                                {formattedTime}
                            </p>

                        </div>

                    </div>


                    {/* SHIFT */}

                    <div className="
                        flex
                        items-center
                        gap-3
                        p-4
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
                            bg-indigo-50
                            text-indigo-600
                        ">

                            <Clock3
                                size={17}
                            />

                        </div>


                        <div>

                            <p className="
                                text-[10px]
                                font-bold
                                uppercase
                                tracking-wide
                                text-slate-400
                            ">
                                Shift
                            </p>

                            <span className={`
                                mt-1
                                inline-flex
                                rounded-md
                                border
                                px-2
                                py-0.5
                                text-[11px]
                                font-bold

                                ${getShiftStyle(
                                    currentShift
                                )}
                            `}>
                                {currentShift}
                            </span>

                        </div>

                    </div>


                    {/* ENGINEER */}

                    <div className="
                        col-span-2
                        flex
                        items-center
                        gap-3
                        border-t
                        border-slate-100
                        p-4

                        sm:col-span-1
                        sm:border-t-0
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
                            bg-green-50
                            text-green-600
                        ">

                            <UserRound
                                size={17}
                            />

                        </div>


                        <div className="min-w-0">

                            <p className="
                                text-[10px]
                                font-bold
                                uppercase
                                tracking-wide
                                text-slate-400
                            ">
                                Inspection Engineer
                            </p>

                            <p className="
                                mt-0.5
                                truncate
                                text-sm
                                font-semibold
                                text-slate-800
                            ">
                                {user?.full_name || "N/A"}
                            </p>

                        </div>

                    </div>

                </div>

            </section>


            {/* =====================================================
                PENDING SUMMARY
            ====================================================== */}

            <section className="
                flex
                items-center
                justify-between
                gap-4

                rounded-2xl
                border
                border-orange-200
                bg-orange-50
                px-4
                py-4

                sm:px-5
            ">

                <div className="
                    flex
                    min-w-0
                    items-center
                    gap-3
                ">

                    <div className="
                        flex
                        h-10
                        w-10
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        bg-orange-100
                        text-orange-600
                    ">

                        <AlertTriangle
                            size={20}
                        />

                    </div>


                    <div>

                        <p className="
                            text-sm
                            font-bold
                            text-orange-900
                        ">
                            Pending Re-Inspections
                        </p>

                        <p className="
                            mt-0.5
                            text-xs
                            text-orange-700
                        ">
                            These machines require follow-up inspection.
                        </p>

                    </div>

                </div>


                <div className="
                    flex
                    h-10
                    min-w-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    bg-orange-600
                    px-3
                    text-lg
                    font-bold
                    text-white
                    shadow-sm
                ">

                    {vehicles.length}

                </div>

            </section>


            {/* =====================================================
                CONTENT
            ====================================================== */}

            <section className="
                overflow-hidden
                rounded-2xl
                border
                border-slate-200
                bg-white
                shadow-sm
            ">


                {/* =================================================
                    LOADING
                ================================================== */}

                {loading ? (

                    <div className="
                        flex
                        min-h-[250px]
                        flex-col
                        items-center
                        justify-center
                        gap-3
                        p-8
                    ">

                        <div className="
                            h-9
                            w-9
                            animate-spin
                            rounded-full
                            border-4
                            border-orange-500
                            border-t-transparent
                        " />

                        <p className="
                            text-sm
                            font-medium
                            text-slate-500
                        ">
                            Loading pending re-inspections...
                        </p>

                    </div>

                ) : vehicles.length === 0 ? (

                    /* =================================================
                        EMPTY STATE
                    ================================================== */

                    <div className="
                        flex
                        min-h-[300px]
                        flex-col
                        items-center
                        justify-center
                        p-8
                        text-center
                    ">

                        <div className="
                            flex
                            h-16
                            w-16
                            items-center
                            justify-center
                            rounded-2xl
                            bg-green-50
                            text-green-600
                        ">

                            <RotateCcw
                                size={28}
                            />

                        </div>


                        <h2 className="
                            mt-5
                            text-lg
                            font-bold
                            text-slate-800
                        ">
                            All Clear
                        </h2>


                        <p className="
                            mt-1
                            max-w-md
                            text-sm
                            leading-6
                            text-slate-500
                        ">
                            No vehicles currently require
                            re-inspection. All previously failed
                            inspections have been cleared.
                        </p>

                    </div>

                ) : (

                    <>


                        {/* =================================================
                            MOBILE CARDS
                        ================================================== */}

                        <div className="
                            space-y-3
                            p-3
                            md:hidden
                        ">

                            {vehicles.map(
                                (item) => (

                                    <div
                                        key={
                                            item.vehicle_id
                                        }
                                        className="
                                            overflow-hidden
                                            rounded-xl
                                            border
                                            border-orange-200
                                            bg-white
                                        "
                                    >

                                        {/* Card Header */}

                                        <div className="
                                            flex
                                            items-start
                                            justify-between
                                            gap-3
                                            border-b
                                            border-orange-100
                                            bg-orange-50/50
                                            px-4
                                            py-3
                                        ">

                                            <div className="
                                                flex
                                                min-w-0
                                                items-center
                                                gap-3
                                            ">

                                                <div className="
                                                    flex
                                                    h-10
                                                    w-10
                                                    shrink-0
                                                    items-center
                                                    justify-center
                                                    rounded-lg
                                                    bg-orange-100
                                                    text-orange-600
                                                ">

                                                    <Truck
                                                        size={19}
                                                    />

                                                </div>


                                                <div className="
                                                    min-w-0
                                                ">

                                                    <p className="
                                                        text-[10px]
                                                        font-bold
                                                        uppercase
                                                        tracking-wider
                                                        text-orange-600
                                                    ">
                                                        Machine
                                                    </p>

                                                    <p className="
                                                        truncate
                                                        text-sm
                                                        font-bold
                                                        text-slate-900
                                                    ">
                                                        {item.machinery_name}
                                                    </p>

                                                </div>

                                            </div>


                                            <span className="
                                                shrink-0
                                                rounded-full
                                                bg-red-100
                                                px-2.5
                                                py-1
                                                text-[10px]
                                                font-bold
                                                uppercase
                                                text-red-700
                                            ">
                                                Action Required
                                            </span>

                                        </div>


                                        {/* Details */}

                                        <div className="
                                            space-y-4
                                            px-4
                                            py-4
                                        ">


                                            {/* Door Number */}

                                            <div className="
                                                flex
                                                items-center
                                                justify-between
                                                gap-3
                                            ">

                                                <div className="
                                                    flex
                                                    items-center
                                                    gap-2
                                                ">

                                                    <Truck
                                                        size={16}
                                                        className="text-slate-400"
                                                    />

                                                    <span className="
                                                        text-xs
                                                        font-medium
                                                        text-slate-500
                                                    ">
                                                        Door Number
                                                    </span>

                                                </div>


                                                <span className="
                                                    rounded-lg
                                                    bg-slate-100
                                                    px-3
                                                    py-1
                                                    text-sm
                                                    font-bold
                                                    text-slate-800
                                                ">
                                                    {item.machine_number}
                                                </span>

                                            </div>


                                            {/* Failed On */}

                                            <div className="
                                                flex
                                                items-center
                                                justify-between
                                                gap-3
                                            ">

                                                <div className="
                                                    flex
                                                    items-center
                                                    gap-2
                                                ">

                                                    <CalendarDays
                                                        size={16}
                                                        className="text-slate-400"
                                                    />

                                                    <span className="
                                                        text-xs
                                                        font-medium
                                                        text-slate-500
                                                    ">
                                                        Failed On
                                                    </span>

                                                </div>


                                                <span className="
                                                    text-sm
                                                    font-semibold
                                                    text-slate-700
                                                ">
                                                    {item.last_inspection_date}
                                                </span>

                                            </div>


                                            {/* Original Inspection */}

                                            <div className="
                                                flex
                                                items-center
                                                justify-between
                                                gap-3
                                            ">

                                                <div className="
                                                    flex
                                                    items-center
                                                    gap-2
                                                ">

                                                    <FileText
                                                        size={16}
                                                        className="text-slate-400"
                                                    />

                                                    <span className="
                                                        text-xs
                                                        font-medium
                                                        text-slate-500
                                                    ">
                                                        Original Inspection
                                                    </span>

                                                </div>


                                                <span className="
                                                    max-w-[160px]
                                                    truncate
                                                    text-sm
                                                    font-bold
                                                    text-slate-800
                                                ">
                                                    {item.original_inspection_number}
                                                </span>

                                            </div>


                                            {/* Action */}

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleReinspection(
                                                        item
                                                    )
                                                }
                                                className="
                                                    flex
                                                    min-h-12
                                                    w-full
                                                    items-center
                                                    justify-center
                                                    gap-2

                                                    rounded-xl

                                                    bg-orange-600

                                                    px-4

                                                    text-sm
                                                    font-bold
                                                    text-white

                                                    shadow-sm
                                                    shadow-orange-600/20

                                                    transition

                                                    hover:bg-orange-700

                                                    active:scale-[0.98]
                                                "
                                            >

                                                <RotateCcw
                                                    size={18}
                                                />

                                                Start Re-Inspection

                                                <ChevronRight
                                                    size={18}
                                                />

                                            </button>

                                        </div>

                                    </div>

                                )
                            )}

                        </div>


                        {/* =================================================
                            DESKTOP TABLE
                        ================================================== */}

                        <div className="
                            hidden
                            overflow-x-auto
                            md:block
                        ">

                            <table className="
                                w-full
                                border-collapse
                            ">

                                <thead>

                                    <tr className="
                                        border-b
                                        border-slate-200
                                        bg-slate-50
                                    ">

                                        <th className="
                                            px-5
                                            py-4
                                            text-left
                                            text-[11px]
                                            font-bold
                                            uppercase
                                            tracking-wider
                                            text-slate-500
                                        ">
                                            Machine
                                        </th>

                                        <th className="
                                            px-5
                                            py-4
                                            text-left
                                            text-[11px]
                                            font-bold
                                            uppercase
                                            tracking-wider
                                            text-slate-500
                                        ">
                                            Door Number
                                        </th>

                                        <th className="
                                            px-5
                                            py-4
                                            text-left
                                            text-[11px]
                                            font-bold
                                            uppercase
                                            tracking-wider
                                            text-slate-500
                                        ">
                                            Failed On
                                        </th>

                                        <th className="
                                            px-5
                                            py-4
                                            text-left
                                            text-[11px]
                                            font-bold
                                            uppercase
                                            tracking-wider
                                            text-slate-500
                                        ">
                                            Original Inspection
                                        </th>

                                        <th className="
                                            px-5
                                            py-4
                                            text-center
                                            text-[11px]
                                            font-bold
                                            uppercase
                                            tracking-wider
                                            text-slate-500
                                        ">
                                            Action
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {vehicles.map(
                                        (item) => (

                                            <tr
                                                key={
                                                    item.vehicle_id
                                                }
                                                className="
                                                    border-b
                                                    border-slate-100
                                                    transition
                                                    last:border-0
                                                    hover:bg-orange-50/30
                                                "
                                            >

                                                {/* Machine */}

                                                <td className="
                                                    px-5
                                                    py-4
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
                                                            bg-orange-50
                                                            text-orange-600
                                                        ">

                                                            <Truck
                                                                size={17}
                                                            />

                                                        </div>


                                                        <div>

                                                            <p className="
                                                                font-bold
                                                                text-slate-800
                                                            ">
                                                                {item.machinery_name}
                                                            </p>

                                                            <p className="
                                                                mt-0.5
                                                                text-[11px]
                                                                text-red-500
                                                            ">
                                                                Re-inspection required
                                                            </p>

                                                        </div>

                                                    </div>

                                                </td>


                                                {/* Door */}

                                                <td className="
                                                    px-5
                                                    py-4
                                                ">

                                                    <span className="
                                                        inline-flex
                                                        rounded-lg
                                                        bg-slate-100
                                                        px-3
                                                        py-1.5
                                                        text-sm
                                                        font-bold
                                                        text-slate-800
                                                    ">
                                                        {item.machine_number}
                                                    </span>

                                                </td>


                                                {/* Date */}

                                                <td className="
                                                    px-5
                                                    py-4
                                                ">

                                                    <div className="
                                                        flex
                                                        items-center
                                                        gap-2
                                                    ">

                                                        <CalendarDays
                                                            size={16}
                                                            className="text-slate-400"
                                                        />

                                                        <span className="
                                                            text-sm
                                                            text-slate-600
                                                        ">
                                                            {item.last_inspection_date}
                                                        </span>

                                                    </div>

                                                </td>


                                                {/* Original inspection */}

                                                <td className="
                                                    px-5
                                                    py-4
                                                ">

                                                    <div className="
                                                        flex
                                                        items-center
                                                        gap-2
                                                    ">

                                                        <FileText
                                                            size={16}
                                                            className="text-slate-400"
                                                        />

                                                        <span className="
                                                            text-sm
                                                            font-semibold
                                                            text-slate-700
                                                        ">
                                                            {item.original_inspection_number}
                                                        </span>

                                                    </div>

                                                </td>


                                                {/* Action */}

                                                <td className="
                                                    px-5
                                                    py-4
                                                    text-center
                                                ">

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleReinspection(
                                                                item
                                                            )
                                                        }
                                                        className="
                                                            inline-flex
                                                            items-center
                                                            justify-center
                                                            gap-2

                                                            rounded-xl

                                                            bg-orange-600

                                                            px-4
                                                            py-2.5

                                                            text-sm
                                                            font-bold
                                                            text-white

                                                            shadow-sm

                                                            transition

                                                            hover:bg-orange-700

                                                            active:scale-[0.98]
                                                        "
                                                    >

                                                        <RotateCcw
                                                            size={17}
                                                        />

                                                        Re-Inspect

                                                        <ChevronRight
                                                            size={16}
                                                        />

                                                    </button>

                                                </td>

                                            </tr>

                                        )
                                    )}

                                </tbody>

                            </table>

                        </div>

                    </>

                )}

            </section>

        </div>
    );
}