import { useState, type FormEvent } from "react";
import {
    Eye,
    EyeOff,
    User,
    Mail,
    Phone,
    Building2,
    BriefcaseBusiness,
    ShieldCheck,
    KeyRound,
    CheckCircle2,
    AlertCircle,
} from "lucide-react";

import useAuth from "../../hooks/useAuth";
import inspectionService from "../../services/inspectionService";

export default function Profile() {

    const { user } = useAuth();

    const [currentPassword, setCurrentPassword] =
        useState("");

    const [newPassword, setNewPassword] =
        useState("");

    const [confirmPassword, setConfirmPassword] =
        useState("");


    const [showCurrentPassword, setShowCurrentPassword] =
        useState(false);

    const [showNewPassword, setShowNewPassword] =
        useState(false);

    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);


    const [loading, setLoading] =
        useState(false);


    const [message, setMessage] =
        useState<{
            type: "success" | "error";
            text: string;
        } | null>(null);


    const initials =
        user?.full_name
            ?.trim()
            .split(/\s+/)
            .filter(Boolean)
            .map((name) => name[0])
            .join("")
            .slice(0, 2)
            .toUpperCase() || "U";


    async function handlePasswordChange(
        e: FormEvent<HTMLFormElement>
    ) {

        e.preventDefault();

        setMessage(null);


        if (!currentPassword) {

            setMessage({
                type: "error",
                text: "Please enter your current password.",
            });

            return;

        }


        if (newPassword.length < 8) {

            setMessage({
                type: "error",
                text: "New password must be at least 8 characters long.",
            });

            return;

        }


        if (newPassword !== confirmPassword) {

            setMessage({
                type: "error",
                text: "New passwords do not match.",
            });

            return;

        }


        if (currentPassword === newPassword) {

            setMessage({
                type: "error",
                text: "New password must be different from your current password.",
            });

            return;

        }


        try {

            setLoading(true);


            await inspectionService.changePassword({
                current_password: currentPassword,
                new_password: newPassword,
            });


            setMessage({
                type: "success",
                text: "Password changed successfully.",
            });


            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");


        } catch (error: any) {

            console.error(
                "Change password error:",
                error
            );


            const responseData =
                error?.response?.data;


            let errorMessage =
                "Failed to change password. Please check your current password.";


            if (
                responseData?.detail
            ) {

                errorMessage =
                    String(
                        responseData.detail
                    );

            } else if (
                responseData?.old_password
            ) {

                errorMessage =
                    Array.isArray(
                        responseData.old_password
                    )
                        ? String(
                            responseData.old_password[0]
                        )
                        : String(
                            responseData.old_password
                        );

            } else if (
                responseData?.new_password
            ) {

                errorMessage =
                    Array.isArray(
                        responseData.new_password
                    )
                        ? String(
                            responseData.new_password[0]
                        )
                        : String(
                            responseData.new_password
                        );

            }


            setMessage({
                type: "error",
                text: errorMessage,
            });


        } finally {

            setLoading(false);

        }

    }


    return (

        <div className="mx-auto w-full max-w-6xl space-y-6">


            {/* =====================================================
                PAGE HEADER
            ====================================================== */}

            <div className="
                overflow-hidden
                rounded-2xl
                bg-gradient-to-r
                from-slate-950
                via-blue-950
                to-blue-900
                shadow-lg
            ">

                <div className="
                    flex
                    flex-col
                    gap-5
                    px-6
                    py-7
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                    sm:px-8
                ">


                    <div>

                        <div className="
                            mb-2
                            flex
                            items-center
                            gap-2
                        ">

                            <ShieldCheck
                                size={20}
                                className="text-blue-300"
                            />

                            <span className="
                                text-xs
                                font-bold
                                uppercase
                                tracking-[0.18em]
                                text-blue-300
                            ">
                                NIRIKSHAN
                            </span>

                        </div>


                        <h1 className="
                            text-2xl
                            font-bold
                            text-white
                            sm:text-3xl
                        ">
                            My Profile
                        </h1>


                        <p className="
                            mt-1
                            text-sm
                            text-slate-300
                        ">
                            Manage your account information
                            and security settings.
                        </p>

                    </div>


                    {/* USER AVATAR */}

                    <div className="
                        flex
                        items-center
                        gap-3
                    ">

                        <div className="
                            flex
                            h-14
                            w-14
                            shrink-0
                            items-center
                            justify-center
                            rounded-full
                            bg-blue-600
                            text-lg
                            font-bold
                            text-white
                            ring-4
                            ring-white/10
                        ">
                            {initials}
                        </div>


                        <div>

                            <p className="
                                font-semibold
                                text-white
                            ">
                                {user?.full_name || "User"}
                            </p>

                            <p className="
                                text-sm
                                text-blue-200
                            ">
                                {user?.designation || "Employee"}
                            </p>

                        </div>

                    </div>

                </div>

            </div>


            {/* =====================================================
                PROFILE INFORMATION
            ====================================================== */}

            <div className="
                overflow-hidden
                rounded-2xl
                border
                border-slate-200
                bg-white
                shadow-sm
            ">


                <div className="
                    border-b
                    border-slate-200
                    px-6
                    py-5
                    sm:px-8
                ">

                    <div className="
                        flex
                        items-center
                        gap-3
                    ">

                        <div className="
                            flex
                            h-10
                            w-10
                            items-center
                            justify-center
                            rounded-xl
                            bg-blue-50
                            text-blue-700
                        ">

                            <User size={20} />

                        </div>


                        <div>

                            <h2 className="
                                font-bold
                                text-slate-900
                            ">
                                Personal Information
                            </h2>

                            <p className="
                                text-xs
                                text-slate-500
                            ">
                                Your registered employee details
                            </p>

                        </div>

                    </div>

                </div>


                <div className="
                    grid
                    grid-cols-1
                    gap-6
                    px-6
                    py-6
                    sm:grid-cols-2
                    sm:px-8
                    lg:grid-cols-3
                ">


                    {/* EMPLOYEE ID */}

                    <ProfileItem
                        icon={<User size={18} />}
                        label="Employee ID"
                        value={user?.emp_id}
                    />


                    {/* FULL NAME */}

                    <ProfileItem
                        icon={<User size={18} />}
                        label="Full Name"
                        value={user?.full_name}
                    />


                    {/* DESIGNATION */}

                    <ProfileItem
                        icon={<BriefcaseBusiness size={18} />}
                        label="Designation"
                        value={user?.designation}
                    />


                    {/* DEPARTMENT */}

                    <ProfileItem
                        icon={<Building2 size={18} />}
                        label="Department"
                        value={user?.department}
                    />


                    {/* COMPANY */}

                    <ProfileItem
                        icon={<Building2 size={18} />}
                        label="Company"
                        value={user?.company}
                    />


                    {/* EMAIL */}

                    <ProfileItem
                        icon={<Mail size={18} />}
                        label="Official Email"
                        value={user?.email}
                    />


                    {/* MOBILE */}

                    <ProfileItem
                        icon={<Phone size={18} />}
                        label="Mobile Number"
                        value={user?.mobile_number}
                    />


                    {/* ACCESS LEVEL */}

                    <div>

                        <div className="
                            mb-2
                            flex
                            items-center
                            gap-2
                        ">

                            <div className="
                                text-blue-600
                            ">

                                <ShieldCheck size={18} />

                            </div>

                            <span className="
                                text-xs
                                font-semibold
                                uppercase
                                tracking-wide
                                text-slate-500
                            ">
                                Access Level
                            </span>

                        </div>


                        <div>

                            <span className={`
                                inline-flex
                                items-center
                                rounded-full
                                px-3
                                py-1
                                text-xs
                                font-bold

                                ${
                                    user?.is_admin
                                        ? "bg-purple-100 text-purple-700"
                                        : "bg-blue-100 text-blue-700"
                                }
                            `}>

                                {user?.is_admin
                                    ? "Administrator"
                                    : "Engineer"}

                            </span>

                        </div>

                    </div>


                    {/* ACCOUNT STATUS */}

                    <div>

                        <div className="
                            mb-2
                            flex
                            items-center
                            gap-2
                        ">

                            <div className="
                                text-blue-600
                            ">

                                <CheckCircle2 size={18} />

                            </div>

                            <span className="
                                text-xs
                                font-semibold
                                uppercase
                                tracking-wide
                                text-slate-500
                            ">
                                Account Status
                            </span>

                        </div>


                        <span className="
                            inline-flex
                            items-center
                            gap-1.5
                            rounded-full
                            bg-green-100
                            px-3
                            py-1
                            text-xs
                            font-bold
                            text-green-700
                        ">

                            <span className="
                                h-1.5
                                w-1.5
                                rounded-full
                                bg-green-500
                            " />

                            Active

                        </span>

                    </div>

                </div>

            </div>


            {/* =====================================================
                CHANGE PASSWORD
            ====================================================== */}

            <div className="
                overflow-hidden
                rounded-2xl
                border
                border-slate-200
                bg-white
                shadow-sm
            ">


                <div className="
                    border-b
                    border-slate-200
                    px-6
                    py-5
                    sm:px-8
                ">

                    <div className="
                        flex
                        items-center
                        gap-3
                    ">

                        <div className="
                            flex
                            h-10
                            w-10
                            items-center
                            justify-center
                            rounded-xl
                            bg-blue-50
                            text-blue-700
                        ">

                            <KeyRound size={20} />

                        </div>


                        <div>

                            <h2 className="
                                font-bold
                                text-slate-900
                            ">
                                Change Password
                            </h2>

                            <p className="
                                text-xs
                                text-slate-500
                            ">
                                Keep your NIRIKSHAN account secure.
                            </p>

                        </div>

                    </div>

                </div>


                <div className="
                    px-6
                    py-6
                    sm:px-8
                ">


                    {/* MESSAGE */}

                    {message && (

                        <div className={`
                            mb-6
                            flex
                            items-start
                            gap-3
                            rounded-xl
                            border
                            px-4
                            py-3

                            ${
                                message.type === "success"
                                    ? "border-green-200 bg-green-50 text-green-700"
                                    : "border-red-200 bg-red-50 text-red-700"
                            }
                        `}>

                            {message.type === "success" ? (

                                <CheckCircle2
                                    size={20}
                                    className="mt-0.5 shrink-0"
                                />

                            ) : (

                                <AlertCircle
                                    size={20}
                                    className="mt-0.5 shrink-0"
                                />

                            )}


                            <span className="
                                text-sm
                                font-medium
                            ">
                                {message.text}
                            </span>

                        </div>

                    )}


                    <form
                        onSubmit={handlePasswordChange}
                        className="
                            max-w-2xl
                            space-y-5
                        "
                    >


                        {/* CURRENT PASSWORD */}

                        <PasswordField
                            label="Current Password"
                            value={currentPassword}
                            onChange={setCurrentPassword}
                            visible={showCurrentPassword}
                            setVisible={setShowCurrentPassword}
                            autoComplete="current-password"
                        />


                        {/* NEW PASSWORD */}

                        <PasswordField
                            label="New Password"
                            value={newPassword}
                            onChange={setNewPassword}
                            visible={showNewPassword}
                            setVisible={setShowNewPassword}
                            autoComplete="new-password"
                        />


                        {/* CONFIRM PASSWORD */}

                        <PasswordField
                            label="Confirm New Password"
                            value={confirmPassword}
                            onChange={setConfirmPassword}
                            visible={showConfirmPassword}
                            setVisible={setShowConfirmPassword}
                            autoComplete="new-password"
                        />


                        {/* PASSWORD REQUIREMENT */}

                        <div className="
                            rounded-xl
                            bg-slate-50
                            border
                            border-slate-200
                            px-4
                            py-3
                        ">

                            <p className="
                                text-xs
                                font-semibold
                                text-slate-600
                            ">
                                Password requirement
                            </p>

                            <p className="
                                mt-1
                                text-xs
                                text-slate-500
                            ">
                                Use at least 8 characters.
                            </p>

                        </div>


                        {/* BUTTON */}

                        <button
                            type="submit"
                            disabled={loading}
                            className="
                                inline-flex
                                items-center
                                justify-center
                                gap-2
                                rounded-xl
                                bg-blue-700
                                px-5
                                py-3
                                font-semibold
                                text-white
                                shadow-md
                                shadow-blue-900/20
                                transition
                                hover:bg-blue-800
                                active:scale-[0.99]
                                disabled:cursor-not-allowed
                                disabled:opacity-60
                            "
                        >

                            <KeyRound size={18} />

                            {loading
                                ? "Updating Password..."
                                : "Update Password"}

                        </button>

                    </form>

                </div>

            </div>

        </div>

    );
}


