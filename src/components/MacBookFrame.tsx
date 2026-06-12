import { ReactNode } from "react";

interface MacBookFrameProps {
  children: ReactNode;
  className?: string;
}

const MacBookFrame = ({ children, className = "" }: MacBookFrameProps) => {
  return (
    <div className={`relative w-full ${className}`}>
      {/* Lid / Screen */}
      <div
        className="relative rounded-[1.2rem] p-[10px] mx-auto"
        style={{
          background: "linear-gradient(145deg, hsl(0 0% 18%) 0%, hsl(0 0% 8%) 100%)",
          boxShadow:
            "0 25px 50px -12px hsl(0 0% 0% / 0.5), inset 0 1px 0 hsl(0 0% 35% / 0.3)",
        }}
      >
        {/* Camera notch */}
        <div className="absolute top-[10px] left-1/2 -translate-x-1/2 z-20 w-16 h-3 rounded-b-md flex items-center justify-center"
          style={{ background: "hsl(0 0% 0%)" }}
        >
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: "hsl(220 30% 15%)" }} />
        </div>
        {/* Screen */}
        <div
          className="relative rounded-[0.85rem] overflow-hidden bg-black aspect-[16/10]"
          style={{ boxShadow: "inset 0 0 20px hsl(0 0% 0% / 0.5)" }}
        >
          {children}
        </div>
      </div>
      {/* Base */}
      <div
        className="relative mx-auto h-[14px] rounded-b-2xl"
        style={{
          width: "108%",
          marginLeft: "-4%",
          background:
            "linear-gradient(180deg, hsl(0 0% 22%) 0%, hsl(0 0% 12%) 50%, hsl(0 0% 6%) 100%)",
          boxShadow:
            "0 12px 24px -8px hsl(0 0% 0% / 0.5), inset 0 1px 0 hsl(0 0% 35% / 0.25)",
        }}
      >
        {/* Notch / trackpad slot */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 h-[5px] w-[18%] rounded-b-md"
          style={{ background: "hsl(0 0% 4%)" }}
        />
      </div>
    </div>
  );
};

export default MacBookFrame;
