import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";

// Auth
import Login from "./pages/Login/Login";
import Register from "./pages/Login/Register";


// Dashboard
import Dashboard from "./pages/Dashboard/Dashboard";

// Inspection
import InspectionPage from "./pages/Inspection/InspectionPage";
import InspectionHistory from "./pages/Inspection/InspectionHistory";

// Reports
import ReportsDashboard from "./pages/Reports/ReportsDashboard";
import InspectionReport from "./pages/Reports/InspectionReport";
import IndividualReport from "./pages/Reports/IndividualReport";
import ShiftReport from "./pages/Reports/ShiftReport";
import DailyReport from "./pages/Reports/DailyReport";
import DateRangeReport from "./pages/Reports/DateRangeReport";
import MonthlySummary from "./pages/Reports/MonthlySummary";

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

                    {/* Public */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Dashboard */}
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        }
                    />

                    {/* Inspection */}
                    <Route
                        path="/inspection"
                        element={
                            <ProtectedRoute>
                                <InspectionPage />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/inspection-history"
                        element={
                            <ProtectedRoute>
                                <InspectionHistory />
                            </ProtectedRoute>
                        }
                    />

                    {/* Reports */}
                    <Route
                        path="/reports"
                        element={
                            <ProtectedRoute>
                                <ReportsDashboard />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/reports/individual"
                        element={
                            <ProtectedRoute>
                                <IndividualReport />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/reports/inspection/:inspectionNumber"
                        element={
                            <ProtectedRoute>
                                <InspectionReport />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/reports/shift"
                        element={
                            <ProtectedRoute>
                                <ShiftReport />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/reports/daily"
                        element={
                            <ProtectedRoute>
                                <DailyReport />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/reports/date-range"
                        element={
                            <ProtectedRoute>
                                <DateRangeReport />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/reports/monthly"
                        element={
                            <ProtectedRoute>
                                <MonthlySummary />
                            </ProtectedRoute>
                        }
                    />

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