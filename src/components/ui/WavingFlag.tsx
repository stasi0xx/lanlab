"use client";

import * as THREE from "three";
import React, { useRef, useMemo } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { useScroll } from "@react-three/drei";

// 1. Definiujemy typ dla uniformów, żeby TS nie płakał o "Index signature"
interface FlagUniforms {
    uTime: { value: number };
    uTexture: { value: THREE.Texture };
    uScroll: { value: number };
    [key: string]: any; // To jest kluczowe dla kompatybilności z Three.js
}

function FlagMesh() {
    // 2. Precyzyjne typowanie referencji
    const meshRef = useRef<THREE.Mesh>(null!);

    // Uwaga: useScroll zadziała tylko jeśli Canvas jest wewnątrz <ScrollControls>.
    // Jeśli nie używasz ScrollControls, scroll.offset będzie undefined.
    // Zabezpieczymy to w kodzie poniżej.
    const scroll = useScroll();

    const texture = useLoader(THREE.TextureLoader, "https://upload.wikimedia.org/wikipedia/en/a/ae/Flag_of_the_United_Kingdom.svg");

    const uniforms = useMemo<FlagUniforms>(() => ({
        uTime: { value: 0 },
        uTexture: { value: texture },
        uScroll: { value: 0 }
    }), [texture]);

    useFrame((state) => {
        const { clock } = state;

        // 3. NAPRAWA BŁĘDU: Rzutujemy materiał na ShaderMaterial
        // Dzięki temu TS wie, że pole .uniforms istnieje.
        const material = meshRef.current.material as THREE.ShaderMaterial;

        // Dodatkowe sprawdzenie dla bezpieczeństwa (w produkcji must-have)
        if (material && material.uniforms) {
            material.uniforms.uTime.value = clock.getElapsedTime();
            // Bezpieczny dostęp do scrolla (jeśli scroll hook nie działa, dajemy 0)
            material.uniforms.uScroll.value = scroll?.offset || 0;
        }
    });

    return (
        <mesh ref={meshRef} scale={[1.5, 1, 1]}>
            {/* Zwiększyłem segmenty z 32 na 64 dla gładszej fali */}
            <planeGeometry args={[3, 2, 64, 64]} />
            <shaderMaterial
                transparent
                uniforms={uniforms}
                vertexShader={`
          varying vec2 vUv;
          uniform float uTime;
          uniform float uScroll;
          void main() {
            vUv = uv;
            vec3 pos = position;
            // Fizyka falowania
            float wave = sin(pos.x * 2.0 + uTime * 2.0) * 0.1;
            wave += sin(pos.y * 2.0 + uTime * 1.5) * 0.05;
            pos.z += wave + (uScroll * 0.5); 
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          }
        `}
                fragmentShader={`
          varying vec2 vUv;
          uniform sampler2D uTexture;
          void main() {
            vec4 color = texture2D(uTexture, vUv);
            gl_FragColor = color;
          }
        `}
            />
        </mesh>
    );
}

export function HeroFlag3D() {
    return (
        <div className="w-full h-[500px] cursor-grab active:cursor-grabbing">
            <Canvas camera={{ position: [0, 0, 3], fov: 50 }}>
                <ambientLight intensity={0.5} />
                <FlagMesh />
            </Canvas>
        </div>
    );
}