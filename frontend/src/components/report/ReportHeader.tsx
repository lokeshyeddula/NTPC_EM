import ntpcLogo from "../../assets/ntpc_logo.png";
import nmlLogo from "../../assets/nml_logo.png";

export default function ReportHeader() {

    return (

        <div className="bg-white rounded-lg shadow mb-6">

            <div className="flex items-center justify-between p-6">

                <img
                    src={ntpcLogo}
                    alt="NTPC"
                    className="h-20"
                />

                <div className="text-center">

                    <h1 className="text-4xl font-bold text-blue-900">

                        NTPC MINING LIMITED

                    </h1>

                    <p className="text-lg">

                        (A Subsidiary of NTPC Limited)

                    </p>

                    <p className="text-lg">

                        Machinery Safety Inspection Report

                    </p>

                </div>

                <img
                    src={nmlLogo}
                    alt="NML"
                    className="h-20"
                />

            </div>

        </div>

    );

}