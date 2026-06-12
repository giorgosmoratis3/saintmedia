import { useState, useEffect } from "react";
import saintmediaLogo from "@/assets/saintmedia-logo-white.png";

interface LoadingScreenProps {
  onFinished: () => void;
}

const LoadingScreen = ({ onFinished }: LoadingScreenProps) => {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setFadeOut(true), 200);
          setTimeout(() => onFinished(), 800);
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [onFinished]);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center transition-opacity duration-500 ${
        fadeOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      style={{ background: "var(--gradient-hero)" }}
    >
      <img
        src={saintmediaLogo}
        alt="SaintMedia"
        className="h-20 md:h-28 w-auto mb-8 animate-pulse"
      />
      <div className="w-48 md:w-64 h-1 rounded-full overflow-hidden" style={{ background: "hsl(0 0% 100% / 0.15)" }}>
        <div
          className="h-full rounded-full transition-all duration-75"
          style={{
            width: `${progress}%`,
            background: "linear-gradient(90deg, hsl(0 0% 100% / 0.6), hsl(0 0% 100% / 0.9))",
          }}
        />
      </div>
    </div>
  );
};

export default LoadingScreen;
