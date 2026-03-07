import { Bell, ChevronDown, Mic } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"

export default function Navbar({ role = "patient", userName = "Alex Johnson" }) {
  const navigate = useNavigate()
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center border-b border-[#cbd5e1] bg-white px-4 gap-4">
      {/* Logo */}
      <div className="flex items-center gap-2 mr-4">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#1E3A5F]">
          <Mic className="h-3.5 w-3.5 text-white" />
        </div>
        <span className="hidden sm:block font-semibold text-[#1E3A5F] text-sm">
          Dysarthria Platform
        </span>
      </div>

      <div className="flex-1" />

      {/* Role badge */}
      <Badge
        variant={role === "therapist" ? "secondary" : "default"}
        className="hidden sm:inline-flex capitalize text-xs"
      >
        {role === "therapist" ? "Speech Therapist" : "Patient"}
      </Badge>

      {/* Notification bell */}
      <Button variant="ghost" size="icon" className="relative">
        <Bell className="h-4 w-4" />
        <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-[#2A9D8F]" />
      </Button>

      {/* Avatar dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-[#F1F5F9] transition-colors">
            <Avatar className="h-7 w-7">
              <AvatarImage src="" />
              <AvatarFallback className="text-xs">{initials}</AvatarFallback>
            </Avatar>
            <span className="hidden sm:block text-sm font-medium text-[#334155]">{userName}</span>
            <ChevronDown className="h-3 w-3 text-[#64748b]" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-red-600"
            onClick={() => navigate("/")}
          >
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
