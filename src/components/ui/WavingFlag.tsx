"use client";

import * as THREE from "three";
import React, { useRef, useMemo } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { useScroll } from "@react-three/drei";

function FlagMesh() {
    const meshRef = useRef<THREE.Mesh>(null!);
    const scroll = useScroll();

    // Ładujemy teksturę flagi
    const texture = useLoader(THREE.TextureLoader, "https://upload.wikimedia.org/wikipedia/en/a/ae/Flag_of_the_United_Kingdom.svg");

    // Shader, który wygina geometrię
    const uniforms = useMemo(() => ({
        uTime: { value: 0 },
        uTexture: { value: texture },
        uScroll: { value: 0 }
    }), [texture]);

    useFrame((state) => {
        const { clock } = state;
        meshRef.current.material.uniforms.uTime.value = clock.getElapsedTime();
        // Reakcja na scroll - flaga wygina się mocniej przy przewijaniu
        meshRef.current.material.uniforms.uScroll.value = scroll?.offset || 0;
    });

    return (
        <mesh ref={meshRef} scale={[1.5, 1, 1]}>
            <planeGeometry args={[3, 2, 32, 32]} />
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
            // Fizyka falowania: kombinacja sinusów
            float wave = sin(pos.x * 2.0 + uTime * 2.0) * 0.1;
            wave += sin(pos.y * 2.0 + uTime * 1.5) * 0.05;
            pos.z += wave + (uScroll * 0.5); // Dodajemy wpływ scrolla
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