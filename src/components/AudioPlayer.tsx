"use client";

import { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AudioPlayerProps {
  src: string;
}

const AudioPlayer = ({ src }: AudioPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.loop = true;
      audio.play().catch(error => {
        console.log("Autoplay was prevented. User interaction is needed to start the audio.", error);
      });
    }
  }, []);

  const toggleMute = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.muted = !audio.muted;
      setIsMuted(audio.muted);
    }
  };

  return (
    <>
      <audio ref={audioRef} src={src} />
      <Button
        onClick={toggleMute}
        variant="ghost"
        size="icon"
        className="fixed top-4 right-4 z-50 bg-blue-900/30 backdrop-blur-md text-cyan-300 hover:bg-blue-800/40 border-2 border-cyan-500 rounded-full shadow-lg drop-shadow-[0_0_10px_rgba(0,255,255,0.5)]" // Futuristic button
      >
        {isMuted ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
        <span className="sr-only">Toggle sound</span>
      </Button>
    </>
  );
};

export default AudioPlayer;