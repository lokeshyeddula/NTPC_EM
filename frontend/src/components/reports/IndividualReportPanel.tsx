import { useEffect, useMemo, useState } from "react";
import {
    Search,
    UserRound,
    Truck,
    CalendarDays,
    ClipboardList,
    CheckCircle2,
    XCircle,
    Eye,
    EyeOff,
    RotateCcw,
    FileText,
} from "lucide-react";

import inspectionService from "../../services/inspectionService";
import InspectionReport from "../../pages/Reports/InspectionReport";


interface Inspection {
    id: number;
    inspection_number: string;
    inspection_date: string;
    vehicle: string;
    shift: string;
    engineer: string;
    operational_status: string;
}


export default function IndividualReportPanel() {

    const [inspections, setInspections] =
        useState<Inspection[]>([]);

    const [searchEngineer, setSearchEngineer] =
        useState("");

    const [searchVehicle, setSearchVehicle] =
        useState("");

    const [searchDate, setSearchDate] =
        useState("");

    const [selectedInspection, setSelectedInspection] =
        useState<string | null>(null);

    const [loading, setLoading] =
        useState(true);


    // =========================================================
    // LOAD DATA
    // =========================================================

    useEffect(() => {
        loadData();
    }, []);


    async function loadData() {

        try {

            setLoading(true);

            const data =
                await inspectionService
                    .getInspectionHistory();

            setInspections(data);

        } catch (error) {

            console.error(
                "Error loading inspection history:",
                error
            );

        } finally {

            setLoading(false);

        }
    }


    // =========================================================
    // FILTER
    // =========================================================

    const hasActiveFilter =
        searchEngineer.trim() !== "" ||
        searchVehicle.trim() !== "" ||
        searchDate !== "";


    const filteredInspections =
        useMemo(() => {

            if (!hasActiveFilter) {
                return [];
            }

            return inspections.filter(
                (item) => {

                    const engineerMatch =
                        item.engineer
                            .toLowerCase()
                            .includes(
                                searchEngineer
                                    .toLowerCase()
                            );

                    const vehicleMatch =
                        item.vehicle
                            .toLowerCase()
                            .includes(
                                searchVehicle
                                    .toLowerCase()
                            );

                    const dateMatch =
                        searchDate === "" ||
                        item.inspection_date ===
                            searchDate;

                    return (
                        engineerMatch &&
                        vehicleMatch &&
                        dateMatch
                    );
                }
            );

        }, [
            inspections,
            searchEngineer,
            searchVehicle,
            searchDate,
            hasActiveFilter,
        ]);


    // =========================================================
    // TOGGLE REPORT
    // =========================================================

    const handleToggleReport =
        (inspectionNum: string) => {

            setSelectedInspection(
                (prev) =>
                    prev === inspectionNum
                        ? null
                        : inspectionNum
            );

        };


    // =========================================================
    // CLEAR FILTERS
    // =========================================================

    function clearFilters() {

        setSearchEngineer("");
        setSearchVehicle("");
        setSearchDate("");
        setSelectedInspection(null);

    }


    // =========================================================
    // STATUS
    // =========================================================

    function isFit(status: string) {

        return (
            status.toLowerCase() === "pass" ||
            status.toLowerCase() === "fit"
        );

    }


    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {

        return (

            <div className="
                flex
                min-h-[300px]
                flex-col
                items-center
                justify-center
                gap-3
            ">

                <div className="
                    h-9
                    w-9
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
                    Loading inspection records...
                </p>

            </div>

        );
    }


    return (

        <div className="
            w-full
            space-y-4
            sm:space-y-6
        ">


            {/* =====================================================
                SEARCH HEADER
            ====================================================== */}

            <section className="
                overflow-hidden
                rounded-2xl
                border
                border-slate-200
                bg-white
                shadow-sm
            ">


                {/* Header */}

                <div className="
                    flex
                    items-center
                    gap-3
                    border-b
                    border-slate-100
                    px-4
                    py-4

                    sm:px-5
                    sm:py-5
                ">

                    <div className="
                        flex
                        h-10
                        w-10
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        bg-blue-50
                        text-blue-600
                    ">

                        <ClipboardList
                            size={20}
                        />

                    </div>


                    <div>

                        <h2 className="
                            text-base
                            font-bold
                            text-slate-900

                            sm:text-lg
                        ">
                            Individual Inspection
                        </h2>

                        <p className="
                            mt-0.5
                            text-xs
                            text-slate-500

                            sm:text-sm
                        ">
                            Search and view a completed inspection report.
                        </p>

                    </div>

                </div>


                {/* =================================================
                    FILTERS
                ================================================== */}

                <div className="
                    bg-slate-50/60
                    p-4

                    sm:p-5
                ">

                    <div className="
                        grid
                        grid-cols-1
                        gap-3

                        sm:grid-cols-2
                        lg:grid-cols-3
                    ">


                        {/* ENGINEER */}

                        <div>

                            <label className="
                                mb-1.5
                                flex
                                items-center
                                gap-1.5

                                text-xs
                                font-bold
                                uppercase
                                tracking-wide
                                text-slate-500
                            ">

                                <UserRound
                                    size={14}
                                />

                                Engineer

                            </label>


                            <div className="relative">

                                <Search
                                    size={17}
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
                                    value={searchEngineer}
                                    onChange={(e) =>
                                        setSearchEngineer(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Search engineer name"
                                    className="
                                        h-11
                                        w-full
                                        rounded-xl
                                        border
                                        border-slate-200
                                        bg-white
                                        pl-10
                                        pr-3
                                        text-sm
                                        text-slate-800
                                        outline-none
                                        transition

                                        placeholder:text-slate-400

                                        focus:border-blue-500
                                        focus:ring-4
                                        focus:ring-blue-500/10
                                    "
                                />

                            </div>

                        </div>


                        {/* VEHICLE */}

                        <div>

                            <label className="
                                mb-1.5
                                flex
                                items-center
                                gap-1.5

                                text-xs
                                font-bold
                                uppercase
                                tracking-wide
                                text-slate-500
                            ">

                                <Truck
                                    size={14}
                                />

                                Vehicle

                            </label>


                            <div className="relative">

                                <Search
                                    size={17}
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
                                    value={searchVehicle}
                                    onChange={(e) =>
                                        setSearchVehicle(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Search vehicle"
                                    className="
                                        h-11
                                        w-full
                                        rounded-xl
                                        border
                                        border-slate-200
                                        bg-white
                                        pl-10
                                        pr-3
                                        text-sm
                                        text-slate-800
                                        outline-none
                                        transition

                                        placeholder:text-slate-400

                                        focus:border-blue-500
                                        focus:ring-4
                                        focus:ring-blue-500/10
                                    "
                                />

                            </div>

                        </div>


                        {/* DATE */}

                        <div>

                            <label className="
                                mb-1.5
                                flex
                                items-center
                                gap-1.5

                                text-xs
                                font-bold
                                uppercase
                                tracking-wide
                                text-slate-500
                            ">

                                <CalendarDays
                                    size={14}
                                />

                                Inspection Date

                            </label>


                            <input
                                type="date"
                                value={searchDate}
                                onChange={(e) =>
                                    setSearchDate(
                                        e.target.value
                                    )
                                }
                                className="
                                    h-11
                                    w-full
                                    rounded-xl
                                    border
                                    border-slate-200
                                    bg-white
                                    px-3
                                    text-sm
                                    text-slate-800
                                    outline-none
                                    transition

                                    focus:border-blue-500
                                    focus:ring-4
                                    focus:ring-blue-500/10
                                "
                            />

                        </div>

                    </div>


                    {/* FILTER FOOTER */}

                    <div className="
                        mt-4
                        flex
                        flex-col
                        gap-3

                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                    ">

                        <div className="
                            text-xs
                            text-slate-500
                        ">

                            {hasActiveFilter ? (

                                <>
                                    Found{" "}
                                    <span className="
                                        font-bold
                                        text-slate-800
                                    ">
                                        {filteredInspections.length}
                                    </span>{" "}
                                    matching inspection
                                    {filteredInspections.length !== 1
                                        ? "s"
                                        : ""}
                                </>

                            ) : (

                                "Enter at least one search criterion."

                            )}

                        </div>


                        {hasActiveFilter && (

                            <button
                                type="button"
                                onClick={clearFilters}
                                className="
                                    inline-flex
                                    items-center
                                    justify-center
                                    gap-2
                                    rounded-lg
                                    px-3
                                    py-2
                                    text-xs
                                    font-semibold
                                    text-slate-600
                                    transition

                                    hover:bg-slate-200
                                "
                            >

                                <RotateCcw
                                    size={14}
                                />

                                Clear Filters

                            </button>

                        )}

                    </div>

                </div>

            </section>


            {/* =====================================================
                NO SEARCH
            ====================================================== */}

            {!hasActiveFilter && (

                <div className="
                    rounded-2xl
                    border
                    border-dashed
                    border-slate-300
                    bg-slate-50
                    p-8
                    text-center

                    sm:p-12
                ">

                    <div className="
                        mx-auto
                        flex
                        h-14
                        w-14
                        items-center
                        justify-center
                        rounded-2xl
                        bg-blue-50
                        text-blue-600
                    ">

                        <Search
                            size={25}
                        />

                    </div>


                    <h3 className="
                        mt-4
                        text-base
                        font-bold
                        text-slate-800
                    ">
                        Search for an Inspection
                    </h3>


                    <p className="
                        mx-auto
                        mt-1
                        max-w-md
                        text-sm
                        leading-6
                        text-slate-500
                    ">
                        Enter an engineer name, vehicle number,
                        or inspection date to find a completed
                        inspection report.
                    </p>

                </div>

            )}


            {/* =====================================================
                NO RESULTS
            ====================================================== */}

            {hasActiveFilter &&
                filteredInspections.length === 0 && (

                    <div className="
                        rounded-2xl
                        border
                        border-slate-200
                        bg-white
                        p-8
                        text-center
                        shadow-sm

                        sm:p-12
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
                            No Inspections Found
                        </h3>


                        <p className="
                            mt-1
                            text-sm
                            text-slate-500
                        ">
                            No completed inspection matches
                            your search criteria.
                        </p>

                    </div>

                )}


            {/* =====================================================
                MOBILE RESULTS
            ====================================================== */}

            {filteredInspections.length > 0 && (

                <section className="
                    overflow-hidden
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    shadow-sm
                ">


                    {/* Results header */}

                    <div className="
                        flex
                        items-center
                        justify-between
                        border-b
                        border-slate-100
                        px-4
                        py-3

                        sm:px-5
                    ">

                        <div>

                            <p className="
                                text-[10px]
                                font-bold
                                uppercase
                                tracking-wider
                                text-blue-500
                            ">
                                Search Results
                            </p>

                            <p className="
                                text-sm
                                font-bold
                                text-slate-800
                            ">
                                {filteredInspections.length} Inspection
                                {filteredInspections.length !== 1
                                    ? "s"
                                    : ""}
                            </p>

                        </div>

                    </div>


                    {/* =================================================
                        MOBILE
                    ================================================== */}

                    <div className="
                        space-y-3
                        p-3

                        md:hidden
                    ">

                        {filteredInspections.map(
                            (item) => {

                                const fit =
                                    isFit(
                                        item.operational_status
                                    );

                                const selected =
                                    selectedInspection ===
                                    item.inspection_number;


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

                                        {/* Card header */}

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
                                                    Inspection Number
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


                                            <span
                                                className={`
                                                    inline-flex
                                                    shrink-0
                                                    items-center
                                                    gap-1.5
                                                    rounded-full
                                                    border
                                                    px-2.5
                                                    py-1.5
                                                    text-[10px]
                                                    font-bold
                                                    uppercase

                                                    ${
                                                        fit
                                                            ? "border-green-200 bg-green-50 text-green-700"
                                                            : "border-red-200 bg-red-50 text-red-700"
                                                    }
                                                `}
                                            >

                                                {fit ? (
                                                    <CheckCircle2
                                                        size={13}
                                                    />
                                                ) : (
                                                    <XCircle
                                                        size={13}
                                                    />
                                                )}

                                                {item.operational_status}

                                            </span>

                                        </div>


                                        {/* Details */}

                                        <div className="
                                            space-y-3
                                            px-4
                                            py-4
                                        ">

                                            <div className="
                                                flex
                                                items-center
                                                gap-3
                                            ">

                                                <Truck
                                                    size={17}
                                                    className="text-blue-600"
                                                />

                                                <div>

                                                    <p className="
                                                        text-[11px]
                                                        text-slate-400
                                                    ">
                                                        Vehicle
                                                    </p>

                                                    <p className="
                                                        text-sm
                                                        font-bold
                                                        text-slate-800
                                                    ">
                                                        {item.vehicle}
                                                    </p>

                                                </div>

                                            </div>


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
                                                        size={15}
                                                        className="text-slate-400"
                                                    />

                                                    <div>

                                                        <p className="
                                                            text-[10px]
                                                            text-slate-400
                                                        ">
                                                            Date
                                                        </p>

                                                        <p className="
                                                            text-xs
                                                            font-semibold
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

                                                    <UserRound
                                                        size={15}
                                                        className="text-slate-400"
                                                    />

                                                    <div className="
                                                        min-w-0
                                                    ">

                                                        <p className="
                                                            text-[10px]
                                                            text-slate-400
                                                        ">
                                                            Engineer
                                                        </p>

                                                        <p className="
                                                            truncate
                                                            text-xs
                                                            font-semibold
                                                            text-slate-700
                                                        ">
                                                            {item.engineer}
                                                        </p>

                                                    </div>

                                                </div>

                                            </div>


                                            <div className="
                                                flex
                                                items-center
                                                justify-between
                                                border-t
                                                border-slate-100
                                                pt-3
                                            ">

                                                <div>

                                                    <p className="
                                                        text-[10px]
                                                        text-slate-400
                                                    ">
                                                        Shift
                                                    </p>

                                                    <p className="
                                                        text-xs
                                                        font-semibold
                                                        text-slate-700
                                                    ">
                                                        {item.shift}
                                                    </p>

                                                </div>


                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleToggleReport(
                                                            item.inspection_number
                                                        )
                                                    }
                                                    className={`
                                                        inline-flex
                                                        items-center
                                                        gap-2
                                                        rounded-xl
                                                        px-4
                                                        py-2.5
                                                        text-xs
                                                        font-bold
                                                        transition

                                                        ${
                                                            selected
                                                                ? "bg-slate-200 text-slate-700 hover:bg-slate-300"
                                                                : "bg-blue-600 text-white hover:bg-blue-700"
                                                        }
                                                    `}
                                                >

                                                    {selected ? (
                                                        <EyeOff
                                                            size={15}
                                                        />
                                                    ) : (
                                                        <Eye
                                                            size={15}
                                                        />
                                                    )}

                                                    {selected
                                                        ? "Close"
                                                        : "View Report"
                                                    }

                                                </button>

                                            </div>


                                            {/* Embedded report */}

                                            {selected && (

                                                <div className="
                                                    border-t
                                                    border-slate-200
                                                    pt-4
                                                ">

                                                    <InspectionReport
                                                        inspectionNumber={
                                                            selectedInspection
                                                        }
                                                        embedded={true}
                                                    />

                                                </div>

                                            )}

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
                                        Engineer
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
                                        Status
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

                                {filteredInspections.map(
                                    (item) => {

                                        const fit =
                                            isFit(
                                                item.operational_status
                                            );

                                        const selected =
                                            selectedInspection ===
                                            item.inspection_number;


                                        return (

                                            <>

                                                <tr
                                                    key={item.id}
                                                    className={`
                                                        border-b
                                                        border-slate-100
                                                        transition

                                                        ${
                                                            selected
                                                                ? "bg-blue-50/70"
                                                                : "hover:bg-blue-50/30"
                                                        }
                                                    `}
                                                >

                                                    {/* Inspection */}

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
                                                                    text-[10px]
                                                                    text-slate-400
                                                                ">
                                                                    ID #{item.id}
                                                                </p>

                                                            </div>

                                                        </div>

                                                    </td>


                                                    {/* Engineer */}

                                                    <td className="
                                                        px-5
                                                        py-4
                                                        text-sm
                                                        text-slate-700
                                                    ">

                                                        {item.engineer}

                                                    </td>


                                                    {/* Vehicle */}

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


                                                    {/* Date */}

                                                    <td className="
                                                        px-5
                                                        py-4
                                                        text-sm
                                                        text-slate-600
                                                    ">

                                                        {item.inspection_date}

                                                    </td>


                                                    {/* Shift */}

                                                    <td className="
                                                        px-5
                                                        py-4
                                                    ">

                                                        <span className="
                                                            inline-flex
                                                            rounded-lg
                                                            border
                                                            border-slate-200
                                                            bg-slate-50
                                                            px-2.5
                                                            py-1
                                                            text-xs
                                                            font-semibold
                                                            text-slate-600
                                                        ">
                                                            {item.shift}
                                                        </span>

                                                    </td>


                                                    {/* Status */}

                                                    <td className="
                                                        px-5
                                                        py-4
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

                                                                ${
                                                                    fit
                                                                        ? "border-green-200 bg-green-50 text-green-700"
                                                                        : "border-red-200 bg-red-50 text-red-700"
                                                                }
                                                            `}
                                                        >

                                                            {fit ? (
                                                                <CheckCircle2
                                                                    size={14}
                                                                />
                                                            ) : (
                                                                <XCircle
                                                                    size={14}
                                                                />
                                                            )}

                                                            {item.operational_status}

                                                        </span>

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
                                                                handleToggleReport(
                                                                    item.inspection_number
                                                                )
                                                            }
                                                            className={`
                                                                inline-flex
                                                                items-center
                                                                gap-2
                                                                rounded-xl
                                                                px-4
                                                                py-2
                                                                text-xs
                                                                font-bold
                                                                transition

                                                                ${
                                                                    selected
                                                                        ? "bg-slate-200 text-slate-700 hover:bg-slate-300"
                                                                        : "bg-blue-600 text-white hover:bg-blue-700"
                                                                }
                                                            `}
                                                        >

                                                            {selected ? (
                                                                <EyeOff
                                                                    size={15}
                                                                />
                                                            ) : (
                                                                <Eye
                                                                    size={15}
                                                                />
                                                            )}

                                                            {selected
                                                                ? "Close"
                                                                : "View"
                                                            }

                                                        </button>

                                                    </td>

                                                </tr>


                                                {/* Expanded report */}

                                                {selected && (

                                                    <tr
                                                        key={`${item.id}-report`}
                                                    >

                                                        <td
                                                            colSpan={7}
                                                            className="
                                                                border-b
                                                                border-blue-200
                                                                p-0
                                                            "
                                                        >

                                                            <div className="
                                                                bg-slate-50
                                                                p-4

                                                                sm:p-6
                                                            ">

                                                                <InspectionReport
                                                                    inspectionNumber={
                                                                        selectedInspection
                                                                    }
                                                                    embedded={true}
                                                                />

                                                            </div>

                                                        </td>

                                                    </tr>

                                                )}

                                            </>

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