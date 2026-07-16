interface Props {

    remarks: string;

    setRemarks: (value: string) => void;

    required: boolean;

}

export default function Remarks({

    remarks,

    setRemarks,

    required,

}: Props) {

    return (

        <div className="bg-white rounded-lg shadow p-6 mt-6">

            <label className="block font-semibold mb-3">

                Remarks

                {required && (

                    <span className="text-red-600 ml-2">

                        *

                    </span>

                )}

            </label>

            <textarea

                rows={4}

                value={remarks}

                onChange={(e) =>
                    setRemarks(e.target.value)
                }

                placeholder={
                    required
                        ? "Remarks are mandatory for UNFIT inspections..."
                        : "Additional remarks (optional)"
                }

                className="w-full border rounded-lg p-3 resize-none"

            />

        </div>

    );

}