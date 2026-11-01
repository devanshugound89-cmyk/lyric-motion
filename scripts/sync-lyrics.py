import json, pathlib, sys
root = pathlib.Path(__file__).resolve().parents[1]
out = root / "public" / "lyrics-aligned.json"
source = root / "public" / "audio.json"
if source.exists():
    data = json.loads(source.read_text(encoding="utf-8"))
else:
    data = {"words":[{"text":"kya","start":0.90},{"text":"fitoor","start":1.30},{"text":"hai","start":1.93},{"text":"raha","start":2.85},{"text":"kyun","start":3.40},{"text":"jaaye","start":3.97},{"text":"naa","start":4.60},{"text":"yeh","start":5.55},{"text":"kasoor","start":6.13},{"text":"mera","start":6.97}]}
for word in data["words"]:
    word["startFrame"] = round(float(word["start"]) * 60)
out.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
print(f"Wrote {out}")
