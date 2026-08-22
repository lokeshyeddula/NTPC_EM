import {
    CheckCircle2,
    XCircle,
    ClipboardCheck,
} from "lucide-react";

interface Props {
    fieldId: number;
    fieldName: string;
    value: string;
    onChange: (
        fieldId: number,
        result: "Pass" | "Fail"
    ) => void;
}

export default function ChecklistItem({
    fieldId,
    fieldName,
    value,
    onChange,
}: Props) {

    const isPass = value === "Pass";
    const isFail = value === "Fail";
    const isPending = !value;


    return (

        <div
            className={`
                relative
                overflow-hidden

                rounded-xl

                border

                bg-white

                transition-all
                duration-200

                ${
                    isPass
                        ? "border-green-200 bg-green-50/40"
                        : isFail
                            ? "border-red-200 bg-red-50/40"
                            : "border-slate-200"
                }

                ${
                    isPending
                        ? "shadow-sm"
                        : "shadow-sm"
                }
            `}
        >

            {/* =====================================================
                STATUS STRIPE
            ====================================================== */}

            <div
                className={`
                    absolute
                    inset-y-0
                    left-0
                    w-1

                    ${
                        isPass
                            ? "bg-green-500"
                            : isFail
                                ? "bg-red-500"
                                : "bg-slate-200"
                    }
                `}
            />


            <div
                className="
                    flex
                    flex-col
                    gap-4

                    px-4
                    py-4
                    pl-5

                    sm:flex-row
                    sm:items-center
                    sm:justify-between

                    sm:gap-6
                    sm:px-5
                    sm:py-5
                    sm:pl-6
                "
            >

                {/* =================================================
                    LEFT — CHECKPOINT
                ================================================= */}

                <div
                    className="
                        flex
                        min-w-0
                        flex-1
                        items-start
                        gap-3
                    "
                >

                    {/* Number */}

                    <div
                        className={`
                            flex
                            h-9
                            w-9
                            shrink-0
                            items-center
                            justify-center

                            rounded-lg

                            text-xs
                            font-bold

                            ${
                                isPass
                                    ? "bg-green-100 text-green-700"
                                    : isFail
                                        ? "bg-red-100 text-red-700"
                                        : "bg-slate-100 text-slate-500"
                            }
                        `}
                    >

                        {fieldId}

                    </div>


                    {/* Text */}

                    <div
                        className="
                            min-w-0
                            pt-0.5
                        "
                    >

                        <div
                            className="
                                flex
                                items-center
                                gap-2
                            "
                        >

                            <ClipboardCheck
                                size={16}
                                className={`
                                    shrink-0

                                    ${
                                        isPass
                                            ? "text-green-600"
                                            : isFail
                                                ? "text-red-600"
                                                : "text-slate-400"
                                    }
                                `}
                            />

                            <h3
                                className={`
                                    text-sm
                                    font-semibold
                                    leading-5

                                    sm:text-base
                                    sm:leading-6

                                    ${
                                        isFail
                                            ? "text-red-900"
                                            : "text-slate-800"
                                    }
                                `}
                            >
                                {fieldName}
                            </h3>

                        </div>


                        {/* Status text */}

                        <p
                            className={`
                                mt-1
                                text-xs
                                font-medium

                                ${
                                    isPass
                                        ? "text-green-600"
                                        : isFail
                                            ? "text-red-600"
                                            : "text-slate-400"
                                }
                            `}
                        >

                            {isPass && "Checkpoint passed"}

                            {isFail && "Attention required — checkpoint failed"}

                            {isPending && "Awaiting inspection result"}

                        </p>

                    </div>

                </div>


                {/* =================================================
                    RIGHT — PASS / FAIL
                ================================================= */}

                <div
                    className="
                        grid
                        w-full
                        grid-cols-2
                        gap-2

                        sm:flex
                        sm:w-auto
                        sm:shrink-0
                        sm:gap-3
                    "
                >

                    {/* =================================================
                        PASS
                    ================================================= */}

                    <button
                        type="button"

                        onClick={() =>
                            onChange(
                                fieldId,
                                "Pass"
                            )
                        }

                        aria-pressed={
                            isPass
                        }

                        className={`
                            flex
                            h-12
                            items-center
                            justify-center
                            gap-2

                            rounded-xl

                            px-5

                            text-sm
                            font-bold

                            transition-all
                            duration-200

                            active:scale-[0.97]

                            sm:min-w-[120px]

                            ${
                                isPass
                                    ? `
                                        bg-green-600
                                        text-white
                                        shadow-md
                                        shadow-green-600/20
                                      `
                                    : `
                                        border
                                        border-green-200
                                        bg-green-50
                                        text-green-700

                                        hover:border-green-300
                                        hover:bg-green-100
                                      `
                            }
                        `}
                    >

                        <CheckCircle2
                            size={19}
                            strokeWidth={
                                isPass
                                    ? 2.5
                                    : 2
                            }
                        />

                        <span>
                            PASS
                        </span>

                    </button>


                    {/* =================================================
                        FAIL
                    ================================================= */}

                    <button
                        type="button"

                        onClick={() =>
                            onChange(
                                fieldId,
                                "Fail"
                            )
                        }

                        aria-pressed={
                            isFail
                        }

                        className={`
                            flex
                            h-12
                            items-center
                            justify-center
                            gap-2

                            rounded-xl

                            px-5

                            text-sm
                            font-bold

                            transition-all
                            duration-200

                            active:scale-[0.97]

                            sm:min-w-[120px]

                            ${
                                isFail
                                    ? `
                                        bg-red-600
                                        text-white
                                        shadow-md
                                        shadow-red-600/20
                                      `
                                    : `
                                        border
                                        border-red-200
                                        bg-red-50
                                        text-red-700

                                        hover:border-red-300
                                        hover:bg-red-100
                                      `
                            }
                        `}
                    >

                        <XCircle
                            size={19}
                            strokeWidth={
                                isFail
                                    ? 2.5
                                    : 2
                            }
                        />

                        <span>
                            FAIL
                        </span>

                    </button>

                </div>

            </div>

        </div>

    );
}