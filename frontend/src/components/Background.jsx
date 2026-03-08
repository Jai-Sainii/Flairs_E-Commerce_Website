import React from "react";

const Background = React.memo(function Background() {
  return (
    <div className="absolute inset-0 z-0 bg-zinc-950 overflow-hidden">
      {/* Animated gradient blobs — reduced blur for GPU performance */}
      <div
        className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-pink-500/15 blur-[80px] animate-pulse"
        style={{ willChange: "transform, opacity" }}
      />
      <div
        className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-500/15 blur-[80px] animate-pulse [animation-delay:1s]"
        style={{ willChange: "transform, opacity" }}
      />
      <div
        className="absolute top-[40%] left-[50%] -translate-x-1/2 w-[400px] h-[400px] rounded-full bg-orange-500/10 blur-[60px] animate-pulse [animation-delay:2s]"
        style={{ willChange: "transform, opacity" }}
      />

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
    </div>
  );
});

export default Background;
