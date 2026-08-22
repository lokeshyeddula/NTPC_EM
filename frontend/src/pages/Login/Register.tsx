import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, UserPlus } from "lucide-react";

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


        // -----------------------------------------------
        // Full Name
        // -----------------------------------------------

        if (name === "full_name") {

            formattedValue =
                toTitleCase(value);

        }


        // -----------------------------------------------
        // Designation
        // -----------------------------------------------

        if (name === "designation") {

            formattedValue =
                toTitleCase(value);

        }


        setForm(
            (previous) => ({

                ...previous,

                [name]: formattedValue,

            })
        );

    }


    async function handleSubmit(
        e: React.FormEvent<HTMLFormElement>
    ) {

        e.preventDefault();

        setError("");


        // -----------------------------------------------
        // Password validation
        // -----------------------------------------------

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


            // -----------------------------------------------
            // Normalize before sending
            // -----------------------------------------------

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

        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-8">

            <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg p-8">


                {/* =================================================
                    LOGOS
                ================================================= */}

                <div className="flex justify-between items-center mb-8">

                    <img
                        src={ntpcLogo}
                        alt="NTPC"
                        className="h-16"
                    />


                    <div className="text-center">

                        <h1 className="text-xl font-bold text-blue-900">
                            Drishti
                        </h1>

                    </div>


                    <img
                        src={nmlLogo}
                        alt="NML"
                        className="h-16"
                    />

                </div>


                {/* =================================================
                    TITLE
                ================================================= */}

                <div className="flex items-center justify-center gap-2 mb-8">

                    <UserPlus
                        className="text-blue-800"
                        size={30}
                    />

                    <h2 className="text-2xl font-bold">
                        Create Account
                    </h2>

                </div>


                {/* =================================================
                    ERROR
                ================================================= */}

                {error && (

                    <div className="mb-6 bg-red-100 border border-red-300 text-red-700 rounded-lg p-3">

                        {error}

                    </div>

                )}


                {/* =================================================
                    FORM
                ================================================= */}

                <form
                    onSubmit={handleSubmit}
                    className="grid grid-cols-1 md:grid-cols-2 gap-5"
                >


                    {/* EMPLOYEE ID */}

                    <input

                        type="text"

                        name="emp_id"

                        placeholder="Employee ID"

                        value={
                            form.emp_id
                        }

                        onChange={
                            handleChange
                        }

                        className="border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-600"

                        required

                    />


                    {/* FULL NAME */}

                    <input

                        type="text"

                        name="full_name"

                        placeholder="Full Name"

                        value={
                            form.full_name
                        }

                        onChange={
                            handleChange
                        }

                        className="border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-600"

                        required

                    />


                    {/* DESIGNATION */}

                    <input

                        type="text"

                        name="designation"

                        placeholder="Designation"

                        value={
                            form.designation
                        }

                        onChange={
                            handleChange
                        }

                        className="border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-600"

                        required

                    />


                    {/* DEPARTMENT */}

                    <input

                        type="text"

                        name="department"

                        placeholder="Department"

                        value={
                            form.department
                        }

                        onChange={
                            handleChange
                        }

                        className="border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-600"

                        required

                    />


                    {/* COMPANY */}

                    <select

                        name="company"

                        value={
                            form.company
                        }

                        onChange={
                            handleChange
                        }

                        className="border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-600"

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


                    {/* EMAIL */}

                    <input

                        type="email"

                        name="email"

                        placeholder="Official Email"

                        value={
                            form.email
                        }

                        onChange={
                            handleChange
                        }

                        className="border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-600"

                        required

                    />


                    {/* MOBILE */}

                    <input

                        type="text"

                        name="mobile_number"

                        placeholder="Mobile Number"

                        value={
                            form.mobile_number
                        }

                        onChange={
                            handleChange
                        }

                        className="border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-600"

                        required

                    />


                    {/* PASSWORD */}

                    <div className="relative">

                        <input

                            type={
                                showPassword
                                    ? "text"
                                    : "password"
                            }

                            name="password"

                            placeholder="Password"

                            value={
                                form.password
                            }

                            onChange={
                                handleChange
                            }

                            className="w-full border rounded-lg p-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-600"

                            required

                        />


                        <button

                            type="button"

                            onClick={() =>
                                setShowPassword(
                                    !showPassword
                                )
                            }

                            className="absolute right-3 top-1/2 -translate-y-1/2"

                        >

                            {
                                showPassword
                                    ? (
                                        <EyeOff
                                            size={20}
                                        />
                                    )
                                    : (
                                        <Eye
                                            size={20}
                                        />
                                    )
                            }

                        </button>

                    </div>


                    {/* CONFIRM PASSWORD */}

                    <div className="relative md:col-span-2">

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

                            onChange={
                                handleChange
                            }

                            className="w-full border rounded-lg p-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-600"

                            required

                        />


                        <button

                            type="button"

                            onClick={() =>
                                setShowConfirmPassword(
                                    !showConfirmPassword
                                )
                            }

                            className="absolute right-3 top-1/2 -translate-y-1/2"

                        >

                            {
                                showConfirmPassword
                                    ? (
                                        <EyeOff
                                            size={20}
                                        />
                                    )
                                    : (
                                        <Eye
                                            size={20}
                                        />
                                    )
                            }

                        </button>

                    </div>


                    {/* CREATE ACCOUNT */}

                    <button

                        type="submit"

                        disabled={loading}

                        className="md:col-span-2 bg-blue-800 hover:bg-blue-900 text-white font-semibold rounded-lg py-3 transition disabled:opacity-50"

                    >

                        {
                            loading
                                ? "Creating Account..."
                                : "Create Account"
                        }

                    </button>


                    {/* LOGIN */}

                    <div className="md:col-span-2 text-center text-gray-600">

                        Already have an account?

                        <Link
                            to="/login"
                            className="ml-2 text-blue-700 font-semibold hover:underline"
                        >
                            Login
                        </Link>

                    </div>

                </form>

            </div>

        </div>

    );

}