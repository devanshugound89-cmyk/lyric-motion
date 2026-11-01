import re, json, pathlib
root = pathlib.Path(__file__).resolve().parents[1]
lrc = root / "public" / "KALYANI.lrc"
out = root / "public" / "lyrics-aligned.json"
lyrics = []
for line in lrc.read_text(encoding="utf-8-sig").splitlines():
    m = re.match(r"\[(\d+):(\d+(?:\.\d+)?)\](.*)$", line.strip())
    if m and m.group(3).strip():
        sec = int(m.group(1)) * 60 + float(m.group(2))
        lyrics.append((sec, m.group(3).strip()))
start = 102.39
duration = 12.0
selected = [(t-start, text) for t, text in lyrics if start <= t < start + duration]
if len(selected) != 3:
    raise SystemExit(f"Expected 3 selected LRC lines, found {len(selected)}")
words = [{"text": text, "start": round(rel, 3), "startFrame": round(rel * 60)} for rel, text in selected]
out.write_text(json.dumps({"words": words}, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
(root / "public" / "lyrics.txt").write_text("\n".join(text for _, text in selected) + "\n", encoding="utf-8")
print(f"Selected {len(selected)} LRC lines from {start:.2f}s to {start+duration:.2f}s")
for word in words:
    print(f"{word['startFrame']:>4}  {word['text']}")
