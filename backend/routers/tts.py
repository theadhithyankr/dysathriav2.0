"""Text-to-speech endpoints.
GET  /tts?text=...  — simple audio fetch
POST /tts           — Google Cloud TTS-compatible format used by TalkingHead.js:
                      receives {input:{ssml:...}, voice:{...}, audioConfig:{...}}
                      returns  {audioContent: base64_mp3, timepoints: [...]}
                      Uses Microsoft Edge TTS for accurate word-level timing.
"""

from fastapi import APIRouter, Query, Depends, Body
from fastapi.responses import Response, JSONResponse
import re
import base64
import edge_tts

from routers.auth import get_current_user

router = APIRouter()

# Neural voice — run `edge-tts --list-voices` to see all options
EDGE_VOICE = "en-US-JennyNeural"


def _ssml_to_text(ssml: str) -> str:
    """Strip SSML tags, returning plain speakable text."""
    text = re.sub(r"<break[^>]*/?>", " ", ssml)
    text = re.sub(r"<[^>]+>", "", text)
    text = (text
        .replace("&amp;", "&").replace("&lt;", "<")
        .replace("&gt;", ">").replace("&quot;", '"').replace("&apos;", "'"))
    return re.sub(r"\s+", " ", text).strip()


async def _edge_tts_synthesize(text: str) -> tuple[bytes, list]:
    """Generate MP3 audio + word-boundary timing via Microsoft Edge TTS.
    word_boundaries: list of dicts with 'offset' (100-ns units), 'text'.
    No API key required — uses the same service as Microsoft Edge browser.
    """
    communicate = edge_tts.Communicate(text, EDGE_VOICE)
    audio_chunks: list[bytes] = []
    word_boundaries: list[dict] = []

    async for chunk in communicate.stream():
        if chunk["type"] == "audio":
            audio_chunks.append(chunk["data"])
        elif chunk["type"] == "WordBoundary":
            word_boundaries.append(chunk)

    return b"".join(audio_chunks), word_boundaries


@router.get("/tts")
async def text_to_speech_get(
    text: str = Query(..., max_length=2000),
    _user=Depends(get_current_user),
):
    """GET version — used by our frontend audio fetch."""
    audio_bytes, _ = await _edge_tts_synthesize(text)
    return Response(
        content=audio_bytes,
        media_type="audio/mpeg",
        headers={"Cache-Control": "no-cache"},
    )


@router.post("/tts")
async def text_to_speech_post(payload: dict = Body(...)):
    """POST version — TalkingHead.js sends Google Cloud TTS format.
    No auth required — called directly by the CDN-loaded TalkingHead module."""
    inp = payload.get("input", {})
    ssml = inp.get("ssml", "") if isinstance(inp, dict) else ""

    if not ssml:
        return Response(status_code=400)

    plain_text = _ssml_to_text(ssml)
    if not plain_text or len(plain_text) > 2000:
        return Response(status_code=400)

    audio_bytes, word_boundaries = await _edge_tts_synthesize(plain_text)
    audio_b64 = base64.b64encode(audio_bytes).decode()

    # TalkingHead inserts <mark name='N'/> before the Nth word (N >= 1).
    # word_boundaries[0] = first word → always at time 0, no timepoint needed.
    # word_boundaries[k] → timepoints[k-1] = {markName: str(k), timeSeconds: ...}
    timepoints = [
        {
            "markName": str(k),
            "timeSeconds": wb["offset"] / 10_000_000,  # 100-ns → seconds
        }
        for k, wb in enumerate(word_boundaries[1:], start=1)
    ]

    return JSONResponse({"audioContent": audio_b64, "timepoints": timepoints})
