import { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import { gsap } from "gsap";
import ParticlesBackground from "@/components/ParticlesBackground";
import GiftBox from "@/components/GiftBox";
import Confetti from "@/components/Confetti";
import AudioPlayer from "@/components/AudioPlayer";
import { Button } from "@/components/ui/button";
import { RefreshCw, Eye } from "lucide-react";
import PhotoTrain from "@/components/PhotoTrain";
import GiftBurst from "@/components/GiftBurst";
import WaveTransition from "@/components/WaveTransition";
import GunAnimation from "@/components/GunAnimation";
import BulletHole from "@/components/BulletHole";
import Bomb from "@/components/Bomb"; // New import
import CountdownTimer from "@/components/CountdownTimer"; // New import
import Mail from "@/components/Mail"; // New import

type AnimationPhase = "gift" | "bombThrown" | "timerCountdown" | "explosion" | "mailRevealed" | "photoTrain" | "finalMessage";

const Surprise = () => {
  const { name } = useParams();
  const [animationPhase, setAnimationPhase] = useState<AnimationPhase>("gift");
  const [bombPosition, setBombPosition] = useState<{ x: number; y: number } | null>(null);
  const [explosionOrigin, setExplosionOrigin] = useState<{ x: number; y: number } | null>(null);
  const [bulletHolePosition, setBulletHolePosition] = useState<{ x: number; y: number } | null>(null);

  const finalGiftRef = useRef<HTMLDivElement>(null);
  const messageRef = useRef<HTMLDivElement>(null);
  const replayButtonRef = useRef<HTMLButtonElement>(null);
  const revealButtonRef = useRef<HTMLButtonElement>(null);
  const mainContentRef = useRef<HTMLDivElement>(null);

  const images = Array.from({ length: 23 }, (_, i) => `/images/image-${i + 1}.png`);

  const birthdayMessage = `Happy Birthday, ${name}! May your day be as bright and beautiful as your smile. Wishing you all the love and happiness in the world.`;

  useEffect(() => {
    if (animationPhase === "finalMessage") {
      const gift = finalGiftRef.current;
      const message = messageRef.current;
      const revealButton = revealButtonRef.current;
      const replayButton = replayButtonRef.current;

      if (!gift || !message || !revealButton || !replayButton) return;

      gsap.set(revealButton, { opacity: 0, y: 20, pointerEvents: 'none' });
      gsap.set(replayButton, { opacity: 0, y: 20, pointerEvents: 'none' });
      gsap.set(message, { filter: 'blur(16px)' });

      const letters = message.querySelectorAll('span');
      gsap.timeline()
        .fromTo(gift, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 1, ease: 'bounce.out' })
        .to(gift, { scale: 1.5, opacity: 0, duration: 0.5, ease: 'power2.in' })
        .fromTo(letters, { opacity: 0, y: 20 }, { opacity: 1, y: 0, stagger: 0.05, duration: 0.5, ease: 'power2.out' }, "-=0.2")
        .to(revealButton, { opacity: 1, y: 0, pointerEvents: 'auto', duration: 0.5, ease: 'power2.out' }, "+=0.5");
    }
  }, [animationPhase]);

  const handleGiftOpen = useCallback((position: { x: number; y: number }) => {
    setBombPosition(position);
    setAnimationPhase("bombThrown");
  }, []);

  const handleBombClick = useCallback((position: { x: number; y: number }) => {
    setExplosionOrigin(position); // Set explosion origin to bomb's position
    setAnimationPhase("timerCountdown");
  }, []);

  const handleTimerComplete = useCallback(() => {
    setAnimationPhase("explosion");
  }, []);

  const handleExplosionComplete = useCallback(() => {
    setAnimationPhase("mailRevealed");
  }, []);

  const handleMailClick = useCallback(() => {
    // Transition to the next phase after mail is clicked
    // For now, let's transition to the PhotoTrain phase directly
    // If you want to re-introduce the "Shoot!" button, we'd add a new phase here.
    setAnimationPhase("photoTrain");
  }, []);

  const handlePhotoTrainComplete = useCallback(() => {
    setAnimationPhase("finalMessage");
    setBulletHolePosition(null);
  }, []);

  const handleReplay = useCallback(() => {
    setAnimationPhase('gift');
    setBombPosition(null);
    setExplosionOrigin(null);
    setBulletHolePosition(null);
    if (mainContentRef.current) {
        gsap.set(mainContentRef.current, { opacity: 1, display: 'flex' });
    }
  }, []);

  const handleReveal = useCallback(() => {
    const message = messageRef.current;
    const revealButton = revealButtonRef.current;
    const replayButton = replayButtonRef.current;

    if (message && revealButton && replayButton) {
      const gradientClasses = ['bg-clip-text', 'text-transparent', 'bg-gradient-to-r', 'from-pink-400', 'via-purple-400', 'to-cyan-400'];

      const tl = gsap.timeline();
      tl.to(revealButton, { opacity: 0, y: -20, pointerEvents: 'none', duration: 0.5, ease: 'power2.in' })
        .to(message, {
          filter: 'blur(0px)',
          duration: 1.5,
          ease: 'power2.out',
          onStart: () => {
            message.classList.remove(...gradientClasses);
            message.classList.add('text-cyan-300');
            message.style.textShadow = '0 0 15px rgba(0, 255, 255, 0.7)';
          }
        }, 0)
        .to(message, {
          filter: 'blur(16px)',
          duration: 1.5,
          ease: 'power2.inOut',
          delay: 9.5,
          onStart: () => {
            message.classList.add(...gradientClasses);
            message.classList.remove('text-cyan-300');
            message.style.textShadow = '0 0 10px rgba(255,255,255,0.5)';
          }
        })
        .to(replayButton, { opacity: 1, y: 0, pointerEvents: 'auto', duration: 0.5, ease: 'power2.out' });
    }
  }, []);

  // Placeholder for GunAnimation and BulletHole if they are still desired later
  // For now, PhotoTrain will follow Mail.
  const handleGunShotComplete = useCallback((holePos: { x: number; y: number }) => {
    setBulletHolePosition(holePos);
    setAnimationPhase("photoTrain");
  }, []);


  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
      <ParticlesBackground />
      <AudioPlayer src="/birthday-music.mp3" />

      {/* Phase: Gift Box */}
      {animationPhase === 'gift' && (
        <div ref={mainContentRef} className="relative z-10 flex flex-col items-center justify-center text-center text-white w-full h-full">
          <div className="flex flex-col items-center animate-fade-in-down">
            <h1 className="text-4xl md:text-6xl font-bold mb-8">A special gift for you, {name}!</h1>
            <GiftBox onOpen={handleGiftOpen} />
          </div>
        </div>
      )}

      {/* Phase: Bomb Thrown */}
      {animationPhase === 'bombThrown' && bombPosition && (
        <Bomb initialX={bombPosition.x} initialY={bombPosition.y} onBombClick={handleBombClick} />
      )}

      {/* Phase: Timer Countdown */}
      {animationPhase === 'timerCountdown' && (
        <CountdownTimer onComplete={handleTimerComplete} />
      )}

      {/* Phase: Explosion */}
      {animationPhase === 'explosion' && explosionOrigin && (
        <GiftBurst originX={explosionOrigin.x} originY={explosionOrigin.y} onComplete={handleExplosionComplete} />
      )}

      {/* Phase: Mail Revealed */}
      {animationPhase === 'mailRevealed' && (
        <Mail onMailClick={handleMailClick} />
      )}

      {/* Phase: Photo Train (after mail click) */}
      {animationPhase === 'photoTrain' && (
        // Re-using GunAnimation and BulletHole to trigger PhotoTrain as per previous flow
        // If you want to remove the gun animation, we can directly call PhotoTrain here
        // For now, I'll keep the gun animation as a transition to PhotoTrain
        <>
            {!bulletHolePosition && <GunAnimation onShotComplete={handleGunShotComplete} />}
            {bulletHolePosition && <BulletHole x={bulletHolePosition.x} y={bulletHolePosition.y} />}
            {bulletHolePosition && <PhotoTrain images={images} onComplete={handlePhotoTrainComplete} holePosition={bulletHolePosition} />}
        </>
      )}

      {/* Phase: Final Message */}
      {animationPhase === "finalMessage" && (
        <div className="relative z-10 flex flex-col items-center justify-center text-center text-white w-full h-full">
          <div ref={finalGiftRef} className="text-8xl">🎁</div>
          {finalGiftRef.current && gsap.getProperty(finalGiftRef.current, "opacity") === 0 && <Confetti />}
          <div
            ref={messageRef}
            className="font-script text-4xl md:text-6xl max-w-3xl p-4 bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400"
            style={{ textShadow: '0 0 10px rgba(255,255,255,0.5)' }}
          >
            {birthdayMessage.split('').map((char, index) => <span key={index} className="inline-block opacity-0">{char === ' ' ? '\u00A0' : char}</span>)}
          </div>
          <div className="mt-8 h-12 relative min-w-[240px]">
            <Button ref={revealButtonRef} onClick={handleReveal} className="absolute inset-0 bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white/30 transition-all duration-300">
              <Eye className="mr-2 h-4 w-4" /> Reveal Message
            </Button>
            <Button ref={replayButtonRef} onClick={handleReplay} className="absolute inset-0 bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white/30 transition-all duration-300">
              <RefreshCw className="mr-2 h-4 w-4" /> Replay
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Surprise;