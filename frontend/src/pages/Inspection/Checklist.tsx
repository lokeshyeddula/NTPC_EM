import { useEffect, useState } from "react";
import inspectionService from "../../services/inspectionService";
import ChecklistItem from "./ChecklistItem";
import type { ChecklistField } from "../../types/inspection";

interface Props {
    machineryType: number;
    vehicle: number;
    relay: string;
}

export default function Checklist({ machineryType, vehicle, relay }: Props) {
    const [fields, setFields] = useState<ChecklistField[]>([]);
    const [loading, setLoading] = useState(true);
    const [results, setResults] = useState<Record<number, "Pass" | "Fail">>({});

    const completedCount = Object.keys(results).length;
    const totalCount = fields.length;

    // Ensures it doesn't flag as completed if there are 0 fields
    const allCompleted = completedCount === totalCount && totalCount > 0;

    const operationalStatus =
        completedCount === 0
            ? "PENDING"
            : Object.values(results).includes("Fail")
            ? "UNFIT"
            : "FIT";

    useEffect(() => {
        loadChecklist();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [machineryType]);

    async function loadChecklist() {
        try {
            setLoading(true);
            const data = await inspectionService.getChecklist(machineryType.toString());
            setFields(data);
            setResults({});
        } catch (error) {
            console.error("Failed to fetch checklist:", error);
            setFields([]);
        } finally {
            setLoading(false);
        }
    }

    function handleResult(fieldId: number, result: "Pass" | "Fail") {
        setResults((prev) => ({
            ...prev,
            [fieldId]: result,
        }));
    }

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow p-6">
                Loading checklist...
            </div>
        );
    }

    if (fields.length === 0) {
        return (
            <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-6">
                No checklist available for this machinery.
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow p-6">
            {/* Merged Header Section */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold">
                        Inspection Checklist
                    </h2>
                    <p className="text-gray-500">
                        Select PASS or FAIL for every checkpoint.
                    </p>
                </div>

                <div className="flex flex-col items-end gap-3">
                    <div
                        className={`px-5 py-2 rounded-lg text-white font-bold text-center min-w-[120px] ${
                            operationalStatus === "FIT"
                                ? "bg-green-600"
                                : operationalStatus === "UNFIT"
                                ? "bg-red-600"
                                : "bg-yellow-500"
                        }`}
                    >
                        {operationalStatus}
                    </div>

                    <div
                        className={`px-4 py-1 rounded-full text-sm font-semibold text-white ${
                            allCompleted ? "bg-green-600" : "bg-orange-500"
                        }`}
                    >
                        {completedCount} / {totalCount} Completed
                    </div>
                </div>
            </div>

            {/* Checklist Items */}
            <div className="space-y-4">
                {fields.map((field) => (
                    <ChecklistItem
                        key={field.id}
                        fieldId={field.id}
                        fieldName={field.field_name}
                        value={results[field.id] || ""}
                        onChange={handleResult}
                    />
                ))}
            </div>
        </div>
    );
}