# Lyric Motion — Agent Context

Repository: https://github.com/devanshugound89-cmyk/lyric-motion
Branch: `master`

## Direct raw source links

- [LyricVideo.tsx](https://raw.githubusercontent.com/devanshugound89-cmyk/lyric-motion/master/src/LyricVideo.tsx)
- [Root.tsx](https://raw.githubusercontent.com/devanshugound89-cmyk/lyric-motion/master/src/Root.tsx)
- [Composition.tsx](https://raw.githubusercontent.com/devanshugound89-cmyk/lyric-motion/master/src/Composition.tsx)
- [Word.tsx](https://raw.githubusercontent.com/devanshugound89-cmyk/lyric-motion/master/src/Word.tsx)
- [types.ts](https://raw.githubusercontent.com/devanshugound89-cmyk/lyric-motion/master/src/types.ts)
- [fetch-assets.mjs](https://raw.githubusercontent.com/devanshugound89-cmyk/lyric-motion/master/scripts/fetch-assets.mjs)
- [sync-lyrics.py](https://raw.githubusercontent.com/devanshugound89-cmyk/lyric-motion/master/scripts/sync-lyrics.py)
- [lyrics-aligned.json](https://raw.githubusercontent.com/devanshugound89-cmyk/lyric-motion/master/public/lyrics-aligned.json)

## Project map

- `src/LyricVideo.tsx`: cinematic lyric composition and timing data.
- `src/Root.tsx`: 1080x1920, 60fps, 720-frame composition registration.
- `scripts/sync-lyrics.py`: converts word start seconds to 60fps `startFrame` values.
- `scripts/fetch-assets.mjs`: optional local B-roll and overlay preprocessing.
- `public/audio.mp3`: the trimmed 12-second render audio used by the composition.
- `public/lyrics-aligned.json`: generated word timing reference.

## Known word timing reference

| Word | Seconds | Frame |
|---|---:|---:|
| kya | 0.90 | 54 |
| fitoor | 1.30 | 78 |
| hai | 1.93 | 116 |
| raha | 2.85 | 171 |
| kyun | 3.40 | 204 |
| jaaye | 3.97 | 238 |
| naa | 4.60 | 276 |
| yeh | 5.55 | 333 |
| kasoor | 6.13 | 368 |
| mera | 6.97 | 418 |

## Validation

```powershell
python scripts/sync-lyrics.py
npx remotion compositions
npx remotion render LyricVideo out/cinema_edit.mp4 --codec=h264
```

The repository is intentionally source-first. Rendered MP4 files under `out/` are ignored by Git; the source, timing data, audio, and pipeline scripts are committed.

# Kalyani LRC update

The current edit uses the provided full Kalyani track and selects the LRC section beginning at `[01:42.39]` through a 12-second excerpt via `Audio startFrom={6143} endAt={6863}` at 60fps.

The incorrect `hai` word was removed only. The remaining nine lyric entries and their existing timing structure are preserved.

Preview: `out/kalyani_lrc_preview.mp4`
