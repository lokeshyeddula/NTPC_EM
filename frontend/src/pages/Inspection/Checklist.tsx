import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    ShieldCheck,
    ClipboardCheck,
    UserRound,
    Building2,
    Phone,
    IdCard,
    FileText,
    CheckCircle2,
    AlertTriangle,
    Clock3,
    RefreshCcw,
} from "lucide-react";

import inspectionService, {
    type PendingReinspection,
} from "../../services/inspectionService";

import ChecklistItem from "./ChecklistItem";
import Remarks from "./Remarks";
import SubmitButton from "./SubmitButton";

import type {
    ChecklistField,
    InspectionPayload,
} from "../../types/inspection";


interface Props {
    machineryType: number;
    vehicle: number;
    relay: string;
    pendingReinspection: PendingReinspection | null;
}


export default function Checklist({
    machineryType,
    vehicle,
    relay,
    pendingReinspection,
}: Props) {

    const navigate = useNavigate();


    // =========================================================
    // STATE
    // =========================================================

    const [fields, setFields] =
        useState<ChecklistField[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [results, setResults] =
        useState<
            Record<
                number,
                "Pass" | "Fail"
            >
        >({});


    const [remarks, setRemarks] =
        useState("");


    const [operatorName, setOperatorName] =
        useState("");

    const [operatorEmployeeId, setOperatorEmployeeId] =
        useState("");

    const [operatorAgency, setOperatorAgency] =
        useState("");

    const [operatorMobile, setOperatorMobile] =
        useState("");

    const [operatorChecklistFilled, setOperatorChecklistFilled] =
        useState(true);

    const [operatorRemarks, setOperatorRemarks] =
        useState("");


    const [saving, setSaving] =
        useState(false);


    // =========================================================
    // RE-INSPECTION
    // =========================================================

    const isReinspection =
        pendingReinspection?.is_unfit === true;


    const parentInspectionId =
        isReinspection
            ? pendingReinspection
                ?.original_inspection_id ?? null
            : null;


    // =========================================================
    // CHECKLIST COUNTER
    // =========================================================

    const completedCount =
        Object.keys(results).length;


    const totalCount =
        fields.length;


    const allCompleted =
        completedCount === totalCount &&
        totalCount > 0;


    const completionPercentage =
        totalCount > 0
            ? Math.round(
                (completedCount / totalCount) * 100
            )
            : 0;


    // =========================================================
    // OPERATIONAL STATUS
    // =========================================================

    const operationalStatus:
        "Fit" |
        "Unfit" |
        "Pending" =

        Object.values(results).includes("Fail")

            ? "Unfit"

            : allCompleted

                ? "Fit"

                : "Pending";


    const remarksRequired =
        operationalStatus === "Unfit";


    // =========================================================
    // LOAD CHECKLIST
    // =========================================================

    useEffect(() => {

        let cancelled = false;


        async function loadChecklist() {

            setLoading(true);

            setResults({});


            // -------------------------------------------------
            // RE-INSPECTION
            // -------------------------------------------------

            if (
                pendingReinspection?.is_unfit === true &&
                pendingReinspection.failed_fields
            ) {

                if (!cancelled) {

                    setFields(
                        pendingReinspection.failed_fields.map(
                            (field) => ({
                                id: field.id,
                                field_name: field.field_name,
                                display_order: 0,
                            })
                        )
                    );

                    setLoading(false);
                }

                return;
            }


            // -------------------------------------------------
            // NORMAL INSPECTION
            // -------------------------------------------------

            try {

                const data =
                    await inspectionService.getChecklist(
                        machineryType.toString()
                    );


                if (!cancelled) {

                    setFields(data);

                }

            } catch (error) {

                console.error(
                    "Failed to fetch checklist:",
                    error
                );


                if (!cancelled) {

                    setFields([]);

                }

            } finally {

                if (!cancelled) {

                    setLoading(false);

                }

            }

        }


        loadChecklist();


        return () => {

            cancelled = true;

        };

    }, [
        machineryType,
        pendingReinspection,
    ]);


    // =========================================================
    // HANDLE RESULT
    // =========================================================

    function handleResult(
        fieldId: number,
        result: "Pass" | "Fail"
    ) {

        setResults(
            (previous) => ({
                ...previous,
                [fieldId]: result,
            })
        );

    }


    // =========================================================
    // SUBMIT
    // =========================================================

    async function handleSubmit() {

        // -------------------------------------------------
        // PREVENT DOUBLE SUBMISSION
        // -------------------------------------------------

        if (saving) {
            return;
        }


        // -------------------------------------------------
        // RELAY
        // -------------------------------------------------

        if (!relay) {

            alert(
                "Please select a Relay."
            );

            return;
        }


        // -------------------------------------------------
        // OPERATOR DETAILS
        // -------------------------------------------------

        if (!isReinspection) {

            if (!operatorName.trim()) {

                alert(
                    "Please enter Operator Name."
                );

                return;
            }


            if (!operatorEmployeeId.trim()) {

                alert(
                    "Please enter Employee ID."
                );

                return;
            }


            if (!operatorAgency.trim()) {

                alert(
                    "Please enter Agency Name."
                );

                return;
            }

        }


        // -------------------------------------------------
        // CHECKLIST
        // -------------------------------------------------

        if (!allCompleted) {

            alert(
                "Please complete all checklist items."
            );

            return;
        }


        // -------------------------------------------------
        // REMARKS
        // -------------------------------------------------

        if (
            remarksRequired &&
            !remarks.trim()
        ) {

            alert(
                "Remarks are mandatory for UNFIT inspection."
            );

            return;
        }


        // -------------------------------------------------
        // RE-INSPECTION VALIDATION
        // -------------------------------------------------

        if (
            isReinspection &&
            !parentInspectionId
        ) {

            alert(
                "Original inspection information is missing. Please return to the Re-Inspection page and try again."
            );

            return;
        }


        // -------------------------------------------------
        // RESULTS
        // -------------------------------------------------

        const inspectionResults =
            fields.map(
                (field) => ({

                    inspection_field:
                        field.id,

                    result:
                        results[field.id],

                })
            );


        // -------------------------------------------------
        // PAYLOAD
        // -------------------------------------------------

        const payload:
            InspectionPayload = {

            relay,

            vehicle,

            operational_status:
                operationalStatus as
                    "Fit" |
                    "Unfit",

            operator_name:
                isReinspection
                    ? "N/A (Reinspection)"
                    : operatorName,

            operator_employee_id:
                isReinspection
                    ? "N/A"
                    : operatorEmployeeId,

            operator_agency:
                isReinspection
                    ? "N/A"
                    : operatorAgency,

            operator_mobile:
                isReinspection
                    ? ""
                    : operatorMobile,

            operator_checklist_filled:
                isReinspection
                    ? true
                    : operatorChecklistFilled,

            operator_remarks:
                isReinspection
                    ? ""
                    : operatorRemarks,

            remarks,

            results: inspectionResults,

            is_reinspection:
                isReinspection,

            parent_inspection_id:
                parentInspectionId,

        };


        // -------------------------------------------------
        // SAVE
        // -------------------------------------------------

        try {

            setSaving(true);


            console.log(
                "Submitting inspection:",
                payload
            );


            const response =
                await inspectionService.createInspection(
                    payload
                );


            // -------------------------------------------------
            // SUCCESS
            // -------------------------------------------------

            alert(
                `${
                    isReinspection
                        ? "Re-inspection"
                        : "Inspection"
                } Saved Successfully\n\n` +

                `Inspection Number: ` +
                response.inspection_number
            );


            /*
             * IMPORTANT:
             *
             * Keep React Router navigation here.
             *
             * Do NOT use window.location.href.
             */

            navigate(
                "/Re-Inspection",
                {
                    replace: true,
                }
            );


        } catch (error: any) {

            console.error(
                "Inspection submission failed:",
                error
            );


            // -------------------------------------------------
            // BACKEND VALIDATION MESSAGE
            // -------------------------------------------------

            const backendError =
                error?.response?.data;


            if (backendError) {

                if (
                    backendError.parent_inspection_id
                ) {

                    alert(
                        backendError.parent_inspection_id
                    );


                } else if (
                    backendError.remarks
                ) {

                    alert(
                        backendError.remarks
                    );


                } else if (
                    backendError.detail
                ) {

                    alert(
                        backendError.detail
                    );


                } else if (
                    backendError.error
                ) {

                    alert(
                        backendError.error
                    );


                } else {

                    alert(
                        "Failed to save inspection."
                    );

                }

            } else {

                alert(
                    "Failed to save inspection. Please try again."
                );

            }

        } finally {

            setSaving(false);

        }

    }


    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {

        return (

            <div className="
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-6
                shadow-sm
            ">

                <div className="
                    flex
                    items-center
                    justify-center
                    gap-3
                    py-10
                ">

                    <div className="
                        h-8
                        w-8
                        animate-spin
                        rounded-full
                        border-4
                        border-blue-600
                        border-t-transparent
                    " />

                    <p className="
                        text-sm
                        font-medium
                        text-slate-600
                    ">
                        Loading inspection checklist...
                    </p>

                </div>

            </div>

        );

    }


    // =========================================================
    // EMPTY CHECKLIST
    // =========================================================

    if (fields.length === 0) {

        return (

            <div className="
                rounded-2xl
                border
                border-amber-200
                bg-amber-50
                p-6
            ">

                <div className="
                    flex
                    items-start
                    gap-3
                ">

                    <AlertTriangle
                        className="text-amber-600 shrink-0"
                        size={22}
                    />

                    <div>

                        <h3 className="
                            font-bold
                            text-amber-900
                        ">
                            No Checklist Available
                        </h3>

                        <p className="
                            mt-1
                            text-sm
                            text-amber-700
                        ">
                            No inspection checklist was found
                            for the selected machinery.
                        </p>

                    </div>

                </div>

            </div>

        );

    }


    // =========================================================
    // UI
    // =========================================================

    return (

        <div className="
            w-full
            space-y-4
            sm:space-y-6
        ">


            {/* =====================================================
                CHECKLIST HEADER
            ====================================================== */}

            <section className="
                overflow-hidden
                rounded-2xl
                border
                border-slate-200
                bg-white
                shadow-sm
            ">

                {/* Header */}

                <div className="
                    bg-gradient-to-r
                    from-slate-950
                    via-blue-950
                    to-blue-800
                    px-4
                    py-5
                    sm:px-6
                    sm:py-6
                ">

                    <div className="
                        flex
                        flex-col
                        gap-5
                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                    ">


                        {/* Title */}

                        <div className="
                            flex
                            items-start
                            gap-3
                        ">

                            <div className="
                                flex
                                h-11
                                w-11
                                shrink-0
                                items-center
                                justify-center
                                rounded-xl
                                bg-white/10
                                ring-1
                                ring-white/20
                            ">

                                {isReinspection ? (

                                    <RefreshCcw
                                        size={23}
                                        className="text-blue-200"
                                    />

                                ) : (

                                    <ShieldCheck
                                        size={23}
                                        className="text-blue-200"
                                    />

                                )}

                            </div>


                            <div>

                                <div className="
                                    text-[11px]
                                    font-bold
                                    uppercase
                                    tracking-[0.18em]
                                    text-blue-200
                                ">
                                    NIRIKSHAN
                                </div>


                                <h2 className="
                                    mt-0.5
                                    text-xl
                                    font-bold
                                    text-white
                                    sm:text-2xl
                                ">

                                    {isReinspection
                                        ? "Targeted Re-Inspection"
                                        : "Inspection Checklist"
                                    }

                                </h2>


                                <p className="
                                    mt-1
                                    text-xs
                                    leading-5
                                    text-blue-100/80
                                    sm:text-sm
                                ">

                                    {isReinspection
                                        ? "Verify the previously failed checkpoints."
                                        : "Complete every safety checkpoint before submission."
                                    }

                                </p>

                            </div>

                        </div>


                        {/* Status */}

                        <div className="
                            flex
                            items-center
                            gap-2
                            sm:flex-col
                            sm:items-end
                        ">

                            <div
                                className={`
                                    flex
                                    items-center
                                    gap-2
                                    rounded-full
                                    px-4
                                    py-2
                                    text-xs
                                    font-bold
                                    shadow-sm

                                    ${
                                        operationalStatus === "Fit"
                                            ? "bg-green-500 text-white"
                                            : operationalStatus === "Unfit"
                                                ? "bg-red-500 text-white"
                                                : "bg-amber-400 text-slate-950"
                                    }
                                `}
                            >

                                {operationalStatus === "Fit" && (
                                    <CheckCircle2 size={16} />
                                )}

                                {operationalStatus === "Unfit" && (
                                    <AlertTriangle size={16} />
                                )}

                                {operationalStatus === "Pending" && (
                                    <Clock3 size={16} />
                                )}

                                {operationalStatus}

                            </div>


                            <div className="
                                rounded-full
                                bg-white/10
                                px-4
                                py-2
                                text-xs
                                font-semibold
                                text-white
                                ring-1
                                ring-white/15
                            ">

                                {completedCount} / {totalCount}
                                {" "}Completed

                            </div>

                        </div>

                    </div>


                    {/* Reinspection information */}

                    {isReinspection &&
                        parentInspectionId && (

                            <div className="
                                mt-4
                                flex
                                items-center
                                gap-2
                                rounded-xl
                                border
                                border-orange-300/20
                                bg-orange-400/10
                                px-3
                                py-2.5
                                text-xs
                                text-orange-100
                            ">

                                <RefreshCcw
                                    size={15}
                                    className="shrink-0"
                                />

                                <span>
                                    Original Inspection ID:
                                    {" "}
                                    <strong>
                                        {parentInspectionId}
                                    </strong>
                                </span>

                            </div>

                        )}

                </div>


                {/* Progress */}

                <div className="
                    border-t
                    border-slate-100
                    bg-white
                    px-4
                    py-4
                    sm:px-6
                ">

                    <div className="
                        mb-2
                        flex
                        items-center
                        justify-between
                    ">

                        <div className="
                            flex
                            items-center
                            gap-2
                            text-xs
                            font-semibold
                            text-slate-500
                        ">

                            <ClipboardCheck
                                size={15}
                                className="text-blue-600"
                            />

                            Checklist Progress

                        </div>


                        <span className="
                            text-xs
                            font-bold
                            text-slate-700
                        ">

                            {completionPercentage}%

                        </span>

                    </div>


                    <div className="
                        h-2
                        overflow-hidden
                        rounded-full
                        bg-slate-100
                    ">

                        <div
                            className={`
                                h-full
                                rounded-full
                                transition-all
                                duration-500

                                ${
                                    operationalStatus === "Unfit"
                                        ? "bg-red-500"
                                        : "bg-blue-600"
                                }
                            `}
                            style={{
                                width: `${completionPercentage}%`,
                            }}
                        />

                    </div>

                </div>

            </section>


            {/* =====================================================
                OPERATOR INFORMATION
            ====================================================== */}

            {!isReinspection && (

                <section className="
                    overflow-hidden
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    shadow-sm
                ">

                    {/* Section Header */}

                    <div className="
                        border-b
                        border-slate-100
                        px-4
                        py-4
                        sm:px-6
                        sm:py-5
                    ">

                        <div className="
                            flex
                            items-center
                            gap-3
                        ">

                            <div className="
                                flex
                                h-10
                                w-10
                                shrink-0
                                items-center
                                justify-center
                                rounded-xl
                                bg-blue-50
                                text-blue-600
                            ">

                                <UserRound
                                    size={20}
                                />

                            </div>


                            <div>

                                <h3 className="
                                    text-base
                                    font-bold
                                    text-slate-900
                                    sm:text-lg
                                ">
                                    Operator Information
                                </h3>

                                <p className="
                                    mt-0.5
                                    text-xs
                                    text-slate-500
                                    sm:text-sm
                                ">
                                    Enter the operator details for this inspection.
                                </p>

                            </div>

                        </div>

                    </div>


                    {/* Form */}

                    <div className="
                        space-y-5
                        p-4
                        sm:p-6
                    ">


                        {/* Name */}

                        <div>

                            <label className="
                                mb-2
                                flex
                                items-center
                                gap-2
                                text-sm
                                font-semibold
                                text-slate-700
                            ">

                                <UserRound
                                    size={15}
                                    className="text-slate-400"
                                />

                                Operator Name

                            </label>


                            <input
                                type="text"
                                value={operatorName}
                                onChange={(event) =>
                                    setOperatorName(
                                        event.target.value
                                    )
                                }
                                placeholder="Enter operator name"
                                className="
                                    w-full
                                    rounded-xl
                                    border
                                    border-slate-200
                                    bg-slate-50
                                    px-4
                                    py-3
                                    text-sm
                                    text-slate-900
                                    outline-none
                                    transition

                                    placeholder:text-slate-400

                                    focus:border-blue-500
                                    focus:bg-white
                                    focus:ring-4
                                    focus:ring-blue-500/10
                                "
                            />

                        </div>


                        {/* Employee ID + Agency */}

                        <div className="
                            grid
                            grid-cols-1
                            gap-5
                            md:grid-cols-2
                        ">


                            {/* Employee ID */}

                            <div>

                                <label className="
                                    mb-2
                                    flex
                                    items-center
                                    gap-2
                                    text-sm
                                    font-semibold
                                    text-slate-700
                                ">

                                    <IdCard
                                        size={15}
                                        className="text-slate-400"
                                    />

                                    Employee ID

                                </label>


                                <input
                                    type="text"
                                    value={operatorEmployeeId}
                                    onChange={(event) =>
                                        setOperatorEmployeeId(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Enter employee ID"
                                    className="
                                        w-full
                                        rounded-xl
                                        border
                                        border-slate-200
                                        bg-slate-50
                                        px-4
                                        py-3
                                        text-sm
                                        text-slate-900
                                        outline-none
                                        transition

                                        placeholder:text-slate-400

                                        focus:border-blue-500
                                        focus:bg-white
                                        focus:ring-4
                                        focus:ring-blue-500/10
                                    "
                                />

                            </div>


                            {/* Agency */}

                            <div>

                                <label className="
                                    mb-2
                                    flex
                                    items-center
                                    gap-2
                                    text-sm
                                    font-semibold
                                    text-slate-700
                                ">

                                    <Building2
                                        size={15}
                                        className="text-slate-400"
                                    />

                                    Agency Name

                                </label>


                                <input
                                    type="text"
                                    value={operatorAgency}
                                    onChange={(event) =>
                                        setOperatorAgency(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Enter agency name"
                                    className="
                                        w-full
                                        rounded-xl
                                        border
                                        border-slate-200
                                        bg-slate-50
                                        px-4
                                        py-3
                                        text-sm
                                        text-slate-900
                                        outline-none
                                        transition

                                        placeholder:text-slate-400

                                        focus:border-blue-500
                                        focus:bg-white
                                        focus:ring-4
                                        focus:ring-blue-500/10
                                    "
                                />

                            </div>

                        </div>


                        {/* Mobile */}

                        <div>

                            <label className="
                                mb-2
                                flex
                                items-center
                                gap-2
                                text-sm
                                font-semibold
                                text-slate-700
                            ">

                                <Phone
                                    size={15}
                                    className="text-slate-400"
                                />

                                Mobile Number

                            </label>


                            <input
                                type="tel"
                                inputMode="numeric"
                                value={operatorMobile}
                                onChange={(event) =>
                                    setOperatorMobile(
                                        event.target.value
                                    )
                                }
                                placeholder="Enter mobile number"
                                className="
                                    w-full
                                    rounded-xl
                                    border
                                    border-slate-200
                                    bg-slate-50
                                    px-4
                                    py-3
                                    text-sm
                                    text-slate-900
                                    outline-none
                                    transition

                                    placeholder:text-slate-400

                                    focus:border-blue-500
                                    focus:bg-white
                                    focus:ring-4
                                    focus:ring-blue-500/10
                                "
                            />

                        </div>


                        {/* Operator Checklist */}

                        <div className="
                            rounded-xl
                            border
                            border-slate-200
                            bg-slate-50
                            p-4
                        ">

                            <div className="
                                mb-3
                                flex
                                items-center
                                gap-2
                            ">

                                <ClipboardCheck
                                    size={17}
                                    className="text-blue-600"
                                />

                                <span className="
                                    text-sm
                                    font-semibold
                                    text-slate-800
                                ">
                                    Operator Checklist Filled
                                </span>

                            </div>


                            <div className="
                                grid
                                grid-cols-2
                                gap-3
                            ">


                                {/* YES */}

                                <button
                                    type="button"
                                    onClick={() =>
                                        setOperatorChecklistFilled(
                                            true
                                        )
                                    }
                                    className={`
                                        flex
                                        min-h-11
                                        items-center
                                        justify-center
                                        gap-2
                                        rounded-xl
                                        border
                                        text-sm
                                        font-bold
                                        transition

                                        ${
                                            operatorChecklistFilled
                                                ? `
                                                    border-green-500
                                                    bg-green-50
                                                    text-green-700
                                                  `
                                                : `
                                                    border-slate-200
                                                    bg-white
                                                    text-slate-500
                                                    hover:bg-slate-100
                                                  `
                                        }
                                    `}
                                >

                                    <CheckCircle2
                                        size={18}
                                    />

                                    Yes

                                </button>


                                {/* NO */}

                                <button
                                    type="button"
                                    onClick={() =>
                                        setOperatorChecklistFilled(
                                            false
                                        )
                                    }
                                    className={`
                                        flex
                                        min-h-11
                                        items-center
                                        justify-center
                                        gap-2
                                        rounded-xl
                                        border
                                        text-sm
                                        font-bold
                                        transition

                                        ${
                                            !operatorChecklistFilled
                                                ? `
                                                    border-red-400
                                                    bg-red-50
                                                    text-red-700
                                                  `
                                                : `
                                                    border-slate-200
                                                    bg-white
                                                    text-slate-500
                                                    hover:bg-slate-100
                                                  `
                                        }
                                    `}
                                >

                                    <AlertTriangle
                                        size={18}
                                    />

                                    No

                                </button>

                            </div>

                        </div>


                        {/* Operator Remarks */}

                        <div>

                            <label className="
                                mb-2
                                flex
                                items-center
                                gap-2
                                text-sm
                                font-semibold
                                text-slate-700
                            ">

                                <FileText
                                    size={15}
                                    className="text-slate-400"
                                />

                                Operator Remarks

                            </label>


                            <textarea
                                rows={3}
                                value={operatorRemarks}
                                onChange={(event) =>
                                    setOperatorRemarks(
                                        event.target.value
                                    )
                                }
                                placeholder="Enter operator-related observations..."
                                className="
                                    w-full
                                    resize-none
                                    rounded-xl
                                    border
                                    border-slate-200
                                    bg-slate-50
                                    px-4
                                    py-3
                                    text-sm
                                    text-slate-900
                                    outline-none
                                    transition

                                    placeholder:text-slate-400

                                    focus:border-blue-500
                                    focus:bg-white
                                    focus:ring-4
                                    focus:ring-blue-500/10
                                "
                            />

                        </div>

                    </div>

                </section>

            )}


            {/* =====================================================
                CHECKLIST ITEMS
            ====================================================== */}

            <section>

                <div className="
                    mb-3
                    flex
                    items-center
                    justify-between
                    gap-3
                    px-1
                ">

                    <div>

                        <h3 className="
                            text-base
                            font-bold
                            text-slate-900
                            sm:text-lg
                        ">

                            Safety Checkpoints

                        </h3>

                        <p className="
                            mt-0.5
                            text-xs
                            text-slate-500
                            sm:text-sm
                        ">

                            Select PASS or FAIL for every checkpoint.

                        </p>

                    </div>


                    <div className="
                        shrink-0
                        rounded-lg
                        bg-blue-50
                        px-3
                        py-1.5
                        text-xs
                        font-bold
                        text-blue-700
                    ">

                        {completedCount}/{totalCount}

                    </div>

                </div>


                <div className="
                    space-y-3
                    sm:space-y-4
                ">

                    {fields.map(
                        (field) => (

                            <ChecklistItem

                                key={
                                    field.id
                                }

                                fieldId={
                                    field.id
                                }

                                fieldName={
                                    field.field_name
                                }

                                value={
                                    results[
                                        field.id
                                    ] || ""
                                }

                                onChange={
                                    handleResult
                                }

                            />

                        )
                    )}

                </div>

            </section>


            {/* =====================================================
                REMARKS
            ====================================================== */}

            <section>

                <Remarks
                    remarks={
                        remarks
                    }

                    setRemarks={
                        setRemarks
                    }

                    required={
                        remarksRequired
                    }
                />

            </section>


            {/* =====================================================
                SUBMIT
            ====================================================== */}

            <section className="
                pb-6
                sm:pb-8
            ">

                <SubmitButton
                    onSubmit={
                        handleSubmit
                    }

                    loading={
                        saving
                    }
                />

            </section>

        </div>

    );
}