interface Props {
    onSubmit: () => void;
    loading: boolean;
}

export default function SubmitButton({
    onSubmit,
    loading,
}: Props) {
    return (
        <div className="flex justify-end mt-4 sm:mt-6">
            <button
                type="button"
                onClick={onSubmit}
                disabled={loading}
                className="w-full sm:w-auto bg-blue-700 hover:bg-blue-800 text-white px-8 py-3.5 sm:py-3 rounded-lg text-lg sm:text-base font-semibold shadow-sm transition-colors disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
                {loading ? "Saving..." : "Submit Inspection"}
            </button>
        </div>
    );
}