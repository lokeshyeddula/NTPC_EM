export default function ReportFooter() {

    return (

        <div className="bg-white rounded-lg shadow p-8 mb-8">

            <div className="grid grid-cols-3 gap-12 text-center">

                <div>

                    <div className="border-t-2 border-gray-500 mt-16"></div>

                    <p className="mt-3 font-semibold">

                        Engineer

                    </p>

                </div>

                <div>

                    <div className="border-t-2 border-gray-500 mt-16"></div>

                    <p className="mt-3 font-semibold">

                        Verified By

                    </p>

                </div>

                <div>

                    <div className="border-t-2 border-gray-500 mt-16"></div>

                    <p className="mt-3 font-semibold">

                        Approved By

                    </p>

                </div>

            </div>

        </div>

    );

}