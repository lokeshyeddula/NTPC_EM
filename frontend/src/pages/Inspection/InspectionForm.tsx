import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Select, { type StylesConfig } from "react-select";

import inspectionService, {
    type PendingReinspection,
} from "../../services/inspectionService";

import Checklist from "./Checklist";

import type {
    MachineryType,
    Vehicle,
} from "../../types/inspection";


interface SelectOption {
    value: string | number;
    label: string;
}


export default function InspectionForm() {

    const [searchParams] = useSearchParams();

    const [relay, setRelay] = useState("");

    const [machineryTypes, setMachineryTypes] =
        useState<MachineryType[]>([]);

    const [vehicles, setVehicles] =
        useState<Vehicle[]>([]);

    const [selectedMachinery, setSelectedMachinery] =
        useState<number | null>(null);

    const [selectedVehicle, setSelectedVehicle] =
        useState<number | null>(null);

    const [isLoadingMachinery, setIsLoadingMachinery] =
        useState(false);

    const [isLoadingVehicles, setIsLoadingVehicles] =
        useState(false);

    const [isCheckingStatus, setIsCheckingStatus] =
        useState(false);

    const [pendingReinspection, setPendingReinspection] =
        useState<PendingReinspection | null>(null);


    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {

        async function initializeForm() {

            setIsLoadingMachinery(true);

            try {

                const machinery =
                    await inspectionService.getMachineryTypes();

                setMachineryTypes(machinery);


                // ---------------------------------------------
                // CHECK URL PARAMETERS
                // ---------------------------------------------

                const machineId =
                    searchParams.get("machine_id");

                const vehicleId =
                    searchParams.get("vehicle_id");


                // ---------------------------------------------
                // OPENED FROM RE-INSPECTION PAGE
                // ---------------------------------------------

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


                    // Select machinery

                    setSelectedMachinery(
                        machineryId
                    );


                    // Load vehicles

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


                    // Select vehicle

                    setSelectedVehicle(
                        selectedVehicleId
                    );


                    // IMPORTANT:
                    // Check whether vehicle is currently UNFIT

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


    // =====================================================
    // CHECK VEHICLE STATUS
    // =====================================================

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

            /*
             * Backend response:
             *
             * {
             *   is_unfit: true,
             *   original_inspection_id: 123,
             *   failed_fields: [...]
             * }
             */

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


    // =====================================================
    // MACHINERY CHANGE
    // =====================================================

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


    // =====================================================
    // VEHICLE CHANGE
    // =====================================================

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


    // =====================================================
    // OPTIONS
    // =====================================================

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


    // =====================================================
    // SELECT STYLES
    // =====================================================

    const customSelectStyles:
        StylesConfig<SelectOption, false> = {

        control: (
            provided,
            state
        ) => {

            const isMobile =
                typeof window !== "undefined" &&
                window.innerWidth < 640;

            return {

                ...provided,

                minHeight:
                    isMobile
                        ? "2.5rem"
                        : "3rem",

                borderRadius:
                    "0.5rem",

                borderColor:
                    state.isFocused
                        ? "#2563eb"
                        : "#d1d5db",

                boxShadow:
                    state.isFocused
                        ? "0 0 0 2px rgba(37, 99, 235, 0.2)"
                        : "none",

                backgroundColor:
                    state.isDisabled
                        ? "#f9fafb"
                        : "#ffffff",

                cursor:
                    state.isDisabled
                        ? "not-allowed"
                        : "pointer",

                transition:
                    "all 0.2s ease",

                fontSize:
                    isMobile
                        ? "0.875rem"
                        : "1rem",

            };
        },


        option: (
            provided,
            state
        ) => {

            const isMobile =
                typeof window !== "undefined" &&
                window.innerWidth < 640;

            return {

                ...provided,

                backgroundColor:
                    state.isSelected
                        ? "#2563eb"
                        : state.isFocused
                            ? "#eff6ff"
                            : "transparent",

                color:
                    state.isSelected
                        ? "white"
                        : "#1f2937",

                cursor:
                    "pointer",

                padding:
                    isMobile
                        ? "8px 12px"
                        : "10px 14px",

                fontSize:
                    isMobile
                        ? "0.875rem"
                        : "1rem",

            };
        },


        menu: (
            provided
        ) => ({

            ...provided,

            borderRadius:
                "0.5rem",

            boxShadow:
                "0 10px 15px -3px rgba(0,0,0,0.1)",

            border:
                "1px solid #e5e7eb",

            overflow:
                "hidden",

            zIndex:
                50,

        }),


        valueContainer: (
            provided
        ) => ({

            ...provided,

            padding:
                "0 8px",

        }),
    };


    // =====================================================
    // RENDER
    // =====================================================

    return (

        <div className="space-y-6">

            {/* =================================================
                SELECTION CARD
            ================================================= */}

            <div className="bg-white sm:rounded-lg sm:shadow px-4 py-4 sm:p-6">

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">


                    {/* RELAY */}

                    <div>

                        <label className="block mb-2 text-sm font-semibold text-gray-700">
                            Relay
                        </label>

                        <Select
                            options={relayOptions}
                            placeholder="Select Relay..."
                            isSearchable={false}
                            styles={customSelectStyles}
                            value={
                                relayOptions.find(
                                    (item) =>
                                        item.value === relay
                                ) || null
                            }
                            onChange={(option) =>
                                setRelay(
                                    option
                                        ? String(option.value)
                                        : ""
                                )
                            }
                        />

                    </div>


                    {/* MACHINERY */}

                    <div>

                        <label className="block mb-2 text-sm font-semibold text-gray-700">
                            Machinery Type
                        </label>

                        <Select
                            options={machineryOptions}
                            placeholder="Search Machinery..."
                            isSearchable
                            isLoading={
                                isLoadingMachinery
                            }
                            styles={customSelectStyles}
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

                    </div>


                    {/* VEHICLE */}

                    <div>

                        <label className="block mb-2 text-sm font-semibold text-gray-700">
                            Door Number
                        </label>

                        <Select
                            options={vehicleOptions}
                            placeholder="Search Door Number..."
                            isSearchable
                            isDisabled={
                                !selectedMachinery
                            }
                            isLoading={
                                isLoadingVehicles ||
                                isCheckingStatus
                            }
                            styles={customSelectStyles}
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

                    </div>

                </div>

            </div>


            {/* =================================================
                REINSPECTION WARNING
            ================================================= */}

            {
                pendingReinspection?.is_unfit &&
                selectedVehicle &&

                <div className="bg-orange-50 border-l-4 border-orange-500 p-4 sm:p-6 rounded-r-lg shadow-sm">

                    <h3 className="text-lg font-bold text-orange-800 mb-1">
                        ⚠️ Targeted Re-inspection
                    </h3>

                    <p className="text-orange-700 text-sm sm:text-base">
                        This vehicle is currently marked as
                        UNFIT. Only the previously failed
                        checkpoints will be displayed for
                        re-inspection.
                    </p>

                    {
                        pendingReinspection.original_inspection_id &&

                        <p className="text-xs text-orange-600 mt-2">
                            Original Inspection ID:{" "}
                            {
                                pendingReinspection.original_inspection_id
                            }
                        </p>
                    }

                </div>
            }


            {/* =================================================
                CHECKLIST
            ================================================= */}

            {
                selectedMachinery &&
                selectedVehicle &&
                !isCheckingStatus &&

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
            }

        </div>
    );
}