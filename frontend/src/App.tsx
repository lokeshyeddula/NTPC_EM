import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";

import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import InspectionHistory from "./pages/Inspection/InspectionHistory";
import ProtectedRoute from "./routes/ProtectedRoute";
import InspectionPage from "./pages/Inspection/InspectionPage";
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>

        <Routes>

          <Route
            path="/"
            element={<Login />}
          />
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
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

        </Routes>

      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;