'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

// Procedural Amber Essential Oil Bottle
function BotanicalBottle() {
  const bottleRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (bottleRef.current) {
      // Phản hồi nhẹ theo vị trí chuột
      const targetX = (state.pointer.x * Math.PI) / 8;
      const targetY = (state.pointer.y * Math.PI) / 12;
      bottleRef.current.rotation.y = THREE.MathUtils.lerp(
        bottleRef.current.rotation.y,
        targetX + 0.3,
        0.05
      );
      bottleRef.current.rotation.x = THREE.MathUtils.lerp(
        bottleRef.current.rotation.x,
        -targetY + 0.1,
        0.05
      );
    }
  });

  return (
    <group ref={bottleRef} position={[0, -0.2, 0]}>
      {/* Bottle Body (Amber Glass) */}
      <mesh position={[0, 0, 0]} castShadow>
        <cylinderGeometry args={[0.85, 0.9, 2.2, 32]} />
        <meshPhysicalMaterial
          color="#9E5D2A" // Màu hổ phách ấm áp
          roughness={0.12}
          transmission={0.65}
          thickness={1.2}
          ior={1.52}
          reflectivity={0.7}
          clearcoat={0.9}
        />
      </mesh>

      {/* Essential Oil Liquid Inside */}
      <mesh position={[0, -0.15, 0]}>
        <cylinderGeometry args={[0.78, 0.82, 1.7, 32]} />
        <meshStandardMaterial
          color="#C6893F"
          roughness={0.2}
          metalness={0.1}
          opacity={0.85}
          transparent
        />
      </mesh>

      {/* Bottle Shoulder */}
      <mesh position={[0, 1.25, 0]}>
        <cylinderGeometry args={[0.45, 0.85, 0.35, 32]} />
        <meshPhysicalMaterial
          color="#9E5D2A"
          roughness={0.12}
          transmission={0.65}
          thickness={1.2}
        />
      </mesh>

      {/* Bottle Neck */}
      <mesh position={[0, 1.55, 0]}>
        <cylinderGeometry args={[0.42, 0.42, 0.35, 32]} />
        <meshPhysicalMaterial
          color="#9E5D2A"
          roughness={0.15}
          transmission={0.5}
        />
      </mesh>

      {/* Pipette / Dropper Cap (Matte Black / Deep Forest) */}
      <mesh position={[0, 1.85, 0]}>
        <cylinderGeometry args={[0.48, 0.48, 0.4, 32]} />
        <meshStandardMaterial color="#1E2D24" roughness={0.6} metalness={0.2} />
      </mesh>

      {/* Dropper Rubber Bulb */}
      <mesh position={[0, 2.2, 0]}>
        <sphereGeometry args={[0.36, 24, 24]} />
        <meshStandardMaterial color="#2C332D" roughness={0.8} />
      </mesh>

      {/* Label wrapped around bottle */}
      <mesh position={[0, 0, 0.86]}>
        <planeGeometry args={[1.1, 1.3]} />
        <meshStandardMaterial color="#F7F4EC" roughness={0.7} />
      </mesh>
    </group>
  );
}

// Botanical Floating Micro Dew Particles
function BotanicalDewParticles({ count = 28 }: { count?: number }) {
  const points = useMemo(() => {
    const coords = [];
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 6;
      const y = (Math.random() - 0.5) * 5;
      const z = (Math.random() - 0.5) * 4;
      coords.push({ pos: [x, y, z] as [number, number, number], scale: Math.random() * 0.08 + 0.04 });
    }
    return coords;
  }, [count]);

  return (
    <group>
      {points.map((p, idx) => (
        <Float key={idx} speed={1.5} rotationIntensity={1} floatIntensity={1.5}>
          <mesh position={p.pos}>
            <sphereGeometry args={[p.scale, 16, 16]} />
            <meshPhysicalMaterial
              color="#A4AD92"
              transmission={0.9}
              roughness={0.1}
              thickness={0.5}
              transparent
              opacity={0.6}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

export default function AmberBottleScene() {
  return (
    <div className="w-full h-full min-h-[420px] relative">
      <Canvas
        camera={{ position: [0, 0.3, 4.8], fov: 42 }}
        dpr={[1, 1.5]} // Giới hạn dpr để bảo vệ pin và hiệu năng
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <ambientLight intensity={1.2} />
        {/* Warm Sunlight & Botanical Highlights */}
        <directionalLight position={[4, 5, 3]} intensity={2.2} color="#FFF8E7" castShadow />
        <directionalLight position={[-4, 3, -2]} intensity={1.0} color="#8E9B82" />
        <pointLight position={[0, 2, 2]} intensity={0.8} color="#B7A078" />

        <Float speed={1.8} rotationIntensity={0.2} floatIntensity={0.4}>
          <BotanicalBottle />
        </Float>

        <BotanicalDewParticles count={24} />
      </Canvas>
    </div>
  );
}
