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
        <div className="bg-white rounded-lg border shadow-sm p-4 sm:p-6 mt-4 sm:mt-6">
            <label className="block text-base sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-3">
                Remarks
                {required && (
                    <span className="text-red-600 ml-1" aria-label="required">
                        *
                    </span>
                )}
            </label>
            <textarea
                rows={4}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder={
                    required
                        ? "Remarks are mandatory for UNFIT inspections..."
                        : "Additional remarks (optional)"
                }
                className="w-full border border-gray-300 rounded-lg p-3 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none resize-none transition-shadow"
            />
        </div>
    );
}