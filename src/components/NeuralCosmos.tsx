import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const NeuralCosmos: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [reducedMotion, setReducedMotion] = useState(false);

    useEffect(() => {
        if (!containerRef.current) return;

        // --- SETUP ---
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 5000);
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(window.innerWidth, window.innerHeight);
        containerRef.current.appendChild(renderer.domElement);

        camera.position.z = 1200;

        // --- LAYER 1: DATA STARFIELD (10,000+ POINTS) ---
        const starCount = 12000;
        const starPositions = new Float32Array(starCount * 3);
        const starSizes = new Float32Array(starCount);

        for (let i = 0; i < starCount; i++) {
            const r = Math.pow(Math.random(), 3) * 3000; // Power distribution for depth
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);

            starPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            starPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            starPositions[i * 3 + 2] = r * Math.cos(phi);
            starSizes[i] = Math.random() * 2 + 0.5;
        }

        const starGeom = new THREE.BufferGeometry();
        starGeom.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
        starGeom.setAttribute('size', new THREE.BufferAttribute(starSizes, 1));

        const starMat = new THREE.PointsMaterial({
            size: 1.5,
            color: 0x38bdf8,
            transparent: true,
            opacity: 0.4,
            blending: THREE.AdditiveBlending,
            sizeAttenuation: true
        });

        const starField = new THREE.Points(starGeom, starMat);
        scene.add(starField);

        // --- LAYER 2: SEMANTIC NEBULAE (SOFT CLOUDS) ---
        const nebulaCount = 6;
        const nebulae: THREE.Mesh[] = [];
        const nebulaColors = [0x0ea5e9, 0x6366f1, 0x8b5cf6, 0x06b6d4];

        for (let i = 0; i < nebulaCount; i++) {
            const geom = new THREE.SphereGeometry(Math.random() * 400 + 200, 32, 32);
            const mat = new THREE.MeshBasicMaterial({
                color: nebulaColors[i % nebulaColors.length],
                transparent: true,
                opacity: 0.03,
                blending: THREE.AdditiveBlending,
                side: THREE.BackSide
            });
            const nebula = new THREE.Mesh(geom, mat);
            nebula.position.set((Math.random() - 0.5) * 2000, (Math.random() - 0.5) * 1500, (Math.random() - 0.5) * 1000);
            scene.add(nebula);
            nebulae.push(nebula);
        }

        // --- LAYER 3: AUTOMATION COMETS (DATA STREAKS) ---
        const cometCount = 8;
        const comets: { mesh: THREE.Mesh, speed: number, direction: THREE.Vector3 }[] = [];
        const cometMat = new THREE.MeshBasicMaterial({ 
            color: 0x22d3ee, 
            transparent: true, 
            opacity: 0.4, 
            blending: THREE.AdditiveBlending 
        });

        for (let i = 0; i < cometCount; i++) {
            const geom = new THREE.CylinderGeometry(0.1, 1, Math.random() * 200 + 100, 8);
            const comet = new THREE.Mesh(geom, cometMat);
            comet.position.set((Math.random() - 0.5) * 3000, (Math.random() - 0.5) * 2000, (Math.random() - 0.5) * 1000);
            
            const direction = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();
            comet.lookAt(comet.position.clone().add(direction));
            comet.rotateX(Math.PI / 2); // Cylinder orientation fix
            
            scene.add(comet);
            comets.push({ mesh: comet, speed: Math.random() * 5 + 2, direction });
        }

        // --- NERUAL PATHWAYS (FAINT) ---
        const pathwayCount = 400;
        const pathGeom = new THREE.BufferGeometry();
        const pathPos = new Float32Array(pathwayCount * 6);
        for(let i=0; i<pathwayCount; i++) {
            const idx = Math.floor(Math.random() * starCount);
            pathPos[i*6] = starPositions[idx*3];
            pathPos[i*6+1] = starPositions[idx*3+1];
            pathPos[i*6+2] = starPositions[idx*3+2];
            
            const nextIdx = (idx + 1) % starCount;
            pathPos[i*6+3] = starPositions[nextIdx*3];
            pathPos[i*6+4] = starPositions[nextIdx*3+1];
            pathPos[i*6+5] = starPositions[nextIdx*3+2];
        }
        pathGeom.setAttribute('position', new THREE.BufferAttribute(pathPos, 3));
        const pathways = new THREE.LineSegments(pathGeom, new THREE.LineBasicMaterial({ 
            color: 0x38bdf8, 
            transparent: true, 
            opacity: 0.05 
        }));
        scene.add(pathways);

        // --- INTERACTIVITY ---
        const mouse = new THREE.Vector2();
        let targetMouse = new THREE.Vector2();
        const onMouseMove = (e: MouseEvent) => {
            targetMouse.x = (e.clientX / window.innerWidth) * 2 - 1;
            targetMouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
        };
        window.addEventListener('mousemove', onMouseMove);

        // --- ANIMATION LOOP ---
        const clock = new THREE.Clock();
        const animate = () => {
            const time = clock.getElapsedTime();

            if (!reducedMotion) {
                // Orbital Motion
                starField.rotation.y = time * 0.01;
                starField.rotation.x = time * 0.005;
                pathways.rotation.y = time * 0.01;
                pathways.rotation.x = time * 0.005;

                // Comets Movement
                comets.forEach(c => {
                    c.mesh.position.addScaledVector(c.direction, c.speed);
                    if (c.mesh.position.length() > 3000) {
                        c.mesh.position.set((Math.random() - 0.5) * 3000, (Math.random() - 0.5) * 2000, (Math.random() - 0.5) * 1000);
                        c.speed = Math.random() * 5 + 2;
                    }
                });

                // Nebulae Drift
                nebulae.forEach((n, i) => {
                    n.position.y += Math.sin(time * 0.2 + i) * 0.2;
                    n.rotation.y = time * 0.02 + i;
                    const mat = n.material as THREE.MeshBasicMaterial;
                    mat.opacity = (Math.sin(time * 0.5 + i) + 1.2) * 0.02;
                });
            }

            // Mouse Interaction (Parallax)
            mouse.lerp(targetMouse, 0.03);
            camera.position.x += (mouse.x * 400 - camera.position.x) * 0.03;
            camera.position.y += (-(mouse.y * 200) - camera.position.y) * 0.03;
            camera.lookAt(0, 0, 0);

            renderer.render(scene, camera);
            animationFrameId = requestAnimationFrame(animate);
        };
        let animationFrameId = requestAnimationFrame(animate);

        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
            containerRef.current?.removeChild(renderer.domElement);
            scene.clear();
        };
    }, [reducedMotion]);

    return (
        <div 
            ref={containerRef} 
            id="neural-cosmos"
            style={{ 
                position: 'fixed', 
                inset: 0, 
                zIndex: -1, 
                pointerEvents: 'none',
                background: 'radial-gradient(circle at center, #0a0a1a 0%, #020617 100%)'
            }} 
        >
            {/* SPECIALIST STATUS OVERLAY */}
            <div style={{
                position: 'absolute',
                top: '40px',
                right: '40px',
                fontFamily: 'monospace',
                color: 'rgba(56, 189, 248, 0.2)',
                fontSize: '10px',
                letterSpacing: '8px',
                userSelect: 'none',
                pointerEvents: 'none'
            }}>
                AI_ML_RAG_LLM_AUTOMATION_FASTAPI_INFRASTRUCTURE_ACTIVE
            </div>

            <button 
                onClick={() => setReducedMotion(!reducedMotion)}
                style={{
                    position: 'fixed',
                    bottom: '20px',
                    left: '20px',
                    background: 'rgba(15, 23, 42, 0.4)',
                    border: '1px solid rgba(56, 189, 248, 0.2)',
                    color: 'rgba(56, 189, 248, 0.4)',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    fontSize: '9px',
                    cursor: 'pointer',
                    zIndex: 100,
                    backdropFilter: 'blur(10px)',
                    pointerEvents: 'auto',
                    fontFamily: 'monospace'
                }}
            >
                {reducedMotion ? 'NEURAL_STABILIZED' : 'NEURAL_FLOWING'}
            </button>
        </div>
    );
};

export default NeuralCosmos;
