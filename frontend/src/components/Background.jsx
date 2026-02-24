export default function Background() {
  return (
    <div className="absolute inset-0 z-0 bg-zinc-950 overflow-hidden">
      {/* Animated gradient blobs */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-pink-500/15 blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-500/15 blur-[120px] animate-pulse [animation-delay:1s]" />
      <div className="absolute top-[40%] left-[50%] -translate-x-1/2 w-[400px] h-[400px] rounded-full bg-orange-500/10 blur-[100px] animate-pulse [animation-delay:2s]" />

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
}
