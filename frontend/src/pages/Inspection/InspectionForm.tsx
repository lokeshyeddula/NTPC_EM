import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Select, { type StylesConfig } from "react-select";
import inspectionService, { type PendingReinspection } from "../../services/inspectionService";
import Checklist from "./Checklist";
import type { MachineryType, Vehicle } from "../../types/inspection";

interface SelectOption {
    value: string | number;
    label: string;
}

export default function InspectionForm() {
    const [searchParams] = useSearchParams();

    const [relay, setRelay] = useState("");
    const [machineryTypes, setMachineryTypes] = useState<MachineryType[]>([]);
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);

    const [selectedMachinery, setSelectedMachinery] = useState<number | null>(null);
    const [selectedVehicle, setSelectedVehicle] = useState<number | null>(null);

    const [isLoadingMachinery, setIsLoadingMachinery] = useState(false);
    const [isLoadingVehicles, setIsLoadingVehicles] = useState(false);
    const [isCheckingStatus, setIsCheckingStatus] = useState(false);

    const [pendingReinspection, setPendingReinspection] = useState<PendingReinspection | null>(null);

    useEffect(() => {
        async function initializeForm() {
            setIsLoadingMachinery(true);
            try {
                const mTypes = await inspectionService.getMachineryTypes();
                setMachineryTypes(mTypes);

                const urlMachineId = searchParams.get("machine_id");
                const urlVehicleId = searchParams.get("vehicle_id");

                if (urlMachineId && urlVehicleId) {
                    const mId = Number(urlMachineId);
                    const vId = Number(urlVehicleId);

                    setSelectedMachinery(mId);

                    setIsLoadingVehicles(true);
                    const vList = await inspectionService.getVehicles(mId.toString());
                    setVehicles(vList);
                    setIsLoadingVehicles(false);

                    setSelectedVehicle(vId);
                    checkVehicleStatus(vId);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoadingMachinery(false);
            }
        }

        initializeForm();
    }, [searchParams]);

    async function checkVehicleStatus(vehicleId: number) {
        setIsCheckingStatus(true);
        setPendingReinspection(null);
        try {
            const status = await inspectionService.checkVehicleStatus(vehicleId.toString());
            setPendingReinspection(status);
        } catch (err) {
            console.error("Failed to check vehicle status", err);
        } finally {
            setIsCheckingStatus(false);
        }
    }

    async function handleMachineryChange(option: SelectOption | null) {
        if (!option) {
            setSelectedMachinery(null);
            setSelectedVehicle(null);
            setVehicles([]);
            setPendingReinspection(null);
            return;
        }

        const machineryId = option.value as number;
        setSelectedMachinery(machineryId);
        setSelectedVehicle(null);
        setPendingReinspection(null);
        setIsLoadingVehicles(true);

        try {
            const data = await inspectionService.getVehicles(machineryId.toString());
            setVehicles(data);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoadingVehicles(false);
        }
    }

    function handleVehicleChange(option: SelectOption | null) {
        if (!option) {
            setSelectedVehicle(null);
            setPendingReinspection(null);
            return;
        }

        const vehicleId = option.value as number;
        setSelectedVehicle(vehicleId);
        checkVehicleStatus(vehicleId);
    }

    const relayOptions: SelectOption[] = [
        { value: "Relay A", label: "Relay A" },
        { value: "Relay B", label: "Relay B" },
        { value: "Relay C", label: "Relay C" },
        { value: "Relay D", label: "Relay D" },
        { value: "General Shift", label: "General Shift" },
    ];

    const machineryOptions: SelectOption[] = machineryTypes.map(item => ({
        value: item.id,
        label: item.name,
    }));

    const vehicleOptions: SelectOption[] = vehicles.map(item => ({
        value: item.id,
        label: item.machine_number,
    }));

    const customSelectStyles: StylesConfig<SelectOption, false> = {
        control: (provided, state) => ({
            ...provided,
            minHeight: '3rem',
            borderRadius: '0.5rem',
            borderColor: state.isFocused ? '#2563eb' : '#d1d5db',
            boxShadow: state.isFocused ? '0 0 0 2px rgba(37, 99, 235, 0.2)' : 'none',
            backgroundColor: state.isDisabled ? '#f9fafb' : '#ffffff',
            cursor: state.isDisabled ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease',
            '&:hover': {
                borderColor: state.isFocused ? '#2563eb' : '#9ca3af'
            }
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected ? '#2563eb' : state.isFocused ? '#eff6ff' : 'transparent',
            color: state.isSelected ? 'white' : '#1f2937',
            cursor: 'pointer',
            padding: '10px 14px',
            '&:active': { backgroundColor: '#dbeafe' }
        }),
        menu: (provided) => ({
            ...provided,
            borderRadius: '0.5rem',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            border: '1px solid #e5e7eb',
            overflow: 'hidden',
            zIndex: 50,
        }),
    };

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-4 sm:p-6">


                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    <div>
                        <label className="block mb-2 text-sm font-semibold text-gray-700">Relay</label>
                        <Select
                            options={relayOptions}
                            placeholder="Select Relay..."
                            isSearchable={false}
                            styles={customSelectStyles}
                            value={relayOptions.find(x => x.value === relay) || null}
                            onChange={(option) => setRelay(option ? (option.value as string) : "")}
                        />
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-semibold text-gray-700">Machinery Type</label>
                        <Select
                            options={machineryOptions}
                            placeholder="Search Machinery..."
                            isSearchable
                            isLoading={isLoadingMachinery}
                            styles={customSelectStyles}
                            value={machineryOptions.find(x => x.value === selectedMachinery) || null}
                            onChange={handleMachineryChange}
                        />
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-semibold text-gray-700">Door Number</label>
                        <Select
                            options={vehicleOptions}
                            placeholder="Search Door Number..."
                            isSearchable
                            isDisabled={!selectedMachinery}
                            isLoading={isLoadingVehicles || isCheckingStatus}
                            styles={customSelectStyles}
                            value={vehicleOptions.find(x => x.value === selectedVehicle) || null}
                            onChange={handleVehicleChange}
                        />
                    </div>
                </div>
            </div>

            {pendingReinspection?.is_unfit && selectedVehicle && (
                <div className="bg-orange-50 border-l-4 border-orange-500 p-4 sm:p-6 rounded-r-lg shadow-sm">
                    <h3 className="text-lg font-bold text-orange-800 mb-1">
                        ⚠️ Targeted Reinspection
                    </h3>
                    <p className="text-orange-700 text-sm sm:text-base">
                        This vehicle is currently marked as UNFIT. You are now performing a targeted reinspection on the previously failed checkpoints.
                    </p>
                </div>
            )}

            {selectedMachinery && selectedVehicle && !isCheckingStatus && (
                <Checklist
                    machineryType={selectedMachinery}
                    vehicle={selectedVehicle}
                    relay={relay}
                    pendingReinspection={pendingReinspection}
                />
            )}
        </div>
    );
}