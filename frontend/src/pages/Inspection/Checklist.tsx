import { useEffect, useState } from "react";
import inspectionService, { type PendingReinspection } from "../../services/inspectionService";
import ChecklistItem from "./ChecklistItem";
import type { ChecklistField } from "../../types/inspection";
import Remarks from "./Remarks";
import SubmitButton from "./SubmitButton";

interface Props {
  machineryType: number;
  vehicle: number;
  relay: string;
  pendingReinspection: PendingReinspection | null;
}

export default function Checklist({ machineryType, vehicle, relay, pendingReinspection }: Props) {
  const [fields, setFields] = useState<ChecklistField[]>([]);
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<Record<number, "Pass" | "Fail">>({});
  const [remarks, setRemarks] = useState("");

  const [operatorName, setOperatorName] = useState("");
  const [operatorEmployeeId, setOperatorEmployeeId] = useState("");
  const [operatorAgency, setOperatorAgency] = useState("");
  const [operatorMobile, setOperatorMobile] = useState("");
  const [operatorChecklistFilled, setOperatorChecklistFilled] = useState(true);
  const [operatorRemarks, setOperatorRemarks] = useState("");
  const [saving, setSaving] = useState(false);

  const completedCount = Object.keys(results).length;
  const totalCount = fields.length;
  const allCompleted = completedCount === totalCount && totalCount > 0;

  const operationalStatus = Object.values(results).includes("Fail")
    ? "Unfit"
    : allCompleted
    ? "Fit"
    : "Pending";

  const remarksRequired = operationalStatus === "Unfit";
  const isReinspection = pendingReinspection?.is_unfit;

  useEffect(() => {
    async function loadChecklist() {
      if (pendingReinspection?.is_unfit && pendingReinspection.failed_fields) {
          setFields(pendingReinspection.failed_fields as ChecklistField[]);
          setResults({});
          setLoading(false);
          return;
      }

      try {
        setLoading(true);
        const data = await inspectionService.getChecklist(machineryType.toString());
        setFields(data);
        setResults({});
      } catch (error) {
        console.error("Failed to fetch checklist:", error);
        setFields([]);
      } finally {
        setLoading(false);
      }
    }

    loadChecklist();
  }, [machineryType, pendingReinspection]);

  async function handleSubmit() {
    if (!relay) { alert("Please select a Relay."); return; }

    // Only validate operator fields if it is NOT a reinspection
    if (!isReinspection) {
        if (!operatorName.trim()) { alert("Please enter Operator Name."); return; }
        if (!operatorEmployeeId.trim()) { alert("Please enter Employee ID."); return; }
        if (!operatorAgency.trim()) { alert("Please enter Agency Name."); return; }
    }

    if (!allCompleted) { alert("Please complete all checklist items."); return; }
    if (remarksRequired && !remarks.trim()) { alert("Remarks are mandatory for UNFIT inspection."); return; }

    const payload = {
      relay,
      vehicle,
      operational_status: operationalStatus,

      // Auto-fill dummy data for reinspections to satisfy backend requirements
      operator_name: isReinspection ? "N/A (Reinspection)" : operatorName,
      operator_employee_id: isReinspection ? "N/A" : operatorEmployeeId,
      operator_agency: isReinspection ? "N/A" : operatorAgency,
      operator_mobile: isReinspection ? "" : operatorMobile,
      operator_checklist_filled: isReinspection ? true : operatorChecklistFilled,
      operator_remarks: isReinspection ? "" : operatorRemarks,

      remarks,
      is_reinspection: isReinspection || false,
      parent_inspection_id: pendingReinspection?.original_inspection_id || null,

      results: fields.map((field) => ({
        inspection_field: field.id,
        result: results[field.id],
      })),
    };

    try {
      setSaving(true);
      const response = await inspectionService.createInspection(payload);
      alert(`Inspection Saved Successfully\n\nInspection Number : ${response.inspection_number}`);
      window.location.reload();
    } catch (error: any) {
      console.error(error);
      alert("Failed to save inspection. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  function handleResult(fieldId: number, result: "Pass" | "Fail") {
    setResults((prev) => ({ ...prev, [fieldId]: result }));
  }

  if (loading) {
    return <div className="bg-white rounded-lg shadow p-4 sm:p-6"><p className="text-gray-600 font-medium">Loading checklist...</p></div>;
  }

  if (fields.length === 0) {
    return <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4 sm:p-6 text-sm sm:text-base">No checklist available.</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="w-full sm:w-auto">
          <h2 className="text-xl sm:text-2xl font-bold">
              {isReinspection ? "Targeted Reinspection" : "Inspection Checklist"}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {isReinspection
                ? "Verify the following previously failed checkpoints."
                : "Select PASS or FAIL for every checkpoint."}
          </p>
        </div>

        <div className="flex flex-row sm:flex-col items-center sm:items-end gap-2 w-full sm:w-auto justify-between sm:justify-start">
          <div className={`px-4 sm:px-5 py-2 rounded-lg text-white text-sm sm:text-base font-bold w-1/2 sm:w-auto text-center ${operationalStatus === "Fit" ? "bg-green-600" : operationalStatus === "Unfit" ? "bg-red-600" : "bg-yellow-500"}`}>
            {operationalStatus}
          </div>
          <div className={`px-3 sm:px-4 py-1.5 sm:py-1 rounded-full text-xs sm:text-sm font-semibold text-white w-1/2 sm:w-auto text-center ${allCompleted ? "bg-green-600" : "bg-orange-500"}`}>
            {completedCount} / {totalCount} Completed
          </div>
        </div>
      </div>

      {/* Conditionally render the entire Operator Information block */}
      {!isReinspection && (
          <div className="mt-6 sm:mt-8 mb-6 sm:mb-8 border rounded-lg p-4 sm:p-6 bg-gray-50">
            <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-5">Operator Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
              <div><label className="block mb-1.5 sm:mb-2 text-sm sm:text-base font-medium">Operator Name</label><input type="text" className="w-full border rounded-lg p-3 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:outline-none" value={operatorName} onChange={(e) => setOperatorName(e.target.value)} /></div>
              <div><label className="block mb-1.5 sm:mb-2 text-sm sm:text-base font-medium">Employee ID</label><input type="text" className="w-full border rounded-lg p-3 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:outline-none" value={operatorEmployeeId} onChange={(e) => setOperatorEmployeeId(e.target.value)} /></div>
              <div><label className="block mb-1.5 sm:mb-2 text-sm sm:text-base font-medium">Agency Name</label><input type="text" className="w-full border rounded-lg p-3 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:outline-none" value={operatorAgency} onChange={(e) => setOperatorAgency(e.target.value)} /></div>
              <div><label className="block mb-1.5 sm:mb-2 text-sm sm:text-base font-medium">Mobile Number</label><input type="tel" className="w-full border rounded-lg p-3 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:outline-none" value={operatorMobile} onChange={(e) => setOperatorMobile(e.target.value)} /></div>
            </div>
            <div className="mt-5 sm:mt-6">
              <label className="block mb-2 sm:mb-3 text-sm sm:text-base font-medium">Operator Checklist Filled</label>
              <div className="flex gap-6 sm:gap-8">
                <label className="flex items-center gap-2 cursor-pointer p-1"><input type="radio" className="w-4 h-4 text-blue-600 focus:ring-blue-500" checked={operatorChecklistFilled} onChange={() => setOperatorChecklistFilled(true)} /><span className="text-sm sm:text-base">Yes</span></label>
                <label className="flex items-center gap-2 cursor-pointer p-1"><input type="radio" className="w-4 h-4 text-blue-600 focus:ring-blue-500" checked={!operatorChecklistFilled} onChange={() => setOperatorChecklistFilled(false)} /><span className="text-sm sm:text-base">No</span></label>
              </div>
              <div className="mt-5 sm:mt-6">
                <label className="block mb-1.5 sm:mb-2 text-sm sm:text-base font-medium">Operator Remarks</label>
                <textarea rows={3} className="w-full border rounded-lg p-3 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none" placeholder="Enter operator-related observations..." value={operatorRemarks} onChange={(e) => setOperatorRemarks(e.target.value)} />
              </div>
            </div>
          </div>
      )}

      <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8 mt-6">
        {fields.map((field) => (
          <ChecklistItem key={field.id} fieldId={field.id} fieldName={field.field_name} value={results[field.id] || ""} onChange={handleResult} />
        ))}
      </div>

      <Remarks remarks={remarks} setRemarks={setRemarks} required={remarksRequired} />

      <div className="mt-6 sm:mt-8">
        <SubmitButton onSubmit={handleSubmit} loading={saving} />
      </div>
    </div>
  );
}