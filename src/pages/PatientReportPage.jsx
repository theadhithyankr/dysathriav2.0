import AppLayout from "@/components/layout/AppLayout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
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
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { Download, MessageSquare, TrendingUp, Calendar, Mic } from "lucide-react"

const scoreHistory = [
  { week: "W1", score: 42 }, { week: "W2", score: 48 }, { week: "W3", score: 51 },
  { week: "W4", score: 55 }, { week: "W5", score: 60 }, { week: "W6", score: 63 },
  { week: "W7", score: 69 }, { week: "W8", score: 74 },
]

const exerciseCompletion = [
  { exercise: "Lip Round", completed: 12, total: 14 },
  { exercise: "Tongue", completed: 9, total: 14 },
  { exercise: "Phonation", completed: 14, total: 14 },
  { exercise: "Breath", completed: 11, total: 14 },
  { exercise: "Rate", completed: 8, total: 14 },
]

const sessions = [
  { date: "2026-03-06", exercise: "Lip Rounding", duration: "12 min", score: 74, severity: "Mild", notes: "Good session" },
  { date: "2026-03-04", exercise: "Tongue Placement", duration: "15 min", score: 68, severity: "Mild", notes: "" },
  { date: "2026-03-01", exercise: "Breath Control", duration: "10 min", score: 63, severity: "Moderate", notes: "Slight fatigue noted" },
  { date: "2026-02-27", exercise: "Vowel Prolongation", duration: "18 min", score: 59, severity: "Moderate", notes: "" },
  { date: "2026-02-24", exercise: "Consonant Drill", duration: "14 min", score: 55, severity: "Moderate", notes: "" },
  { date: "2026-02-21", exercise: "Rate Control", duration: "12 min", score: 53, severity: "Moderate", notes: "Pacing improved" },
  { date: "2026-02-18", exercise: "Jaw Relaxation", duration: "8 min", score: 51, severity: "Moderate", notes: "" },
  { date: "2026-02-15", exercise: "Lip Rounding", duration: "11 min", score: 48, severity: "Moderate", notes: "" },
]

const therapistNotes = [
  {
    date: "2026-03-06",
    author: "Dr. Priya Nair",
    note: "Alex continues to show steady improvement. Lip rounding exercises are producing measurable gains in intelligibility. Score now at 74/100 — approaching Mild–Normal threshold. Will maintain current programme for 2 more weeks before reassessment.",
  },
  {
    date: "2026-02-20",
    author: "Dr. Priya Nair",
    note: "Progress slower than expected in articulation rate tasks. Introduced paced-speech metronome technique. Patient responded well. Recommend increasing session frequency to 4x/week.",
  },
  {
    date: "2026-02-01",
    author: "Dr. Priya Nair",
    note: "Initial assessment complete. Diagnosed as Moderate dysarthria. Baseline score: 42/100. Programme started focusing on lip closure and breath support.",
  },
]

const severityColor = { Mild: "mild", Moderate: "moderate", Severe: "severe" }

