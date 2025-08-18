import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import ParticlesBackground from "@/components/ParticlesBackground";
import GiftBox from "@/components/GiftBox";
import Confetti from "@/components/Confetti";
import AudioPlayer from "@/components/AudioPlayer";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

gsap.registerPlugin(MotionPathPlugin);

type AnimationPhase = "gift" | "photos" | "character" | "finalMessage";

const Surprise = () => {
  const { name } = useParams();
  const navigate = useNavigate();
  const [animationPhase, setAnimationPhase] = useState<AnimationPhase>("gift");
  const [path, setPath] = useState("");
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const characterRef = useRef<HTMLDivElement>(null);
  const finalGiftRef = useRef<HTMLDivElement>(null);
  const messageRef = useRef<HTMLDivElement>(null);
  const backButtonRef = useRef<HTMLButtonElement>(null);

  const images = Array.from({ length: 23 }, (_, i) => `/images/image-${i + 1}.jpg`);

  const birthdayMessage = `Happy Birthday, ${name}! May your day be as bright and beautiful as your smile. Wishing you all the love and happiness in the world.`;

  useEffect(() => {
    const updatePath = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const newPath = `M ${-w * 0.1},${h * 0.5} C ${w * 0.2},${h * 0.3} ${w * 0.4},${h * 0.7} ${w * 0.6},${h * 0.5} S ${w * 0.8},${h * 0.3} ${w * 1.1},${h * 0.5}`;
      setPath(newPath);
    };
    updatePath();
    window.addEventListener("resize", updatePath);
    return () => window.removeEventListener("resize", updatePath);
  }, []);

  useEffect(() => {
    if (animationPhase === "photos" && path) {
      const imageElements = Array.from(imageContainerRef.current?.children || []);
      if (imageElements.length === 0) return;

      gsap.set(imageElements, { scale: 0, autoAlpha: 0 });
      gsap.to(imageElements, {
        duration: 10,
        scale: 1,
        autoAlpha: 1,
        stagger: 0.3,
        motionPath: { path: "#path", align: "#path", alignOrigin: [0.5, 0.5], autoRotate: true },
        ease: "power1.inOut",
        onComplete: () => setTimeout(() => setAnimationPhase("character"), 1000),
      });
    } else if (animationPhase === "character") {
      const char = characterRef.current;
      if (!char) return;
      gsap.timeline({ onComplete: () => setAnimationPhase("finalMessage") })
        .fromTo(char, { x: '-100vw', y: '10vh', scale: 0.5 }, { x: '0', y: '10vh', scale: 1, duration: 2, ease: 'power2.inOut' })
        .to(char, { scale: 1.1, yoyo: true, repeat: 1, duration: 0.5, ease: 'power1.inOut' }) // "placing" animation
        .to(char, { x: '100vw', duration: 2, ease: 'power2.in' });
    } else if (animationPhase === "finalMessage") {
      const gift = finalGiftRef.current;
      const message = messageRef.current;
      const backButton = backButtonRef.current;
      if (!gift || !message || !backButton) return;

      const letters = message.querySelectorAll('span');
      gsap.timeline()
        .fromTo(gift, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 1, ease: 'bounce.out' })
        .to(gift, { x: '+=10', yoyo: true, repeat: 5, duration: 0.1, ease: 'power1.inOut' }) // Shaking
        .to(gift, { scale: 1.5, opacity: 0, duration: 0.5, ease: 'power2.in' })
        .fromTo(letters, { opacity: 0, y: 20 }, { opacity: 1, y: 0, stagger: 0.05, duration: 0.5, ease: 'power2.out' }, "-=0.2")
        .fromTo(backButton, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, "+=0.5");
    }
  }, [animationPhase, path]);

  const handleGiftOpen = () => {
    setTimeout(() => setAnimationPhase("photos"), 500);
  };

  const handleGoBack = () => {
    navigate('/');
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
      <ParticlesBackground />
      <AudioPlayer src="/birthday-music.mp3" />
      <svg className="absolute w-0 h-0"><path id="path" d={path} stroke="none" fill="none" /></svg>

      <div className="relative z-10 flex flex-col items-center justify-center text-center text-white">
        {animationPhase === "gift" && (
          <>
            <h1 className="text-4xl md:text-6xl font-bold mb-8 animate-fade-in-down">A special gift for you, {name}!</h1>
            <GiftBox onOpen={handleGiftOpen} />
          </>
        )}

        <div ref={imageContainerRef} className="absolute top-0 left-0 w-full h-full pointer-events-none">
          {animationPhase === "photos" && images.map((src, index) => (
            <img key={index} src={src} alt={`Surprise image ${index + 1}`} className="absolute w-24 h-24 object-cover rounded-full border-4 border-pink-400 shadow-lg will-change-transform opacity-0" style={{ boxShadow: '0 0 15px #ff00ff, 0 0 25px #ff00ff', transformOrigin: 'center center' }} />
          ))}
        </div>

        {animationPhase === "character" && (
          <div ref={characterRef} className="absolute flex flex-col items-center">
            <span className="text-6xl">🏃</span>
            <span className="text-4xl mt-[-10px]">🎁</span>
          </div>
        )}

        {animationPhase === "finalMessage" && (
          <div className="flex flex-col items-center">
            <div ref={finalGiftRef} className="text-8xl">🎁</div>
            {finalGiftRef.current && gsap.getProperty(finalGiftRef.current, "opacity") === 0 && <Confetti />}
            <div ref={messageRef} className="font-script text-4xl md:text-6xl max-w-3xl p-4 bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400" style={{ textShadow: '0 0 10px rgba(255,255,255,0.5)' }}>
              {birthdayMessage.split('').map((char, index) => <span key={index} className="inline-block opacity-0">{char === ' ' ? '\u00A0' : char}</span>)}
            </div>
            <Button
              ref={backButtonRef}
              onClick={handleGoBack}
              className="mt-8 bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white/30 transition-all duration-300 opacity-0"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Create Another Surprise
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Surprise;