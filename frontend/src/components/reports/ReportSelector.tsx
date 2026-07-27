export default function ReportSelector() {
    return (
        <div className="space-y-6">
            <div className="bg-white sm:rounded-lg sm:shadow py-4 sm:p-6 border-b sm:border-none border-gray-200">
                <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-gray-800">
                    Reports Dashboard
                </h1>
                {/* Your tab buttons or selector components */}
            </div>

            <div className="bg-white sm:rounded-lg sm:shadow py-4 sm:p-6 border-b sm:border-none border-gray-200">
                {/* Active report panel goes here */}
            </div>
        </div>
    );
}