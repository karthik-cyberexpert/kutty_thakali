import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import ParticlesBackground from "@/components/ParticlesBackground";
import GiftBox from "@/components/GiftBox";
import Confetti from "@/components/Confetti";
import AudioPlayer from "@/components/AudioPlayer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Eye } from "lucide-react";
import PhotoTrain from "@/components/PhotoTrain";

type AnimationPhase = "gift" | "photoTrain" | "finalMessage";

const Surprise = () => {
  const { name } = useParams();
  const navigate = useNavigate();
  const [animationPhase, setAnimationPhase] = useState<AnimationPhase>("gift");
  const [isMessageRevealed, setIsMessageRevealed] = useState(false);
  const finalGiftRef = useRef<HTMLDivElement>(null);
  const messageRef = useRef<HTMLDivElement>(null);
  const backButtonRef = useRef<HTMLButtonElement>(null);
  const revealButtonRef = useRef<HTMLButtonElement>(null);

  const images = Array.from({ length: 23 }, (_, i) => `/images/image-${i + 1}.png`);

  const birthdayMessage = `Happy Birthday, ${name}! May your day be as bright and beautiful as your smile. Wishing you all the love and happiness in the world.`;

  useEffect(() => {
    if (animationPhase === "finalMessage") {
      const gift = finalGiftRef.current;
      const message = messageRef.current;
      const revealButton = revealButtonRef.current;
      if (!gift || !message || !revealButton) return;

      const letters = message.querySelectorAll('span');
      gsap.timeline()
        .fromTo(gift, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 1, ease: 'bounce.out' })
        .to(gift, { x: '+=10', yoyo: true, repeat: 5, duration: 0.1, ease: 'power1.inOut' })
        .to(gift, { scale: 1.5, opacity: 0, duration: 0.5, ease: 'power2.in' })
        .fromTo(letters, { opacity: 0, y: 20 }, { opacity: 1, y: 0, stagger: 0.05, duration: 0.5, ease: 'power2.out' }, "-=0.2")
        .fromTo(revealButton, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, "+=0.5");
    }
  }, [animationPhase]);

  const handleGiftOpen = () => {
    setTimeout(() => setAnimationPhase("photoTrain"), 500);
  };
  
  const handlePhotoTrainComplete = () => {
    setAnimationPhase("finalMessage");
  };

  const handleGoBack = () => {
    navigate('/');
  };

  const handleReveal = () => {
    setIsMessageRevealed(true);

    gsap.delayedCall(0.01, () => {
      const message = messageRef.current;
      const revealButton = revealButtonRef.current;
      const backButton = backButtonRef.current;

      if (message && revealButton && backButton) {
        const tl = gsap.timeline();
        tl.to(message, { filter: 'blur(0px)', duration: 1.5, ease: 'power2.out' })
          .to(revealButton, { opacity: 0, y: -20, duration: 0.5, ease: 'power2.in' }, 0)
          .fromTo(backButton, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' });
      }
    });
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
      <ParticlesBackground />
      <AudioPlayer src="/birthday-music.mp3" />

      {animationPhase === "photoTrain" && (
        <PhotoTrain images={images} onComplete={handlePhotoTrainComplete} />
      )}

      <div className="relative z-10 flex flex-col items-center justify-center text-center text-white">
        {animationPhase === "gift" && (
          <>
            <h1 className="text-4xl md:text-6xl font-bold mb-8 animate-fade-in-down">A special gift for you, {name}!</h1>
            <GiftBox onOpen={handleGiftOpen} />
          </>
        )}

        {animationPhase === "finalMessage" && (
          <div className="flex flex-col items-center">
            <div ref={finalGiftRef} className="text-8xl">🎁</div>
            {finalGiftRef.current && gsap.getProperty(finalGiftRef.current, "opacity") === 0 && <Confetti />}
            <div 
              ref={messageRef} 
              className="font-script text-4xl md:text-6xl max-w-3xl p-4 bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 blur-lg" 
              style={{ textShadow: '0 0 10px rgba(255,255,255,0.5)' }}
            >
              {birthdayMessage.split('').map((char, index) => <span key={index} className="inline-block opacity-0">{char === ' ' ? '\u00A0' : char}</span>)}
            </div>
            
            <div className="mt-8 h-12">
              {!isMessageRevealed ? (
                <Button
                  ref={revealButtonRef}
                  onClick={handleReveal}
                  className="bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white/30 transition-all duration-300 opacity-0"
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Reveal Message
                </Button>
              ) : (
                <Button
                  ref={backButtonRef}
                  onClick={handleGoBack}
                  className="bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white/30 transition-all duration-300 opacity-0"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Create Another Surprise
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Surprise;