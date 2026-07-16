import { useEffect, useState } from "react";

import Layout from "../../components/layout/Layout";

import inspectionService from "../../services/inspectionService";

interface InspectionHistory {

    id: number;

    inspection_number: string;

    inspection_date: string;

    shift: string;

    relay: string;

    vehicle: string;

    engineer: string;

    operational_status: string;

}

export default function InspectionHistory() {

    const [history, setHistory] = useState<
        InspectionHistory[]
    >([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        loadHistory();

    }, []);

    async function loadHistory() {

        try {

            const data =
                await inspectionService.getInspectionHistory();

            setHistory(data);

        }

        catch (error) {

            console.error(error);

        }

        finally {

            setLoading(false);

        }

    }

    return (

        <Layout>

            <div className="bg-white rounded-lg shadow p-6">

                <h1 className="text-3xl font-bold mb-6">

                    Inspection History

                </h1>

                {

                    loading ?

                        <div>

                            Loading...

                        </div>

                        :

                        <table className="w-full border">

                            <thead>

                                <tr className="bg-gray-100">

                                    <th className="p-3 text-left">

                                        Inspection No

                                    </th>

                                    <th className="p-3">

                                        Date

                                    </th>

                                    <th className="p-3">

                                        Shift

                                    </th>

                                    <th className="p-3">

                                        Vehicle

                                    </th>

                                    <th className="p-3">

                                        Engineer

                                    </th>

                                    <th className="p-3">

                                        Status

                                    </th>

                                    <th className="p-3">

                                        Action

                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {

                                    history.map(item => (

                                        <tr
                                            key={item.id}
                                            className="border-t hover:bg-gray-50"
                                        >

                                            <td className="p-3">

                                                {item.inspection_number}

                                            </td>

                                            <td className="text-center">

                                                {item.inspection_date}

                                            </td>

                                            <td className="text-center">

                                                {item.shift}

                                            </td>

                                            <td className="text-center">

                                                {item.vehicle}

                                            </td>

                                            <td className="text-center">

                                                {item.engineer}

                                            </td>

                                            <td className="text-center">

                                                <span
                                                    className={`px-3 py-1 rounded-full text-white text-sm ${
                                                        item.operational_status === "Fit"
                                                            ? "bg-green-600"
                                                            : "bg-red-600"
                                                    }`}
                                                >

                                                    {item.operational_status}

                                                </span>

                                            </td>

                                            <td className="text-center">

                                                <button
                                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                                                >

                                                    View

                                                </button>

                                            </td>

                                        </tr>

                                    ))

                                }

                            </tbody>

                        </table>

                }

            </div>

        </Layout>

    );

}