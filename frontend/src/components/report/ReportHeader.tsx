import ntpcLogo from "../../assets/ntpc_logo.png";
import nmlLogo from "../../assets/nml_logo.png";

export default function ReportHeader() {
    return (
        <div className="bg-white rounded-lg shadow mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row items-center justify-between p-4 sm:p-6 gap-4 sm:gap-0">
                <img
                    src={ntpcLogo}
                    alt="NTPC"
                    className="h-14 sm:h-20 object-contain"
                />

                <div className="text-center order-last sm:order-none">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-900 leading-tight">
                        NTPC MINING LIMITED
                    </h1>
                    <p className="text-sm sm:text-base md:text-lg text-gray-700 mt-1">
                        (A Subsidiary of NTPC Limited)
                    </p>
                    <p className="text-base sm:text-lg font-medium text-gray-800 mt-2">
                        Machinery Safety Inspection Report
                    </p>
                </div>

                <img
                    src={nmlLogo}
                    alt="NML"
                    className="h-14 sm:h-20 object-contain hidden sm:block"
                />
            </div>
        </div>
    );
}