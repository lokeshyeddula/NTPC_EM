export default function ReportSelector() {
    return (
        <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-gray-800">
                    Reports Dashboard
                </h1>
                {/* Your tab buttons or selector components */}
            </div>

            <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                {/* Active report panel goes here */}
            </div>
        </div>
    );
}