import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function LoadingScreen() {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        setTimeout(() => setIsVisible(false), 500);
      },
    });
    gsap.set(textRef.current, { opacity: 0, y: 20 });

    tl.to(textRef.current, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power3.out",
      delay: 0.5,
    })
      .to(
        textRef.current,
        {
          letterSpacing: "0.2em",
          duration: 1.5,
          ease: "power2.inOut",
        },
        "-=0.5",
      )
      .to(textRef.current, {
        opacity: 0,
        y: -20,
        duration: 0.8,
        ease: "power3.in",
      })
      .to(containerRef.current, {
        yPercent: -100,
        duration: 1,
        ease: "expo.inOut",
      });

    return () => {
      tl.kill();
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] bg-zinc-900 flex items-center justify-center overflow-hidden"
    >
      <div
        ref={textRef}
        className="text-6xl md:text-8xl font-serif font-bold text-white tracking-tighter"
      >
        Flaire.
      </div>
    </div>
  );
}
