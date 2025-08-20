import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { gsap } from "gsap";
import ParticlesBackground from "@/components/ParticlesBackground";
import GiftBox from "@/components/GiftBox";
import Confetti from "@/components/Confetti";
import AudioPlayer from "@/components/AudioPlayer";
import { Button } from "@/components/ui/button";
import { RefreshCw, Eye } from "lucide-react";
import GiftBurst from "@/components/GiftBurst";
import Bomb from "@/components/Bomb";
import CountdownTimer from "@/components/CountdownTimer";
import Mail from "@/components/Mail";
import RocketAnimation from "@/components/RocketAnimation";

type AnimationPhase = "gift" | "bombThrown" | "timerCountdown" | "explosion" | "finalMessage";

const Surprise = () => {
  const { name } = useParams();
  const navigate = useNavigate();
  const location = useLocation(); // To read state from navigation

  const [animationPhase, setAnimationPhase] = useState<AnimationPhase>("gift");
  const [bombPosition, setBombPosition] = useState<{ x: number; y: number } | null>(null);
  const [explosionOrigin, setExplosionOrigin] = useState<{ x: number; y: number } | null>(null);
  const [isGiftBurstFading, setIsGiftBurstFading] = useState(false);
  const [showFindMailText, setShowFindMailText] = useState(false); // New state for "Find a mail box" text

  // New states for rocket animation and message
  const [showOriginalBirthdayMessage, setShowOriginalBirthdayMessage] = useState(true);
  const [showRocketRevealAnimation, setShowRocketRevealAnimation] = useState(false);
  const [showRocketText, setShowRocketText] = useState(false);
  const [showFinalGiftBox, setShowFinalGiftBox] = useState(true); // New state to control gift box visibility

  const finalGiftRef = useRef<HTMLDivElement>(null);
  const messageRef = useRef<HTMLDivElement>(null); // Ref for the original birthday message
  const revealButtonRef = useRef<HTMLButtonElement>(null); // This is now the "Show" button
  const replayButtonRef = useRef<HTMLButtonElement>(null);
  const mainContentRef = useRef<HTMLDivElement>(null);
  const findMailTextRef = useRef<HTMLDivElement>(null); // Ref for the new text

  // Refs for the new animated text elements
  const numberRef = useRef<HTMLDivElement>(null);
  const greetingRef = useRef<HTMLDivElement>(null);

  const birthdayMessage = `Happy Birthday, ${name}! May your day be as bright and beautiful as your smile. Wishing you all the love and happiness in the world.`;

  // Effect to handle navigation state for final message
  useEffect(() => {
    if (location.state?.phase === 'finalMessage') {
      setAnimationPhase('finalMessage');
      // Clear any previous states that might interfere
      setBombPosition(null);
      setExplosionOrigin(null);
      setIsGiftBurstFading(false);
      setShowFindMailText(false); // Ensure this is false
      setShowOriginalBirthdayMessage(true); // Start with original blurred message
      setShowRocketRevealAnimation(false);
      setShowRocketText(false);
      setShowFinalGiftBox(true); // Ensure gift box is visible when entering this phase
    }
  }, [location.state]);

  useEffect(() => {
    if (animationPhase === "finalMessage") {
      const gift = finalGiftRef.current;
      const revealButton = revealButtonRef.current;
      const replayButton = replayButtonRef.current;

      if (!gift || !revealButton || !replayButton) return;

      // Initial states for buttons and messages in finalMessage phase
      gsap.set(revealButton, { opacity: 0, y: 20, pointerEvents: 'none' });
      gsap.set(replayButton, { opacity: 0, y: 20, pointerEvents: 'none' });

      // Animate gift and then show the "Show" button
      gsap.timeline()
        .fromTo(gift, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 1, ease: 'bounce.out' })
        .to(gift, {
          scale: 1.5,
          opacity: 0,
          duration: 0.5,
          ease: 'power2.in',
          onComplete: () => {
            setShowFinalGiftBox(false); // Hide it completely after fading out
          }
        })
        .to(revealButton, { opacity: 1, y: 0, pointerEvents: 'auto', duration: 0.5, ease: 'power2.out' }, "+=0.5");
    }
  }, [animationPhase]);

  const handleGiftOpen = useCallback((position: { x: number; y: number }) => {
    setBombPosition(position);
    setAnimationPhase("bombThrown");
  }, []);

  const handleBombClick = useCallback((position: { x: number; y: number }) => {
    setExplosionOrigin(position);
    setAnimationPhase("timerCountdown");
  }, []);

  const handleTimerComplete = useCallback(() => {
    setAnimationPhase("explosion"); // Transition to explosion phase where particles and mail appear
    setShowFindMailText(true); // Show "Find a mail box" text
  }, []);

  const handleMailClick = useCallback(() => {
    // This is called when the Mail icon is clicked
    setIsGiftBurstFading(true); // Trigger GiftBurst particles to fade out
    setShowFindMailText(false); // Hide "Find a mail box" text
    // The Mail component's own animation will handle its disappearance
  }, []);

  const handleMailOpenComplete = useCallback(() => {
    // This is called after the Mail opening animation finishes
    // We now wait for GiftBurst to fade out before navigating
    // The navigation is handled by handleGiftBurstFadeOutComplete
    navigate(`/mail-content/${name}`, { state: { fromMailOpen: true } }); // Navigate to MailContent with state
  }, [name, navigate]);

  const handleGiftBurstFadeOutComplete = useCallback(() => {
    // This callback is fired when GiftBurst particles have completely faded out
    // This navigation is now handled by handleMailOpenComplete
    setIsGiftBurstFading(false); // Reset state for replay
    setShowFindMailText(false); // Ensure this is false
  }, []);

  const handleShow = useCallback(() => {
    const revealButton = revealButtonRef.current;
    if (!revealButton) return;

    gsap.to(revealButton, { opacity: 0, y: -20, pointerEvents: 'none', duration: 0.5, ease: 'power2.in' });
    setShowOriginalBirthdayMessage(false); // Hide the original blurred message
    setShowRocketRevealAnimation(true); // Start the rocket animation
  }, []);

  const handleRocketRevealText = useCallback(() => {
    setShowRocketText(true); // Render the elements first
    gsap.timeline()
      .fromTo(numberRef.current,
        { opacity: 0, y: 50, scale: 0.8, filter: 'blur(10px)' },
        { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: 0.8, ease: 'power2.out' }
      )
      .fromTo(greetingRef.current,
        { opacity: 0, y: 50, scale: 0.8, filter: 'blur(10px)' },
        { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: 0.8, ease: 'power2.out' },
        '-=0.4' // Stagger the start slightly
      );
  }, []);

  const handleRocketAnimationComplete = useCallback(() => {
    setShowRocketRevealAnimation(false); // Hide the rocket animation component
    const replayButton = replayButtonRef.current;
    if (replayButton) {
      gsap.to(replayButton, { opacity: 1, y: 0, pointerEvents: 'auto', duration: 0.5, ease: 'power2.out' });
    }
  }, []);

  const handleReplay = useCallback(() => {
    setAnimationPhase('gift');
    setBombPosition(null);
    setExplosionOrigin(null);
    setIsGiftBurstFading(false); // Reset state
    setShowFindMailText(false); // Reset state
    setShowOriginalBirthdayMessage(true); // Show original blurred message again
    setShowRocketRevealAnimation(false); // Hide rocket animation
    setShowRocketText(false); // Hide rocket text
    setShowFinalGiftBox(true); // Show gift box again for replay
    if (mainContentRef.current) {
        gsap.set(mainContentRef.current, { opacity: 1, display: 'flex' });
    }
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

      {/* Phase: Explosion (particles and mail appear together) */}
      {animationPhase === 'explosion' && explosionOrigin && (
        <>
          <GiftBurst
            originX={explosionOrigin.x}
            originY={explosionOrigin.y}
            fadeAway={isGiftBurstFading} // Control fade out via state
            onFadeOutComplete={handleGiftBurstFadeOutComplete} // Callback when fade out is done
          />
          <Mail
            explosionOrigin={explosionOrigin} // Pass origin for scattering
            onMailClick={handleMailClick}
            onMailOpenComplete={handleMailOpenComplete}
          />
          {showFindMailText && (
            <div
              ref={findMailTextRef}
              className="absolute inset-0 flex items-center justify-center z-40 text-white text-4xl md:text-5xl font-bold animate-fade-in-down"
              style={{ textShadow: '0 0 15px rgba(255,255,255,0.8), 0 0 30px rgba(0,255,255,0.7)' }}
            >
              Find a mail box!
            </div>
          )}
        </>
      )}

      {/* Phase: Final Message */}
      {animationPhase === "finalMessage" && (
        <div className="relative z-10 flex flex-col items-center justify-center text-center text-white w-full h-full">
          {/* Gift box (conditionally rendered) */}
          {showFinalGiftBox && (
            <div ref={finalGiftRef} className="text-8xl">🎁</div>
          )}
          {/* Confetti (appears when gift is hidden) */}
          {!showFinalGiftBox && <Confetti />}

          {/* Original blurred message (visible until "Show" is clicked) */}
          {showOriginalBirthdayMessage && (
            <div
              ref={messageRef} // Keep messageRef for the original message
              className="font-script text-4xl md:text-6xl max-w-3xl p-4 bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400"
              style={{ textShadow: '0 0 10px rgba(255,255,255,0.5)', filter: 'blur(16px)' }}
            >
              {birthdayMessage.split('').map((char, index) => <span key={index} className="inline-block">{char === ' ' ? '\u00A0' : char}</span>)}
            </div>
          )}

          {/* "Show" button (visible only before rocket animation) */}
          {!showRocketRevealAnimation && !showRocketText && (
            <Button ref={revealButtonRef} onClick={handleShow} className="mt-8 bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white/30 transition-all duration-300">
              <Eye className="mr-2 h-4 w-4" /> Show
            </Button>
          )}

          {/* Rocket animation component */}
          {showRocketRevealAnimation && (
            <RocketAnimation
              onReveal={handleRocketRevealText}
              onComplete={handleRocketAnimationComplete}
            />
          )}

          {/* Revealed text and Replay button (visible after rocket animation) */}
          {showRocketText && (
            <div className="absolute inset-0 flex flex-col items-center justify-center z-50">
              <div ref={numberRef} className="text-9xl md:text-[12rem] font-bold text-white mb-4" style={{ textShadow: '0 0 20px rgba(255,255,255,0.8), 0 0 40px rgba(255,0,255,0.8)' }}>
                19
              </div>
              <div ref={greetingRef} className="text-3xl md:text-4xl font-script text-purple-300 mb-8" style={{ textShadow: '0 0 10px rgba(128,0,128,0.7)' }}>
                Happy Birthday Bestoo
              </div>
              <Button ref={replayButtonRef} onClick={handleReplay} className="mt-8 bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white/30 transition-all duration-300">
                <RefreshCw className="mr-2 h-4 w-4" /> Replay
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Surprise;