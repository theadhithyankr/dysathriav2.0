import { useState, useRef, useEffect } from "react"
import AppLayout from "@/components/layout/AppLayout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Mic, MicOff, Upload, RotateCcw, CheckCircle2, AlertCircle, Info } from "lucide-react"

const SEVERITY_CONFIG = {
  Mild: {
    variant: "mild",
    message: "Mild dysarthria detected. Speech intelligibility is mostly preserved. Continue with current therapy programme.",
    score: 74,
  },
  Moderate: {
    variant: "moderate",
    message: "Moderate dysarthria detected. Some loss of intelligibility. Your therapist has been notified for programme adjustment.",
    score: 52,
  },
  Severe: {
    variant: "severe",
    message: "Severe dysarthria detected. Significant speech intelligibility impairment. Please consult your therapist promptly.",
    score: 28,
  },
}

// Fake waveform bars
function Waveform({ active }) {
  const bars = Array.from({ length: 40 })
  return (
    <div className="flex items-center justify-center gap-[2px] h-16">
      {bars.map((_, i) => {
        const baseHeight = 8
        const maxExtra = active ? 40 : 4
        const height = baseHeight + Math.sin(i * 0.5) * maxExtra * (active ? 1 : 0.2)
        return (
          <div
            key={i}
            className="w-1 rounded-full transition-all duration-150"
            style={{
              height: `${Math.max(4, height)}px`,
              backgroundColor: active ? "#2A9D8F" : "#cbd5e1",
              opacity: active ? 0.7 + Math.sin(i) * 0.3 : 0.4,
            }}
          />
        )
      })}
    </div>
  )
}

