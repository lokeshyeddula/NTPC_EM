import Layout from "../../components/layout/Layout";
import InspectionHeader from "./InspectionHeader";
import InspectionForm from "./InspectionForm";

export default function InspectionPage() {
    return (
        <Layout>
            {/*
              Added a responsive vertical gap:
              space-y-4 (16px) on mobile,
              space-y-6 (24px) on sm screens and up
            */}
            <div className="flex flex-col space-y-4 sm:space-y-6 w-full max-w-7xl mx-auto">
                <InspectionHeader />
                <InspectionForm />
            </div>
        </Layout>
    );
}