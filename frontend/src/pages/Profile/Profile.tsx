import { useState, type FormEvent, type ReactNode } from "react";
import {
    User,
    Mail,
    Phone,
    Building2,
    BriefcaseBusiness,
    ShieldCheck,
    KeyRound,
    CheckCircle2,
    AlertCircle,
    Eye,
    EyeOff,
    BadgeCheck,
} from "lucide-react";

import useAuth from "../../hooks/useAuth";
import inspectionService from "../../services/inspectionService";


export default function Profile() {

    const { user } = useAuth();


    /* ============================================================
       PASSWORD STATE
    ============================================================ */

    const [currentPassword, setCurrentPassword] =
        useState("");

    const [newPassword, setNewPassword] =
        useState("");

    const [confirmPassword, setConfirmPassword] =
        useState("");


    /* ============================================================
       PASSWORD VISIBILITY
    ============================================================ */

    const [showCurrentPassword, setShowCurrentPassword] =
        useState(false);

    const [showNewPassword, setShowNewPassword] =
        useState(false);

    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);


    /* ============================================================
       UI STATE
    ============================================================ */

    const [loading, setLoading] =
        useState(false);

    const [message, setMessage] =
        useState<{
            type: "success" | "error";
            text: string;
        } | null>(null);


    /* ============================================================
       INITIALS
    ============================================================ */

    const initials =
        user?.full_name
            ?.trim()
            .split(/\s+/)
            .filter(Boolean)
            .map((name) => name[0])
            .join("")
            .slice(0, 2)
            .toUpperCase() || "U";


    /* ============================================================
       CHANGE PASSWORD
    ============================================================ */

    async function handlePasswordChange(
        e: FormEvent<HTMLFormElement>
    ) {

        e.preventDefault();

        setMessage(null);


        /* Current password */

        if (!currentPassword.trim()) {

            setMessage({
                type: "error",
                text: "Please enter your current password.",
            });

            return;
        }


        /* Minimum password length */

        if (newPassword.length < 8) {

            setMessage({
                type: "error",
                text: "New password must be at least 8 characters long.",
            });

            return;
        }


        /* Password confirmation */

        if (newPassword !== confirmPassword) {

            setMessage({
                type: "error",
                text: "New passwords do not match.",
            });

            return;
        }


        /* Prevent same password */

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

                current_password:
                    currentPassword,

                new_password:
                    newPassword,

            });


            setMessage({

                type: "success",

                text:
                    "Password changed successfully.",

            });


            /* Clear fields */

            setCurrentPassword("");

            setNewPassword("");

            setConfirmPassword("");


        } catch (error: any) {

            console.error(
                "Change password error:",
                error
            );


            const data =
                error?.response?.data;


            let errorMessage =
                "Failed to change password. Please check your current password.";


            if (data?.detail) {

                errorMessage =
                    String(data.detail);

            } else if (data?.old_password) {

                errorMessage =
                    Array.isArray(
                        data.old_password
                    )
                        ? String(
                            data.old_password[0]
                        )
                        : String(
                            data.old_password
                        );

            } else if (data?.new_password) {

                errorMessage =
                    Array.isArray(
                        data.new_password
                    )
                        ? String(
                            data.new_password[0]
                        )
                        : String(
                            data.new_password
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

        <div
            className="
                mx-auto
                w-full
                max-w-6xl
                space-y-5
                sm:space-y-6
            "
        >


            {/* =====================================================
                PROFILE HERO
            ====================================================== */}

            <section
                className="
                    relative
                    overflow-hidden
                    rounded-2xl

                    bg-gradient-to-br
                    from-slate-950
                    via-blue-950
                    to-blue-800

                    shadow-lg
                "
            >

                {/* Decorative background */}

                <div
                    className="
                        pointer-events-none
                        absolute
                        -right-20
                        -top-20
                        h-48
                        w-48
                        rounded-full
                        bg-blue-500/10
                        blur-2xl
                    "
                />

                <div
                    className="
                        pointer-events-none
                        absolute
                        -bottom-24
                        -left-16
                        h-48
                        w-48
                        rounded-full
                        bg-blue-400/10
                        blur-2xl
                    "
                />


                <div
                    className="
                        relative
                        flex
                        flex-col
                        gap-5

                        px-5
                        py-6

                        sm:px-8
                        sm:py-7

                        lg:flex-row
                        lg:items-center
                        lg:justify-between
                    "
                >


                    {/* LEFT */}

                    <div>

                        <div
                            className="
                                mb-2
                                flex
                                items-center
                                gap-2
                            "
                        >

                            <ShieldCheck
                                size={19}
                                className="text-blue-300"
                            />

                            <span
                                className="
                                    text-xs
                                    font-bold
                                    uppercase
                                    tracking-[0.18em]
                                    text-blue-300
                                "
                            >
                                NIRIKSHAN
                            </span>

                        </div>


                        <h1
                            className="
                                text-[26px]
                                font-bold
                                leading-tight
                                text-white

                                sm:text-3xl
                            "
                        >
                            My Profile
                        </h1>


                        <p
                            className="
                                mt-2
                                max-w-xl
                                text-sm
                                leading-6
                                text-slate-300

                                sm:text-base
                            "
                        >
                            Manage your employee information
                            and account security.
                        </p>

                    </div>


                    {/* USER */}

                    <div
                        className="
                            flex
                            items-center
                            gap-3
                        "
                    >

                        {/* Avatar */}

                        <div
                            className="
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

                                sm:h-16
                                sm:w-16
                                sm:text-xl
                            "
                        >

                            {initials}

                        </div>


                        {/* Name */}

                        <div
                            className="
                                min-w-0
                            "
                        >

                            <p
                                className="
                                    truncate
                                    text-base
                                    font-bold
                                    text-white

                                    sm:text-lg
                                "
                            >
                                {user?.full_name || "User"}
                            </p>


                            <p
                                className="
                                    truncate
                                    text-sm
                                    text-blue-200
                                "
                            >
                                {user?.designation || "Employee"}
                            </p>

                        </div>

                    </div>

                </div>

            </section>


            {/* =====================================================
                PERSONAL INFORMATION
            ====================================================== */}

            <section
                className="
                    overflow-hidden
                    rounded-2xl

                    border
                    border-slate-200

                    bg-white

                    shadow-sm
                "
            >


                {/* SECTION HEADER */}

                <div
                    className="
                        flex
                        items-center
                        gap-3

                        border-b
                        border-slate-200

                        px-5
                        py-5

                        sm:px-7
                    "
                >

                    <div
                        className="
                            flex
                            h-10
                            w-10
                            shrink-0
                            items-center
                            justify-center

                            rounded-xl

                            bg-blue-50
                            text-blue-700
                        "
                    >

                        <User size={20} />

                    </div>


                    <div>

                        <h2
                            className="
                                text-base
                                font-bold
                                text-slate-900

                                sm:text-lg
                            "
                        >
                            Personal Information
                        </h2>


                        <p
                            className="
                                text-xs
                                text-slate-500

                                sm:text-sm
                            "
                        >
                            Your registered employee details
                        </p>

                    </div>

                </div>


                {/* INFORMATION */}

                <div
                    className="
                        grid
                        grid-cols-1

                        gap-x-8
                        gap-y-6

                        px-5
                        py-6

                        sm:grid-cols-2
                        sm:px-7

                        lg:grid-cols-3
                    "
                >


                    <ProfileItem
                        icon={<User size={18} />}
                        label="Employee ID"
                        value={user?.emp_id}
                    />


                    <ProfileItem
                        icon={<User size={18} />}
                        label="Full Name"
                        value={user?.full_name}
                    />


                    <ProfileItem
                        icon={<BriefcaseBusiness size={18} />}
                        label="Designation"
                        value={user?.designation}
                    />


                    <ProfileItem
                        icon={<Building2 size={18} />}
                        label="Department"
                        value={user?.department}
                    />


                    <ProfileItem
                        icon={<Building2 size={18} />}
                        label="Company"
                        value={user?.company}
                    />


                    <ProfileItem
                        icon={<Mail size={18} />}
                        label="Official Email"
                        value={user?.email}
                    />


                    <ProfileItem
                        icon={<Phone size={18} />}
                        label="Mobile Number"
                        value={user?.mobile_number}
                    />


                    {/* ACCESS LEVEL */}

                    <div>

                        <ProfileLabel
                            icon={
                                <ShieldCheck
                                    size={18}
                                />
                            }
                            label="Access Level"
                        />


                        <span
                            className={`
                                inline-flex
                                items-center
                                gap-1.5

                                rounded-full

                                px-3
                                py-1.5

                                text-xs
                                font-bold

                                ${
                                    user?.is_admin
                                        ? "bg-purple-100 text-purple-700"
                                        : "bg-blue-100 text-blue-700"
                                }
                            `}
                        >

                            <BadgeCheck size={14} />

                            {user?.is_admin
                                ? "Administrator"
                                : "Engineer"}

                        </span>

                    </div>


                    {/* ACCOUNT STATUS */}

                    <div>

                        <ProfileLabel
                            icon={
                                <CheckCircle2
                                    size={18}
                                />
                            }
                            label="Account Status"
                        />


                        <span
                            className="
                                inline-flex
                                items-center
                                gap-2

                                rounded-full

                                bg-green-100

                                px-3
                                py-1.5

                                text-xs
                                font-bold
                                text-green-700
                            "
                        >

                            <span
                                className="
                                    h-1.5
                                    w-1.5
                                    rounded-full
                                    bg-green-500
                                "
                            />

                            Active

                        </span>

                    </div>

                </div>

            </section>


            {/* =====================================================
                SECURITY
            ====================================================== */}

            <section
                className="
                    overflow-hidden
                    rounded-2xl

                    border
                    border-slate-200

                    bg-white

                    shadow-sm
                "
            >


                {/* HEADER */}

                <div
                    className="
                        flex
                        items-center
                        gap-3

                        border-b
                        border-slate-200

                        px-5
                        py-5

                        sm:px-7
                    "
                >

                    <div
                        className="
                            flex
                            h-10
                            w-10
                            shrink-0
                            items-center
                            justify-center

                            rounded-xl

                            bg-blue-50
                            text-blue-700
                        "
                    >

                        <KeyRound size={20} />

                    </div>


                    <div>

                        <h2
                            className="
                                text-base
                                font-bold
                                text-slate-900

                                sm:text-lg
                            "
                        >
                            Account Security
                        </h2>


                        <p
                            className="
                                text-xs
                                text-slate-500

                                sm:text-sm
                            "
                        >
                            Change your NIRIKSHAN password
                        </p>

                    </div>

                </div>


                {/* SECURITY CONTENT */}

                <div
                    className="
                        px-5
                        py-6

                        sm:px-7
                    "
                >


                    {/* MESSAGE */}

                    {message && (

                        <div
                            className={`
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
                            `}
                        >

                            {message.type === "success" ? (

                                <CheckCircle2
                                    size={20}
                                    className="
                                        mt-0.5
                                        shrink-0
                                    "
                                />

                            ) : (

                                <AlertCircle
                                    size={20}
                                    className="
                                        mt-0.5
                                        shrink-0
                                    "
                                />

                            )}


                            <p
                                className="
                                    text-sm
                                    font-medium
                                    leading-5
                                "
                            >
                                {message.text}
                            </p>

                        </div>

                    )}


                    <form
                        onSubmit={
                            handlePasswordChange
                        }
                        className="
                            max-w-2xl
                            space-y-5
                        "
                    >


                        <PasswordField
                            label="Current Password"
                            value={currentPassword}
                            onChange={
                                setCurrentPassword
                            }
                            visible={
                                showCurrentPassword
                            }
                            setVisible={
                                setShowCurrentPassword
                            }
                            autoComplete="current-password"
                        />


                        <PasswordField
                            label="New Password"
                            value={newPassword}
                            onChange={
                                setNewPassword
                            }
                            visible={
                                showNewPassword
                            }
                            setVisible={
                                setShowNewPassword
                            }
                            autoComplete="new-password"
                        />


                        <PasswordField
                            label="Confirm New Password"
                            value={confirmPassword}
                            onChange={
                                setConfirmPassword
                            }
                            visible={
                                showConfirmPassword
                            }
                            setVisible={
                                setShowConfirmPassword
                            }
                            autoComplete="new-password"
                        />


                        {/* PASSWORD INFO */}

                        <div
                            className="
                                rounded-xl

                                border
                                border-slate-200

                                bg-slate-50

                                px-4
                                py-3
                            "
                        >

                            <div
                                className="
                                    flex
                                    items-center
                                    gap-2
                                "
                            >

                                <ShieldCheck
                                    size={16}
                                    className="text-blue-600"
                                />

                                <p
                                    className="
                                        text-xs
                                        font-semibold
                                        text-slate-700
                                    "
                                >
                                    Password requirement
                                </p>

                            </div>


                            <p
                                className="
                                    mt-1
                                    pl-6
                                    text-xs
                                    text-slate-500
                                "
                            >
                                Password must contain at least
                                8 characters.
                            </p>

                        </div>


                        {/* BUTTON */}

                        <button
                            type="submit"
                            disabled={loading}
                            className="
                                flex
                                w-full
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

                                sm:w-auto
                            "
                        >

                            <KeyRound size={18} />

                            {loading
                                ? "Updating Password..."
                                : "Update Password"}

                        </button>

                    </form>

                </div>

            </section>


            {/* =====================================================
                MOBILE BOTTOM SPACE
            ====================================================== */}

            <div className="h-4 sm:hidden" />

        </div>

    );
}


/* =================================================================
   PROFILE LABEL
================================================================= */

interface ProfileLabelProps {

    icon: ReactNode;

    label: string;

}


function ProfileLabel({
    icon,
    label,
}: ProfileLabelProps) {

    return (

        <div
            className="
                mb-2
                flex
                items-center
                gap-2
            "
        >

            <span
                className="
                    text-blue-600
                "
            >
                {icon}
            </span>


            <span
                className="
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wide
                    text-slate-500
                "
            >
                {label}
            </span>

        </div>

    );
}


/* =================================================================
   PROFILE ITEM
================================================================= */

interface ProfileItemProps {

    icon: ReactNode;

    label: string;

    value?: string | null;

}


function ProfileItem({
    icon,
    label,
    value,
}: ProfileItemProps) {

    return (

        <div className="min-w-0">

            <ProfileLabel
                icon={icon}
                label={label}
            />


            <p
                className="
                    break-words

                    text-sm
                    font-semibold
                    leading-6
                    text-slate-900

                    sm:text-base
                "
            >
                {value || "N/A"}
            </p>

        </div>

    );
}


/* =================================================================
   PASSWORD FIELD
================================================================= */

interface PasswordFieldProps {

    label: string;

    value: string;

    onChange: (
        value: string
    ) => void;

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

            <label
                className="
                    mb-2
                    block

                    text-sm
                    font-semibold
                    text-slate-700
                "
            >
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

                    autoComplete={
                        autoComplete
                    }

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
                        setVisible(
                            !visible
                        )
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