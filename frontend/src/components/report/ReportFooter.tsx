export default function ReportFooter() {
    return (
        <div className="bg-white rounded-lg shadow p-6 sm:p-8 mb-6 sm:mb-8 mt-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12 text-center">
                <div>
                    <div className="border-t-2 border-gray-500 mt-8 sm:mt-16"></div>
                    <p className="mt-2 sm:mt-3 font-semibold text-sm sm:text-base text-gray-700">
                        Engineer
                    </p>
                </div>
                <div>
                    <div className="border-t-2 border-gray-500 mt-8 sm:mt-16"></div>
                    <p className="mt-2 sm:mt-3 font-semibold text-sm sm:text-base text-gray-700">
                        Approved By
                    </p>
                </div>
            </div>
        </div>
    );
}