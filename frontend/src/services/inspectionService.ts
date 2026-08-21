import api from "../api/axios";
import ENDPOINTS from "../api/endpoints";

import type {
    MachineryType,
    Vehicle,
    ChecklistField,
    InspectionPayload,
} from "../types/inspection";


export interface PendingReinspection {

    is_unfit: boolean;

    original_inspection_id?: number;

    failed_fields?: {
        id: number;
        field_name: string;
    }[];

}


export interface PendingVehicle {

    vehicle_id: number;

    machine_number: string;

    machinery_type_id: number;

    machinery_name: string;

    last_inspection_date: string;

    original_inspection_id: number;

    original_inspection_number: string;

}


class InspectionService {


    // =====================================================
    // CHECK VEHICLE STATUS
    // =====================================================

    async checkVehicleStatus(
        vehicleId: string | number
    ): Promise<PendingReinspection> {

        const response = await api.get(
            "/inspections/check-status/",
            {
                params: {
                    vehicle_id: vehicleId,
                },
            }
        );

        return response.data;

    }


    // =====================================================
    // GET PENDING REINSPECTIONS
    // =====================================================

    async getPendingReinspections(): Promise<PendingVehicle[]> {

        const response = await api.get(
            "/inspections/reinspections/pending/"
        );

        return response.data;

    }


    // =====================================================
    // MACHINERY TYPES
    // =====================================================

    async getMachineryTypes(): Promise<MachineryType[]> {

        const response = await api.get(
            ENDPOINTS.MACHINERY_TYPES
        );

        return response.data;

    }


    // =====================================================
    // VEHICLES
    // =====================================================

    async getVehicles(
        machineType: string
    ): Promise<Vehicle[]> {

        const response = await api.get(
            `${ENDPOINTS.VEHICLES}${machineType}/`
        );

        return response.data;

    }


    // =====================================================
    // CHECKLIST
    // =====================================================

    async getChecklist(
        machineryTypeId: string
    ): Promise<ChecklistField[]> {

        const response = await api.get(
            `${ENDPOINTS.CHECKLISTS}${machineryTypeId}/`
        );

        return response.data;

    }


    // =====================================================
    // CREATE INSPECTION
    // =====================================================

    async createInspection(
        data: InspectionPayload
    ) {

        const response = await api.post(
            ENDPOINTS.CREATE_INSPECTION,
            data
        );

        return response.data;

    }


    // =====================================================
    // INSPECTION HISTORY
    // =====================================================

    async getInspectionHistory() {

        const response = await api.get(
            "/inspections/history/"
        );

        return response.data;

    }


    // =====================================================
    // INSPECTION REPORT
    // =====================================================

    async getInspectionReport(
        inspectionNumber: string
    ) {

        const response = await api.get(
            `/reports/inspection/${inspectionNumber}/`
        );

        return response.data;

    }


    // =====================================================
    // CHANGE PASSWORD
    // =====================================================

    async changePassword(
        data: {
            current_password: string;
            new_password: string;
        }
    ) {

        const response = await api.post(
            "/auth/change-password/",
            data
        );

        return response.data;

    }

}


export default new InspectionService();