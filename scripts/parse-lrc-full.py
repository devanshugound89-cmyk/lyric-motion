import re, json, pathlib
root = pathlib.Path(__file__).resolve().parents[1]
lrc = root / "public" / "KALYANI.lrc"
out = root / "public" / "lrc-lines.json"
length = 269.0
lines=[]
for raw in lrc.read_text(encoding="utf-8-sig").splitlines():
    m=re.match(r"\[(\d+):(\d+(?:\.\d+)?)\](.*)$",raw.strip())
    if not m: continue
    text=m.group(3).strip()
    if not text: continue
    sec=int(m.group(1))*60+float(m.group(2))
    if sec < length: lines.append({"text":text,"start":round(sec,3),"startFrame":round(sec*60)})
lines.sort(key=lambda x:x["startFrame"])
for i,line in enumerate(lines): line["durationInFrames"]=(lines[i+1]["startFrame"]-line["startFrame"] if i+1<len(lines) else round(length*60)-line["startFrame"])
out.write_text(json.dumps({"fps":60,"durationInFrames":round(length*60),"lines":lines},ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
print(f"Wrote {len(lines)} exact LRC lines, {round(length*60)} frames")
