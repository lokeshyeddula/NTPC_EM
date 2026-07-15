interface Props {
    fieldId: number;
    fieldName: string;
    value: string;
    onChange: (
        fieldId: number,
        result: "Pass" | "Fail"
    ) => void;
}

export default function ChecklistItem({

    fieldId,

    fieldName,

    value,

    onChange,

}: Props) {

    return (

        <div className="bg-white rounded-xl border shadow-sm p-5 mb-4">

            <div className="flex justify-between items-center">

                <div>

                    <h3 className="font-semibold text-lg">

                        {fieldName}

                    </h3>

                </div>

                <div className="flex gap-3">

                    <button

                        type="button"

                        onClick={() =>
                            onChange(fieldId, "Pass")
                        }

                        className={`w-28 h-12 rounded-lg font-bold transition

                        ${
                            value === "Pass"

                                ? "bg-green-600 text-white"

                                : "bg-green-100 text-green-700 hover:bg-green-200"

                        }`}

                    >

                        PASS

                    </button>

                    <button

                        type="button"

                        onClick={() =>
                            onChange(fieldId, "Fail")
                        }

                        className={`w-28 h-12 rounded-lg font-bold transition

                        ${
                            value === "Fail"

                                ? "bg-red-600 text-white"

                                : "bg-red-100 text-red-700 hover:bg-red-200"

                        }`}

                    >

                        FAIL

                    </button>

                </div>

            </div>

        </div>

    );

}