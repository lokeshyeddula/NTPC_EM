import { useEffect, useMemo, useState } from "react";
import {
    Search,
    RefreshCcw,
    ClipboardList,
    CheckCircle2,
    XCircle,
    CalendarDays,
    UserRound,
    Truck,
    Clock3,
    FileText,
} from "lucide-react";

import inspectionService from "../../services/inspectionService";

interface InspectionHistory {
    id: number;
    inspection_number: string;
    inspection_date: string;
    shift: string;
    relay: string;
    vehicle: string;
    engineer: string;
    operational_status: string;
}

type StatusFilter = "All" | "Fit" | "Unfit";

export default function InspectionHistory() {

    const [history, setHistory] =
        useState<InspectionHistory[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [refreshing, setRefreshing] =
        useState(false);

    const [search, setSearch] =
        useState("");

    const [statusFilter, setStatusFilter] =
        useState<StatusFilter>("All");


    // =========================================================
    // LOAD HISTORY
    // =========================================================

    useEffect(() => {
        loadHistory();
    }, []);


    async function loadHistory() {

        try {

            setLoading(true);

            const data =
                await inspectionService.getInspectionHistory();

            setHistory(data);

        } catch (error) {

            console.error(
                "Failed to load inspection history:",
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
                await inspectionService.getInspectionHistory();

            setHistory(data);

        } catch (error) {

            console.error(
                "Failed to refresh inspection history:",
                error
            );

        } finally {

            setRefreshing(false);

        }
    }


    // =========================================================
    // SUMMARY
    // =========================================================

    const totalInspections =
        history.length;

    const fitCount =
        history.filter(
            (item) =>
                item.operational_status === "Fit"
        ).length;

    const unfitCount =
        history.filter(
            (item) =>
                item.operational_status === "Unfit"
        ).length;


    // =========================================================
    // FILTER
    // =========================================================

    const filteredHistory =
        useMemo(() => {

            const query =
                search.trim().toLowerCase();

            return history.filter(
                (item) => {

                    const matchesSearch =
                        !query ||
                        item.inspection_number
                            ?.toLowerCase()
                            .includes(query) ||
                        item.vehicle
                            ?.toLowerCase()
                            .includes(query) ||
                        item.engineer
                            ?.toLowerCase()
                            .includes(query) ||
                        item.shift
                            ?.toLowerCase()
                            .includes(query) ||
                        item.relay
                            ?.toLowerCase()
                            .includes(query);


                    const matchesStatus =
                        statusFilter === "All" ||
                        item.operational_status ===
                            statusFilter;


                    return (
                        matchesSearch &&
                        matchesStatus
                    );

                }
            );

        }, [
            history,
            search,
            statusFilter,
        ]);


    // =========================================================
    // STATUS HELPERS
    // =========================================================

    function getStatusStyles(
        status: string
    ) {

        if (status === "Fit") {

            return {
                wrapper:
                    "border-green-200 bg-green-50 text-green-700",
                icon:
                    "text-green-600",
            };

        }

        return {
            wrapper:
                "border-red-200 bg-red-50 text-red-700",
            icon:
                "text-red-600",
        };

    }


    function getShiftStyles(
        shift: string
    ) {

        if (
            shift?.toLowerCase() === "morning"
        ) {

            return "bg-blue-50 text-blue-700 border-blue-100";

        }

        if (
            shift?.toLowerCase() === "evening"
        ) {

            return "bg-orange-50 text-orange-700 border-orange-100";

        }

        return "bg-indigo-50 text-indigo-700 border-indigo-100";

    }


    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {

        return (

            <div className="
                min-h-[60vh]
                flex
                items-center
                justify-center
            ">

                <div className="
                    flex
                    flex-col
                    items-center
                    gap-3
                ">

                    <div className="
                        h-10
                        w-10
                        animate-spin
                        rounded-full
                        border-4
                        border-blue-600
                        border-t-transparent
                    " />

                    <p className="
                        text-sm
                        font-medium
                        text-slate-500
                    ">
                        Loading inspection history...
                    </p>

                </div>

            </div>

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
                border-slate-200
                bg-white
                shadow-sm
            ">

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
                        flex-col
                        gap-4

                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                    ">


                        {/* TITLE */}

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
                                ring-1
                                ring-white/20
                            ">

                                <ClipboardList
                                    size={23}
                                    className="text-blue-200"
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
                                    text-xl
                                    font-bold
                                    text-white
                                    sm:text-2xl
                                ">
                                    Inspection History
                                </h1>

                                <p className="
                                    mt-1
                                    text-xs
                                    text-blue-100/80
                                    sm:text-sm
                                ">
                                    Review completed machinery inspections
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

                            <span>
                                {refreshing
                                    ? "Refreshing..."
                                    : "Refresh"
                                }
                            </span>

                        </button>

                    </div>

                </div>

            </section>


            {/* =====================================================
                SUMMARY CARDS
            ====================================================== */}

            <div className="
                grid
                grid-cols-1
                gap-3

                sm:grid-cols-3
                sm:gap-4
            ">


                {/* TOTAL */}

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
                        items-center
                        justify-between
                    ">

                        <div>

                            <p className="
                                text-xs
                                font-semibold
                                uppercase
                                tracking-wide
                                text-slate-500
                            ">
                                Total Inspections
                            </p>

                            <p className="
                                mt-1
                                text-2xl
                                font-bold
                                text-slate-900
                            ">
                                {totalInspections}
                            </p>

                        </div>


                        <div className="
                            flex
                            h-11
                            w-11
                            items-center
                            justify-center
                            rounded-xl
                            bg-blue-50
                            text-blue-600
                        ">

                            <ClipboardList
                                size={21}
                            />

                        </div>

                    </div>

                </div>


                {/* FIT */}

                <div className="
                    rounded-2xl
                    border
                    border-green-200
                    bg-green-50/50
                    p-4
                    shadow-sm
                    sm:p-5
                ">

                    <div className="
                        flex
                        items-center
                        justify-between
                    ">

                        <div>

                            <p className="
                                text-xs
                                font-semibold
                                uppercase
                                tracking-wide
                                text-green-700
                            ">
                                Fit
                            </p>

                            <p className="
                                mt-1
                                text-2xl
                                font-bold
                                text-green-800
                            ">
                                {fitCount}
                            </p>

                        </div>


                        <div className="
                            flex
                            h-11
                            w-11
                            items-center
                            justify-center
                            rounded-xl
                            bg-green-100
                            text-green-600
                        ">

                            <CheckCircle2
                                size={21}
                            />

                        </div>

                    </div>

                </div>


                {/* UNFIT */}

                <div className="
                    rounded-2xl
                    border
                    border-red-200
                    bg-red-50/50
                    p-4
                    shadow-sm
                    sm:p-5
                ">

                    <div className="
                        flex
                        items-center
                        justify-between
                    ">

                        <div>

                            <p className="
                                text-xs
                                font-semibold
                                uppercase
                                tracking-wide
                                text-red-700
                            ">
                                Unfit
                            </p>

                            <p className="
                                mt-1
                                text-2xl
                                font-bold
                                text-red-800
                            ">
                                {unfitCount}
                            </p>

                        </div>


                        <div className="
                            flex
                            h-11
                            w-11
                            items-center
                            justify-center
                            rounded-xl
                            bg-red-100
                            text-red-600
                        ">

                            <XCircle
                                size={21}
                            />

                        </div>

                    </div>

                </div>

            </div>


            {/* =====================================================
                SEARCH + FILTER
            ====================================================== */}

            <section className="
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
                    flex-col
                    gap-3

                    lg:flex-row
                    lg:items-center
                    lg:justify-between
                ">


                    {/* SEARCH */}

                    <div className="
                        relative
                        w-full
                        lg:max-w-xl
                    ">

                        <Search
                            size={18}
                            className="
                                absolute
                                left-3
                                top-1/2
                                -translate-y-1/2
                                text-slate-400
                            "
                        />

                        <input
                            type="text"
                            value={search}
                            onChange={(e) =>
                                setSearch(
                                    e.target.value
                                )
                            }
                            placeholder="
                                Search inspection number, vehicle,
                                engineer, shift...
                            "
                            className="
                                h-11
                                w-full
                                rounded-xl
                                border
                                border-slate-200
                                bg-slate-50
                                pl-10
                                pr-4
                                text-sm
                                text-slate-800
                                outline-none
                                transition

                                placeholder:text-slate-400

                                focus:border-blue-500
                                focus:bg-white
                                focus:ring-4
                                focus:ring-blue-500/10
                            "
                        />

                    </div>


                    {/* FILTER */}

                    <div className="
                        flex
                        w-full
                        gap-2

                        lg:w-auto
                    ">

                        {(
                            [
                                "All",
                                "Fit",
                                "Unfit",
                            ] as StatusFilter[]
                        ).map(
                            (status) => (

                                <button
                                    key={status}
                                    type="button"
                                    onClick={() =>
                                        setStatusFilter(
                                            status
                                        )
                                    }
                                    className={`
                                        flex-1
                                        rounded-xl
                                        px-4
                                        py-2.5

                                        text-sm
                                        font-semibold

                                        transition

                                        lg:flex-none

                                        ${
                                            statusFilter === status
                                                ? status === "Fit"
                                                    ? "bg-green-600 text-white shadow-sm"
                                                    : status === "Unfit"
                                                        ? "bg-red-600 text-white shadow-sm"
                                                        : "bg-blue-700 text-white shadow-sm"
                                                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                        }
                                    `}
                                >

                                    {status}

                                </button>

                            )
                        )}

                    </div>

                </div>


                <div className="
                    mt-3
                    text-xs
                    font-medium
                    text-slate-500
                ">

                    Showing{" "}
                    <span className="font-bold text-slate-700">
                        {filteredHistory.length}
                    </span>{" "}
                    of{" "}
                    <span className="font-bold text-slate-700">
                        {history.length}
                    </span>{" "}
                    inspections

                </div>

            </section>


            {/* =====================================================
                NO RESULTS
            ====================================================== */}

            {filteredHistory.length === 0 ? (

                <section className="
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    p-8
                    text-center
                    shadow-sm
                ">

                    <div className="
                        mx-auto
                        flex
                        h-14
                        w-14
                        items-center
                        justify-center
                        rounded-2xl
                        bg-slate-100
                        text-slate-400
                    ">

                        <FileText
                            size={25}
                        />

                    </div>


                    <h3 className="
                        mt-4
                        font-bold
                        text-slate-800
                    ">

                        {history.length === 0
                            ? "No Inspection History"
                            : "No Matching Inspections"
                        }

                    </h3>


                    <p className="
                        mt-1
                        text-sm
                        text-slate-500
                    ">

                        {history.length === 0
                            ? "Completed inspections will appear here."
                            : "Try changing your search or status filter."
                        }

                    </p>

                </section>

            ) : (

                <section className="
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    shadow-sm
                ">


                    {/* =================================================
                        MOBILE CARDS
                    ================================================== */}

                    <div className="
                        space-y-3
                        p-3
                        md:hidden
                    ">

                        {filteredHistory.map(
                            (item) => {

                                const status =
                                    getStatusStyles(
                                        item.operational_status
                                    );

                                return (

                                    <div
                                        key={item.id}
                                        className="
                                            overflow-hidden
                                            rounded-xl
                                            border
                                            border-slate-200
                                            bg-white
                                        "
                                    >

                                        {/* Card Header */}

                                        <div className="
                                            flex
                                            items-center
                                            justify-between
                                            gap-3
                                            border-b
                                            border-slate-100
                                            bg-slate-50/70
                                            px-4
                                            py-3
                                        ">

                                            <div className="
                                                min-w-0
                                            ">

                                                <p className="
                                                    text-[10px]
                                                    font-bold
                                                    uppercase
                                                    tracking-wider
                                                    text-slate-400
                                                ">
                                                    Inspection
                                                </p>

                                                <p className="
                                                    truncate
                                                    text-sm
                                                    font-bold
                                                    text-slate-900
                                                ">
                                                    {item.inspection_number}
                                                </p>

                                            </div>


                                            <div
                                                className={`
                                                    flex
                                                    shrink-0
                                                    items-center
                                                    gap-1.5
                                                    rounded-full
                                                    border
                                                    px-3
                                                    py-1.5
                                                    text-[11px]
                                                    font-bold
                                                    uppercase

                                                    ${status.wrapper}
                                                `}
                                            >

                                                {item.operational_status === "Fit"
                                                    ? (
                                                        <CheckCircle2
                                                            size={14}
                                                        />
                                                    )
                                                    : (
                                                        <XCircle
                                                            size={14}
                                                        />
                                                    )
                                                }

                                                {item.operational_status}

                                            </div>

                                        </div>


                                        {/* Details */}

                                        <div className="
                                            space-y-3
                                            px-4
                                            py-4
                                        ">


                                            {/* Vehicle */}

                                            <div className="
                                                flex
                                                items-center
                                                gap-3
                                            ">

                                                <Truck
                                                    size={17}
                                                    className="text-blue-600"
                                                />

                                                <div className="
                                                    min-w-0
                                                ">

                                                    <p className="
                                                        text-[11px]
                                                        font-medium
                                                        text-slate-400
                                                    ">
                                                        Vehicle
                                                    </p>

                                                    <p className="
                                                        truncate
                                                        text-sm
                                                        font-semibold
                                                        text-slate-800
                                                    ">
                                                        {item.vehicle}
                                                    </p>

                                                </div>

                                            </div>


                                            {/* Date + Shift */}

                                            <div className="
                                                grid
                                                grid-cols-2
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

                                                    <div>

                                                        <p className="
                                                            text-[11px]
                                                            text-slate-400
                                                        ">
                                                            Date
                                                        </p>

                                                        <p className="
                                                            text-sm
                                                            font-medium
                                                            text-slate-700
                                                        ">
                                                            {item.inspection_date}
                                                        </p>

                                                    </div>

                                                </div>


                                                <div className="
                                                    flex
                                                    items-center
                                                    gap-2
                                                ">

                                                    <Clock3
                                                        size={16}
                                                        className="text-slate-400"
                                                    />

                                                    <div>

                                                        <p className="
                                                            text-[11px]
                                                            text-slate-400
                                                        ">
                                                            Shift
                                                        </p>

                                                        <span className={`
                                                            inline-flex
                                                            rounded-md
                                                            border
                                                            px-2
                                                            py-0.5
                                                            text-[11px]
                                                            font-semibold

                                                            ${getShiftStyles(
                                                                item.shift
                                                            )}
                                                        `}>
                                                            {item.shift}
                                                        </span>

                                                    </div>

                                                </div>

                                            </div>


                                            {/* Engineer */}

                                            <div className="
                                                flex
                                                items-center
                                                gap-3
                                                border-t
                                                border-slate-100
                                                pt-3
                                            ">

                                                <UserRound
                                                    size={17}
                                                    className="text-slate-400"
                                                />

                                                <div>

                                                    <p className="
                                                        text-[11px]
                                                        text-slate-400
                                                    ">
                                                        Inspection Engineer
                                                    </p>

                                                    <p className="
                                                        text-sm
                                                        font-semibold
                                                        text-slate-700
                                                    ">
                                                        {item.engineer}
                                                    </p>

                                                </div>

                                            </div>

                                        </div>

                                    </div>

                                );

                            }
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
                                        Inspection
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
                                        Date
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
                                        Shift
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
                                        Vehicle
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
                                        Engineer
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
                                        Status
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {filteredHistory.map(
                                    (item) => {

                                        const status =
                                            getStatusStyles(
                                                item.operational_status
                                            );

                                        return (

                                            <tr
                                                key={item.id}
                                                className="
                                                    border-b
                                                    border-slate-100
                                                    transition
                                                    last:border-0
                                                    hover:bg-blue-50/30
                                                "
                                            >

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
                                                            bg-blue-50
                                                            text-blue-600
                                                        ">

                                                            <FileText
                                                                size={16}
                                                            />

                                                        </div>

                                                        <div>

                                                            <p className="
                                                                font-bold
                                                                text-slate-800
                                                            ">
                                                                {item.inspection_number}
                                                            </p>

                                                            <p className="
                                                                text-[11px]
                                                                text-slate-400
                                                            ">
                                                                ID #{item.id}
                                                            </p>

                                                        </div>

                                                    </div>

                                                </td>


                                                <td className="
                                                    px-5
                                                    py-4
                                                    text-sm
                                                    text-slate-600
                                                ">

                                                    {item.inspection_date}

                                                </td>


                                                <td className="
                                                    px-5
                                                    py-4
                                                ">

                                                    <span className={`
                                                        inline-flex
                                                        rounded-lg
                                                        border
                                                        px-2.5
                                                        py-1
                                                        text-xs
                                                        font-semibold

                                                        ${getShiftStyles(
                                                            item.shift
                                                        )}
                                                    `}>
                                                        {item.shift}
                                                    </span>

                                                </td>


                                                <td className="
                                                    px-5
                                                    py-4
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
                                                            text-sm
                                                            font-semibold
                                                            text-slate-800
                                                        ">
                                                            {item.vehicle}
                                                        </span>

                                                    </div>

                                                </td>


                                                <td className="
                                                    px-5
                                                    py-4
                                                ">

                                                    <div className="
                                                        flex
                                                        items-center
                                                        gap-2
                                                    ">

                                                        <UserRound
                                                            size={16}
                                                            className="text-slate-400"
                                                        />

                                                        <span className="
                                                            text-sm
                                                            text-slate-700
                                                        ">
                                                            {item.engineer}
                                                        </span>

                                                    </div>

                                                </td>


                                                <td className="
                                                    px-5
                                                    py-4
                                                    text-center
                                                ">

                                                    <span
                                                        className={`
                                                            inline-flex
                                                            items-center
                                                            gap-1.5
                                                            rounded-full
                                                            border
                                                            px-3
                                                            py-1.5
                                                            text-xs
                                                            font-bold
                                                            uppercase

                                                            ${status.wrapper}
                                                        `}
                                                    >

                                                        {item.operational_status === "Fit"
                                                            ? (
                                                                <CheckCircle2
                                                                    size={14}
                                                                />
                                                            )
                                                            : (
                                                                <XCircle
                                                                    size={14}
                                                                />
                                                            )
                                                        }

                                                        {item.operational_status}

                                                    </span>

                                                </td>

                                            </tr>

                                        );

                                    }
                                )}

                            </tbody>

                        </table>

                    </div>

                </section>

            )}

        </div>
    );
}