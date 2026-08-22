import {
    CalendarDays,
    ClipboardCheck,
    Cog,
    Hash,
    UserRound,
    Truck,
    Radio,
    Clock3,
} from "lucide-react";

import type { InspectionReport } from "../../types/report";

interface Props {
    report: InspectionReport;
}

interface InfoItemProps {
    icon: React.ReactNode;
    label: string;
    value: string | number | null | undefined;
    highlight?: boolean;
}

function InfoItem({
    icon,
    label,
    value,
    highlight = false,
}: InfoItemProps) {
    return (
        <div
            className={`
                flex
                min-w-0
                items-start
                gap-3
                rounded-xl
                border
                p-3.5
                transition

                sm:p-4

                ${
                    highlight
                        ? "border-blue-200 bg-blue-50/50"
                        : "border-slate-200 bg-white"
                }
            `}
        >
            <div
                className={`
                    flex
                    h-9
                    w-9
                    shrink-0
                    items-center
                    justify-center
                    rounded-lg

                    ${
                        highlight
                            ? "bg-blue-100 text-blue-700"
                            : "bg-slate-100 text-slate-500"
                    }
                `}
            >
                {icon}
            </div>

            <div className="min-w-0 flex-1">

                <p className="
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-wider
                    text-slate-400

                    sm:text-[11px]
                ">
                    {label}
                </p>

                <p
                    className={`
                        mt-1
                        break-words
                        text-sm
                        font-bold

                        sm:text-base

                        ${
                            highlight
                                ? "text-blue-900"
                                : "text-slate-800"
                        }
                    `}
                >
                    {value || "N/A"}
                </p>

            </div>
        </div>
    );
}

export default function ReportInfo({ report }: Props) {

    return (
        <div className="bg-white">

            {/* =====================================================
                SECTION HEADER
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
                sm:py-4
            ">

                <div className="
                    flex
                    h-9
                    w-9
                    shrink-0
                    items-center
                    justify-center
                    rounded-lg
                    bg-blue-50
                    text-blue-700
                ">
                    <ClipboardCheck size={19} />
                </div>

                <div>

                    <h2 className="
                        text-base
                        font-bold
                        text-slate-900

                        sm:text-lg
                    ">
                        Inspection Information
                    </h2>

                    <p className="
                        mt-0.5
                        text-xs
                        text-slate-500
                    ">
                        Identification and inspection details
                    </p>

                </div>

            </div>


            {/* =====================================================
                INSPECTION IDENTIFICATION
            ====================================================== */}

            <div className="p-4 sm:p-5">

                <div className="
                    mb-3
                    flex
                    items-center
                    gap-2
                ">

                    <Hash
                        size={15}
                        className="text-blue-600"
                    />

                    <h3 className="
                        text-xs
                        font-bold
                        uppercase
                        tracking-wider
                        text-slate-500
                    ">
                        Inspection Identification
                    </h3>

                </div>


                <div className="
                    grid
                    grid-cols-1
                    gap-3

                    sm:grid-cols-2
                ">

                    <InfoItem
                        icon={<Hash size={17} />}
                        label="Inspection Number"
                        value={report.inspection_number}
                        highlight
                    />

                    <InfoItem
                        icon={<CalendarDays size={17} />}
                        label="Inspection Date"
                        value={report.inspection_date}
                    />

                </div>


                {/* =================================================
                    MACHINERY INFORMATION
                ================================================== */}

                <div className="
                    mb-3
                    mt-6
                    flex
                    items-center
                    gap-2
                ">

                    <Cog
                        size={15}
                        className="text-blue-600"
                    />

                    <h3 className="
                        text-xs
                        font-bold
                        uppercase
                        tracking-wider
                        text-slate-500
                    ">
                        Machinery Information
                    </h3>

                </div>


                <div className="
                    grid
                    grid-cols-1
                    gap-3

                    sm:grid-cols-2
                ">

                    <InfoItem
                        icon={<Cog size={17} />}
                        label="Machinery Type"
                        value={report.machinery_type}
                    />

                    <InfoItem
                        icon={<Truck size={17} />}
                        label="Vehicle Number"
                        value={report.vehicle}
                        highlight
                    />

                </div>


                {/* =================================================
                    INSPECTION DETAILS
                ================================================== */}

                <div className="
                    mb-3
                    mt-6
                    flex
                    items-center
                    gap-2
                ">

                    <ClipboardCheck
                        size={15}
                        className="text-blue-600"
                    />

                    <h3 className="
                        text-xs
                        font-bold
                        uppercase
                        tracking-wider
                        text-slate-500
                    ">
                        Inspection Details
                    </h3>

                </div>


                <div className="
                    grid
                    grid-cols-1
                    gap-3

                    sm:grid-cols-2
                    lg:grid-cols-3
                ">

                    <InfoItem
                        icon={<Clock3 size={17} />}
                        label="Shift"
                        value={report.shift}
                    />

                    <InfoItem
                        icon={<Radio size={17} />}
                        label="Relay"
                        value={report.relay}
                    />

                    <InfoItem
                        icon={<UserRound size={17} />}
                        label="Engineer"
                        value={report.engineer}
                    />

                    <InfoItem
                        icon={<UserRound size={17} />}
                        label="Designation"
                        value={report.designation}
                    />

                </div>

            </div>

        </div>
    );
}