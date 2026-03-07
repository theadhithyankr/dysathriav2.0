import { Link, useLocation } from "react-router-dom"
import {
  LayoutDashboard,
  Mic,
  Dumbbell,
  FileText,
  Users,
  BarChart2,
  Settings,
  ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"

const patientNav = [
  { label: "Dashboard", href: "/patient/dashboard", icon: LayoutDashboard },
  { label: "Record & Detect", href: "/patient/record", icon: Mic },
  { label: "Therapy Exercises", href: "/patient/therapy", icon: Dumbbell },
  { label: "My Reports", href: "/patient/report", icon: FileText },
]

const therapistNav = [
  { label: "Dashboard", href: "/therapist/dashboard", icon: LayoutDashboard },
  { label: "Patients", href: "/therapist/patients", icon: Users },
  { label: "Analytics", href: "/therapist/analytics", icon: BarChart2 },
  { label: "Reports", href: "/therapist/reports", icon: FileText },
]

export default function Sidebar({ role = "patient", collapsed = false }) {
  const location = useLocation()
  const navItems = role === "therapist" ? therapistNav : patientNav

  return (
    <aside
      className={cn(
        "flex flex-col border-r border-[#cbd5e1] bg-white min-h-screen transition-all",
        collapsed ? "w-16" : "w-60"
      )}
    >
      {/* Branding */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-[#e2e8f0]">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[#1E3A5F]">
          <Mic className="h-4 w-4 text-white" />
        </div>
        {!collapsed && (
          <span className="text-sm font-semibold text-[#1E3A5F] leading-tight">
            Dysarthria<br />
            <span className="font-normal text-[#64748b]">Platform</span>
          </span>
        )}
      </div>

      {/* Role label */}
      {!collapsed && (
        <div className="px-4 pt-4 pb-1">
          <p className="text-[10px] uppercase tracking-widest font-semibold text-[#64748b]">
            {role === "therapist" ? "Therapist Portal" : "Patient Portal"}
          </p>
        </div>
      )}

      {/* Nav items */}
      <nav className="flex-1 px-2 py-2 space-y-0.5">
        {navItems.map(({ label, href, icon: Icon }) => {
          const active = location.pathname === href
          return (
            <Link
              key={href}
              to={href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-[#1E3A5F] text-white"
                  : "text-[#334155] hover:bg-[#F1F5F9]"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {!collapsed && <span>{label}</span>}
              {!collapsed && active && <ChevronRight className="ml-auto h-3 w-3" />}
            </Link>
          )
        })}
      </nav>

      {/* Settings */}
      <div className="px-2 pb-4 border-t border-[#e2e8f0] pt-2">
        <Link
          to="/settings"
          className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-[#334155] hover:bg-[#F1F5F9]"
        >
          <Settings className="h-4 w-4 shrink-0" />
          {!collapsed && <span>Settings</span>}
        </Link>
      </div>
    </aside>
  )
}
