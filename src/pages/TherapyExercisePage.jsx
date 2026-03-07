import { useState } from "react"
import AppLayout from "@/components/layout/AppLayout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  CheckCircle2,
  Circle,
  ChevronRight,
  ChevronLeft,
  Mic,
  PlayCircle,
  RotateCcw,
  Info,
} from "lucide-react"

const exercises = [
  {
    id: 1,
    title: "Warm-Up: Jaw Relaxation",
    category: "Warm-Up",
    duration: "2 min",
    instruction:
      "Gently drop your jaw as far as comfortable, then slowly close. Repeat 10 times. Keep your neck and shoulders relaxed throughout.",
    tips: ["Move slowly and without strain", "Breathe normally", "Stop if you feel discomfort"],
    prompt: null,
  },
  {
    id: 2,
    title: "Lip Rounding — /oo/ Sound",
    category: "Articulation",
    duration: "3 min",
    instruction:
      "Round your lips as if saying 'oo'. Hold for 3 seconds, then relax. Repeat 8 times. Focus on symmetry — both sides of your lips should move equally.",
    tips: ["Use a mirror to check symmetry", "Exaggerate the rounding", "Feel the muscle engagement"],
    prompt: "Say: 'oo' — 'oo' — 'oo'",
  },
  {
    id: 3,
    title: "Tongue Tip Elevation",
    category: "Articulation",
    duration: "3 min",
    instruction:
      "Place your tongue tip behind your upper front teeth. Hold for 5 seconds, then lower slowly. Do 8 repetitions.",
    tips: ["Keep the rest of your tongue flat", "Do not push teeth", "Increase hold time gradually"],
    prompt: "Say: 'la — la — la' slowly",
  },
  {
    id: 4,
    title: "Sustained Vowel /a/",
    category: "Phonation",
    duration: "2 min",
    instruction:
      "Take a deep breath and produce a steady 'ahh' sound for as long as comfortable. Aim for at least 5 seconds. Repeat 5 times.",
    tips: ["Keep pitch steady", "Avoid letting voice fade", "Note your maximum phonation time"],
    prompt: "Record sustained 'ahh' for ≥5 seconds",
  },
  {
    id: 5,
    title: "Controlled Breath Release",
    category: "Respiration",
    duration: "3 min",
    instruction:
      "Inhale slowly for 4 counts. Hold for 2 counts. Exhale slowly over 6 counts. Repeat 6 times. This builds respiratory support for speech.",
    tips: ["Breathe from the diaphragm", "Count silently in your head", "Do not force the exhale"],
    prompt: null,
  },
  {
    id: 6,
    title: "Sentence Drill: Plosives",
    category: "Connected Speech",
    duration: "4 min",
    instruction:
      "Read each sentence aloud, focusing on clear plosive sounds (/p/, /b/, /t/, /d/, /k/, /g/). Speak at 70% of your natural speed.",
    tips: ["Over-articulate each plosive", "Pause between sentences", "Record yourself for review"],
    prompt: '"Buy Bobby a puppy" — "The big dog bit the duck"',
  },
  {
    id: 7,
    title: "Rate Control Practice",
    category: "Connected Speech",
    duration: "4 min",
    instruction:
      "Use paced speech to read the passage below. Aim for one syllable per beat at a slow, controlled rate. Gradually build speed over repeats.",
    tips: ["Use a metronome app if available", "Start at 60 bpm", "Increase by 5 bpm each round"],
    prompt: '"I want to speak clearly so that everyone can understand me."',
  },
  {
    id: 8,
    title: "Cool-Down: Facial Massage",
    category: "Cool-Down",
    duration: "2 min",
    instruction:
      "Using your fingertips, gently massage your cheeks in circular motions for 30 seconds. Then tap lightly around your lips and jaw for 30 seconds. Finish with 3 deep breaths.",
    tips: ["Very gentle pressure only", "End session on a relaxed note"],
    prompt: null,
  },
]

const categoryColor = {
  "Warm-Up": "bg-blue-50 text-blue-600",
  Articulation: "bg-[#2A9D8F]/10 text-[#2A9D8F]",
  Phonation: "bg-purple-50 text-purple-600",
  Respiration: "bg-amber-50 text-amber-600",
  "Connected Speech": "bg-[#1E3A5F]/10 text-[#1E3A5F]",
  "Cool-Down": "bg-slate-100 text-slate-500",
}

