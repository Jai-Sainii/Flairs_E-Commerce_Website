import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";

function ShoppingBag({ position, color, speed }) {
  const meshRef = useRef(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01 * speed;
      meshRef.current.position.y +=
        Math.sin(state.clock.getElapsedTime() * speed) * 0.005;
    }
  });

  return (
    <Float speed={speed} rotationIntensity={1} floatIntensity={1}>
      <group ref={meshRef} position={position}>
        <mesh>
          <boxGeometry args={[1.5, 2, 0.6]} />
          <meshStandardMaterial color={color} roughness={0.3} metalness={0.2} />
        </mesh>
        <mesh position={[0, 1, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.4, 0.05, 16, 32, Math.PI]} />
          <meshStandardMaterial color="#333" />
        </mesh>
      </group>
    </Float>
  );
}

function Clothing({ position, color, speed }) {
  const meshRef = useRef(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.008 * speed;
      meshRef.current.position.y +=
        Math.cos(state.clock.getElapsedTime() * speed) * 0.005;
    }
  });

  return (
    <Float speed={speed} rotationIntensity={1.5} floatIntensity={1.5}>
      <group ref={meshRef} position={position}>
        <mesh>
          <boxGeometry args={[1.2, 1.4, 0.2]} />
          <meshStandardMaterial color={color} />
        </mesh>
        <mesh position={[0.8, 0.4, 0]} rotation={[0, 0, -Math.PI / 4]}>
          <boxGeometry args={[0.6, 0.3, 0.2]} />
          <meshStandardMaterial color={color} />
        </mesh>
        <mesh position={[-0.8, 0.4, 0]} rotation={[0, 0, Math.PI / 4]}>
          <boxGeometry args={[0.6, 0.3, 0.2]} />
          <meshStandardMaterial color={color} />
        </mesh>
      </group>
    </Float>
  );
}

function CreditCard({ position, speed }) {
  const meshRef = useRef(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.02 * speed;
      meshRef.current.rotation.x = Math.sin(state.clock.getElapsedTime()) * 0.2;
    }
  });

  return (
    <Float speed={speed} rotationIntensity={3} floatIntensity={1}>
      <mesh ref={meshRef} position={position}>
        <boxGeometry args={[2, 1.2, 0.05]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.2} />
        <mesh position={[-0.6, 0.2, 0.03]}>
          <planeGeometry args={[0.4, 0.3]} />
          <meshStandardMaterial color="#ffd700" metalness={1} />
        </mesh>
      </mesh>
    </Float>
  );
}

export default function Background() {
  return (
    <div className="absolute inset-0 z-0 bg-zinc-950">
      <Suspense fallback={null}>
        <Canvas
          camera={{ position: [0, 0, 10], fov: 50 }}
          dpr={[1, 1.5]}
          gl={{ antialias: false, powerPreference: "high-performance" }}
        >
          <ambientLight intensity={0.6} />
          <pointLight position={[10, 10, 10]} intensity={1.2} />
          <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} />

          <ShoppingBag position={[-4, 2, -2]} color="#ff4e91" speed={1} />
          <Clothing position={[5, -3, 0]} color="#ff8a5c" speed={1.2} />
          <CreditCard position={[0, 3, -5]} speed={0.8} />
          <ShoppingBag position={[-6, -4, -3]} color="#4f46e5" speed={1.5} />
          <Clothing position={[6, 3, -2]} color="#06b6d4" speed={1} />
          <CreditCard position={[-2, -3, -4]} speed={1.1} />

          <gridHelper
            args={[100, 100, 0x222222, 0x111111]}
            position={[0, -10, 0]}
          />
        </Canvas>
      </Suspense>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-950/20 to-zinc-950/40 pointer-events-none"></div>
    </div>
  );
}
