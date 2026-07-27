interface Props {
    fieldId: number;
    fieldName: string;
    value: string;
    onChange: (fieldId: number, result: "Pass" | "Fail") => void;
}

export default function ChecklistItem({
    fieldId,
    fieldName,
    value,
    onChange,
}: Props) {
    return (
        <div className="bg-white sm:rounded-xl border-b sm:border border-gray-200 sm:shadow-sm py-4 sm:p-5 sm:mb-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">

                {/* Text Container */}
                <div className="w-full sm:flex-1 sm:pr-4">
                    <h3 className="font-semibold text-base sm:text-lg text-gray-800 leading-snug">
                        {fieldName}
                    </h3>
                </div>

                {/* Buttons Container */}
                <div className="flex gap-3 w-full sm:w-auto mt-2 sm:mt-0">
                    <button
                        type="button"
                        onClick={() => onChange(fieldId, "Pass")}
                        className={`flex-1 sm:flex-none sm:w-28 h-12 rounded-lg font-bold transition-all duration-200
                        ${
                            value === "Pass"
                                ? "bg-green-600 text-white shadow-md scale-[1.02]"
                                : "bg-green-100 text-green-700 hover:bg-green-200"
                        }`}
                    >
                        Pass
                    </button>

                    <button
                        type="button"
                        onClick={() => onChange(fieldId, "Fail")}
                        className={`flex-1 sm:flex-none sm:w-28 h-12 rounded-lg font-bold transition-all duration-200
                        ${
                            value === "Fail"
                                ? "bg-red-600 text-white shadow-md scale-[1.02]"
                                : "bg-red-100 text-red-700 hover:bg-red-200"
                        }`}
                    >
                        Fail
                    </button>
                </div>

            </div>
        </div>
    );
}