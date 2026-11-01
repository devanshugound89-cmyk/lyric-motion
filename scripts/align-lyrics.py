"""
Forced-align the lyrics in public/lyrics.txt to public/audio.mp3 and write real
word onsets (no more guessed timings).

Usage:
    pip install stable-ts
    python scripts/align-lyrics.py                       # default: public/audio.mp3
    python scripts/align-lyrics.py --audio public/vocals.mp3 --model medium

Tips:
  * For best results align against an isolated vocal stem:
        pip install demucs
        demucs --two-stems=vocals public/audio.mp3
    then pass --audio separated/htdemucs/audio/vocals.wav
  * public/lyrics.txt must contain exactly 10 whitespace-separated words, in
    singing order (the composition expects 10).
  * --shift nudges every word (seconds, negative = earlier) if the aligner is
    consistently a hair late/early. LEAD_FRAMES in LyricVideo.tsx is the other knob.
"""
import argparse
import json
import pathlib
import sys

ROOT = pathlib.Path(__file__).resolve().parents[1]
FPS = 60

# Labels shown in the JSON (must match the 10 lyric words, in order)
LABELS = ["kya", "fitoor", "hai", "raha", "kyun", "jaaye", "naa", "yeh", "kasoor", "mera"]


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--audio", default=str(ROOT / "public" / "audio.mp3"))
    ap.add_argument("--lyrics", default=str(ROOT / "public" / "lyrics.txt"))
    ap.add_argument("--model", default="small")
    ap.add_argument("--language", default="hi")
    ap.add_argument("--shift", type=float, default=0.0)
    ap.add_argument("--fps", type=int, default=FPS)
    args = ap.parse_args()

    try:
        import stable_whisper
    except ImportError:
        sys.exit("Missing dependency. Run: pip install stable-ts")

    text = pathlib.Path(args.lyrics).read_text(encoding="utf-8").strip()
    expected = text.split()
    if len(expected) != len(LABELS):
        sys.exit(f"lyrics.txt has {len(expected)} words, expected {len(LABELS)}. Fix the file.")

    model = stable_whisper.load_model(args.model)
    result = model.align(args.audio, text, language=args.language)

    words = [w for seg in result.segments for w in seg.words]
    if len(words) != len(LABELS):
        sys.exit(
            f"Aligner returned {len(words)} words, expected {len(LABELS)}. "
            "Try --model medium or a vocal stem."
        )

    out_words = []
    prev = -1
    for label, w in zip(LABELS, words):
        start = max(0.0, round(float(w.start) + args.shift, 3))
        frame = round(start * args.fps)
        frame = max(frame, prev + 1)  # strictly increasing
        prev = frame
        out_words.append({"text": label, "start": start, "startFrame": frame})

    (ROOT / "public").mkdir(exist_ok=True)
    (ROOT / "public" / "audio.json").write_text(
        json.dumps({"words": [{"text": w["text"], "start": w["start"]} for w in out_words]}, indent=2),
        encoding="utf-8",
    )
    (ROOT / "public" / "lyrics-aligned.json").write_text(
        json.dumps({"words": out_words}, ensure_ascii=False, indent=2), encoding="utf-8"
    )

    print("word      start(s)  frame")
    for w in out_words:
        print(f"{w['text']:<9} {w['start']:>7.3f}  {w['startFrame']:>5}")
    print("\nWrote public/audio.json and public/lyrics-aligned.json")


if __name__ == "__main__":
    main()
