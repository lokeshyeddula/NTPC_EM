import { useEffect, useState } from "react";

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

    pendingReinspection:
        PendingReinspection | null;
}


export default function Checklist({

    machineryType,
    vehicle,
    relay,
    pendingReinspection,

}: Props) {


    // =====================================================
    // STATE
    // =====================================================

    const [
        fields,
        setFields,
    ] = useState<ChecklistField[]>([]);


    const [
        loading,
        setLoading,
    ] = useState(true);


    const [
        results,
        setResults,
    ] = useState<
        Record<
            number,
            "Pass" | "Fail"
        >
    >({});


    const [
        remarks,
        setRemarks,
    ] = useState("");


    const [
        operatorName,
        setOperatorName,
    ] = useState("");


    const [
        operatorEmployeeId,
        setOperatorEmployeeId,
    ] = useState("");


    const [
        operatorAgency,
        setOperatorAgency,
    ] = useState("");


    const [
        operatorMobile,
        setOperatorMobile,
    ] = useState("");


    const [
        operatorChecklistFilled,
        setOperatorChecklistFilled,
    ] = useState(true);


    const [
        operatorRemarks,
        setOperatorRemarks,
    ] = useState("");


    const [
        saving,
        setSaving,
    ] = useState(false);


    // =====================================================
    // DETERMINE REINSPECTION
    // =====================================================

    const isReinspection =
        pendingReinspection?.is_unfit === true;


    const parentInspectionId =
        isReinspection
            ? pendingReinspection
                ?.original_inspection_id ?? null
            : null;


    // =====================================================
    // CHECKLIST COUNTER
    // =====================================================

    const completedCount =
        Object.keys(results).length;


    const totalCount =
        fields.length;


    const allCompleted =
        completedCount === totalCount &&
        totalCount > 0;


    // =====================================================
    // OPERATIONAL STATUS
    // =====================================================

    const operationalStatus:
        "Fit" |
        "Unfit" |
        "Pending" =

        Object.values(results).includes(
            "Fail"
        )

            ? "Unfit"

            : allCompleted

                ? "Fit"

                : "Pending";


    const remarksRequired =
        operationalStatus === "Unfit";


    // =====================================================
    // LOAD CHECKLIST
    // =====================================================

    useEffect(() => {

        let cancelled = false;


        async function loadChecklist() {

            setLoading(true);

            setResults({});


            // -------------------------------------------------
            // REINSPECTION
            // -------------------------------------------------

            if (
                pendingReinspection?.is_unfit === true &&
                pendingReinspection.failed_fields
            ) {

                if (!cancelled) {

                    setFields(
                        pendingReinspection.failed_fields
                            .map(
                                (field) => ({
                                    id: field.id,

                                    field_name:
                                        field.field_name,

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

                    setFields(
                        data
                    );

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


    // =====================================================
    // HANDLE RESULT
    // =====================================================

    function handleResult(

        fieldId: number,

        result:
            "Pass" |
            "Fail"

    ) {

        setResults(
            (previous) => ({

                ...previous,

                [fieldId]:
                    result,

            })
        );

    }


    // =====================================================
    // SUBMIT
    // =====================================================

    async function handleSubmit() {


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

            if (
                !operatorName.trim()
            ) {

                alert(
                    "Please enter Operator Name."
                );

                return;
            }


            if (
                !operatorEmployeeId.trim()
            ) {

                alert(
                    "Please enter Employee ID."
                );

                return;
            }


            if (
                !operatorAgency.trim()
            ) {

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
        // IMPORTANT REINSPECTION VALIDATION
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

            results:
                inspectionResults,

            // -------------------------------------------------
            // REINSPECTION INFORMATION
            // -------------------------------------------------

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
                await inspectionService
                    .createInspection(
                        payload
                    );


            alert(

                `${
                    isReinspection
                        ? "Re-inspection"
                        : "Inspection"
                } Saved Successfully\n\n` +

                `Inspection Number : ` +
                response.inspection_number

            );


            /*
             * Do NOT use window.location.reload().
             *
             * Reloading can cause the re-inspection URL/state
             * to be processed again.
             *
             * Instead navigate back to the pending page.
             */

            window.location.href =
                "/reinspection";


        } catch (error: any) {

            console.error(
                "Inspection submission failed:",
                error
            );


            // -------------------------------------------------
            // SHOW BACKEND VALIDATION MESSAGE
            // -------------------------------------------------

            const backendError =
                error?.response?.data;


            if (
                backendError
            ) {

                if (
                    backendError
                        .parent_inspection_id
                ) {

                    alert(
                        backendError
                            .parent_inspection_id
                    );

                } else if (
                    backendError
                        .remarks
                ) {

                    alert(
                        backendError
                            .remarks
                    );

                } else if (
                    backendError
                        .detail
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


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <div className="bg-white rounded-lg shadow p-4 sm:p-6">

                <p className="text-gray-600 font-medium">

                    Loading checklist...

                </p>

            </div>

        );

    }


    // =====================================================
    // EMPTY CHECKLIST
    // =====================================================

    if (fields.length === 0) {

        return (

            <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4 sm:p-6">

                No checklist available.

            </div>

        );

    }


    // =====================================================
    // UI
    // =====================================================

    return (

        <div className="bg-white sm:rounded-lg sm:shadow px-4 py-2 sm:p-6">


            {/* =================================================
                HEADER
            ================================================= */}

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">

                <div>

                    <h2 className="text-xl sm:text-2xl font-bold">

                        {
                            isReinspection
                                ? "Targeted Re-inspection"
                                : "Inspection Checklist"
                        }

                    </h2>


                    <p className="text-sm text-gray-500 mt-1">

                        {
                            isReinspection

                                ? "Verify the previously failed checkpoints."

                                : "Select PASS or FAIL for every checkpoint."
                        }

                    </p>


                    {
                        isReinspection &&
                        parentInspectionId &&

                        <p className="text-xs text-orange-600 mt-2">

                            Original Inspection ID:{" "}
                            {parentInspectionId}

                        </p>
                    }

                </div>


                {/* STATUS */}

                <div className="flex flex-row sm:flex-col items-center sm:items-end gap-2 w-full sm:w-auto justify-between sm:justify-start">

                    <div
                        className={`
                            px-4 sm:px-5
                            py-2
                            rounded-lg
                            text-white
                            text-sm sm:text-base
                            font-bold
                            w-1/2
                            sm:w-auto
                            text-center

                            ${
                                operationalStatus === "Fit"
                                    ? "bg-green-600"
                                    : operationalStatus === "Unfit"
                                        ? "bg-red-600"
                                        : "bg-yellow-500"
                            }
                        `}
                    >

                        {operationalStatus}

                    </div>


                    <div
                        className={`
                            px-3 sm:px-4
                            py-1.5
                            rounded-full
                            text-xs sm:text-sm
                            font-semibold
                            text-white
                            w-1/2
                            sm:w-auto
                            text-center

                            ${
                                allCompleted
                                    ? "bg-green-600"
                                    : "bg-orange-500"
                            }
                        `}
                    >

                        {completedCount} / {totalCount}

                        {" "}Completed

                    </div>

                </div>

            </div>


            {/* =================================================
                OPERATOR INFORMATION
            ================================================= */}

            {!isReinspection && (

                <div className="mt-6 pt-6 border-t border-gray-200 sm:mt-8 sm:mb-8 sm:border sm:rounded-lg sm:p-6 sm:bg-gray-50">

                    <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-5">

                        Operator Information

                    </h3>


                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">


                        {/* NAME */}

                        <div>

                            <label className="block mb-2 text-sm font-medium">

                                Operator Name

                            </label>

                            <input

                                type="text"

                                className="w-full border rounded-lg p-3"

                                value={
                                    operatorName
                                }

                                onChange={(event) =>
                                    setOperatorName(
                                        event.target.value
                                    )
                                }

                            />

                        </div>


                        {/* EMPLOYEE ID */}

                        <div>

                            <label className="block mb-2 text-sm font-medium">

                                Employee ID

                            </label>

                            <input

                                type="text"

                                className="w-full border rounded-lg p-3"

                                value={
                                    operatorEmployeeId
                                }

                                onChange={(event) =>
                                    setOperatorEmployeeId(
                                        event.target.value
                                    )
                                }

                            />

                        </div>


                        {/* AGENCY */}

                        <div>

                            <label className="block mb-2 text-sm font-medium">

                                Agency Name

                            </label>

                            <input

                                type="text"

                                className="w-full border rounded-lg p-3"

                                value={
                                    operatorAgency
                                }

                                onChange={(event) =>
                                    setOperatorAgency(
                                        event.target.value
                                    )
                                }

                            />

                        </div>


                        {/* MOBILE */}

                        <div>

                            <label className="block mb-2 text-sm font-medium">

                                Mobile Number

                            </label>

                            <input

                                type="tel"

                                className="w-full border rounded-lg p-3"

                                value={
                                    operatorMobile
                                }

                                onChange={(event) =>
                                    setOperatorMobile(
                                        event.target.value
                                    )
                                }

                            />

                        </div>

                    </div>


                    {/* OPERATOR CHECKLIST */}

                    <div className="mt-5">

                        <label className="block mb-3 text-sm font-medium">

                            Operator Checklist Filled

                        </label>


                        <div className="flex gap-8">

                            <label className="flex items-center gap-2">

                                <input

                                    type="radio"

                                    checked={
                                        operatorChecklistFilled
                                    }

                                    onChange={() =>
                                        setOperatorChecklistFilled(
                                            true
                                        )
                                    }

                                />

                                Yes

                            </label>


                            <label className="flex items-center gap-2">

                                <input

                                    type="radio"

                                    checked={
                                        !operatorChecklistFilled
                                    }

                                    onChange={() =>
                                        setOperatorChecklistFilled(
                                            false
                                        )
                                    }

                                />

                                No

                            </label>

                        </div>

                    </div>


                    {/* OPERATOR REMARKS */}

                    <div className="mt-5">

                        <label className="block mb-2 text-sm font-medium">

                            Operator Remarks

                        </label>

                        <textarea

                            rows={3}

                            className="w-full border rounded-lg p-3 resize-none"

                            placeholder="Enter operator-related observations..."

                            value={
                                operatorRemarks
                            }

                            onChange={(event) =>
                                setOperatorRemarks(
                                    event.target.value
                                )
                            }

                        />

                    </div>

                </div>

            )}


            {/* =================================================
                CHECKLIST ITEMS
            ================================================= */}

            <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8 mt-6">

                {
                    fields.map(
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
                    )
                }

            </div>


            {/* =================================================
                REMARKS
            ================================================= */}

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


            {/* =================================================
                SUBMIT
            ================================================= */}

            <div className="mt-6 sm:mt-8">

                <SubmitButton

                    onSubmit={
                        handleSubmit
                    }

                    loading={
                        saving
                    }

                />

            </div>

        </div>

    );
}