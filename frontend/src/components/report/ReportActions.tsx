import axios from "../../api/axios";

interface Props {
    inspectionNumber: string;
}

export default function ReportActions({
    inspectionNumber,
}: Props) {

    async function downloadPDF() {
        try {
            const response = await axios.get(
                `/reports/pdf/inspection/${inspectionNumber}/`,
                {
                    responseType: "blob",
                }
            );
            const url = window.URL.createObjectURL(response.data);
            const link = document.createElement("a");
            link.href = url;
            link.download = `${inspectionNumber}.pdf`;
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error(error);
            alert("Unable to download PDF.");
        }
    }

    return (
        <div className="flex flex-col sm:flex-row justify-end gap-3 mb-4 sm:mb-6 print:hidden">
            <button
                onClick={downloadPDF}
                className="w-full sm:w-auto bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium transition-colors"
            >
                Download PDF
            </button>

            <button
                onClick={() => window.print()}
                className="w-full sm:w-auto bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-medium transition-colors"
            >
                Print
            </button>
        </div>
    );
}