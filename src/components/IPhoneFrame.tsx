import { ReactNode } from "react";

interface IPhoneFrameProps {
  children: ReactNode;
  className?: string;
}

const IPhoneFrame = ({ children, className = "" }: IPhoneFrameProps) => {
  return (
    <div className={`relative ${className}`}>
      {/* iPhone Frame */}
      <div 
        className="relative rounded-[2.5rem] p-2 overflow-hidden"
        style={{
          background: 'linear-gradient(145deg, hsl(0 0% 15%) 0%, hsl(0 0% 8%) 100%)',
          boxShadow: '0 25px 50px -12px hsl(0 0% 0% / 0.5), inset 0 1px 0 hsl(0 0% 30% / 0.3)',
        }}
      >
        {/* Inner bezel */}
        <div 
          className="relative rounded-[2rem] overflow-hidden"
          style={{
            background: 'hsl(0 0% 5%)',
            boxShadow: 'inset 0 0 20px hsl(0 0% 0% / 0.5)',
          }}
        >
          {/* Dynamic Island */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
            <div 
              className="h-[28px] w-[100px] rounded-full flex items-center justify-center gap-3 px-4"
              style={{
                background: 'hsl(0 0% 0%)',
                boxShadow: '0 2px 10px hsl(0 0% 0% / 0.3)',
              }}
            >
              {/* Camera */}
              <div 
                className="w-3 h-3 rounded-full"
                style={{
                  background: 'radial-gradient(circle at 30% 30%, hsl(220 30% 25%), hsl(220 30% 10%))',
                  boxShadow: 'inset 0 1px 2px hsl(0 0% 0% / 0.5)',
                }}
              />
              {/* Sensor */}
              <div 
                className="w-2 h-2 rounded-full"
                style={{
                  background: 'hsl(0 0% 8%)',
                }}
              />
            </div>
          </div>

          {/* Screen content */}
          <div className="aspect-[9/19.5] w-full overflow-hidden rounded-[1.8rem]">
            {children}
          </div>
        </div>

        {/* Side buttons - left */}
        <div 
          className="absolute left-0 top-[100px] w-[3px] h-8 rounded-l-sm"
          style={{ background: 'hsl(0 0% 20%)' }}
        />
        <div 
          className="absolute left-0 top-[150px] w-[3px] h-14 rounded-l-sm"
          style={{ background: 'hsl(0 0% 20%)' }}
        />
        <div 
          className="absolute left-0 top-[210px] w-[3px] h-14 rounded-l-sm"
          style={{ background: 'hsl(0 0% 20%)' }}
        />

        {/* Side button - right */}
        <div 
          className="absolute right-0 top-[140px] w-[3px] h-16 rounded-r-sm"
          style={{ background: 'hsl(0 0% 20%)' }}
        />
      </div>
    </div>
  );
};

export default IPhoneFrame;