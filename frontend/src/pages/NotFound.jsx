import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router";

function NotFound() {
  const navigate = useNavigate();
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let animationId;
    const particles = [];
    const PARTICLE_COUNT = 60;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 2.5 + 1,
        dx: (Math.random() - 0.5) * 0.6,
        dy: (Math.random() - 0.5) * 0.6,
        opacity: Math.random() * 0.5 + 0.2,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(240, 57, 176, ${p.opacity})`;
        ctx.fill();
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
      });

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dist = Math.hypot(
            particles[i].x - particles[j].x,
            particles[i].y - particles[j].y,
          );
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(125, 42, 232, ${0.15 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      animationId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div style={styles.wrapper}>
     
      <canvas ref={canvasRef} style={styles.canvas} />

   
      <div style={styles.content}>
  
        <h1 style={styles.glitch} data-text="404">
          404
        </h1>

        <p style={styles.subtitle}>
          Oops! The page you're looking for doesn't exist.
        </p>
        <p style={styles.description}>
          It might have been moved, deleted, or perhaps the URL was mistyped.
        </p>

        <button style={styles.button} onClick={() => navigate("/")}>
          <span style={styles.btnIcon}>←</span> Back to Home
        </button>
      </div>


      <style>{`
        @keyframes glitch {
          0%   { text-shadow: 2px 0 #f039b0, -2px 0 #7d2ae8; }
          20%  { text-shadow: -3px 0 #f039b0, 3px 0 #7d2ae8; }
          40%  { text-shadow: 3px 0 #f039b0, -3px 0 #7d2ae8; }
          60%  { text-shadow: -2px 0 #f039b0, 2px 0 #7d2ae8; }
          80%  { text-shadow: 4px 0 #f039b0, -4px 0 #7d2ae8; }
          100% { text-shadow: 2px 0 #f039b0, -2px 0 #7d2ae8; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(240,57,176,0.5); }
          50%      { box-shadow: 0 0 20px 6px rgba(240,57,176,0.25); }
        }
      `}</style>
    </div>
  );
}


const styles = {
  wrapper: {
    position: "relative",
    minHeight: "80vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    background:
      "linear-gradient(135deg, #0a0a0a 0%, #1a0a1a 50%, #0a0a14 100%)",
  },

  canvas: {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    zIndex: 0,
  },

  content: {
    position: "relative",
    zIndex: 1,
    textAlign: "center",
    padding: "2rem",
    animation: "fadeUp 0.8s ease-out both",
  },

  glitch: {
    fontSize: "clamp(7rem, 20vw, 14rem)",
    fontWeight: 900,
    color: "#fff",
    letterSpacing: "0.05em",
    lineHeight: 1,
    margin: 0,
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
    animation: "glitch 2.5s infinite",
    userSelect: "none",
  },

  subtitle: {
    fontSize: "clamp(1.1rem, 2.5vw, 1.5rem)",
    color: "#e0e0e0",
    marginTop: "1rem",
    fontWeight: 500,
    letterSpacing: "0.02em",
  },

  description: {
    fontSize: "clamp(0.85rem, 1.5vw, 1rem)",
    color: "#888",
    marginTop: "0.5rem",
    maxWidth: "440px",
    marginLeft: "auto",
    marginRight: "auto",
    lineHeight: 1.6,
  },

  button: {
    marginTop: "2.5rem",
    padding: "14px 36px",
    fontSize: "1rem",
    fontWeight: 600,
    color: "#fff",
    background: "linear-gradient(135deg, #f039b0 0%, #7d2ae8 100%)",
    border: "none",
    borderRadius: "50px",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    transition: "transform 0.25s ease, box-shadow 0.25s ease",
    animation: "pulse 2.5s infinite",
    letterSpacing: "0.03em",
  },

  btnIcon: {
    fontSize: "1.2rem",
    transition: "transform 0.25s ease",
  },
};

export default NotFound;
