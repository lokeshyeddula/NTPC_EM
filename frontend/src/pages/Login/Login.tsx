import { useState } from "react";
import { useNavigate } from "react-router-dom";

import useAuth from "../../hooks/useAuth";

export default function Login() {

    const navigate = useNavigate();

    const { login } = useAuth();

    const [empId, setEmpId] = useState("");

    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);

    async function handleLogin(
        e: React.FormEvent
    ) {

        e.preventDefault();

        try {

            setLoading(true);

            await login({
                emp_id: empId,
                password,
            });

            navigate("/dashboard");

        }

        catch (err) {

            alert("Invalid Employee ID or Password");

        }

        finally {

            setLoading(false);

        }

    }

    return (

        <div
            style={{
                width: 400,
                margin: "80px auto",
            }}
        >

            <h1>NTPC E&M</h1>

            <h3>Login</h3>

            <form onSubmit={handleLogin}>

                <input

                    placeholder="Employee ID"

                    value={empId}

                    onChange={(e) =>
                        setEmpId(e.target.value)
                    }

                    style={{
                        width: "100%",
                        marginBottom: 10,
                        padding: 10,
                    }}

                />

                <input

                    type="password"

                    placeholder="Password"

                    value={password}

                    onChange={(e) =>
                        setPassword(e.target.value)
                    }

                    style={{
                        width: "100%",
                        marginBottom: 10,
                        padding: 10,
                    }}

                />

                <button

                    style={{
                        width: "100%",
                        padding: 12,
                    }}

                    disabled={loading}

                >

                    {loading ? "Logging in..." : "Login"}

                </button>

            </form>

        </div>

    );

}