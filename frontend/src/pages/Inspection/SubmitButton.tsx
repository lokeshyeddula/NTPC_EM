interface Props {

    onSubmit: () => void;

    loading: boolean;

}

export default function SubmitButton({

    onSubmit,

    loading,

}: Props) {

    return (

        <div className="flex justify-end mt-6">

            <button

                type="button"

                onClick={onSubmit}

                disabled={loading}

                className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-3 rounded-lg font-semibold disabled:opacity-50"

            >

                {loading
                    ? "Saving..."
                    : "Submit Inspection"}

            </button>

        </div>

    );

}