import React from 'react';
import { Composition } from 'remotion';
import { LyricVideo } from './LyricVideo';

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="LyricVideo"
      component={LyricVideo}
      durationInFrames={480}
      fps={60}
      width={1080}
      height={1920}
    />
  );
};

export const Root = RemotionRoot;
