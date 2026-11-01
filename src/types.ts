export interface WordToken {
  text: string;
  startOffsetFrames: number;
  highlight?: boolean;
}

export interface LyricPhrase {
  id: string;
  startFrame: number;
  durationInFrames: number;
  words: WordToken[];
}
