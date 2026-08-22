import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Select, { type StylesConfig } from "react-select";

import {
    ClipboardCheck,
    Truck,
    Radio,
    Hash,
    AlertTriangle,
    RefreshCw,
    ChevronRight,
} from "lucide-react";

import inspectionService, {
    type PendingReinspection,
} from "../../services/inspectionService";

import Checklist from "./Checklist";

import type {
    MachineryType,
    Vehicle,
} from "../../types/inspection";


/* ================================================================
   TYPES
================================================================ */

interface SelectOption {
    value: string | number;
    label: string;
}


/* ================================================================
   COMPONENT
================================================================ */

export default function InspectionForm() {

    const [searchParams] =
        useSearchParams();


    /* ============================================================
       FORM STATE
    ============================================================ */

    const [relay, setRelay] =
        useState("");

    const [machineryTypes, setMachineryTypes] =
        useState<MachineryType[]>([]);

    const [vehicles, setVehicles] =
        useState<Vehicle[]>([]);

    const [selectedMachinery, setSelectedMachinery] =
        useState<number | null>(null);

    const [selectedVehicle, setSelectedVehicle] =
        useState<number | null>(null);


    /* ============================================================
       LOADING STATE
    ============================================================ */

    const [isLoadingMachinery, setIsLoadingMachinery] =
        useState(false);

    const [isLoadingVehicles, setIsLoadingVehicles] =
        useState(false);

    const [isCheckingStatus, setIsCheckingStatus] =
        useState(false);


    /* ============================================================
       REINSPECTION
    ============================================================ */

    const [pendingReinspection, setPendingReinspection] =
        useState<PendingReinspection | null>(null);


    /* ============================================================
       INITIAL LOAD
    ============================================================ */

    useEffect(() => {

        async function initializeForm() {

            setIsLoadingMachinery(true);

            try {

                const machinery =
                    await inspectionService.getMachineryTypes();

                setMachineryTypes(machinery);


                /* ------------------------------------------------
                   CHECK URL PARAMETERS
                ------------------------------------------------ */

                const machineId =
                    searchParams.get("machine_id");

                const vehicleId =
                    searchParams.get("vehicle_id");


                /* ------------------------------------------------
                   OPENED FROM RE-INSPECTION
                ------------------------------------------------ */

                if (machineId && vehicleId) {

                    const machineryId =
                        Number(machineId);

                    const selectedVehicleId =
                        Number(vehicleId);


                    if (
                        Number.isNaN(machineryId) ||
                        Number.isNaN(selectedVehicleId)
                    ) {

                        return;

                    }


                    /* Select machinery */

                    setSelectedMachinery(
                        machineryId
                    );


                    /* Load vehicles */

                    setIsLoadingVehicles(true);

                    try {

                        const vehicleList =
                            await inspectionService.getVehicles(
                                machineryId.toString()
                            );

                        setVehicles(
                            vehicleList
                        );

                    } finally {

                        setIsLoadingVehicles(false);

                    }


                    /* Select vehicle */

                    setSelectedVehicle(
                        selectedVehicleId
                    );


                    /* Check current vehicle status */

                    await checkVehicleStatus(
                        selectedVehicleId
                    );

                }

            } catch (error) {

                console.error(
                    "Failed to initialize inspection form:",
                    error
                );

            } finally {

                setIsLoadingMachinery(false);

            }

        }


        initializeForm();

    }, [searchParams]);


    /* ============================================================
       CHECK VEHICLE STATUS
    ============================================================ */

    async function checkVehicleStatus(
        vehicleId: number
    ) {

        setIsCheckingStatus(true);

        setPendingReinspection(null);

        try {

            const response =
                await inspectionService.checkVehicleStatus(
                    vehicleId.toString()
                );


            setPendingReinspection(
                response
            );

        } catch (error) {

            console.error(
                "Failed to check vehicle status:",
                error
            );

            setPendingReinspection(
                null
            );

        } finally {

            setIsCheckingStatus(false);

        }

    }


    /* ============================================================
       MACHINERY CHANGE
    ============================================================ */

    async function handleMachineryChange(
        option: SelectOption | null
    ) {

        if (!option) {

            setSelectedMachinery(null);

            setSelectedVehicle(null);

            setVehicles([]);

            setPendingReinspection(null);

            return;

        }


        const machineryId =
            Number(option.value);


        setSelectedMachinery(
            machineryId
        );

        setSelectedVehicle(null);

        setPendingReinspection(null);

        setIsLoadingVehicles(true);


        try {

            const vehicleList =
                await inspectionService.getVehicles(
                    machineryId.toString()
                );

            setVehicles(
                vehicleList
            );

        } catch (error) {

            console.error(
                "Failed to load vehicles:",
                error
            );

            setVehicles([]);

        } finally {

            setIsLoadingVehicles(false);

        }

    }


    /* ============================================================
       VEHICLE CHANGE
    ============================================================ */

    function handleVehicleChange(
        option: SelectOption | null
    ) {

        if (!option) {

            setSelectedVehicle(null);

            setPendingReinspection(null);

            return;

        }


        const vehicleId =
            Number(option.value);


        setSelectedVehicle(
            vehicleId
        );


        checkVehicleStatus(
            vehicleId
        );

    }


    /* ============================================================
       OPTIONS
    ============================================================ */

    const relayOptions: SelectOption[] = [

        {
            value: "Relay A",
            label: "Relay A",
        },

        {
            value: "Relay B",
            label: "Relay B",
        },

        {
            value: "Relay C",
            label: "Relay C",
        },

        {
            value: "Relay D",
            label: "Relay D",
        },

        {
            value: "General Shift",
            label: "General Shift",
        },

    ];


    const machineryOptions: SelectOption[] =
        machineryTypes.map(
            (item) => ({
                value: item.id,
                label: item.name,
            })
        );


    const vehicleOptions: SelectOption[] =
        vehicles.map(
            (item) => ({
                value: item.id,
                label: item.machine_number,
            })
        );


    /* ============================================================
       SELECT STYLES
    ============================================================ */

    const customSelectStyles:
        StylesConfig<SelectOption, false> = {

        control: (
            provided,
            state
        ) => ({

            ...provided,

            minHeight:
                "52px",

            height:
                "52px",

            borderRadius:
                "12px",

            borderColor:
                state.isFocused
                    ? "#2563eb"
                    : "#cbd5e1",

            boxShadow:
                state.isFocused
                    ? "0 0 0 4px rgba(37, 99, 235, 0.10)"
                    : "none",

            backgroundColor:
                state.isDisabled
                    ? "#f8fafc"
                    : "#ffffff",

            cursor:
                state.isDisabled
                    ? "not-allowed"
                    : "pointer",

            transition:
                "all 0.2s ease",

            fontSize:
                "0.925rem",

            "&:hover": {

                borderColor:
                    state.isDisabled
                        ? "#cbd5e1"
                        : "#93c5fd",

            },

        }),


        option: (
            provided,
            state
        ) => ({

            ...provided,

            backgroundColor:
                state.isSelected
                    ? "#2563eb"
                    : state.isFocused
                        ? "#eff6ff"
                        : "white",

            color:
                state.isSelected
                    ? "white"
                    : "#1e293b",

            cursor:
                "pointer",

            padding:
                "10px 14px",

            fontSize:
                "0.9rem",

        }),


        menu: (
            provided
        ) => ({

            ...provided,

            marginTop:
                "6px",

            borderRadius:
                "12px",

            boxShadow:
                "0 15px 35px rgba(15, 23, 42, 0.14)",

            border:
                "1px solid #e2e8f0",

            overflow:
                "hidden",

            zIndex:
                9999,

        }),


        /*
         * IMPORTANT:
         * The dropdown is rendered into document.body.
         * This prevents the Inspection Setup card's
         * overflow-hidden from clipping the menu.
         */

        menuPortal: (
            provided
        ) => ({

            ...provided,

            zIndex:
                9999,

        }),


        menuList: (
            provided
        ) => ({

            ...provided,

            padding:
                "6px",

            maxHeight:
                "240px",

        }),


        valueContainer: (
            provided
        ) => ({

            ...provided,

            padding:
                "0 12px",

        }),


        placeholder: (
            provided
        ) => ({

            ...provided,

            color:
                "#94a3b8",

        }),


        singleValue: (
            provided
        ) => ({

            ...provided,

            color:
                "#0f172a",

            fontWeight:
                600,

        }),

    };


    /* ============================================================
       CURRENT STEP
    ============================================================ */

    const currentStep =
        !relay
            ? 1
            : !selectedMachinery
                ? 2
                : !selectedVehicle
                    ? 3
                    : 4;


    return (

        <div className="space-y-5 sm:space-y-6">


            {/* =====================================================
                INSPECTION SETUP CARD
            ====================================================== */}

            <section
                className="
                    overflow-hidden
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    shadow-sm
                "
            >


                {/* =================================================
                    SECTION HEADER
                ================================================= */}

                <div
                    className="
                        border-b
                        border-slate-200
                        px-5
                        py-5
                        sm:px-7
                    "
                >

                    <div
                        className="
                            flex
                            items-center
                            justify-between
                            gap-4
                        "
                    >

                        <div
                            className="
                                flex
                                items-center
                                gap-3
                            "
                        >

                            <div
                                className="
                                    flex
                                    h-10
                                    w-10
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-xl
                                    bg-blue-50
                                    text-blue-700
                                "
                            >

                                <ClipboardCheck
                                    size={21}
                                />

                            </div>


                            <div>

                                <h2
                                    className="
                                        text-base
                                        font-bold
                                        text-slate-900
                                        sm:text-lg
                                    "
                                >
                                    Inspection Setup
                                </h2>

                                <p
                                    className="
                                        text-xs
                                        text-slate-500
                                        sm:text-sm
                                    "
                                >
                                    Select the inspection details
                                    to continue.
                                </p>

                            </div>

                        </div>


                        {/* STEP INDICATOR */}

                        <div
                            className="
                                hidden
                                items-center
                                gap-2
                                sm:flex
                            "
                        >

                            <span
                                className="
                                    text-xs
                                    font-semibold
                                    uppercase
                                    tracking-wide
                                    text-slate-400
                                "
                            >
                                Step
                            </span>

                            <span
                                className="
                                    flex
                                    h-8
                                    min-w-8
                                    items-center
                                    justify-center
                                    rounded-full
                                    bg-blue-600
                                    px-2
                                    text-xs
                                    font-bold
                                    text-white
                                "
                            >
                                {Math.min(
                                    currentStep,
                                    4
                                )}
                            </span>

                            <span
                                className="
                                    text-xs
                                    text-slate-400
                                "
                            >
                                / 4
                            </span>

                        </div>

                    </div>

                </div>


                {/* =================================================
                    STEPS
                ================================================= */}

                <div
                    className="
                        grid
                        grid-cols-1
                        gap-5
                        px-5
                        py-6
                        sm:grid-cols-2
                        sm:px-7
                        lg:grid-cols-3
                    "
                >


                    {/* =================================================
                        STEP 1 — RELAY
                    ================================================= */}

                    <SelectionField
                        step="01"
                        icon={
                            <Radio
                                size={18}
                            />
                        }
                        label="Relay"
                        description="Select inspection relay"
                        active={!!relay}
                    >

                        <Select
                            options={
                                relayOptions
                            }

                            placeholder="Select Relay..."

                            isSearchable={false}

                            styles={
                                customSelectStyles
                            }

                            /*
                             * Render dropdown outside the card.
                             * This prevents desktop clipping.
                             */

                            menuPortalTarget={
                                document.body
                            }

                            menuPosition="fixed"

                            value={
                                relayOptions.find(
                                    (item) =>
                                        item.value ===
                                        relay
                                ) || null
                            }

                            onChange={(
                                option
                            ) =>
                                setRelay(
                                    option
                                        ? String(
                                            option.value
                                        )
                                        : ""
                                )
                            }

                        />

                    </SelectionField>


                    {/* =================================================
                        STEP 2 — MACHINERY
                    ================================================= */}

                    <SelectionField
                        step="02"
                        icon={
                            <Truck
                                size={18}
                            />
                        }
                        label="Machinery Type"
                        description="Select machinery category"
                        active={
                            !!selectedMachinery
                        }
                    >

                        <Select
                            options={
                                machineryOptions
                            }

                            placeholder={
                                isLoadingMachinery
                                    ? "Loading machinery..."
                                    : "Search Machinery..."
                            }

                            isSearchable

                            isLoading={
                                isLoadingMachinery
                            }

                            styles={
                                customSelectStyles
                            }

                            /*
                             * Render outside card.
                             */

                            menuPortalTarget={
                                document.body
                            }

                            menuPosition="fixed"

                            value={
                                machineryOptions.find(
                                    (item) =>
                                        item.value ===
                                        selectedMachinery
                                ) || null
                            }

                            onChange={
                                handleMachineryChange
                            }

                        />

                    </SelectionField>


                    {/* =================================================
                        STEP 3 — DOOR NUMBER
                    ================================================= */}

                    <SelectionField
                        step="03"
                        icon={
                            <Hash
                                size={18}
                            />
                        }
                        label="Door Number"
                        description={
                            selectedMachinery
                                ? "Select the vehicle"
                                : "Select machinery first"
                        }
                        active={
                            !!selectedVehicle
                        }
                        disabled={
                            !selectedMachinery
                        }
                    >

                        <Select
                            options={
                                vehicleOptions
                            }

                            placeholder={
                                !selectedMachinery
                                    ? "Select machinery first..."
                                    : isLoadingVehicles ||
                                      isCheckingStatus
                                        ? "Loading vehicles..."
                                        : "Search Door Number..."
                            }

                            isSearchable

                            isDisabled={
                                !selectedMachinery
                            }

                            isLoading={
                                isLoadingVehicles ||
                                isCheckingStatus
                            }

                            styles={
                                customSelectStyles
                            }

                            /*
                             * Render outside card.
                             */

                            menuPortalTarget={
                                document.body
                            }

                            menuPosition="fixed"

                            value={
                                vehicleOptions.find(
                                    (item) =>
                                        item.value ===
                                        selectedVehicle
                                ) || null
                            }

                            onChange={
                                handleVehicleChange
                            }

                        />

                    </SelectionField>

                </div>


                {/* =================================================
                    PROGRESS / STATUS
                ================================================= */}

                <div
                    className="
                        border-t
                        border-slate-100
                        bg-slate-50
                        px-5
                        py-4
                        sm:px-7
                    "
                >

                    <div
                        className="
                            flex
                            flex-col
                            gap-3
                            sm:flex-row
                            sm:items-center
                            sm:justify-between
                        "
                    >

                        {/* Progress */}

                        <div
                            className="
                                flex
                                items-center
                                gap-2
                            "
                        >

                            <StepDot
                                number="1"
                                active={
                                    !!relay
                                }
                            />

                            <ChevronRight
                                size={14}
                                className="text-slate-300"
                            />

                            <StepDot
                                number="2"
                                active={
                                    !!selectedMachinery
                                }
                            />

                            <ChevronRight
                                size={14}
                                className="text-slate-300"
                            />

                            <StepDot
                                number="3"
                                active={
                                    !!selectedVehicle
                                }
                            />

                        </div>


                        {/* Status */}

                        <div
                            className="
                                text-xs
                                font-medium
                                text-slate-500
                            "
                        >

                            {!relay && (
                                "Start by selecting a relay."
                            )}

                            {relay &&
                                !selectedMachinery && (
                                    "Now select the machinery type."
                                )}

                            {relay &&
                                selectedMachinery &&
                                !selectedVehicle && (
                                    "Now select the door number."
                                )}

                            {relay &&
                                selectedMachinery &&
                                selectedVehicle &&
                                !isCheckingStatus && (
                                    "Vehicle selected. Checklist ready."
                                )}

                            {isCheckingStatus && (
                                <span
                                    className="
                                        inline-flex
                                        items-center
                                        gap-2
                                        text-blue-600
                                    "
                                >

                                    <RefreshCw
                                        size={14}
                                        className="animate-spin"
                                    />

                                    Checking vehicle status...

                                </span>
                            )}

                        </div>

                    </div>

                </div>

            </section>


            {/* =====================================================
                REINSPECTION WARNING
            ====================================================== */}

            {
                pendingReinspection?.is_unfit &&
                selectedVehicle && (

                    <section
                        className="
                            overflow-hidden
                            rounded-2xl
                            border
                            border-orange-200
                            bg-orange-50
                            shadow-sm
                        "
                    >

                        <div
                            className="
                                border-l-4
                                border-orange-500
                                px-5
                                py-5
                                sm:px-6
                            "
                        >

                            <div
                                className="
                                    flex
                                    items-start
                                    gap-3
                                "
                            >

                                <div
                                    className="
                                        flex
                                        h-10
                                        w-10
                                        shrink-0
                                        items-center
                                        justify-center
                                        rounded-xl
                                        bg-orange-100
                                        text-orange-600
                                    "
                                >

                                    <AlertTriangle
                                        size={21}
                                    />

                                </div>


                                <div
                                    className="
                                        min-w-0
                                    "
                                >

                                    <h3
                                        className="
                                            text-base
                                            font-bold
                                            text-orange-900
                                            sm:text-lg
                                        "
                                    >
                                        Targeted Re-Inspection
                                    </h3>


                                    <p
                                        className="
                                            mt-1
                                            text-sm
                                            leading-6
                                            text-orange-800
                                        "
                                    >
                                        This vehicle is currently
                                        marked as <strong>UNFIT</strong>.
                                        Only the previously failed
                                        checkpoints will be displayed
                                        for re-inspection.
                                    </p>


                                    {
                                        pendingReinspection
                                            .original_inspection_id && (

                                            <div
                                                className="
                                                    mt-3
                                                    inline-flex
                                                    items-center
                                                    rounded-lg
                                                    bg-orange-100
                                                    px-3
                                                    py-1.5
                                                    text-xs
                                                    font-semibold
                                                    text-orange-800
                                                "
                                            >
                                                Original Inspection ID:
                                                <span className="ml-1">
                                                    {
                                                        pendingReinspection
                                                            .original_inspection_id
                                                    }
                                                </span>
                                            </div>

                                        )
                                    }

                                </div>

                            </div>

                        </div>

                    </section>

                )
            }


            {/* =====================================================
                CHECKLIST
            ====================================================== */}

            {
                selectedMachinery &&
                selectedVehicle &&
                !isCheckingStatus && (

                    <Checklist

                        machineryType={
                            selectedMachinery
                        }

                        vehicle={
                            selectedVehicle
                        }

                        relay={
                            relay
                        }

                        pendingReinspection={
                            pendingReinspection
                        }

                    />

                )
            }


            {/* =====================================================
                BOTTOM MOBILE SPACE
            ====================================================== */}

            <div className="h-4 sm:hidden" />

        </div>

    );
}


