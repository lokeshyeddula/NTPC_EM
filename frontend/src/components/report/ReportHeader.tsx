import ntpcLogo from "../../assets/Ntpc_logo.png";
import nmlLogo from "../../assets/nml_logo.png";

export default function ReportHeader() {
    return (
        <div className="bg-white">

            {/* =====================================================
                TOP BRANDING
            ====================================================== */}

            <div className="
                flex
                items-center
                justify-between
                gap-3
                border-b
                border-slate-200
                px-4
                py-4

                sm:px-6
                sm:py-5

                md:px-8
            ">

                {/* NTPC Logo */}

                <div className="
                    flex
                    w-20
                    shrink-0
                    items-center
                    justify-start

                    sm:w-28
                    md:w-32
                ">

                    <img
                        src={ntpcLogo}
                        alt="NTPC"
                        className="
                            h-11
                            w-auto
                            max-w-full
                            object-contain

                            sm:h-14

                            md:h-16
                        "
                    />

                </div>


                {/* CENTRAL TITLE */}

                <div className="
                    min-w-0
                    flex-1
                    text-center
                ">

                    <p className="
                        text-[9px]
                        font-bold
                        uppercase
                        tracking-[0.2em]
                        text-blue-700

                        sm:text-[10px]
                    ">
                        NIRIKSHAN
                    </p>


                    <h1 className="
                        mt-0.5
                        text-base
                        font-extrabold
                        leading-tight
                        text-slate-900

                        sm:text-xl

                        md:text-2xl
                    ">
                        NTPC MINING LIMITED
                    </h1>


                    <p className="
                        mt-0.5
                        text-[9px]
                        text-slate-500

                        sm:text-xs

                        md:text-sm
                    ">
                        (A Subsidiary of NTPC Limited)
                    </p>


                    <div className="
                        mx-auto
                        mt-2
                        h-px
                        w-16
                        bg-blue-600

                        sm:mt-3
                        sm:w-24
                    " />


                    <h2 className="
                        mt-2
                        text-xs
                        font-bold
                        uppercase
                        tracking-wide
                        text-slate-700

                        sm:text-sm

                        md:text-base
                    ">
                        Machinery Safety Inspection Report
                    </h2>

                </div>


                {/* NML Logo */}

                <div className="
                    flex
                    w-20
                    shrink-0
                    items-center
                    justify-end

                    sm:w-28
                    md:w-32
                ">

                    <img
                        src={nmlLogo}
                        alt="NML"
                        className="
                            h-11
                            w-auto
                            max-w-full
                            object-contain

                            sm:h-14

                            md:h-16
                        "
                    />

                </div>

            </div>


            {/* =====================================================
                REPORT IDENTIFICATION STRIP
            ====================================================== */}

            <div className="
                flex
                items-center
                justify-center
                bg-slate-50
                px-4
                py-2

                sm:py-2.5
            ">

                <div className="
                    flex
                    items-center
                    gap-2
                    text-center
                ">

                    <span className="
                        h-1.5
                        w-1.5
                        rounded-full
                        bg-blue-600
                    " />

                    <span className="
                        text-[9px]
                        font-semibold
                        uppercase
                        tracking-[0.16em]
                        text-slate-500

                        sm:text-[10px]
                    ">
                        Machinery Safety Inspection
                    </span>

                    <span className="
                        h-1.5
                        w-1.5
                        rounded-full
                        bg-blue-600
                    " />

                </div>

            </div>

        </div>
    );
}