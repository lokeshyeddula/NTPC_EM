import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    Eye,
    EyeOff,
    UserPlus,
    ShieldCheck,
} from "lucide-react";

import ntpcLogo from "../../assets/Ntpc_logo.png";
import nmlLogo from "../../assets/nml_logo.png";

import useAuth from "../../hooks/useAuth";


function toTitleCase(value: string): string {
    return value
        .toLowerCase()
        .replace(/\s+/g, " ")
        .trim()
        .replace(/\b\w/g, (char) => char.toUpperCase());
}


export default function Register() {

    const navigate = useNavigate();

    const { register } = useAuth();


    const [form, setForm] = useState({

        emp_id: "",

        full_name: "",

        designation: "",

        department: "",

        company: "NTPC",

        email: "",

        mobile_number: "",

        password: "",

        confirm_password: "",

    });


    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [showPassword, setShowPassword] =
        useState(false);

    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);


    function handleChange(
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement
        >
    ) {

        const {
            name,
            value,
        } = e.target;


        let formattedValue = value;


        // Full Name → Title Case

        if (name === "full_name") {

            formattedValue =
                toTitleCase(value);

        }


        // Designation → Title Case

        if (name === "designation") {

            formattedValue =
                toTitleCase(value);

        }


        setForm((previous) => ({

            ...previous,

            [name]: formattedValue,

        }));

    }


    async function handleSubmit(
        e: React.FormEvent<HTMLFormElement>
    ) {

        e.preventDefault();

        setError("");


        // Password validation

        if (
            form.password !==
            form.confirm_password
        ) {

            setError(
                "Passwords do not match."
            );

            return;

        }


        try {

            setLoading(true);


            // Normalize before sending

            const registrationData = {

                ...form,

                full_name:
                    toTitleCase(
                        form.full_name
                    ),

                designation:
                    toTitleCase(
                        form.designation
                    ),

            };


            await register(
                registrationData
            );


            navigate(
                "/dashboard"
            );


        } catch (err: any) {

            if (
                err.response?.data
            ) {

                const data =
                    err.response.data;


                const firstError =
                    Object.values(data)[0];


                setError(

                    Array.isArray(
                        firstError
                    )

                        ? String(
                            firstError[0]
                        )

                        : String(
                            firstError
                        )

                );

            } else {

                setError(
                    "Registration failed."
                );

            }

        } finally {

            setLoading(false);

        }

    }


    return (

        <div className="
            min-h-screen
            bg-slate-100
            flex
            items-center
            justify-center
            px-4
            py-6
            sm:py-10
        ">


            <div className="
                w-full
                max-w-5xl
                overflow-hidden
                rounded-2xl
                bg-white
                shadow-2xl
                border
                border-slate-200
            ">


                {/* =================================================
                    BRANDING
                ================================================== */}

                <div className="
                    bg-gradient-to-r
                    from-slate-950
                    via-blue-950
                    to-blue-900
                    px-4
                    py-5
                    sm:px-8
                    sm:py-6
                ">

                    <div className="
                        flex
                        items-center
                        justify-between
                        gap-2
                        sm:gap-6
                    ">


                        {/* NTPC */}

                        <div className="
                            flex
                            h-16
                            w-20
                            shrink-0
                            items-center
                            justify-center
                            rounded-xl
                            bg-white
                            px-2
                            shadow-md
                            sm:h-16
                            sm:w-24
                            sm:px-3
                        ">

                            <img
                                src={ntpcLogo}
                                alt="NTPC"
                                className="
                                    h-12
                                    w-auto
                                    max-w-[72px]
                                    object-contain
                                    sm:h-12
                                    sm:max-w-[82px]
                                "
                            />

                        </div>


                        {/* NIRIKSHAN */}

                        <div className="
                            min-w-0
                            flex-1
                            text-center
                        ">

                            <div className="
                                flex
                                items-center
                                justify-center
                                gap-1.5
                                sm:gap-2
                            ">

                                <ShieldCheck
                                    size={22}
                                    className="
                                        shrink-0
                                        text-blue-300
                                        sm:h-6
                                        sm:w-6
                                    "
                                />

                                <h1 className="
                                    text-[21px]
                                    font-extrabold
                                    tracking-[0.08em]
                                    text-white
                                    sm:text-2xl
                                    sm:tracking-wider
                                ">
                                    NIRIKSHAN
                                </h1>

                            </div>


                            <p className="
                                mt-1
                                text-[8px]
                                font-semibold
                                uppercase
                                tracking-[0.14em]
                                leading-3
                                text-blue-200
                                sm:text-[10px]
                                sm:tracking-[0.18em]
                            ">
                                Digital Machinery
                                <br className="sm:hidden" />
                                <span className="sm:hidden">
                                    {" "}Inspection
                                </span>
                                <span className="hidden sm:inline">
                                    {" "}Inspection
                                </span>
                            </p>

                        </div>


                        {/* NML */}

                        <div className="
                            flex
                            h-16
                            w-20
                            shrink-0
                            items-center
                            justify-center
                            rounded-xl
                            bg-white
                            px-2
                            shadow-md
                            sm:h-16
                            sm:w-24
                            sm:px-3
                        ">

                            <img
                                src={nmlLogo}
                                alt="NML"
                                className="
                                    h-12
                                    w-auto
                                    max-w-[72px]
                                    object-contain
                                    sm:h-12
                                    sm:max-w-[82px]
                                "
                            />

                        </div>

                    </div>

                </div>


                {/* =================================================
                    CONTENT
                ================================================== */}

                <div className="
                    grid
                    grid-cols-1
                    lg:grid-cols-2
                ">


                    {/* =================================================
                        LEFT INFORMATION PANEL
                    ================================================== */}

                    <div className="
                        hidden
                        lg:flex
                        flex-col
                        justify-center
                        bg-gradient-to-br
                        from-blue-950
                        to-slate-900
                        p-10
                        text-white
                    ">

                        <div className="max-w-md">

                            <div className="
                                mb-6
                                flex
                                h-14
                                w-14
                                items-center
                                justify-center
                                rounded-2xl
                                bg-blue-600
                                shadow-lg
                                shadow-blue-950/40
                            ">

                                <UserPlus
                                    size={30}
                                />

                            </div>


                            <h2 className="
                                text-3xl
                                font-bold
                                leading-tight
                            ">

                                Join

                                <span className="
                                    block
                                    text-blue-400
                                ">
                                    NIRIKSHAN
                                </span>

                            </h2>


                            <p className="
                                mt-5
                                text-sm
                                leading-6
                                text-slate-300
                            ">

                                Create your account to
                                access the digital machinery
                                inspection management system
                                for NML Talaipalli E&M.

                            </p>


                            <div className="
                                mt-8
                                space-y-3
                            ">


                                <div className="
                                    flex
                                    items-center
                                    gap-3
                                ">

                                    <span className="
                                        h-2
                                        w-2
                                        rounded-full
                                        bg-green-400
                                    " />

                                    <span className="
                                        text-sm
                                        text-slate-300
                                    ">
                                        Digital Inspection Records
                                    </span>

                                </div>


                                <div className="
                                    flex
                                    items-center
                                    gap-3
                                ">

                                    <span className="
                                        h-2
                                        w-2
                                        rounded-full
                                        bg-green-400
                                    " />

                                    <span className="
                                        text-sm
                                        text-slate-300
                                    ">
                                        Safety Checklist Management
                                    </span>

                                </div>


                                <div className="
                                    flex
                                    items-center
                                    gap-3
                                ">

                                    <span className="
                                        h-2
                                        w-2
                                        rounded-full
                                        bg-green-400
                                    " />

                                    <span className="
                                        text-sm
                                        text-slate-300
                                    ">
                                        Re-Inspection Tracking
                                    </span>

                                </div>


                                <div className="
                                    flex
                                    items-center
                                    gap-3
                                ">

                                    <span className="
                                        h-2
                                        w-2
                                        rounded-full
                                        bg-green-400
                                    " />

                                    <span className="
                                        text-sm
                                        text-slate-300
                                    ">
                                        Reports & History
                                    </span>

                                </div>

                            </div>


                            <div className="
                                mt-10
                                border-t
                                border-slate-700
                                pt-5
                            ">

                                <p className="
                                    text-xs
                                    font-semibold
                                    uppercase
                                    tracking-wider
                                    text-blue-300
                                ">
                                    NML Talaipalli
                                </p>

                                <p className="
                                    mt-1
                                    text-xs
                                    text-slate-400
                                ">
                                    E&M Division
                                </p>

                            </div>

                        </div>

                    </div>


                    {/* =================================================
                        REGISTRATION FORM
                    ================================================== */}

                    <div className="
                        p-6
                        sm:p-10
                        lg:p-10
                    ">


                        {/* TITLE */}

                        <div className="mb-7">

                            <p className="
                                text-xs
                                font-bold
                                uppercase
                                tracking-widest
                                text-blue-600
                            ">
                                New User
                            </p>

                            <h2 className="
                                mt-2
                                text-2xl
                                sm:text-3xl
                                font-bold
                                text-slate-900
                            ">
                                Create Account
                            </h2>

                            <p className="
                                mt-2
                                text-sm
                                text-slate-500
                            ">
                                Enter your employee details
                                to create your NIRIKSHAN account.
                            </p>

                        </div>


                        {/* ERROR */}

                        {error && (

                            <div className="
                                mb-5
                                rounded-xl
                                border
                                border-red-200
                                bg-red-50
                                px-4
                                py-3
                                text-sm
                                font-medium
                                text-red-700
                            ">

                                {error}

                            </div>

                        )}


                        {/* FORM */}

                        <form
                            onSubmit={handleSubmit}
                            className="
                                grid
                                grid-cols-1
                                sm:grid-cols-2
                                gap-4
                            "
                        >


                            {/* EMPLOYEE ID */}

                            <div>

                                <label className="
                                    mb-1.5
                                    block
                                    text-sm
                                    font-semibold
                                    text-slate-700
                                ">
                                    Employee ID
                                </label>

                                <input
                                    type="text"
                                    name="emp_id"
                                    placeholder="Enter Employee ID"
                                    value={form.emp_id}
                                    onChange={handleChange}
                                    autoComplete="username"
                                    className="
                                        w-full
                                        rounded-xl
                                        border
                                        border-slate-300
                                        bg-slate-50
                                        px-4
                                        py-3
                                        text-sm
                                        outline-none
                                        transition
                                        focus:border-blue-600
                                        focus:bg-white
                                        focus:ring-4
                                        focus:ring-blue-100
                                    "
                                    required
                                />

                            </div>


                            {/* FULL NAME */}

                            <div>

                                <label className="
                                    mb-1.5
                                    block
                                    text-sm
                                    font-semibold
                                    text-slate-700
                                ">
                                    Full Name
                                </label>

                                <input
                                    type="text"
                                    name="full_name"
                                    placeholder="Enter Full Name"
                                    value={form.full_name}
                                    onChange={handleChange}
                                    className="
                                        w-full
                                        rounded-xl
                                        border
                                        border-slate-300
                                        bg-slate-50
                                        px-4
                                        py-3
                                        text-sm
                                        outline-none
                                        transition
                                        focus:border-blue-600
                                        focus:bg-white
                                        focus:ring-4
                                        focus:ring-blue-100
                                    "
                                    required
                                />

                            </div>


                            {/* DESIGNATION */}

                            <div>

                                <label className="
                                    mb-1.5
                                    block
                                    text-sm
                                    font-semibold
                                    text-slate-700
                                ">
                                    Designation
                                </label>

                                <input
                                    type="text"
                                    name="designation"
                                    placeholder="Enter Designation"
                                    value={form.designation}
                                    onChange={handleChange}
                                    className="
                                        w-full
                                        rounded-xl
                                        border
                                        border-slate-300
                                        bg-slate-50
                                        px-4
                                        py-3
                                        text-sm
                                        outline-none
                                        transition
                                        focus:border-blue-600
                                        focus:bg-white
                                        focus:ring-4
                                        focus:ring-blue-100
                                    "
                                    required
                                />

                            </div>


                            {/* DEPARTMENT */}

                            <div>

                                <label className="
                                    mb-1.5
                                    block
                                    text-sm
                                    font-semibold
                                    text-slate-700
                                ">
                                    Department
                                </label>

                                <input
                                    type="text"
                                    name="department"
                                    placeholder="Enter Department"
                                    value={form.department}
                                    onChange={handleChange}
                                    className="
                                        w-full
                                        rounded-xl
                                        border
                                        border-slate-300
                                        bg-slate-50
                                        px-4
                                        py-3
                                        text-sm
                                        outline-none
                                        transition
                                        focus:border-blue-600
                                        focus:bg-white
                                        focus:ring-4
                                        focus:ring-blue-100
                                    "
                                    required
                                />

                            </div>


                            {/* COMPANY */}

                            <div>

                                <label className="
                                    mb-1.5
                                    block
                                    text-sm
                                    font-semibold
                                    text-slate-700
                                ">
                                    Company
                                </label>

                                <select
                                    name="company"
                                    value={form.company}
                                    onChange={handleChange}
                                    className="
                                        w-full
                                        rounded-xl
                                        border
                                        border-slate-300
                                        bg-slate-50
                                        px-4
                                        py-3
                                        text-sm
                                        outline-none
                                        transition
                                        focus:border-blue-600
                                        focus:bg-white
                                        focus:ring-4
                                        focus:ring-blue-100
                                    "
                                >

                                    <option value="NTPC">
                                        NTPC
                                    </option>

                                    <option value="NML">
                                        NML
                                    </option>

                                    <option value="VPR">
                                        VPR
                                    </option>

                                    <option value="OTHER">
                                        OTHER
                                    </option>

                                </select>

                            </div>


                            {/* EMAIL */}

                            <div>

                                <label className="
                                    mb-1.5
                                    block
                                    text-sm
                                    font-semibold
                                    text-slate-700
                                ">
                                    Official Email
                                </label>

                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Enter Official Email"
                                    value={form.email}
                                    onChange={handleChange}
                                    autoComplete="email"
                                    className="
                                        w-full
                                        rounded-xl
                                        border
                                        border-slate-300
                                        bg-slate-50
                                        px-4
                                        py-3
                                        text-sm
                                        outline-none
                                        transition
                                        focus:border-blue-600
                                        focus:bg-white
                                        focus:ring-4
                                        focus:ring-blue-100
                                    "
                                    required
                                />

                            </div>


                            {/* MOBILE */}

                            <div>

                                <label className="
                                    mb-1.5
                                    block
                                    text-sm
                                    font-semibold
                                    text-slate-700
                                ">
                                    Mobile Number
                                </label>

                                <input
                                    type="tel"
                                    name="mobile_number"
                                    placeholder="Enter Mobile Number"
                                    value={form.mobile_number}
                                    onChange={handleChange}
                                    inputMode="numeric"
                                    maxLength={15}
                                    className="
                                        w-full
                                        rounded-xl
                                        border
                                        border-slate-300
                                        bg-slate-50
                                        px-4
                                        py-3
                                        text-sm
                                        outline-none
                                        transition
                                        focus:border-blue-600
                                        focus:bg-white
                                        focus:ring-4
                                        focus:ring-blue-100
                                    "
                                    required
                                />

                            </div>


                            {/* PASSWORD */}

                            <div>

                                <label className="
                                    mb-1.5
                                    block
                                    text-sm
                                    font-semibold
                                    text-slate-700
                                ">
                                    Password
                                </label>

                                <div className="relative">

                                    <input
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        name="password"
                                        placeholder="Create Password"
                                        value={form.password}
                                        onChange={handleChange}
                                        autoComplete="new-password"
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
                                            outline-none
                                            transition
                                            focus:border-blue-600
                                            focus:bg-white
                                            focus:ring-4
                                            focus:ring-blue-100
                                        "
                                        required
                                    />


                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(
                                                !showPassword
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
                                            hover:bg-blue-50
                                            hover:text-blue-700
                                        "
                                    >

                                        {showPassword ? (

                                            <EyeOff size={19} />

                                        ) : (

                                            <Eye size={19} />

                                        )}

                                    </button>

                                </div>

                            </div>


                            {/* CONFIRM PASSWORD */}

                            <div>

                                <label className="
                                    mb-1.5
                                    block
                                    text-sm
                                    font-semibold
                                    text-slate-700
                                ">
                                    Confirm Password
                                </label>

                                <div className="relative">

                                    <input
                                        type={
                                            showConfirmPassword
                                                ? "text"
                                                : "password"
                                        }
                                        name="confirm_password"
                                        placeholder="Confirm Password"
                                        value={
                                            form.confirm_password
                                        }
                                        onChange={handleChange}
                                        autoComplete="new-password"
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
                                            outline-none
                                            transition
                                            focus:border-blue-600
                                            focus:bg-white
                                            focus:ring-4
                                            focus:ring-blue-100
                                        "
                                        required
                                    />


                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowConfirmPassword(
                                                !showConfirmPassword
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
                                            hover:bg-blue-50
                                            hover:text-blue-700
                                        "
                                    >

                                        {showConfirmPassword ? (

                                            <EyeOff size={19} />

                                        ) : (

                                            <Eye size={19} />

                                        )}

                                    </button>

                                </div>

                            </div>


                            {/* CREATE ACCOUNT */}

                            <button
                                type="submit"
                                disabled={loading}
                                className="
                                    sm:col-span-2
                                    mt-2
                                    flex
                                    items-center
                                    justify-center
                                    gap-2
                                    rounded-xl
                                    bg-blue-700
                                    px-4
                                    py-3.5
                                    font-semibold
                                    text-white
                                    shadow-lg
                                    shadow-blue-900/20
                                    transition
                                    hover:bg-blue-800
                                    active:scale-[0.99]
                                    disabled:cursor-not-allowed
                                    disabled:opacity-60
                                "
                            >

                                <UserPlus size={18} />

                                {loading
                                    ? "Creating Account..."
                                    : "Create Account"}

                            </button>


                            {/* LOGIN */}

                            <div className="
                                sm:col-span-2
                                pt-2
                                text-center
                            ">

                                <p className="
                                    text-sm
                                    text-slate-500
                                ">
                                    Already have an account?
                                </p>

                                <Link
                                    to="/login"
                                    className="
                                        mt-2
                                        inline-block
                                        font-semibold
                                        text-blue-700
                                        hover:text-blue-900
                                        hover:underline
                                    "
                                >
                                    Sign In
                                </Link>

                            </div>

                        </form>


                        {/* FOOTER */}

                        <div className="
                            mt-6
                            border-t
                            border-slate-200
                            pt-5
                            text-center
                        ">

                            <p className="
                                text-[10px]
                                font-semibold
                                uppercase
                                tracking-widest
                                text-slate-400
                            ">
                                NIRIKSHAN
                            </p>

                            <p className="
                                mt-1
                                text-xs
                                text-slate-400
                            ">
                                NML Talaipalli • E&M
                            </p>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );
}