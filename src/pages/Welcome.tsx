import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ParticlesBackground from "@/components/ParticlesBackground";
import { Gift, Upload, X } from "lucide-react";

const Welcome = () => {
  const [name, setName] = useState("Bestie");
  const [images, setImages] = useState<string[]>([]);
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const imageUrls = files.map(file => URL.createObjectURL(file));
      setImages(prevImages => [...prevImages, ...imageUrls].slice(0, 23)); // Limit to 23 images
    }
  };

  const removeImage = (index: number) => {
    setImages(prevImages => prevImages.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      navigate(`/surprise/${name.trim()}`, { state: { images } });
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden p-4">
      <ParticlesBackground />
      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-2xl text-white max-w-lg w-full">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-shadow-lg">
            Create a Birthday Surprise!
          </h1>
          <p className="mb-8 text-lg">Enter a name and add some photos for the magic.</p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-white/20 border-none text-white text-center text-lg placeholder:text-gray-300 focus:ring-2 focus:ring-pink-500 rounded-lg"
              placeholder="Enter a name"
            />
            
            <div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                multiple
                accept="image/*"
                className="hidden"
              />
              <Button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full bg-white/20 border border-white/30 text-white hover:bg-white/30"
              >
                <Upload className="mr-2 h-4 w-4" />
                Upload Photos ({images.length}/23)
              </Button>
            </div>

            {images.length > 0 && (
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-48 overflow-y-auto p-2 bg-black/20 rounded-lg">
                {images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img src={image} alt={`preview ${index}`} className="w-full h-full object-cover rounded-md aspect-square" />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <Button
              type="submit"
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-6 text-lg rounded-full shadow-lg transform transition-all duration-300 hover:scale-105"
            >
              Create Surprise <Gift className="ml-2" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Welcome;