export default function PatientReportPage() {
  return (
    <AppLayout role="patient" userName="Alex Johnson">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1E3A5F]">My Report</h1>
          <p className="text-sm text-[#64748b] mt-1">
            Comprehensive overview of your assessment history and progress.
          </p>
        </div>
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Export PDF
        </Button>
      </div>

      {/* Patient summary strip */}
      <Card className="mb-6">
        <CardContent className="pt-5 pb-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {[
              { icon: Mic, label: "Current Severity", value: "Mild", sub: "Improved from Moderate" },
              { icon: TrendingUp, label: "Latest Score", value: "74/100", sub: "+32 from baseline" },
              { icon: Calendar, label: "Total Sessions", value: "48", sub: "Since Feb 2026" },
              { icon: MessageSquare, label: "Therapist", value: "Dr. Priya Nair", sub: "Last note: Mar 6" },
            ].map(({ icon: Icon, label, value, sub }) => (
              <div key={label} className="flex gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[#F1F5F9]">
                  <Icon className="h-4 w-4 text-[#2A9D8F]" />
                </div>
                <div>
                  <p className="text-xs text-[#64748b] mb-0.5">{label}</p>
                  <p className="font-semibold text-[#1E3A5F] text-sm">{value}</p>
                  <p className="text-xs text-[#94a3b8]">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="overview">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
          <TabsTrigger value="charts">Progress Charts</TabsTrigger>
          <TabsTrigger value="notes">Therapist Notes</TabsTrigger>
        </TabsList>

        {/* Overview tab */}
        <TabsContent value="overview">
          <div className="grid sm:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Severity Progression</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { period: "Feb 2026 (Baseline)", severity: "Moderate", score: 42 },
                  { period: "Feb–Mar 2026", severity: "Moderate", score: 55 },
                  { period: "Mar 2026 (Current)", severity: "Mild", score: 74 },
                ].map(({ period, severity, score }) => (
                  <div key={period} className="flex items-center gap-3">
                    <div className="w-28 shrink-0 text-xs text-[#64748b]">{period}</div>
                    <Progress value={score} className="flex-1" />
                    <Badge variant={severityColor[severity]} className="shrink-0 w-20 justify-center">
                      {severity}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Acoustic Feature Scores</CardTitle>
                <CardDescription>Latest assessment</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { feature: "Pitch Regularity", score: 68 },
                  { feature: "Articulation Rate", score: 52 },
                  { feature: "Voice Quality (HNR)", score: 81 },
                  { feature: "Pause Pattern", score: 45 },
                  { feature: "Intelligibility (Overall)", score: 74 },
                ].map(({ feature, score }) => (
                  <div key={feature}>
                    <div className="flex justify-between mb-1">
                      <span className="text-xs text-[#64748b]">{feature}</span>
                      <span className="text-xs font-medium">{score}/100</span>
                    </div>
                    <Progress value={score} className="h-1.5" />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="sm:col-span-2">
              <CardHeader>
                <CardTitle className="text-base">Exercise Completion Rate</CardTitle>
                <CardDescription>Last 2 weeks across exercise types</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {exerciseCompletion.map(({ exercise, completed, total }) => (
                    <div key={exercise} className="flex items-center gap-3">
                      <span className="w-28 text-xs text-[#64748b] shrink-0">{exercise}</span>
                      <Progress value={(completed / total) * 100} className="flex-1" />
                      <span className="text-xs font-medium text-[#334155] w-12 text-right">
                        {completed}/{total}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Sessions tab */}
        <TabsContent value="sessions">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Session History</CardTitle>
              <CardDescription>{sessions.length} sessions recorded</CardDescription>
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
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sessions.map((s, i) => (
                    <TableRow key={i}>
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
                      <TableCell className="text-xs text-[#64748b]">{s.notes || "—"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Charts tab */}
        <TabsContent value="charts">
          <div className="grid sm:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Speech Score Over Time</CardTitle>
                <CardDescription>8-week trend</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={scoreHistory} margin={{ top: 4, right: 8, bottom: 0, left: -20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="week" tick={{ fontSize: 11, fill: "#94a3b8" }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "#94a3b8" }} />
                    <Tooltip contentStyle={{ border: "1px solid #e2e8f0", borderRadius: "6px", fontSize: 12 }} />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="#2A9D8F"
                      strokeWidth={2}
                      dot={{ r: 3, fill: "#2A9D8F" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Exercise Completion per Week</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart
                    data={[
                      { week: "W1", sessions: 3 }, { week: "W2", sessions: 4 },
                      { week: "W3", sessions: 3 }, { week: "W4", sessions: 5 },
                      { week: "W5", sessions: 4 }, { week: "W6", sessions: 5 },
                      { week: "W7", sessions: 5 }, { week: "W8", sessions: 6 },
                    ]}
                    margin={{ top: 4, right: 8, bottom: 0, left: -20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="week" tick={{ fontSize: 11, fill: "#94a3b8" }} />
                    <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} />
                    <Tooltip contentStyle={{ border: "1px solid #e2e8f0", borderRadius: "6px", fontSize: 12 }} />
                    <Bar dataKey="sessions" fill="#1E3A5F" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Therapist Notes tab */}
        <TabsContent value="notes">
          <div className="space-y-4">
            {therapistNotes.map((n, i) => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm">{n.author}</CardTitle>
                    <span className="text-xs text-[#94a3b8]">{n.date}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-[#334155] leading-relaxed">{n.note}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </AppLayout>
  )
}
