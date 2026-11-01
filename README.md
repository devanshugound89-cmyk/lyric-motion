# Lyric Motion

A source-first Remotion project for a cinematic Hindi lyric edit.

## Agent-readable entry points

Start here: [AGENT_CONTEXT.md](AGENT_CONTEXT.md)

Direct raw source: [src/LyricVideo.tsx](https://raw.githubusercontent.com/devanshugound89-cmyk/lyric-motion/master/src/LyricVideo.tsx)

## Commands

```powershell
npm install
python scripts/sync-lyrics.py
npx remotion compositions
npx remotion render LyricVideo out/cinema_edit.mp4 --codec=h264
```

The committed project includes the composition source, exact timing reference, audio asset, and local media-ingestion scripts. Rendered files under `out/` remain ignored.
