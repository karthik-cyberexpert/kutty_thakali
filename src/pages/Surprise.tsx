import { useParams } from "react-router-dom";
import ParticlesBackground from "@/components/ParticlesBackground";

const Surprise = () => {
  const { name } = useParams();

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
        <ParticlesBackground />
        <div className="relative z-10 text-center text-white">
            <h1 className="text-4xl md:text-6xl font-bold">Happy Birthday, {name}!</h1>
            <p className="mt-4 text-xl">Your gift is loading...</p>
        </div>
    </div>
  );
};

export default Surprise;