export default function TherapyExercisePage() {
  const [current, setCurrent] = useState(0)
  const [completed, setCompleted] = useState([])
  const [started, setStarted] = useState(false)

  const exercise = exercises[current]
  const progress = Math.round(((completed.length) / exercises.length) * 100)
  const isCompleted = completed.includes(exercise.id)
  const allDone = completed.length === exercises.length

  function markDoneAndNext() {
    if (!completed.includes(exercise.id)) {
      setCompleted((c) => [...c, exercise.id])
    }
    if (current < exercises.length - 1) setCurrent((c) => c + 1)
  }

  function handleReset() {
    setCurrent(0)
    setCompleted([])
    setStarted(false)
  }

  return (
    <AppLayout role="patient" userName="Alex Johnson">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1E3A5F]">Therapy Exercises</h1>
          <p className="text-sm text-[#64748b] mt-1">Session: Lip & Articulation Programme — assigned by Dr. Priya Nair</p>
        </div>
        <Button variant="outline" size="sm" onClick={handleReset}>
          <RotateCcw className="mr-2 h-3.5 w-3.5" />
          Restart
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Stepper */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Progress</CardTitle>
              <div className="space-y-1.5 mt-1">
                <div className="flex justify-between text-xs text-[#64748b]">
                  <span>{completed.length} of {exercises.length} completed</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} />
              </div>
            </CardHeader>
            <CardContent className="pt-0 px-3 pb-3">
              <div className="space-y-0.5">
                {exercises.map((ex, idx) => {
                  const done = completed.includes(ex.id)
                  const active = idx === current
                  return (
                    <button
                      key={ex.id}
                      onClick={() => setCurrent(idx)}
                      className={`w-full flex items-center gap-2.5 rounded-md px-3 py-2 text-xs transition-colors ${
                        active ? "bg-[#1E3A5F] text-white" : "hover:bg-[#F1F5F9] text-[#334155]"
                      }`}
                    >
                      <span className="shrink-0">
                        {done ? (
                          <CheckCircle2 className={`h-3.5 w-3.5 ${active ? "text-[#2A9D8F]" : "text-emerald-500"}`} />
                        ) : (
                          <Circle className={`h-3.5 w-3.5 ${active ? "text-white/60" : "text-[#cbd5e1]"}`} />
                        )}
                      </span>
                      <span className="truncate text-left">{ex.title}</span>
                    </button>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Exercise card */}
        <div className="lg:col-span-2 space-y-4">
          {allDone ? (
            <Card>
              <CardContent className="pt-10 pb-10 text-center space-y-4">
                <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto" />
                <h2 className="text-xl font-bold text-[#1E3A5F]">Session Complete!</h2>
                <p className="text-sm text-[#64748b] max-w-sm mx-auto">
                  Excellent work. You've completed all 8 exercises. Your progress has been recorded.
                </p>
                <div className="flex gap-3 justify-center">
                  <Button onClick={handleReset} variant="outline">
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Redo Session
                  </Button>
                  <Button>View Report</Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded ${
                            categoryColor[exercise.category] || "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {exercise.category}
                        </span>
                        <span className="text-xs text-[#94a3b8]">{exercise.duration}</span>
                      </div>
                      <CardTitle className="text-lg text-[#1E3A5F]">{exercise.title}</CardTitle>
                      <CardDescription>
                        Step {current + 1} of {exercises.length}
                      </CardDescription>
                    </div>
                    {isCompleted && (
                      <Badge variant="mild" className="shrink-0">Done</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-5">
                  {/* Instruction */}
                  <div className="rounded-md border border-[#e2e8f0] bg-[#F1F5F9] p-4">
                    <p className="text-sm text-[#334155] leading-relaxed">{exercise.instruction}</p>
                  </div>

                  {/* Prompt */}
                  {exercise.prompt && (
                    <div className="flex items-start gap-2 rounded-md border border-[#2A9D8F]/30 bg-[#2A9D8F]/5 px-4 py-3">
                      <Mic className="h-4 w-4 shrink-0 text-[#2A9D8F] mt-0.5" />
                      <p className="text-sm text-[#334155] italic">{exercise.prompt}</p>
                    </div>
                  )}

                  {/* Tips */}
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-[#64748b] mb-2 flex items-center gap-1.5">
                      <Info className="h-3 w-3" />
                      Tips
                    </p>
                    <ul className="space-y-1">
                      {exercise.tips.map((tip) => (
                        <li key={tip} className="flex items-start gap-2 text-xs text-[#64748b]">
                          <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#2A9D8F]" />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Start / record prompt */}
                  {!started && exercise.prompt && (
                    <Button
                      variant="outline"
                      className="w-full border-[#2A9D8F] text-[#2A9D8F] hover:bg-[#2A9D8F]/5"
                      onClick={() => setStarted(true)}
                    >
                      <PlayCircle className="mr-2 h-4 w-4" />
                      Start Recording
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Navigation */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  disabled={current === 0}
                  onClick={() => setCurrent((c) => c - 1)}
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Previous
                </Button>
                <Button className="flex-1" onClick={markDoneAndNext}>
                  {current === exercises.length - 1 ? "Finish Session" : "Next Exercise"}
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </AppLayout>
  )
}