/* ================================================================
   SELECTION FIELD
================================================================ */

interface SelectionFieldProps {

    step: string;

    icon: React.ReactNode;

    label: string;

    description: string;

    active: boolean;

    disabled?: boolean;

    children: React.ReactNode;

}


function SelectionField({
    step,
    icon,
    label,
    description,
    active,
    disabled = false,
    children,
}: SelectionFieldProps) {

    return (

        <div
            className={`
                min-w-0
                rounded-xl
                border
                p-4
                transition

                ${
                    disabled
                        ? "border-slate-200 bg-slate-50/70"
                        : active
                            ? "border-blue-200 bg-blue-50/30"
                            : "border-slate-200 bg-white"
                }
            `}
        >

            {/* FIELD HEADER */}

            <div
                className="
                    mb-3
                    flex
                    items-start
                    justify-between
                    gap-3
                "
            >

                <div
                    className="
                        flex
                        min-w-0
                        items-center
                        gap-3
                    "
                >

                    <div
                        className={`
                            flex
                            h-9
                            w-9
                            shrink-0
                            items-center
                            justify-center
                            rounded-lg

                            ${
                                disabled
                                    ? "bg-slate-100 text-slate-400"
                                    : active
                                        ? "bg-blue-100 text-blue-700"
                                        : "bg-slate-100 text-slate-600"
                            }
                        `}
                    >

                        {icon}

                    </div>


                    <div className="min-w-0">

                        <div
                            className="
                                flex
                                items-center
                                gap-2
                            "
                        >

                            <span
                                className="
                                    text-[10px]
                                    font-bold
                                    tracking-widest
                                    text-slate-400
                                "
                            >
                                {step}
                            </span>

                            <span
                                className="
                                    truncate
                                    text-sm
                                    font-bold
                                    text-slate-800
                                "
                            >
                                {label}
                            </span>

                        </div>


                        <p
                            className="
                                mt-0.5
                                text-xs
                                text-slate-500
                            "
                        >
                            {description}
                        </p>

                    </div>

                </div>


                {active && (

                    <span
                        className="
                            shrink-0
                            rounded-full
                            bg-green-100
                            px-2
                            py-1
                            text-[10px]
                            font-bold
                            uppercase
                            tracking-wide
                            text-green-700
                        "
                    >
                        Selected
                    </span>

                )}

            </div>


            {/* SELECT */}

            {children}

        </div>

    );
}


/* ================================================================
   STEP DOT
================================================================ */

interface StepDotProps {

    number: string;

    active: boolean;

}


function StepDot({
    number,
    active,
}: StepDotProps) {

    return (

        <div
            className={`
                flex
                h-7
                w-7
                items-center
                justify-center
                rounded-full
                text-[10px]
                font-bold

                ${
                    active
                        ? "bg-blue-600 text-white"
                        : "bg-slate-200 text-slate-500"
                }
            `}
        >

            {number}

        </div>

    );
}
