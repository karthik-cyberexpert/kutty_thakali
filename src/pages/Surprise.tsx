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
  const location = useLocation();

  const [animationPhase, setAnimationPhase] = useState<AnimationPhase>("gift");
  const [bombPosition, setBombPosition] = useState<{ x: number; y: number } | null>(null);
  const [explosionOrigin, setExplosionOrigin] = useState<{ x: number; y: number } | null>(null);
  const [isGiftBurstFading, setIsGiftBurstFading] = useState(false);
  const [showFindMailText, setShowFindMailText] = useState(false);

  const [isMessageBlurred, setIsMessageBlurred] = useState(true); // Reintroduced state for message blur
  const [showRocketRevealAnimation, setShowRocketRevealAnimation] = useState(false);
  const [showRocketText, setShowRocketText] = useState(false);

  // States for button visibility
  const [showRevealButton, setShowRevealButton] = useState(false); // Controls "Reveal Text" button
  const [showRocketTriggerButton, setShowRocketTriggerButton] = useState(false); // Controls "Show Surprise" button
  const [showReplayButton, setShowReplayButton] = useState(false); // Controls "Replay" button

  const messageRef = useRef<HTMLDivElement>(null);
  const revealButtonRef = useRef<HTMLButtonElement>(null); // Ref for "Reveal Text" button
  const rocketTriggerButtonRef = useRef<HTMLButtonElement>(null); // Ref for "Show Surprise" button
  const replayButtonRef = useRef<HTMLButtonElement>(null);
  const mainContentRef = useRef<HTMLDivElement>(null);
  const findMailTextRef = useRef<HTMLDivElement>(null);

  const numberRef = useRef<HTMLDivElement>(null);
  const greetingRef = useRef<HTMLDivElement>(null);

  const birthdayMessage = `Happy Birthday, ${name}! May your day be as bright and beautiful as your smile. Wishing you all the love and happiness in the world.`;

  useEffect(() => {
    if (location.state?.phase === 'finalMessage') {
      setAnimationPhase('finalMessage');
      setBombPosition(null);
      setExplosionOrigin(null);
      setIsGiftBurstFading(false);
      setShowFindMailText(false);
      setIsMessageBlurred(true); // Ensure message starts blurred
      setShowRocketRevealAnimation(false);
      setShowRocketText(false);
      setShowRevealButton(true); // Show "Reveal Text" button initially
      setShowRocketTriggerButton(false); // Hide "Show Surprise" button
      setShowReplayButton(false); // Hide "Replay" button
    }
  }, [location.state]);

  useEffect(() => {
    if (animationPhase === "finalMessage") {
      const revealButton = revealButtonRef.current;

      if (!revealButton) return;

      // Initial states for buttons in finalMessage phase
      gsap.set(revealButton, { opacity: 0, y: 20 });

      // Animate to show the "Reveal Text" button directly
      gsap.timeline()
        .to(revealButton, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, "+=0.5");
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
    setAnimationPhase("explosion");
    setShowFindMailText(true);
  }, []);

  const handleMailClick = useCallback(() => {
    setIsGiftBurstFading(true);
    setShowFindMailText(false);
  }, []);

  const handleMailOpenComplete = useCallback(() => {
    navigate(`/mail-content/${name}`, { state: { fromMailOpen: true } });
  }, [name, navigate]);

  const handleGiftBurstFadeOutComplete = useCallback(() => {
    setIsGiftBurstFading(false);
    setShowFindMailText(false);
  }, []);

  const handleRevealText = useCallback(() => {
    const revealButton = revealButtonRef.current;
    const rocketTriggerButton = rocketTriggerButtonRef.current;

    if (!revealButton || !rocketTriggerButton) return;

    // Unblur the message instantly by updating state
    setIsMessageBlurred(false);

    gsap.timeline()
      .to(revealButton, { opacity: 0, y: -20, pointerEvents: 'none', duration: 0.5, ease: 'power2.in', onComplete: () => {
          setShowRevealButton(false); // Hide the "Reveal Text" button
      }})
      .call(() => {
          // Re-blur the message after 6 seconds
          setTimeout(() => {
              setIsMessageBlurred(true); // Re-blur instantly
              // Show the "Show Surprise" button
              gsap.fromTo(rocketTriggerButton,
                  { opacity: 0, y: 20 },
                  { opacity: 1, y: 0, pointerEvents: 'auto', duration: 0.5, ease: 'power2.out', onStart: () => {
                      setShowRocketTriggerButton(true);
                  }}
              );
          }, 6000); // 6 seconds delay
      }, [], 0); // Start this call immediately with the button fade out

  }, []);

  const handleTriggerRocket = useCallback(() => {
    const rocketTriggerButton = rocketTriggerButtonRef.current;
    if (!rocketTriggerButton) return;

    gsap.to(rocketTriggerButton, { opacity: 0, y: -20, pointerEvents: 'none', duration: 0.5, ease: 'power2.in', onComplete: () => {
        setShowRocketTriggerButton(false); // Hide the "Show Surprise" button
    }});
    setShowRocketRevealAnimation(true); // Start the rocket animation
  }, []);

  const handleRocketRevealText = useCallback(() => {
    setShowRocketText(true);
    gsap.timeline()
      .fromTo(numberRef.current,
        { opacity: 0, y: 50, scale: 0.8, filter: 'blur(10px)' },
        { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: 0.8, ease: 'power2.out' }
      )
      .fromTo(greetingRef.current,
        { opacity: 0, y: 50, scale: 0.8, filter: 'blur(10px)' },
        { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: 0.8, ease: 'power2.out' },
        '-=0.4'
      );
  }, []);

  const handleRocketAnimationComplete = useCallback(() => {
    setShowRocketRevealAnimation(false);
    setShowReplayButton(true); // Show replay button after rocket animation
    const replayButton = replayButtonRef.current;
    if (replayButton) {
      gsap.fromTo(replayButton, { opacity: 0, y: 20 }, { opacity: 1, y: 0, pointerEvents: 'auto', duration: 0.5, ease: 'power2.out' });
    }
  }, []);

  const handleReplay = useCallback(() => {
    setAnimationPhase('gift');
    setBombPosition(null);
    setExplosionOrigin(null);
    setIsGiftBurstFading(false);
    setShowFindMailText(false);
    setIsMessageBlurred(true); // Reset for replay
    setShowRocketRevealAnimation(false);
    setShowRocketText(false);
    setShowRevealButton(true); // Reset for replay
    setShowRocketTriggerButton(false); // Reset for replay
    setShowReplayButton(false); // Reset for replay
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
            fadeAway={isGiftBurstFading}
            onFadeOutComplete={handleGiftBurstFadeOutComplete}
          />
          <Mail
            explosionOrigin={explosionOrigin}
            onMailClick={handleMailClick}
            onMailOpenComplete={handleMailOpenComplete}
          />
          {showFindMailText && (
            <div
              ref={findMailTextRef}
              className="absolute inset-x-0 top-0 flex items-start justify-center z-40 text-white text-4xl md:text-5xl font-bold animate-fade-in-down pt-20"
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
          {/* Confetti (appears when gift is hidden) */}
          <Confetti />

          {/* Original blurred message (visible until "Reveal Text" is clicked) */}
          <div
            ref={messageRef}
            className={`font-script text-4xl md:text-6xl max-w-3xl p-4 bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 ${isMessageBlurred ? 'blur-lg' : ''}`}
            style={{ textShadow: '0 0 10px rgba(255,255,255,0.5)' }}
          >
            {birthdayMessage.split('').map((char, index) => <span key={index} className="inline-block">{char === ' ' ? '\u00A0' : char}</span>)}
          </div>

          {/* "Reveal Text" button */}
          {showRevealButton && (
            <Button ref={revealButtonRef} onClick={handleRevealText} className="mt-8 bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white/30 transition-all duration-300">
              <Eye className="mr-2 h-4 w-4" /> Reveal Text
            </Button>
          )}

          {/* "Show Surprise" button (for rocket animation) */}
          {showRocketTriggerButton && (
            <Button ref={rocketTriggerButtonRef} onClick={handleTriggerRocket} className="mt-8 bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white/30 transition-all duration-300">
              <Eye className="mr-2 h-4 w-4" /> Show Surprise
            </Button>
          )}

          {/* Rocket animation component */}
          {showRocketRevealAnimation && (
            <RocketAnimation
              onReveal={handleRocketRevealText}
              onComplete={handleRocketAnimationComplete}
            />
          )}

          {/* Revealed text and Replay button */}
          {showRocketText && (
            <div className="absolute inset-0 flex flex-col items-center justify-center z-50">
              <div ref={numberRef} className="text-9xl md:text-[12rem] font-bold text-white mb-4" style={{ textShadow: '0 0 20px rgba(255,255,255,0.8), 0 0 40px rgba(255,0,255,0.8)' }}>
                19
              </div>
              <div ref={greetingRef} className="text-3xl md:text-4xl font-script text-purple-300 mb-8" style={{ textShadow: '0 0 10px rgba(128,0,128,0.7)' }}>
                Happy Birthday Bestoo
              </div>
              {showReplayButton && (
                <Button ref={replayButtonRef} onClick={handleReplay} className="mt-8 bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white/30 transition-all duration-300">
                  <RefreshCw className="mr-2 h-4 w-4" /> Replay
                </Button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Surprise;