import AppLayout from "@/components/layout/AppLayout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { Mic, Dumbbell, TrendingUp, Calendar, ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"

const scoreData = [
  { week: "W1", score: 42 },
  { week: "W2", score: 48 },
  { week: "W3", score: 51 },
  { week: "W4", score: 55 },
  { week: "W5", score: 60 },
  { week: "W6", score: 63 },
  { week: "W7", score: 69 },
  { week: "W8", score: 74 },
]

const recentSessions = [
  { date: "2026-03-06", exercise: "Lip Rounding", duration: "12 min", score: 74, severity: "Mild" },
  { date: "2026-03-04", exercise: "Tongue Placement", duration: "15 min", score: 68, severity: "Mild" },
  { date: "2026-03-01", exercise: "Breath Control", duration: "10 min", score: 63, severity: "Moderate" },
  { date: "2026-02-27", exercise: "Vowel Prolongation", duration: "18 min", score: 59, severity: "Moderate" },
  { date: "2026-02-24", exercise: "Consonant Drill", duration: "14 min", score: 55, severity: "Moderate" },
]

const severityColor = { Mild: "mild", Moderate: "moderate", Severe: "severe" }

export default function PatientDashboard() {
  return (
    <AppLayout role="patient" userName="Alex Johnson">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1E3A5F]">Good morning, Alex</h1>
        <p className="text-sm text-[#64748b] mt-1">Here's your therapy overview for today.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Sessions", value: "48", icon: Calendar, delta: "+3 this week" },
          { label: "Current Score", value: "74", icon: TrendingUp, delta: "+11 from last month" },
          { label: "Streak", value: "7 days", icon: Dumbbell, delta: "Personal best!" },
          { label: "Severity", value: "Mild", icon: Mic, delta: "Improved from Moderate" },
        ].map(({ label, value, icon: Icon, delta }) => (
          <Card key={label}>
            <CardContent className="pt-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-[#64748b] uppercase tracking-wide font-medium mb-1">{label}</p>
                  <p className="text-2xl font-bold text-[#1E3A5F]">{value}</p>
                  <p className="text-xs text-[#2A9D8F] mt-1">{delta}</p>
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-[#F1F5F9]">
                  <Icon className="h-4 w-4 text-[#2A9D8F]" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        {/* Today's exercise card */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Today's Exercise</CardTitle>
            <CardDescription>Assigned by Dr. Priya Nair</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="rounded-md bg-[#F1F5F9] px-4 py-3">
                <p className="font-semibold text-[#1E3A5F] text-sm">Lip Rounding & Articulation</p>
                <p className="text-xs text-[#64748b] mt-1">8 steps · Estimated 15 min</p>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-[#64748b]">Session progress</span>
                  <span className="text-xs font-medium text-[#334155]">3 / 8 steps</span>
                </div>
                <Progress value={37} />
              </div>
              <Button className="w-full" asChild>
                <Link to="/patient/therapy">
                  Continue Exercise
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Score progress chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Speech Score — Last 8 Weeks</CardTitle>
            <CardDescription>Higher is better (0–100 scale)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={scoreData} margin={{ top: 4, right: 8, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="week" tick={{ fontSize: 11, fill: "#94a3b8" }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "#94a3b8" }} />
                <Tooltip
                  contentStyle={{ border: "1px solid #e2e8f0", borderRadius: "6px", fontSize: 12 }}
                  cursor={{ stroke: "#e2e8f0" }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#2A9D8F"
                  strokeWidth={2}
                  dot={{ r: 3, fill: "#2A9D8F" }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent session history */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Recent Sessions</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/patient/report">View all</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Exercise</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Severity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentSessions.map((s) => (
                <TableRow key={s.date + s.exercise}>
                  <TableCell className="text-sm">{s.date}</TableCell>
                  <TableCell className="text-sm font-medium">{s.exercise}</TableCell>
                  <TableCell className="text-sm text-[#64748b]">{s.duration}</TableCell>
                  <TableCell>
                    <span className="font-semibold text-[#1E3A5F]">{s.score}</span>
                    <span className="text-xs text-[#94a3b8]">/100</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={severityColor[s.severity]}>{s.severity}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </AppLayout>
  )
}
