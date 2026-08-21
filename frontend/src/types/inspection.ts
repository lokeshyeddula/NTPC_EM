export interface MachineryType {
    id: number;
    name: string;
}


export interface Vehicle {
    id: number;
    machine_number: string;
    make_model: string;
}


export interface ChecklistField {
    id: number;
    field_name: string;
    display_order: number;
}


export interface InspectionResult {
    inspection_field: number;
    result: "Pass" | "Fail";
}


export interface InspectionPayload {

    relay: string;

    vehicle: number;

    operational_status:
        "Fit" |
        "Unfit";

    operator_name: string;

    operator_employee_id: string;

    operator_agency: string;

    operator_mobile: string;

    operator_checklist_filled: boolean;

    operator_remarks: string;

    remarks: string;

    results: InspectionResult[];

    is_reinspection: boolean;

    parent_inspection_id: number | null;
}


export const RELAYS = [
    "Relay A",
    "Relay B",
    "Relay C",
    "Relay D",
    "General Shift",
];