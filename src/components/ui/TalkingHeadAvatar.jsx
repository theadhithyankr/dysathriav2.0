import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react"
import { Loader2 } from "lucide-react"
import { getToken, API_BASE } from "@/lib/auth"

const TH_URL     = "https://cdn.jsdelivr.net/gh/met4citizen/TalkingHead@1.7.0/modules/talkinghead.mjs"
const AVATAR_URL = "https://cdn.jsdelivr.net/gh/met4citizen/TalkingHead@1.7.0/avatars/brunette.glb"

/**
 * Estimate per-word start times and durations (milliseconds).
 * ~75 ms/char, min 200 ms/word, 80 ms inter-word gap.
 */
function estimateWordTimings(text) {
  const words = text.split(/\s+/).filter(Boolean)
  const wtimes = []
  const wdurations = []
  let t = 0
  for (const w of words) {
    const dur = Math.max(200, w.length * 75)
    wtimes.push(t)
    wdurations.push(dur)
    t += dur + 80
  }
  return { words, wtimes, wdurations }
}

/**
 * 3-D talking avatar backed by TalkingHead.js + Ready Player Me.
 * Exposes speak(text, onWord?) and stop() via ref.
 * Falls back gracefully if CDN is unreachable.
 *
 * Usage:
 *   const avatarRef = useRef(null)
 *   <TalkingHeadAvatar ref={avatarRef} onSpeakingChange={setSpeaking} />
 *   avatarRef.current.speak("Hello!")
 */
const TalkingHeadAvatar = forwardRef(function TalkingHeadAvatar(
  { onSpeakingChange, className = "" },
  ref
) {
  const containerRef = useRef(null)
  const headRef      = useRef(null)
  const [status, setStatus] = useState("idle") // idle | loading | ready | error

  useImperativeHandle(ref, () => ({
    speak(text, onWord) {
      if (!headRef.current || status !== "ready") return
      const head = headRef.current
      onSpeakingChange?.(true)

      ;(async () => {
        try {
          const token = getToken()
          const res = await fetch(
            `${API_BASE}/api/tts?text=${encodeURIComponent(text)}`,
            { headers: { Authorization: `Bearer ${token}` } }
          )
          if (!res.ok) throw new Error("TTS fetch failed")
          const arrayBuffer = await res.arrayBuffer()
          head.speakAudio(
            { audio: arrayBuffer, ...estimateWordTimings(text) },
            { lipsyncLang: "en" },
            (word) => onWord?.(word.trim().toLowerCase().replace(/[^a-z']/g, ""))
          )
        } catch {
          // Fall back to speakText (animation only, no audio)
          head.speakText(text, { lipsyncLang: "en" })
        }
        // Poll until speaking stops — handles both speakAudio and speakText paths
        const poll = setInterval(() => {
          if (!head.isSpeaking?.()) {
            clearInterval(poll)
            onWord?.("")
            onSpeakingChange?.(false)
          }
        }, 300)
      })()
    },
    stop() {
      headRef.current?.stopSpeaking()
      onSpeakingChange?.(false)
    }
  }), [status]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!containerRef.current) return
    let mounted = true

    async function init() {
      setStatus("loading")
      try {
        // Dynamic CDN import — @vite-ignore bypasses Vite's static analysis
        const { TalkingHead } = await import(/* @vite-ignore */ TH_URL)
        if (!mounted) return

        const head = new TalkingHead(containerRef.current, {
          ttsEndpoint:        null,
          ttsLang:            "en-US",
          cameraView:         "head",
          cameraRotateEnable: false,
          cameraZoomEnable:   false,
          cameraEnable:       false,
        })

        await head.showAvatar({
          url:          AVATAR_URL,
          body:         "F",
          avatarMood:   "neutral",
          ttsLang:      "en-US",
          lipsyncLang:  "en",
        })

        // Detect when speech finishes naturally by polling the queue
        const origSpeakText = head.speakText.bind(head)
        head.speakText = (...args) => {
          const result = origSpeakText(...args)
          // Poll for idle state (queue length goes to 0)
          const poll = setInterval(() => {
            if (!head.isSpeaking?.()) {
              clearInterval(poll)
              onSpeakingChange?.(false)
            }
          }, 300)
          return result
        }

        // Manual stop also notifies parent
        const origStop = head.stopSpeaking.bind(head)
        head.stopSpeaking = (...args) => {
          onSpeakingChange?.(false)
          return origStop(...args)
        }

        headRef.current = head
        if (mounted) setStatus("ready")
      } catch (err) {
        console.warn("TalkingHead failed to load:", err)
        if (mounted) setStatus("error")
      }
    }

    init()

    return () => {
      mounted = false
      try { headRef.current?.stopSpeaking() } catch {} // eslint-disable-line no-empty
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      className={`relative rounded-xl overflow-hidden flex items-center justify-center shrink-0 ${className}`}
      style={{ background: "linear-gradient(160deg,#1a1a3e 0%,#0f2d2d 100%)" }}
    >
      {/* Avatar canvas — TalkingHead injects a <canvas> here */}
      <div ref={containerRef} className="w-full h-full" />

      {status === "loading" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-white/70 pointer-events-none">
          <Loader2 className="h-6 w-6 animate-spin text-[#2A9D8F]" />
          <span className="text-xs">Loading avatar…</span>
        </div>
      )}

      {status === "error" && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-white/40 text-xs text-center px-3">
            3-D avatar unavailable
          </span>
        </div>
      )}

      {/* Ready glow ring */}
      {status === "ready" && (
        <div className="absolute inset-0 rounded-xl ring-1 ring-[#2A9D8F]/40 pointer-events-none" />
      )}
    </div>
  )
})

export default TalkingHeadAvatar
