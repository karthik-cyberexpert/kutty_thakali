import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { gsap } from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import ParticlesBackground from "@/components/ParticlesBackground";
import GiftBox from "@/components/GiftBox";

gsap.registerPlugin(MotionPathPlugin);

const Surprise = () => {
  const { name } = useParams();
  const [isGiftOpened, setIsGiftOpened] = useState(false);
  const [path, setPath] = useState("");
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const images = Array.from({ length: 23 }, (_, i) => `https://picsum.photos/seed/${i + 1}/200`);

  useEffect(() => {
    const updatePath = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const newPath = `M ${-w * 0.1},${h * 0.5} C ${w * 0.2},${h * 0.1} ${w * 0.4},${h * 0.9} ${w * 0.6},${h * 0.5} S ${w * 0.8},${h * 0.1} ${w * 1.1},${h * 0.5}`;
      setPath(newPath);
    };

    updatePath();
    window.addEventListener("resize", updatePath);
    return () => window.removeEventListener("resize", updatePath);
  }, []);

  useEffect(() => {
    if (isGiftOpened && path) {
      const imageElements = Array.from(imageContainerRef.current?.children || []);
      if (imageElements.length === 0) return;

      gsap.set(imageElements, { scale: 0, autoAlpha: 0 });

      gsap.to(imageElements, {
        duration: 10,
        scale: 1,
        autoAlpha: 1,
        stagger: 0.3,
        motionPath: {
          path: "#path",
          align: "#path",
          alignOrigin: [0.5, 0.5],
          autoRotate: true,
        },
        ease: "power1.inOut",
      });
    }
  }, [isGiftOpened, path]);

  const handleGiftOpen = () => {
    setTimeout(() => {
      setIsGiftOpened(true);
    }, 500);
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
      <ParticlesBackground />
      
      <svg className="absolute w-0 h-0">
        <path id="path" d={path} stroke="none" fill="none" />
      </svg>

      <div className="relative z-10 flex flex-col items-center justify-center text-center text-white">
        {!isGiftOpened && (
          <>
            <h1 className="text-4xl md:text-6xl font-bold mb-8 animate-fade-in-down">
              A special gift for you, {name}!
            </h1>
            <GiftBox onOpen={handleGiftOpen} />
          </>
        )}
        
        <div ref={imageContainerRef} className="absolute top-0 left-0 w-full h-full pointer-events-none">
          {isGiftOpened && images.map((src, index) => (
            <img
              key={index}
              src={src}
              alt={`Surprise image ${index + 1}`}
              className="absolute w-24 h-24 object-cover rounded-full border-4 border-pink-400 shadow-lg will-change-transform opacity-0"
              style={{ 
                boxShadow: '0 0 15px #ff00ff, 0 0 25px #ff00ff',
                transformOrigin: 'center center' 
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Surprise;