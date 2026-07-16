import api from "../api/axios";
import ENDPOINTS from "../api/endpoints";

import type {
    MachineryType,
    Vehicle,
    ChecklistField,
    InspectionPayload,
} from "../types/inspection";

class InspectionService {

    async getMachineryTypes(): Promise<MachineryType[]> {

        const response = await api.get(
            ENDPOINTS.MACHINERY_TYPES
        );

        return response.data;

    }

    async getVehicles(
        machineType: string
    ): Promise<Vehicle[]> {

        const response = await api.get(
            `${ENDPOINTS.VEHICLES}${machineType}/`
        );

        return response.data;

    }

    async getChecklist(
        machineryTypeId: string
    ): Promise<ChecklistField[]> {

        const response = await api.get(
            `${ENDPOINTS.CHECKLISTS}${machineryTypeId}/`
        );

        return response.data;

    }

    async createInspection(
        data: InspectionPayload
    ) {

        const response = await api.post(
            ENDPOINTS.CREATE_INSPECTION,
            data
        );

        return response.data;

    }
async getInspectionHistory() {

    const response = await api.get(
        "/inspections/history/"
    );

    return response.data;

}

}

export default new InspectionService();