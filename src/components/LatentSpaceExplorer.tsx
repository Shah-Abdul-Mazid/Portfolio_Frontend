import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const LatentSpaceExplorer: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [reducedMotion, setReducedMotion] = useState(false);

    useEffect(() => {
        if (!containerRef.current) return;

        // --- SETUP ---
        const scene = new THREE.Scene();
        scene.fog = THREE.FogExp2 ? new THREE.FogExp2(0x020617, 0.001) : null;
        
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 3000);
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(window.innerWidth, window.innerHeight);
        containerRef.current.appendChild(renderer.domElement);

        camera.position.z = 1000;

        // --- LAYER 1: THE EMBEDDING NEBULA (POINT CLOUD) ---
        const pointCount = 4000;
        const positions = new Float32Array(pointCount * 3);
        const colors = new Float32Array(pointCount * 3);
        const colorPalette = [
            new THREE.Color(0x38bdf8), // Cyan
            new THREE.Color(0x818cf8), // Indigo
            new THREE.Color(0x22d3ee), // Bright Cyan
            new THREE.Color(0x1e293b)  // Deep Blue
        ];

        for (let i = 0; i < pointCount; i++) {
            // Clusters - Creating 8 distinct semantic clusters
            const clusterId = i % 8;
            const clusterX = (Math.sin(clusterId) * 600) + (Math.random() - 0.5) * 400;
            const clusterY = (Math.cos(clusterId) * 400) + (Math.random() - 0.5) * 400;
            const clusterZ = (Math.sin(clusterId * 1.5) * 400) + (Math.random() - 0.5) * 400;

            positions[i * 3] = clusterX;
            positions[i * 3 + 1] = clusterY;
            positions[i * 3 + 2] = clusterZ;

            const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;
        }

        const pointGeom = new THREE.BufferGeometry();
        pointGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        pointGeom.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const pointMat = new THREE.PointsMaterial({
            size: 1.5,
            vertexColors: true,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending
        });

        const pointCloud = new THREE.Points(pointGeom, pointMat);
        scene.add(pointCloud);

        // --- LAYER 2: INTERACTIVE SEARCH BEAM ---
        const beamMat = new THREE.MeshBasicMaterial({ 
            color: 0x38bdf8, 
            transparent: true, 
            opacity: 0.1,
            blending: THREE.AdditiveBlending 
        });
        const beamGeom = new THREE.CylinderGeometry(5, 400, 1500, 32);
        const searchBeam = new THREE.Mesh(beamGeom, beamMat);
        searchBeam.rotation.x = Math.PI / 2;
        searchBeam.position.z = 250;
        scene.add(searchBeam);

        // --- LAYER 3: COGNITIVE PATHWAYS (LINES) ---
        const lineMat = new THREE.LineBasicMaterial({ 
            color: 0x38bdf8, 
            transparent: true, 
            opacity: 0.05 
        });
        const lineCount = 500;
        const lineGeom = new THREE.BufferGeometry();
        const linePos = new Float32Array(lineCount * 6);
        for(let i=0; i<lineCount; i++) {
            const idx = Math.floor(Math.random() * pointCount);
            linePos[i*6] = positions[idx*3];
            linePos[i*6+1] = positions[idx*3+1];
            linePos[i*6+2] = positions[idx*3+2];
            
            // Connect within same cluster
            const nextIdx = (idx + 1) % pointCount;
            linePos[i*6+3] = positions[nextIdx*3];
            linePos[i*6+4] = positions[nextIdx*3+1];
            linePos[i*6+5] = positions[nextIdx*3+2];
        }
        lineGeom.setAttribute('position', new THREE.BufferAttribute(linePos, 3));
        const pathways = new THREE.LineSegments(lineGeom, lineMat);
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
                pointCloud.rotation.y = time * 0.05;
                pointCloud.rotation.z = time * 0.02;
                pathways.rotation.y = time * 0.05;
                pathways.rotation.z = time * 0.02;
            }

            // Mouse interaction
            mouse.lerp(targetMouse, 0.05);
            camera.position.x += (mouse.x * 300 - camera.position.x) * 0.05;
            camera.position.y += (-(mouse.y * 200) - camera.position.y) * 0.05;
            camera.lookAt(0, 0, 0);

            // Search Beam follows mouse
            searchBeam.position.x = mouse.x * 800;
            searchBeam.position.y = -mouse.y * 500;
            searchBeam.lookAt(0, 0, 0);
            searchBeam.material.opacity = (Math.sin(time * 2) + 1.2) * 0.05;

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
            id="latent-space-explorer"
            style={{ 
                position: 'fixed', 
                inset: 0, 
                zIndex: -1, 
                pointerEvents: 'none',
                background: '#020617'
            }} 
        >
            {/* HUD / SPECIALIST TOKEN OVERLAY */}
            <div style={{
                position: 'absolute',
                top: '50px',
                left: '50px',
                fontFamily: 'monospace',
                color: 'rgba(56, 189, 248, 0.3)',
                fontSize: '10px',
                letterSpacing: '5px',
                userSelect: 'none'
            }}>
                SIMULATING_LATENT_SPACE_DYNAMICS...<br/>
                COLLECTING_COGNITIVE_CLUSTERS... [OK]<br/>
                RETRIEVING_EMBEDDINGS... [OK]
            </div>

            <div style={{
                position: 'absolute',
                bottom: '100px',
                right: '50px',
                fontFamily: 'monospace',
                color: 'rgba(56, 189, 248, 0.1)',
                fontSize: '15vw',
                fontWeight: 900,
                pointerEvents: 'none',
                userSelect: 'none'
            }}>
                RAG
            </div>

            <button 
                onClick={() => setReducedMotion(!reducedMotion)}
                style={{
                    position: 'fixed',
                    bottom: '20px',
                    left: '20px',
                    background: 'rgba(15, 23, 42, 0.5)',
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
                {reducedMotion ? 'NEURAL_STATIC_ON' : 'NEURAL_FLUID_ON'}
            </button>
        </div>
    );
};

export default LatentSpaceExplorer;
