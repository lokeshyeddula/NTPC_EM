import {
    BrowserRouter,
    Routes,
    Route,
} from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";

import ProtectedRoute from "./routes/ProtectedRoute";

import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";

import InspectionPage from "./pages/Inspection/InspectionPage";
import InspectionHistory from "./pages/Inspection/InspectionHistory";

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

                    {/* Public Route */}

                    <Route
                        path="/"
                        element={<Login />}
                    />

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

                    {/* Reports Dashboard */}

                    <Route
                        path="/reports"
                        element={
                            <ProtectedRoute>
                                <ReportsDashboard />
                            </ProtectedRoute>
                        }
                    />

                    {/* Individual Inspection Report */}

                    <Route
                        path="/reports/individual"
                        element={
                            <ProtectedRoute>
                                <IndividualReport />
                            </ProtectedRoute>
                        }
                    />

                    {/* View Single Inspection Report */}

                    <Route
                        path="/reports/inspection/:inspectionNumber"
                        element={
                            <ProtectedRoute>
                                <InspectionReport />
                            </ProtectedRoute>
                        }
                    />

                    {/* Shift Wise Report */}

                    <Route
                        path="/reports/shift"
                        element={
                            <ProtectedRoute>
                                <ShiftReport />
                            </ProtectedRoute>
                        }
                    />

                    {/* Daily Report */}

                    <Route
                        path="/reports/daily"
                        element={
                            <ProtectedRoute>
                                <DailyReport />
                            </ProtectedRoute>
                        }
                    />

                    {/* Date Range Report */}

                    <Route
                        path="/reports/date-range"
                        element={
                            <ProtectedRoute>
                                <DateRangeReport />
                            </ProtectedRoute>
                        }
                    />

                    {/* Monthly Summary */}

                    <Route
                        path="/reports/monthly"
                        element={
                            <ProtectedRoute>
                                <MonthlySummary />
                            </ProtectedRoute>
                        }
                    />

                </Routes>

            </AuthProvider>

        </BrowserRouter>

    );

}

export default App;