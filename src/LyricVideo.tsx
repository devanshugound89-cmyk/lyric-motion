import React from "react";
import { AbsoluteFill, Audio, OffthreadVideo, Img, Sequence, staticFile, useCurrentFrame, interpolate, Easing } from "remotion";
import { loadFont as loadSyne } from "@remotion/google-fonts/Syne";
import { loadFont as loadPlayfair } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadRozha } from "@remotion/google-fonts/RozhaOne";

const { fontFamily: displayFont } = loadSyne();
const { fontFamily: serifFont } = loadPlayfair();
const { fontFamily: hindiFont } = loadRozha();
const HAS_BROLL_VIDEO = false;
const HAS_PNG_OVERLAY = false;
const aeEnter = Easing.bezier(0.16, 1, 0.3, 1);
const aeExit = Easing.bezier(0.7, 0, 0.84, 0);

type Word = { text:string; hindi?:string; startFrame:number; font:"sans"|"serif"; size:number; x:number; y:number; enter:"bottom"|"left"|"right"|"depth"; accent?:boolean };
type Phrase = { id:string; from:number; duration:number; angle:{x:number;y:number;rotate:number;scale:number}; words:Word[] };

const PHRASES: Phrase[] = [
  { id:"p1", from:48, duration:122, angle:{x:0,y:0,rotate:-1.5,scale:1.04}, words:[
    {text:"kya",startFrame:54,font:"serif",size:86,x:-130,y:-95,enter:"left"},
    {text:"FITOOR",hindi:"फ़ितूर",startFrame:78,font:"sans",size:138,x:10,y:5,enter:"depth",accent:true},
    {text:"hai...",startFrame:116,font:"serif",size:92,x:145,y:105,enter:"bottom"},
  ]},
  { id:"p2", from:170, duration:162, angle:{x:-12,y:8,rotate:1.8,scale:1.06}, words:[
    {text:"raha",startFrame:171,font:"serif",size:82,x:-150,y:-130,enter:"left"},
    {text:"KYUN",startFrame:204,font:"sans",size:112,x:90,y:-45,enter:"right"},
    {text:"jaaye",hindi:"जाए ना",startFrame:238,font:"serif",size:124,x:-40,y:55,enter:"bottom",accent:true},
    {text:"NAA",startFrame:276,font:"sans",size:132,x:115,y:155,enter:"depth",accent:true},
  ]},
  { id:"p3", from:332, duration:148, angle:{x:10,y:-10,rotate:-1.2,scale:1.08}, words:[
    {text:"yeh",startFrame:333,font:"serif",size:88,x:-140,y:-100,enter:"bottom"},
    {text:"KASOOR",hindi:"कसूर",startFrame:368,font:"sans",size:134,x:0,y:0,enter:"depth",accent:true},
    {text:"mera.",hindi:"मेरा",startFrame:418,font:"serif",size:108,x:120,y:110,enter:"right"},
  ]},
];

const CinematicBackdrop: React.FC = () => {
  const frame = useCurrentFrame();
  const swayX = Math.sin(frame/28)*9;
  const swayY = Math.cos(frame/34)*9;
  return <AbsoluteFill style={{backgroundColor:"#090D12", overflow:"hidden"}}>
    {HAS_BROLL_VIDEO ? <OffthreadVideo src={staticFile("assets/broll_graded.mp4")} style={{width:"100%",height:"100%",objectFit:"cover",filter:"contrast(1.15) saturate(.82) brightness(.55)"}} /> : <AbsoluteFill style={{background:"radial-gradient(ellipse at 30% 20%,rgba(224,122,95,.18),transparent 38%),radial-gradient(ellipse at 80% 72%,rgba(16,55,62,.75),transparent 52%),linear-gradient(145deg,#090D12,#101D23 55%,#090D12)"}} />}
    <div style={{position:"absolute",inset:-100,transform:`translate(${swayX}px,${swayY}px)`,background:"radial-gradient(circle at 18% 25%,rgba(242,204,143,.15),transparent 18%),radial-gradient(circle at 78% 65%,rgba(224,122,95,.14),transparent 22%)",filter:"blur(36px)"}} />
    {HAS_PNG_OVERLAY && <Img src={staticFile("assets/cutout.png")} style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"contain",mixBlendMode:"screen",opacity:.28}} />}
    <AbsoluteFill style={{background:"radial-gradient(circle at center,transparent 42%,rgba(0,0,0,.8) 100%)",pointerEvents:"none"}} />
  </AbsoluteFill>;
};

