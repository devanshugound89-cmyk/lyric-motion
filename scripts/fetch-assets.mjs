import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
const root = process.cwd();
const assets = path.join(root, "public", "assets");
fs.mkdirSync(assets, { recursive: true });
const brollUrl = process.argv[2] || "";
const overlayUrl = process.argv[3] || "";
const run = (bin, args) => execFileSync(bin, args, { stdio: "inherit" });
if (!brollUrl) { console.log("B-roll download skipped: pass a URL as argument 1."); }
else { run("yt-dlp", ["-f", "bestvideo[ext=mp4]/best[ext=mp4]", "--download-sections", "*0:00-0:10", brollUrl, "-o", path.join(assets,"raw_broll.mp4"), "--force-overwrites"]); run("ffmpeg", ["-y","-i",path.join(assets,"raw_broll.mp4"),"-vf","scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,fps=60,eq=contrast=1.12:brightness=-0.08:saturation=0.84,colorbalance=rs=-0.08:gs=-0.02:bs=0.12:rh=0.10:gh=0.04:bh=-0.08","-an","-c:v","libx264","-pix_fmt","yuv420p",path.join(assets,"broll_graded.mp4")]); }
if (!overlayUrl) { console.log("Overlay download skipped: pass a URL as argument 2."); }
else { run("yt-dlp", [overlayUrl,"-o",path.join(assets,"raw_overlay.mp4"),"--force-overwrites"]); run("ffmpeg", ["-y","-i",path.join(assets,"raw_overlay.mp4"),"-vf","fps=60,colorkey=0x00ff00:0.25:0.10,format=yuva420p","-an","-c:v","libvpx-vp9",path.join(assets,"overlay_keyed.webm")]); }
console.log("Asset cache ready:", fs.readdirSync(assets));