/* ================================================================
   PROFILE ITEM
================================================================ */

interface ProfileItemProps {

    icon: React.ReactNode;

    label: string;

    value?: string | null;

}


function ProfileItem({
    icon,
    label,
    value,
}: ProfileItemProps) {

    return (

        <div>

            <div className="
                mb-2
                flex
                items-center
                gap-2
            ">

                <div className="
                    text-blue-600
                ">
                    {icon}
                </div>

                <span className="
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wide
                    text-slate-500
                ">
                    {label}
                </span>

            </div>


            <p className="
                break-words
                text-sm
                font-semibold
                text-slate-900
            ">
                {value || "N/A"}
            </p>

        </div>

    );
}


/* ================================================================
   PASSWORD FIELD
================================================================ */

interface PasswordFieldProps {

    label: string;

    value: string;

    onChange: (value: string) => void;

    visible: boolean;

    setVisible: (
        value: boolean
    ) => void;

    autoComplete: string;

}


function PasswordField({
    label,
    value,
    onChange,
    visible,
    setVisible,
    autoComplete,
}: PasswordFieldProps) {

    return (

        <div>

            <label className="
                mb-2
                block
                text-sm
                font-semibold
                text-slate-700
            ">
                {label}
            </label>


            <div className="relative">

                <input
                    type={
                        visible
                            ? "text"
                            : "password"
                    }
                    required
                    value={value}
                    onChange={(e) =>
                        onChange(
                            e.target.value
                        )
                    }
                    autoComplete={autoComplete}
                    placeholder="Enter password"
                    className="
                        w-full
                        rounded-xl
                        border
                        border-slate-300
                        bg-slate-50
                        px-4
                        py-3
                        pr-12
                        text-sm
                        text-slate-900
                        outline-none
                        transition

                        placeholder:text-slate-400

                        focus:border-blue-600
                        focus:bg-white
                        focus:ring-4
                        focus:ring-blue-100
                    "
                />


                <button
                    type="button"
                    onClick={() =>
                        setVisible(!visible)
                    }
                    className="
                        absolute
                        right-3
                        top-1/2
                        -translate-y-1/2
                        rounded-lg
                        p-1.5
                        text-slate-400
                        transition
                        hover:bg-blue-50
                        hover:text-blue-700
                    "
                    aria-label={
                        visible
                            ? "Hide password"
                            : "Show password"
                    }
                >

                    {visible ? (

                        <EyeOff size={19} />

                    ) : (

                        <Eye size={19} />

                    )}

                </button>

            </div>

        </div>

    );
}