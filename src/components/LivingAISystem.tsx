import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const LivingAISystem: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [reducedMotion, setReducedMotion] = useState(false);

    useEffect(() => {
        if (!containerRef.current) return;

        // --- SETUP ---
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(window.innerWidth, window.innerHeight);
        containerRef.current.appendChild(renderer.domElement);

        camera.position.z = 400;
        camera.position.y = 100;

        // --- LAYER 1: DIGITAL LANDSCAPE (3D GRID) ---
        const gridGeometry = new THREE.PlaneGeometry(1200, 1200, 40, 40);
        const gridMaterial = new THREE.MeshBasicMaterial({
            color: 0x38bdf8,
            wireframe: true,
            transparent: true,
            opacity: 0.15
        });
        const grid = new THREE.Mesh(gridGeometry, gridMaterial);
        grid.rotation.x = -Math.PI / 2;
        grid.position.y = -150;
        scene.add(grid);

        // --- LAYER 2: NEURAL CORE (PARTICLES) ---
        const particleCount = 200;
        const positions = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);
        
        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 1000;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 600;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 400;
            sizes[i] = Math.random() * 2 + 1;
        }

        const particleGeometry = new THREE.BufferGeometry();
        particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        const particleMaterial = new THREE.PointsMaterial({
            size: 2,
            color: 0x38bdf8,
            transparent: true,
            opacity: 0.5,
            blending: THREE.AdditiveBlending
        });

        const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
        scene.add(particleSystem);

        // --- CONNECTIONS (LINES) ---
        const lineMaterial = new THREE.LineBasicMaterial({
            color: 0x818cf8,
            transparent: true,
            opacity: 0.1,
            blending: THREE.AdditiveBlending
        });

        const linesGroup = new THREE.Group();
        scene.add(linesGroup);

        const updateConnections = () => {
            linesGroup.clear();
            const posAttr = particleGeometry.attributes.position.array as Float32Array;
            const maxConnections = 3;
            const linePositions: number[] = [];

            for (let i = 0; i < particleCount; i++) {
                let connections = 0;
                for (let j = i + 1; j < particleCount && connections < maxConnections; j++) {
                    const dx = posAttr[i * 3] - posAttr[j * 3];
                    const dy = posAttr[i * 3 + 1] - posAttr[j * 3 + 1];
                    const dz = posAttr[i * 3 + 2] - posAttr[j * 3 + 2];
                    const distSq = dx * dx + dy * dy + dz * dz;

                    if (distSq < 15000) {
                        linePositions.push(posAttr[i * 3], posAttr[i * 3 + 1], posAttr[i * 3 + 2]);
                        linePositions.push(posAttr[j * 3], posAttr[j * 3 + 1], posAttr[j * 3 + 2]);
                        connections++;
                    }
                }
            }

            const geometry = new THREE.BufferGeometry();
            geometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
            const lines = new THREE.LineSegments(geometry, lineMaterial);
            linesGroup.add(lines);
        };

        // --- LAYER 3: DATA STREAM (CANVAS 2D TEXTURE) ---
        const dataStreamCanvas = document.createElement('canvas');
        dataStreamCanvas.width = 512;
        dataStreamCanvas.height = 512;
        const dataCtx = dataStreamCanvas.getContext('2d');
        if (dataCtx) {
            dataCtx.fillStyle = '#020617';
            dataCtx.fillRect(0, 0, 512, 512);
            dataCtx.font = 'bold 30px Courier';
            dataCtx.fillStyle = '#38bdf8';
            for (let i = 0; i < 20; i++) {
                dataCtx.fillText(Math.random().toString(36).substring(7), Math.random() * 512, Math.random() * 512);
            }
        }
        const dataTexture = new THREE.CanvasTexture(dataStreamCanvas);
        dataTexture.wrapS = THREE.RepeatWrapping;
        dataTexture.wrapT = THREE.RepeatWrapping;

        const dataGrid = new THREE.Mesh(
            new THREE.PlaneGeometry(2000, 2000),
            new THREE.MeshBasicMaterial({ map: dataTexture, transparent: true, opacity: 0.03 })
        );
        dataGrid.position.z = -500;
        scene.add(dataGrid);

        // --- LAYER 4: SIGNAL PULSES ---
        const signalCount = 5;
        const signals: { mesh: THREE.Mesh, start: number, end: number, progress: number }[] = [];
        const signalMaterial = new THREE.MeshBasicMaterial({ color: 0x38bdf8, blending: THREE.AdditiveBlending });
        const signalSphere = new THREE.SphereGeometry(2, 8, 8);

        for (let i = 0; i < signalCount; i++) {
            const mesh = new THREE.Mesh(signalSphere, signalMaterial);
            scene.add(mesh);
            signals.push({ mesh, start: 0, end: 0, progress: 1 }); // Start in inactive state
        }

        const updateSignals = () => {
            const posAttr = particleGeometry.attributes.position.array as Float32Array;
            signals.forEach(s => {
                if (s.progress >= 1) {
                    s.start = Math.floor(Math.random() * particleCount);
                    s.end = Math.floor(Math.random() * particleCount);
                    s.progress = 0;
                }
                
                s.progress += 0.005;
                const sx = posAttr[s.start * 3];
                const sy = posAttr[s.start * 3 + 1];
                const sz = posAttr[s.start * 3 + 2];
                const ex = posAttr[s.end * 3];
                const ey = posAttr[s.end * 3 + 1];
                const ez = posAttr[s.end * 3 + 2];

                s.mesh.position.set(
                    sx + (ex - sx) * s.progress,
                    sy + (ey - sy) * s.progress,
                    sz + (ez - sz) * s.progress
                );
                s.mesh.scale.setScalar(Math.sin(s.progress * Math.PI) * 1.5);
            });
        };

        // --- LAYER 5: HOLOGRAPHIC WAVES ---
        const waveGeometry = new THREE.BufferGeometry();
        const wavePoints = 100;
        const wavePos = new Float32Array(wavePoints * 3);
        waveGeometry.setAttribute('position', new THREE.BufferAttribute(wavePos, 3));
        const waveMaterial = new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.2 });
        const waveLine = new THREE.Line(waveGeometry, waveMaterial);
        waveLine.position.z = 100;
        scene.add(waveLine);

        // --- INTERACTIVITY ---
        const mouse = new THREE.Vector2();
        let targetMouse = new THREE.Vector2();
        
        const onMouseMove = (event: MouseEvent) => {
            targetMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            targetMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        };
        window.addEventListener('mousemove', onMouseMove);

        // --- ANIMATION LOOP ---
        const clock = new THREE.Clock();
        
        const animate = () => {
            const time = clock.getElapsedTime();
            
            // Grid Animation
            const vertices = gridGeometry.attributes.position.array as Float32Array;
            for (let i = 0; i < vertices.length; i += 3) {
                const x = vertices[i];
                const y = vertices[i + 1];
                vertices[i + 2] = Math.sin(x / 120 + time) * 30 + Math.cos(y / 120 + time) * 30;
            }
            gridGeometry.attributes.position.needsUpdate = true;

            // Particle Movement
            const posAttr = particleGeometry.attributes.position.array as Float32Array;
            for (let i = 0; i < particleCount; i++) {
                posAttr[i * 3 + 1] += Math.sin(time + posAttr[i * 3]) * 0.15;
                posAttr[i * 3] += Math.cos(time + posAttr[i * 3 + 1]) * 0.15;
            }
            particleGeometry.attributes.position.needsUpdate = true;
            
            // Update Wave
            const waveAttr = waveGeometry.attributes.position.array as Float32Array;
            for (let i = 0; i < wavePoints; i++) {
                waveAttr[i * 3] = i * 10 - 500;
                waveAttr[i * 3 + 1] = Math.sin(i * 0.1 + time * 2) * 50;
                waveAttr[i * 3 + 2] = 0;
            }
            waveGeometry.attributes.position.needsUpdate = true;
            waveLine.material.opacity = (Math.sin(time) + 1) * 0.1;

            // Data Stream Scroll
            dataTexture.offset.y -= 0.001;
            dataTexture.offset.x += 0.0005;

            // Mouse Interaction (Parallax)
            mouse.lerp(targetMouse, 0.05);
            camera.position.x += (mouse.x * 250 - camera.position.x) * 0.05;
            camera.position.y += (-(mouse.y * 150) + 100 - camera.position.y) * 0.05;
            camera.lookAt(0, 0, 0);

            // Throttle line updates
            if (Math.floor(time * 5) % 2 === 0) {
                updateConnections();
                updateSignals();
            }

            renderer.render(scene, camera);
            animationFrameId = requestAnimationFrame(animate);
        };

        let animationFrameId = requestAnimationFrame(animate);

        // --- CLEANUP ---
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
            className="living-ai-system"
            style={{ 
                position: 'fixed', 
                inset: 0, 
                zIndex: -1, 
                pointerEvents: 'none',
                background: 'linear-gradient(to bottom, #020617, #0a0a0a)'
            }} 
        >
            {!reducedMotion && (
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    pointerEvents: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    color: 'rgba(56, 189, 248, 0.05)',
                    fontSize: '12vw',
                    fontWeight: 900,
                    userSelect: 'none',
                    fontFamily: 'monospace',
                    overflow: 'hidden'
                }}>
                    <div style={{ alignSelf: 'flex-start', marginLeft: '5%' }}>LLM</div>
                    <div style={{ alignSelf: 'flex-end', marginRight: '5%' }}>RAG</div>
                    <div style={{ alignSelf: 'flex-start', marginLeft: '15%' }}>FastAPI</div>
                    <div style={{ alignSelf: 'flex-end', marginRight: '10%' }}>PYTHON</div>
                </div>
            )}
            
            <button 
                onClick={() => setReducedMotion(!reducedMotion)}
                style={{
                    position: 'fixed',
                    bottom: '20px',
                    left: '20px',
                    background: 'rgba(15, 23, 42, 0.5)',
                    border: '1px solid rgba(56, 189, 248, 0.2)',
                    color: 'rgba(56, 189, 248, 0.5)',
                    padding: '8px 12px',
                    borderRadius: '20px',
                    fontSize: '10px',
                    cursor: 'pointer',
                    zIndex: 100,
                    backdropFilter: 'blur(10px)',
                    pointerEvents: 'auto'
                }}
            >
                {reducedMotion ? 'Enable Motion' : 'Reduce Motion'}
            </button>
        </div>
    );
};

export default LivingAISystem;
