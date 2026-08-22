import {
    PenLine,
    ShieldCheck,
} from "lucide-react";

export default function ReportFooter() {
    return (
        <div className="
            bg-white
        ">

            {/* =====================================================
                SIGN-OFF HEADER
            ====================================================== */}

            <div className="
                flex
                items-center
                gap-3
                border-b
                border-slate-200
                px-4
                py-4

                sm:px-5
            ">

                <div className="
                    flex
                    h-9
                    w-9
                    shrink-0
                    items-center
                    justify-center
                    rounded-lg
                    bg-slate-100
                    text-slate-600
                ">

                    <PenLine size={18} />

                </div>


                <div>

                    <h2 className="
                        text-base
                        font-bold
                        text-slate-900

                        sm:text-lg
                    ">
                        Inspection Sign-Off
                    </h2>

                    <p className="
                        mt-0.5
                        text-xs
                        text-slate-500
                    ">
                        Verification and approval
                    </p>

                </div>

            </div>


            {/* =====================================================
                SIGNATURE AREA
            ====================================================== */}

            <div className="
                grid
                grid-cols-1
                gap-10
                p-5

                sm:grid-cols-3
                sm:gap-8
                sm:p-6

                md:p-8
            ">

                {/* =================================================
                    ENGINEER
                ================================================== */}

                <div className="
                    flex
                    flex-col
                    justify-end
                    text-center
                ">

                    <div className="
                        h-20

                        sm:h-24
                    " />

                    <div className="
                        border-t
                        border-slate-400
                    " />

                    <p className="
                        mt-2
                        text-sm
                        font-bold
                        text-slate-700
                    ">
                        Engineer
                    </p>

                    <p className="
                        mt-0.5
                        text-[11px]
                        text-slate-400
                    ">
                        Signature
                    </p>

                </div>


                {/* =================================================
                    APPROVED BY
                ================================================== */}

                <div className="
                    flex
                    flex-col
                    justify-end
                    text-center
                ">

                    <div className="
                        h-20

                        sm:h-24
                    " />

                    <div className="
                        border-t
                        border-slate-400
                    " />

                    <p className="
                        mt-2
                        text-sm
                        font-bold
                        text-slate-700
                    ">
                        Approved By
                    </p>

                    <p className="
                        mt-0.5
                        text-[11px]
                        text-slate-400
                    ">
                        Signature / Authorization
                    </p>

                </div>


                {/* =================================================
                    DATE / SEAL
                ================================================== */}

                <div className="
                    flex
                    flex-col
                    justify-end
                    text-center
                ">

                    <div className="
                        flex
                        h-20
                        items-center
                        justify-center

                        sm:h-24
                    ">

                        <div className="
                            flex
                            h-14
                            w-14
                            items-center
                            justify-center
                            rounded-full
                            border
                            border-dashed
                            border-slate-300
                            text-slate-300
                        ">

                            <ShieldCheck size={22} />

                        </div>

                    </div>


                    <div className="
                        border-t
                        border-slate-400
                    " />

                    <p className="
                        mt-2
                        text-sm
                        font-bold
                        text-slate-700
                    ">
                        Date / Official Seal
                    </p>

                    <p className="
                        mt-0.5
                        text-[11px]
                        text-slate-400
                    ">
                        Verification
                    </p>

                </div>

            </div>


            {/* =====================================================
                DOCUMENT NOTE
            ====================================================== */}

            <div className="
                border-t
                border-slate-100
                bg-slate-50
                px-4
                py-3
                text-center
            ">

                <p className="
                    text-[10px]
                    leading-4
                    text-slate-400

                    sm:text-[11px]
                ">
                    This inspection report is generated through the
                    NIRIKSHAN Machinery Safety Inspection System.
                </p>

            </div>

        </div>
    );
}