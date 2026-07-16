export interface InspectionResult {

    field_name: string;

    result: "Pass" | "Fail";

}

export interface InspectionReport {

    id: number;

    inspection_number: string;

    inspection_date: string;

    shift: string;

    relay: string;

    engineer: string;

    designation: string;

    vehicle: string;

    machinery_type: string;

    operational_status: "Fit" | "Unfit";

    remarks: string;

    results: InspectionResult[];

}