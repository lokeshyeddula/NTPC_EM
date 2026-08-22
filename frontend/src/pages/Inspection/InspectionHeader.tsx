import { useEffect, useState } from "react";
import {
    ShieldCheck,
    CalendarDays,
    Clock3,
    UserRound,
    BriefcaseBusiness,
    Radio,
} from "lucide-react";

import useAuth from "../../hooks/useAuth";

export default function InspectionHeader() {

    const { user } = useAuth();

    const [currentTime, setCurrentTime] =
        useState(new Date());

    useEffect(() => {

        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);

    }, []);


    function getShift() {

        const hour = currentTime.getHours();

        if (hour >= 6 && hour < 14) {
            return "Morning";
        }

        if (hour >= 14 && hour < 22) {
            return "Evening";
        }

        return "Night";
    }


    function formatDate() {

        return currentTime.toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }
        );

    }


    function formatTime() {

        return currentTime.toLocaleTimeString(
            "en-IN",
            {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: true,
            }
        );

    }


    const shift = getShift();


    return (

        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#07112f] via-[#102d73] to-[#1d4ed8] text-white shadow-lg">

            {/* Decorative background */}

            <div className="absolute -right-16 -top-20 h-52 w-52 rounded-full bg-white/10 blur-2xl" />

            <div className="absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-blue-400/10 blur-3xl" />


            <div className="relative p-5 sm:p-7">

                {/* Top title */}

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                    <div className="flex items-center gap-3">

                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10 border border-white/20 backdrop-blur">

                            <ShieldCheck
                                size={27}
                                strokeWidth={2}
                            />

                        </div>

                        <div>

                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-200">
                                NIRIKSHAN
                            </p>

                            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
                                Machinery Inspection
                            </h1>

                        </div>

                    </div>


                    {/* Shift badge */}

                    <div className="flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 backdrop-blur">

                        <Radio
                            size={16}
                            className="text-blue-200"
                        />

                        <span className="text-sm font-medium">
                            {shift} Shift
                        </span>

                    </div>

                </div>


                {/* Information */}

                <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">

                    {/* Date */}

                    <InfoItem
                        icon={<CalendarDays size={18} />}
                        label="Inspection Date"
                        value={formatDate()}
                    />


                    {/* Time */}

                    <InfoItem
                        icon={<Clock3 size={18} />}
                        label="Inspection Time"
                        value={formatTime()}
                    />


                    {/* Shift */}

                    <InfoItem
                        icon={<Radio size={18} />}
                        label="Shift"
                        value={shift}
                    />


                    {/* Engineer */}

                    <InfoItem
                        icon={<UserRound size={18} />}
                        label="Inspection Engineer"
                        value={user?.full_name || "N/A"}
                    />


                    {/* Designation */}

                    <InfoItem
                        icon={<BriefcaseBusiness size={18} />}
                        label="Designation"
                        value={user?.designation || "N/A"}
                    />

                </div>

            </div>

        </section>

    );
}


/* =========================================================
   INFORMATION ITEM
========================================================= */

interface InfoItemProps {

    icon: React.ReactNode;

    label: string;

    value: string;

}


function InfoItem({
    icon,
    label,
    value,
}: InfoItemProps) {

    return (

        <div className="rounded-xl border border-white/10 bg-white/[0.08] px-4 py-3 backdrop-blur-sm">

            <div className="flex items-center gap-2 text-blue-200">

                {icon}

                <span className="text-xs font-medium uppercase tracking-wide">
                    {label}
                </span>

            </div>


            <p className="mt-1.5 truncate text-sm sm:text-base font-semibold text-white">

                {value}

            </p>

        </div>

    );

}