const EditorialWord: React.FC<{word:Word; phraseStart:number}> = ({word,phraseStart}) => {
  const frame=useCurrentFrame(); const local=frame-(word.startFrame-phraseStart); if(local<0)return null;
  const progress=interpolate(local,[0,18],[0,1],{easing:aeEnter,extrapolateLeft:"clamp",extrapolateRight:"clamp"});
  const drift=interpolate(local,[0,120],[0,-14],{extrapolateRight:"clamp"});
  const startX=word.enter==="left"?-140:word.enter==="right"?140:0; const startY=word.enter==="bottom"?95:0; const startScale=word.enter==="depth"?1.65:1;
  const x=word.x+interpolate(progress,[0,1],[startX,0]); const y=word.y+interpolate(progress,[0,1],[startY,0])+drift; const scale=interpolate(progress,[0,1],[startScale,1]);
  const blur=interpolate(local,[0,10],[16,0],{easing:aeEnter,extrapolateRight:"clamp"}); const opacity=interpolate(local,[0,6],[0,1],{extrapolateRight:"clamp"});
  const color=word.accent?"#F2CC8F":"#FAF8F5"; const shadow=word.accent?"0 0 24px rgba(224,122,95,.65),0 0 55px rgba(242,204,143,.35),0 8px 25px rgba(0,0,0,.9)":"0 0 14px rgba(224,122,95,.28),0 6px 20px rgba(0,0,0,.85)";
  return <div style={{position:"absolute",transform:`translate3d(${x}px,${y}px,0) scale(${scale})`,filter:blur>.15?`blur(${blur.toFixed(1)}px)`:"none",opacity,display:"flex",flexDirection:"column",alignItems:"center"}}>{word.hindi&&<span style={{position:"absolute",top:-58,fontFamily:hindiFont,fontSize:64,color:"#E07A5F",opacity:.42,whiteSpace:"nowrap",textShadow:"0 0 22px rgba(224,122,95,.6)"}}>{word.hindi}</span>}<span style={{fontFamily:word.font==="serif"?serifFont:displayFont,fontStyle:word.font==="serif"?"italic":"normal",fontWeight:word.font==="serif"?600:800,fontSize:word.size,color,letterSpacing:word.font==="serif"?-1:-3,lineHeight:.95,textShadow:shadow,whiteSpace:"nowrap"}}>{word.text}</span></div>;
};

export const LyricVideo: React.FC = () => {
  const frame=useCurrentFrame(); const swayX=Math.sin(frame/28)*9; const swayY=Math.cos(frame/34)*9; const breathe=1.02+Math.sin(frame/45)*.015;
  const hook=([78,238,368].find(h=>frame>=h&&frame<h+22)); const burn=hook===undefined?0:interpolate(frame-hook!,[0,4,22],[0,.48,0],{extrapolateRight:"clamp"});
  return <AbsoluteFill style={{backgroundColor:"#090D12",overflow:"hidden"}}><Audio src={staticFile("audio.mp3")} /><CinematicBackdrop /><AbsoluteFill style={{transform:`translate3d(${swayX}px,${swayY}px,0) scale(${breathe})`}}>{PHRASES.map(phrase=><Sequence key={phrase.id} from={phrase.from} durationInFrames={phrase.duration}>{<PhraseLayer phrase={phrase} />}</Sequence>)}</AbsoluteFill><AbsoluteFill style={{background:"radial-gradient(circle at 15% 20%,rgba(224,122,95,.55),transparent 20%),radial-gradient(circle at 85% 80%,rgba(242,204,143,.35),transparent 25%)",mixBlendMode:"screen",opacity:burn,pointerEvents:"none"}} /><AbsoluteFill style={{background:"url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.07'/%3E%3C/svg%3E\")",mixBlendMode:"overlay",opacity:.24,pointerEvents:"none"}} /></AbsoluteFill>;
};

const PhraseLayer: React.FC<{phrase:Phrase}> = ({phrase}) => { const frame=useCurrentFrame(); const local=frame; const exit=interpolate(local,[phrase.duration-12,phrase.duration],[0,1],{easing:aeExit,extrapolateLeft:"clamp",extrapolateRight:"clamp"}); const sceneY=interpolate(exit,[0,1],[0,-180]); const sceneScale=interpolate(exit,[0,1],[phrase.angle.scale,1.22]); const blur=interpolate(exit,[0,1],[0,18]); const opacity=interpolate(exit,[0,1],[1,0]); return <AbsoluteFill style={{justifyContent:"center",alignItems:"center",transform:`translate3d(${phrase.angle.x}px,${phrase.angle.y+sceneY}px,0) rotate(${phrase.angle.rotate}deg) scale(${sceneScale})`,filter:blur>.2?`blur(${blur.toFixed(1)}px)`:"none",opacity}}>{phrase.words.map((word,i)=><EditorialWord key={i} word={word} phraseStart={phrase.from} />)}</AbsoluteFill>; };
