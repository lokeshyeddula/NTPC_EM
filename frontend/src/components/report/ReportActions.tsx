import {
    ArrowLeft,
    Download,
    Printer,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import axios from "../../api/axios";

interface Props {
    inspectionNumber: string;
}

export default function ReportActions({
    inspectionNumber,
}: Props) {

    const navigate = useNavigate();

    async function downloadPDF() {

        try {

            const response = await axios.get(
                `/reports/pdf/inspection/${inspectionNumber}/`,
                {
                    responseType: "blob",
                }
            );

            const url =
                window.URL.createObjectURL(
                    response.data
                );

            const link =
                document.createElement("a");

            link.href = url;

            link.download =
                `${inspectionNumber}.pdf`;

            document.body.appendChild(link);

            link.click();

            link.remove();

            window.URL.revokeObjectURL(url);

        } catch (error) {

            console.error(
                "PDF download error:",
                error
            );

            alert(
                "Unable to download PDF. Please try again."
            );

        }
    }


    function handlePrint() {
        window.print();
    }


    return (

        <div className="
            print:hidden
            mb-5
        ">

            <div className="
                flex
                flex-col
                gap-3

                sm:flex-row
                sm:items-center
                sm:justify-between
            ">

                {/* =================================================
                    LEFT - BACK / REPORT IDENTIFICATION
                ================================================== */}

                <div className="
                    flex
                    items-center
                    gap-3
                ">

                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="
                            inline-flex
                            h-10
                            items-center
                            justify-center
                            gap-2
                            rounded-lg
                            border
                            border-slate-200
                            bg-white
                            px-3
                            text-sm
                            font-semibold
                            text-slate-600
                            shadow-sm
                            transition

                            hover:border-blue-300
                            hover:bg-blue-50
                            hover:text-blue-700

                            focus:outline-none
                            focus:ring-2
                            focus:ring-blue-500
                            focus:ring-offset-1
                        "
                    >

                        <ArrowLeft
                            size={17}
                        />

                        <span>
                            Back
                        </span>

                    </button>


                    <div className="
                        hidden
                        border-l
                        border-slate-200
                        pl-3

                        sm:block
                    ">

                        <p className="
                            text-[10px]
                            font-bold
                            uppercase
                            tracking-wider
                            text-slate-400
                        ">
                            Inspection Report
                        </p>

                        <p className="
                            mt-0.5
                            text-sm
                            font-bold
                            text-slate-800
                        ">
                            {inspectionNumber}
                        </p>

                    </div>

                </div>


                {/* =================================================
                    RIGHT - ACTIONS
                ================================================== */}

                <div className="
                    grid
                    grid-cols-2
                    gap-2

                    sm:flex
                    sm:gap-2
                ">

                    {/* DOWNLOAD */}

                    <button
                        type="button"
                        onClick={downloadPDF}
                        className="
                            inline-flex
                            h-10
                            items-center
                            justify-center
                            gap-2
                            rounded-lg
                            bg-blue-600
                            px-4
                            text-sm
                            font-semibold
                            text-white
                            shadow-sm
                            transition

                            hover:bg-blue-700
                            hover:shadow

                            focus:outline-none
                            focus:ring-2
                            focus:ring-blue-500
                            focus:ring-offset-1
                        "
                    >

                        <Download
                            size={17}
                        />

                        <span>
                            Download PDF
                        </span>

                    </button>


                    {/* PRINT */}

                    <button
                        type="button"
                        onClick={handlePrint}
                        className="
                            inline-flex
                            h-10
                            items-center
                            justify-center
                            gap-2
                            rounded-lg
                            border
                            border-slate-200
                            bg-white
                            px-4
                            text-sm
                            font-semibold
                            text-slate-700
                            shadow-sm
                            transition

                            hover:border-slate-300
                            hover:bg-slate-50
                            hover:text-slate-900

                            focus:outline-none
                            focus:ring-2
                            focus:ring-slate-400
                            focus:ring-offset-1
                        "
                    >

                        <Printer
                            size={17}
                        />

                        <span>
                            Print
                        </span>

                    </button>

                </div>

            </div>

        </div>
    );
}