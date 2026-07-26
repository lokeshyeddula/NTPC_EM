import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
    Outlet,
} from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";

// Layout
import Layout from "./components/Layout/Layout";

// Auth
import Login from "./pages/Login/Login";
import Register from "./pages/Login/Register";

// Dashboard
import Dashboard from "./pages/Dashboard/Dashboard";

// Inspection
import InspectionPage from "./pages/Inspection/InspectionPage";
import InspectionHistory from "./pages/Inspection/InspectionHistory";
import PendingReinspections from "./pages/Inspection/PendingReinspections";

// Reports
import ReportsDashboard from "./pages/Reports/ReportsDashboard";
import InspectionReport from "./pages/Reports/InspectionReport";
import IndividualReport from "./pages/Reports/IndividualReport";
import ShiftReport from "./pages/Reports/ShiftReport";
import DailyReport from "./pages/Reports/DailyReport";

import MonthlySummary from "./pages/Reports/MonthlySummary";

// Profile
import Profile from "./pages/Profile/Profile";

// Helper layout wrapper component for protected pages (renders layout shell only once)
function DashboardLayout() {
    return (
        <ProtectedRoute>
            <Layout>
                <Outlet />
            </Layout>
        </ProtectedRoute>
    );
}

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>

                    {/* Redirect */}
                    <Route
                        path="/"
                        element={<Navigate to="/login" replace />}
                    />

                    {/* Public Routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Protected Routes Grouped Under DashboardLayout */}
                    <Route element={<DashboardLayout />}>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/inspection" element={<InspectionPage />} />
                        <Route path="/Re-Inspection" element={<PendingReinspections />} />
                        <Route path="/inspection-history" element={<InspectionHistory />} />

                        {/* Profile */}
                        <Route path="/profile" element={<Profile />} />

                        {/* Reports */}
                        <Route path="/reports" element={<ReportsDashboard />} />
                        <Route path="/reports/individual" element={<IndividualReport />} />
                        <Route path="/reports/inspection/:inspectionNumber" element={<InspectionReport />} />
                        <Route path="/reports/shift" element={<ShiftReport />} />
                        <Route path="/reports/daily" element={<DailyReport />} />
                        <Route path="/reports/monthly" element={<MonthlySummary />} />
                    </Route>

                    {/* 404 */}
                    <Route
                        path="*"
                        element={<Navigate to="/login" replace />}
                    />

                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;