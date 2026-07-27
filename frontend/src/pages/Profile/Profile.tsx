import { useState, type FormEvent } from "react";
import { Eye, EyeOff } from "lucide-react";
import useAuth from "../../hooks/useAuth";
import inspectionService from "../../services/inspectionService";

export default function Profile() {
    const { user } = useAuth();

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // Visibility toggles for each password field
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    async function handlePasswordChange(e: FormEvent) {
        e.preventDefault();
        setMessage(null);

        if (newPassword !== confirmPassword) {
            setMessage({ type: "error", text: "New passwords do not match." });
            return;
        }

        if (newPassword.length < 6) {
            setMessage({ type: "error", text: "Password must be at least 6 characters long." });
            return;
        }

        try {
            setLoading(true);
            await inspectionService.changePassword({
                current_password: currentPassword,
                new_password: newPassword,
            });

            setMessage({ type: "success", text: "Password changed successfully!" });
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (error: any) {
            console.error("Change password error:", error);
            setMessage({
                type: "error",
                text: error.response?.data?.detail || "Failed to change password. Please check your current password.",
            });
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            {/* Top Card: Page Title */}
            <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                <h1 className="text-2xl sm:text-3xl font-bold mb-1 text-gray-800">
                    User Profile
                </h1>

            </div>

            {/* Personal Information Card */}
            <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-3">
                    Personal Information
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-500 mb-1">
                            Full Name
                        </label>
                        <div className="font-medium text-gray-900 text-base">
                            {user?.full_name || "N/A"}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-500 mb-1">
                            Username / Email
                        </label>
                        <div className="font-medium text-gray-900 text-base">
    {user?.email || "N/A"}
</div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-500 mb-1">
                            Designation
                        </label>
                        <div className="font-medium text-gray-900 text-base">
                            {user?.designation || "N/A"}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-500 mb-1">
                            Role / Access Level
                        </label>
                       <div className="font-medium text-gray-900 text-base uppercase">
    {user?.is_admin ? "Administrator" : "Engineer"}
</div>
                    </div>
                </div>
            </div>

            {/* Change Password Card */}
            <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-3">
                    Change Password
                </h2>

                {message && (
                    <div
                        className={`p-4 mb-4 rounded-lg text-sm font-medium ${
                            message.type === "success"
                                ? "bg-green-50 text-green-700 border border-green-200"
                                : "bg-red-50 text-red-700 border border-red-200"
                        }`}
                    >
                        {message.text}
                    </div>
                )}

                <form onSubmit={handlePasswordChange} className="space-y-4 max-w-xl">
                    {/* Current Password */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Current Password
                        </label>
                        <div className="relative">
                            <input
                                type={showCurrentPassword ? "text" : "password"}
                                required
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 pr-10 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                            <button
                                type="button"
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
                            >
                                {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    {/* New Password */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                            New Password
                        </label>
                        <div className="relative">
                            <input
                                type={showNewPassword ? "text" : "password"}
                                required
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 pr-10 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                            <button
                                type="button"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
                            >
                                {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    {/* Confirm New Password */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Confirm New Password
                        </label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 pr-10 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
                            >
                                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:opacity-50"
                    >
                        {loading ? "Updating Password..." : "Update Password"}
                    </button>
                </form>
            </div>
        </div>
    );
}