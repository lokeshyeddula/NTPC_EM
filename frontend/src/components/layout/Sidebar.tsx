import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ClipboardCheck,
  RefreshCw,
  FileText,
  History,
  ShieldCheck,
  UserCircle,
  X,
  ChevronRight,
} from "lucide-react";

interface Props {
  onClose?: () =>void;
}

const menu = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Inspection",
    path: "/inspection",
    icon: ClipboardCheck,
  },
  {
    name: "Re-Inspection",
    path: "/Re-Inspection",
    icon: RefreshCw,
  },
  {
    name: "Reports",
    path: "/reports",
    icon: FileText,
  },
  {
    name: "History",
    path: "/inspection-history",
    icon: History,
  },
  {
    name: "Admin",
    path: "/admin",
    icon: ShieldCheck,
  },
  {
    name: "Profile",
    path: "/profile",
    icon: UserCircle,
  },
];

export default function Sidebar({ onClose }: Props) {
  return (
    <aside className="flex h-screen w-72 flex-col bg-slate-950 border-r border-slate-800">

      {/* Logo */}

      <div className="flex items-center justify-between px-6 py-6 border-b border-slate-800">

        <div>

          <h2 className="text-2xl font-bold tracking-wide text-white">

            NTPC E&M

          </h2>

          <p className="text-xs text-slate-400 mt-1">

            Inspection Management

          </p>

        </div>

        <button
          onClick={onClose}
          className="md:hidden rounded-lg p-2 hover:bg-slate-800 transition"
        >
          <X size={22} className="text-slate-300" />
        </button>

      </div>

      {/* Navigation */}

      <div className="flex-1 overflow-y-auto py-6">

        <div className="px-4">

          <p className="text-xs uppercase tracking-widest text-slate-500 mb-4">

            MAIN MENU

          </p>

        </div>

        <nav className="space-y-2 px-3">

          {menu.map((item) => {

            const Icon = item.icon;

            return (

              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `group flex items-center justify-between rounded-xl px-4 py-3 transition-all duration-200 ${
                    isActive
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-900/30"
                      : "text-slate-300 hover:bg-slate-900 hover:text-white"
                  }`
                }
              >

                <div className="flex items-center gap-3">

                  <Icon size={20} />

                  <span className="font-medium">

                    {item.name}

                  </span>

                </div>

                <ChevronRight
                  size={18}
                  className="opacity-0 group-hover:opacity-100 transition"
                />

              </NavLink>

            );

          })}

        </nav>

      </div>

      {/* Bottom */}

      <div className="border-t border-slate-800 p-5">

        <div className="rounded-xl bg-slate-900 p-4">

          <p className="text-xs text-slate-400">

            NML Talaipalli

          </p>

          <h3 className="mt-1 font-semibold text-white">

            NTPC E&M System

          </h3>

        </div>

      </div>

    </aside>
  );
}