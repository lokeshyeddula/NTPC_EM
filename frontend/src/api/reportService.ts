import axios from "./axios";

class ReportService {

    async getInspectionHistory() {

        const response = await axios.get(
            "/inspections/history/"
        );

        return response.data;

    }

}

export default new ReportService();