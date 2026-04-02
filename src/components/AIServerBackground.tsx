import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const AIServerBackground: React.FC = () => {
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

        camera.position.z = 500;
        camera.position.y = 50;

        // --- LAYER 1: 3D CYBER GRID ---
        const gridGeom = new THREE.PlaneGeometry(2000, 2000, 50, 50);
        const gridMat = new THREE.MeshBasicMaterial({ 
            color: 0x22d3ee, 
            wireframe: true, 
            transparent: true, 
            opacity: 0.1 
        });
        const grid = new THREE.Mesh(gridGeom, gridMat);
        grid.rotation.x = -Math.PI / 2.2;
        grid.position.y = -200;
        scene.add(grid);

        // --- LAYER 2: VERTICAL DATA BEAMS ---
        const beamCount = 40;
        const beams: THREE.Mesh[] = [];
        const beamGeom = new THREE.BoxGeometry(1, 400, 1);
        const beamMat = new THREE.MeshBasicMaterial({ 
            color: 0x38bdf8, 
            transparent: true, 
            opacity: 0.2,
            blending: THREE.AdditiveBlending 
        });

        for (let i = 0; i < beamCount; i++) {
            const beam = new THREE.Mesh(beamGeom, beamMat);
            beam.position.set((Math.random() - 0.5) * 1500, (Math.random() - 0.5) * 500, (Math.random() - 0.5) * 800);
            scene.add(beam);
            beams.push(beam);
        }

        // --- LAYER 3: CODE MATRIX (CANVAS PLANES) ---
        const codeSnippets = [
            '@app.post("/v1/rag/query")',
            'def get_embeddings(text: str):',
            'vector_db.similarity_search(query)',
            'llm.generate_response(context)',
            'fastapi_job.automation_worker()',
            'import torch; model.eval()',
            'from langchain.chains import RAG',
            'retrieval_service.retrieve(top_k=5)',
            'STATUS: COLLECTING_CONCEXT...',
            'TOKEN_USAGE: 4096 (Active)',
            'SYSTEM: OPTIMIZING_RETRIEVAL...'
        ];

        const createCodeTexture = (text: string) => {
            const canvas = document.createElement('canvas');
            canvas.width = 1024;
            canvas.height = 128;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.fillStyle = 'rgba(0,0,0,0)';
                ctx.fillRect(0, 0, 1024, 128);
                ctx.font = 'bold 60px monospace';
                ctx.fillStyle = '#38bdf8';
                ctx.shadowBlur = 15;
                ctx.shadowColor = '#22d3ee';
                ctx.fillText(text, 50, 80);
            }
            return new THREE.CanvasTexture(canvas);
        };

        const codePlanes: THREE.Mesh[] = [];
        for (let i = 0; i < 15; i++) {
            const tex = createCodeTexture(codeSnippets[i % codeSnippets.length]);
            const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, opacity: 0.3 });
            const plane = new THREE.Mesh(new THREE.PlaneGeometry(600, 75), mat);
            plane.position.set((Math.random() - 0.5) * 1200, (Math.random() - 0.5) * 800, (Math.random() - 0.5) * 1000);
            scene.add(plane);
            codePlanes.push(plane);
        }

        // --- INTERACTIVITY ---
        const mouse = new THREE.Vector2();
        let targetMouse = new THREE.Vector2();
        const onMouseMove = (e: MouseEvent) => {
            targetMouse.x = (e.clientX / window.innerWidth) * 2 - 1;
            targetMouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
        };
        window.addEventListener('mousemove', onMouseMove);

        // --- ANIMATION ---
        const clock = new THREE.Clock();
        const animate = () => {
            const time = clock.getElapsedTime();
            
            if (!reducedMotion) {
                // Grid Wave
                const gridPos = gridGeom.attributes.position.array as Float32Array;
                for (let i = 0; i < gridPos.length; i += 3) {
                    gridPos[i + 2] = Math.sin(gridPos[i]/100 + time) * 30 + Math.cos(gridPos[i+1]/100 + time) * 30;
                }
                gridGeom.attributes.position.needsUpdate = true;

                // Beams Floating
                beams.forEach((b, i) => {
                    const mat = b.material as THREE.MeshBasicMaterial;
                    b.position.y += Math.sin(time + i) * 0.5;
                    mat.opacity = (Math.sin(time * 2 + i) + 1) * 0.15;
                });

                // Code Planes Drift
                codePlanes.forEach((cp, i) => {
                    const mat = cp.material as THREE.MeshBasicMaterial;
                    cp.position.z += 0.5;
                    if (cp.position.z > 500) cp.position.z = -1000;
                    cp.position.x += Math.cos(time + i) * 0.2;
                    mat.opacity = (Math.sin(time + i) + 1) * 0.2;
                });
            }

            // Mouse interaction
            mouse.lerp(targetMouse, 0.05);
            camera.position.x += (mouse.x * 150 - camera.position.x) * 0.05;
            camera.position.y += (-(mouse.y * 100) + 50 - camera.position.y) * 0.05;
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
            className="ai-server-bg"
            style={{ 
                position: 'fixed', 
                inset: 0, 
                zIndex: -1, 
                pointerEvents: 'none',
                background: '#020617'
            }} 
        >
            {/* Intensity Scanline Overlay */}
            <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.05) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.01), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.01))',
                backgroundSize: '100% 4px, 3px 100%',
                pointerEvents: 'none',
                opacity: 0.6
            }} />

            {/* AI HUD OVERLAY */}
            <div style={{
                position: 'absolute',
                top: '50px',
                right: '50px',
                fontFamily: 'monospace',
                color: 'rgba(56, 189, 248, 0.6)',
                textAlign: 'right',
                fontSize: '12px',
                letterSpacing: '2px',
                pointerEvents: 'none'
            }}>
                <div>[SERVER_NODE_B47]</div>
                <div>STATE: AI_RETRIEVAL_ACTIVE</div>
                <div>BANDWIDTH: 4.8 GB/s</div>
                <div style={{ color: '#22d3ee' }}>LATENCY: 12ms</div>
                <div style={{ marginTop: '20px', borderTop: '1px solid rgba(56, 189, 248, 0.2)', paddingTop: '10px' }}>
                    PROCESS_ID: 19842<br/>
                    CORE_TEMP: 42°C
                </div>
            </div>

            <button 
                onClick={() => setReducedMotion(!reducedMotion)}
                style={{
                    position: 'fixed',
                    bottom: '20px',
                    left: '20px',
                    background: 'rgba(15, 23, 42, 0.6)',
                    border: '1px solid rgba(56, 189, 248, 0.3)',
                    color: 'rgba(56, 189, 248, 0.6)',
                    padding: '10px 20px',
                    borderRadius: '30px',
                    fontSize: '11px',
                    cursor: 'pointer',
                    zIndex: 100,
                    backdropFilter: 'blur(10px)',
                    pointerEvents: 'auto',
                    fontFamily: 'monospace'
                }}
            >
                {reducedMotion ? 'SYSTEM_STABILIZE_OFF' : 'SYSTEM_STABILIZE_ON'}
            </button>
        </div>
    );
};

export default AIServerBackground;
