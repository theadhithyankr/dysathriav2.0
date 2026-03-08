"""
Text-to-speech proxy endpoint.
Uses gTTS (Google TTS, no API key required) to return MP3 audio for the avatar.
"""

from fastapi import APIRouter, Query, Depends
from fastapi.responses import Response
from gtts import gTTS
import io

from routers.auth import get_current_user

router = APIRouter()


@router.get("/tts")
async def text_to_speech(
    text: str = Query(..., max_length=2000),
    _user=Depends(get_current_user),           # requires auth to prevent abuse
):
    """Convert text to MP3 speech audio via Google TTS."""
    tts = gTTS(text=text, lang="en", slow=False)
    buf = io.BytesIO()
    tts.write_to_fp(buf)
    buf.seek(0)
    return Response(
        content=buf.read(),
        media_type="audio/mpeg",
        headers={"Cache-Control": "no-cache"},
    )
