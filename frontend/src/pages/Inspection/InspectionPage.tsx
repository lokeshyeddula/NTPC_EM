import InspectionHeader from "./InspectionHeader";
import InspectionForm from "./InspectionForm";

export default function InspectionPage() {
    return (
        /*
          Added a responsive vertical gap:
          space-y-4 (16px) on mobile,
          space-y-6 (24px) on sm screens and up
        */
        <div className="w-full flex flex-col gap-4">
            <InspectionHeader />
            <InspectionForm />
        </div>
    );
}