import React from 'react';
import { Composition } from 'remotion';
import { LyricVideo } from './LyricVideo';
export const RemotionRoot: React.FC = () => <Composition id="LyricVideo" component={LyricVideo} durationInFrames={16140} fps={60} width={1080} height={1920}/>;
export const Root = RemotionRoot;