export default function RecordDetectPage() {
  const [recording, setRecording] = useState(false)
  const [recorded, setRecorded] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState(null) // "Mild" | "Moderate" | "Severe"
  const [elapsed, setElapsed] = useState(0)
  const intervalRef = useRef(null)

  useEffect(() => {
    if (recording) {
      intervalRef.current = setInterval(() => setElapsed((e) => e + 1), 1000)
    } else {
      clearInterval(intervalRef.current)
    }
    return () => clearInterval(intervalRef.current)
  }, [recording])

  function handleStartStop() {
    if (recording) {
      setRecording(false)
      setRecorded(true)
    } else {
      setRecording(true)
      setRecorded(false)
      setResult(null)
      setElapsed(0)
    }
  }

  function handleReset() {
    setRecording(false)
    setRecorded(false)
    setResult(null)
    setElapsed(0)
  }

  function handleAnalyze() {
    setAnalyzing(true)
    setTimeout(() => {
      const severities = ["Mild", "Moderate", "Severe"]
      setResult(severities[Math.floor(Math.random() * 3)])
      setAnalyzing(false)
    }, 2000)
  }

  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`
  const config = result ? SEVERITY_CONFIG[result] : null

  return (
    <AppLayout role="patient" userName="Alex Johnson">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1E3A5F]">Record & Detect</h1>
        <p className="text-sm text-[#64748b] mt-1">Record a speech sample to assess your current dysarthria severity.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recorder card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Mic className="h-4 w-4 text-[#2A9D8F]" />
              Speech Recorder
            </CardTitle>
            <CardDescription>Read the prompted sentence aloud while recording.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Prompt sentence */}
            <div className="rounded-md border border-[#e2e8f0] bg-[#F1F5F9] px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#64748b] mb-1">Read aloud:</p>
              <p className="text-sm text-[#334155] italic leading-relaxed">
                "The quick brown fox jumps over the lazy dog near the river bank."
              </p>
            </div>

            {/* Waveform */}
            <div className="rounded-md border border-[#e2e8f0] bg-white px-4 py-4">
              <Waveform active={recording} />
              <div className="mt-2 flex items-center justify-between">
                <span className="text-xs text-[#94a3b8]">
                  {recording ? "Recording…" : recorded ? "Recording complete" : "Waiting to record"}
                </span>
                <span className="text-xs font-mono text-[#64748b]">{formatTime(elapsed)}</span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex gap-3">
              <Button
                size="lg"
                variant={recording ? "destructive" : "default"}
                className="flex-1"
                onClick={handleStartStop}
              >
                {recording ? (
                  <><MicOff className="mr-2 h-4 w-4" /> Stop Recording</>
                ) : (
                  <><Mic className="mr-2 h-4 w-4" /> {recorded ? "Re-record" : "Start Recording"}</>
                )}
              </Button>
              {recorded && !recording && (
                <Button variant="outline" size="lg" onClick={handleReset}>
                  <RotateCcw className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Upload alternative */}
            <div className="flex items-center gap-3 text-xs text-[#94a3b8]">
              <div className="flex-1 h-px bg-[#e2e8f0]" />
              or
              <div className="flex-1 h-px bg-[#e2e8f0]" />
            </div>
            <Button variant="outline" className="w-full" size="sm">
              <Upload className="mr-2 h-4 w-4" />
              Upload Audio File (.wav / .mp3)
            </Button>
          </CardContent>
        </Card>

        {/* Analysis card */}
        <div className="space-y-4">
          {/* Submit button */}
          <Card>
            <CardContent className="pt-6">
              <Button
                className="w-full"
                size="lg"
                disabled={!recorded || analyzing}
                onClick={handleAnalyze}
                variant="secondary"
              >
                {analyzing ? "Analysing…" : "Submit for Analysis"}
              </Button>
              {analyzing && (
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-xs text-[#64748b]">
                    <span>Processing audio…</span>
                    <span>Please wait</span>
                  </div>
                  <Progress value={66} className="animate-pulse" />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Result card */}
          {result && config && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Analysis Result</CardTitle>
                  <Badge variant={config.variant} className="text-sm px-3 py-1">
                    {result}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Score meter */}
                <div>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-xs text-[#64748b]">Speech intelligibility score</span>
                    <span className="text-sm font-bold text-[#1E3A5F]">{config.score}/100</span>
                  </div>
                  <Progress value={config.score} />
                </div>

                {/* Severity scale */}
                <div className="flex gap-1 text-[10px] font-medium">
                  {["Severe", "Moderate", "Mild"].map((s) => (
                    <div
                      key={s}
                      className={`flex-1 text-center rounded py-1 ${
                        s === result
                          ? s === "Mild"
                            ? "bg-emerald-100 text-emerald-700"
                            : s === "Moderate"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-red-100 text-red-700"
                          : "bg-[#F1F5F9] text-[#94a3b8]"
                      }`}
                    >
                      {s}
                    </div>
                  ))}
                </div>

                {/* Message */}
                <div className="flex gap-2 rounded-md border border-[#e2e8f0] bg-[#F1F5F9] p-3">
                  {result === "Mild" ? (
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
                  ) : (
                    <AlertCircle className="h-4 w-4 shrink-0 text-amber-500 mt-0.5" />
                  )}
                  <p className="text-xs text-[#334155] leading-relaxed">{config.message}</p>
                </div>

                {/* Acoustic features */}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#64748b] mb-2">
                    Acoustic Features Analysed
                  </p>
                  <div className="space-y-2">
                    {[
                      { feature: "Pitch Regularity", pct: 68 },
                      { feature: "Articulation Rate", pct: 52 },
                      { feature: "Voice Quality (HNR)", pct: 81 },
                      { feature: "Pause Pattern", pct: 45 },
                    ].map(({ feature, pct }) => (
                      <div key={feature}>
                        <div className="flex justify-between mb-1">
                          <span className="text-xs text-[#64748b]">{feature}</span>
                          <span className="text-xs font-medium text-[#334155]">{pct}%</span>
                        </div>
                        <Progress value={pct} className="h-1" />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Info card if no result yet */}
          {!result && !analyzing && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex gap-3">
                  <Info className="h-5 w-5 shrink-0 text-[#2A9D8F]" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-[#1E3A5F]">How analysis works</p>
                    <p className="text-xs text-[#64748b] leading-relaxed">
                      The AI model extracts acoustic features — pitch, articulation rate, voice quality, and pause patterns —
                      then classifies dysarthria severity as Mild, Moderate, or Severe.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AppLayout>
  )
}
