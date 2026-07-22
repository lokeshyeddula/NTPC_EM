import { useEffect, useState } from "react";
import Select from "react-select";

import inspectionService from "../../services/inspectionService";

import Checklist from "./Checklist";

import type {
    MachineryType,
    Vehicle,
} from "../../types/inspection";

interface SelectOption {
    value: number;
    label: string;
}

export default function InspectionForm() {

    const [relay, setRelay] = useState("");

    const [machineryTypes, setMachineryTypes] =
        useState<MachineryType[]>([]);

    const [vehicles, setVehicles] =
        useState<Vehicle[]>([]);

    const [selectedMachinery, setSelectedMachinery] =
        useState<number | null>(null);

    const [selectedVehicle, setSelectedVehicle] =
        useState<number | null>(null);

    useEffect(() => {

        loadMachineryTypes();

    }, []);

    async function loadMachineryTypes() {

        try {

            const data =
                await inspectionService.getMachineryTypes();

            setMachineryTypes(data);

        }

        catch (err) {

            console.error(err);

        }

    }

    async function handleMachineryChange(
        option: SelectOption | null
    ) {

        if (!option) {

            setSelectedMachinery(null);

            setSelectedVehicle(null);

            setVehicles([]);

            return;

        }

        setSelectedMachinery(option.value);

        setSelectedVehicle(null);

        try {

            const data =
                await inspectionService.getVehicles(
                    option.value.toString()
                );

            setVehicles(data);

        }

        catch (err) {

            console.error(err);

        }

    }

    const machineryOptions: SelectOption[] =
        machineryTypes.map(item => ({
            value: item.id,
            label: item.name,
        }));

    const vehicleOptions: SelectOption[] =
        vehicles.map(item => ({
            value: item.id,
            label: item.machine_number,
        }));

    return (

        <div className="space-y-6">

            <div className="bg-white rounded-lg shadow p-6">

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    {/* Relay */}

                    <div>

                        <label className="block mb-2 font-medium">

                            Relay

                        </label>

                        <select
                            className="w-full border rounded-lg p-3"
                            value={relay}
                            onChange={(e) =>
                                setRelay(e.target.value)
                            }
                        >

                            <option value="">
                                Select Relay
                            </option>

                            <option>Relay A</option>
                            <option>Relay B</option>
                            <option>Relay C</option>
                            <option>Relay D</option>
                            <option>General Shift</option>

                        </select>

                    </div>

                    {/* Machinery */}

                    <div>

                        <label className="block mb-2 font-medium">

                            Machinery Type

                        </label>

                        <Select

                            options={machineryOptions}

                            placeholder="Search Machinery..."

                            isSearchable

                            value={
                                machineryOptions.find(
                                    x =>
                                        x.value ===
                                        selectedMachinery
                                ) || null
                            }

                            onChange={handleMachineryChange}

                        />

                    </div>

                    {/* Vehicle */}

                    <div>

                        <label className="block mb-2 font-medium">

                            Door Number

                        </label>

                        <Select

                            options={vehicleOptions}

                            placeholder="Search Door Number..."

                            isSearchable

                            isDisabled={!selectedMachinery}

                            value={
                                vehicleOptions.find(
                                    x =>
                                        x.value ===
                                        selectedVehicle
                                ) || null
                            }

                            onChange={(option) =>
                                setSelectedVehicle(
                                    option
                                        ? option.value
                                        : null
                                )
                            }

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