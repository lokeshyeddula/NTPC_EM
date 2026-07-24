import { useEffect, useState } from "react";
import Select, { type StylesConfig } from "react-select";
import inspectionService from "../../services/inspectionService";
import Checklist from "./Checklist";
import type { MachineryType, Vehicle } from "../../types/inspection";

// Updated to accept both string and number values
interface SelectOption {
    value: string | number;
    label: string;
}

export default function InspectionForm() {
    const [relay, setRelay] = useState("");

    // Data States
    const [machineryTypes, setMachineryTypes] = useState<MachineryType[]>([]);
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);

    // Selection States
    const [selectedMachinery, setSelectedMachinery] = useState<number | null>(null);
    const [selectedVehicle, setSelectedVehicle] = useState<number | null>(null);

    // Loading States
    const [isLoadingMachinery, setIsLoadingMachinery] = useState(false);
    const [isLoadingVehicles, setIsLoadingVehicles] = useState(false);

    useEffect(() => {
        loadMachineryTypes();
    }, []);

    async function loadMachineryTypes() {
        setIsLoadingMachinery(true);
        try {
            const data = await inspectionService.getMachineryTypes();
            setMachineryTypes(data);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoadingMachinery(false);
        }
    }

    async function handleMachineryChange(option: SelectOption | null) {
        if (!option) {
            setSelectedMachinery(null);
            setSelectedVehicle(null);
            setVehicles([]);
            return;
        }

        // We know Machinery values are numbers based on our API
        const machineryId = option.value as number;
        setSelectedMachinery(machineryId);
        setSelectedVehicle(null);
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

    // --- Options Arrays ---
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

    // --- Beautified React-Select Styles ---
    const customSelectStyles: StylesConfig<SelectOption, false> = {
        control: (provided, state) => ({
            ...provided,
            minHeight: '3rem', // 48px height to match Tailwind's standard inputs
            borderRadius: '0.5rem',
            borderColor: state.isFocused ? '#2563eb' : '#d1d5db', // blue-600 or gray-300
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
            backgroundColor: state.isSelected
                ? '#2563eb' // blue-600 when selected
                : state.isFocused
                    ? '#eff6ff' // blue-50 on hover
                    : 'transparent',
            color: state.isSelected ? 'white' : '#1f2937', // gray-800
            cursor: 'pointer',
            padding: '10px 14px',
            '&:active': {
                backgroundColor: '#dbeafe', // blue-100 when clicked
            }
        }),
        menu: (provided) => ({
            ...provided,
            borderRadius: '0.5rem',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            border: '1px solid #e5e7eb',
            overflow: 'hidden',
            zIndex: 50,
        }),
        menuList: (provided) => ({
            ...provided,
            padding: '4px', // slight padding inside the popup menu
        }),
        valueContainer: (provided) => ({
            ...provided,
            padding: '0 0.75rem',
        }),
        input: (provided) => ({
            ...provided,
            margin: '0',
            padding: '0',
        }),
        placeholder: (provided) => ({
            ...provided,
            color: '#9ca3af', // gray-400
        }),
        singleValue: (provided) => ({
            ...provided,
            color: '#111827', // gray-900
            fontWeight: 500,
        })
    };

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 border border-gray-100">

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

                    {/* Beautified Relay Dropdown */}
                    <div>
                        <label className="block mb-2 text-sm font-semibold text-gray-700">
                            Relay
                        </label>
                        <Select
                            options={relayOptions}
                            placeholder="Select Relay..."
                            isSearchable={false} // No need to search just 5 options
                            styles={customSelectStyles}
                            value={relayOptions.find(x => x.value === relay) || null}
                            onChange={(option) => setRelay(option ? (option.value as string) : "")}
                        />
                    </div>

                    {/* Beautified Machinery Type Dropdown */}
                    <div>
                        <label className="block mb-2 text-sm font-semibold text-gray-700">
                            Machinery Type
                        </label>
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

                    {/* Beautified Door Number Dropdown */}
                    <div>
                        <label className="block mb-2 text-sm font-semibold text-gray-700">
                            Door Number
                        </label>
                        <Select
                            options={vehicleOptions}
                            placeholder="Search Door Number..."
                            isSearchable
                            isDisabled={!selectedMachinery}
                            isLoading={isLoadingVehicles}
                            styles={customSelectStyles}
                            value={vehicleOptions.find(x => x.value === selectedVehicle) || null}
                            onChange={(option) => setSelectedVehicle(option ? (option.value as number) : null)}
                        />
                    </div>
                </div>
            </div>

            {selectedMachinery && selectedVehicle && (
                <Checklist
                    machineryType={selectedMachinery}
                    vehicle={selectedVehicle}
                    relay={relay}
                />
            )}
        </div>
    );
}