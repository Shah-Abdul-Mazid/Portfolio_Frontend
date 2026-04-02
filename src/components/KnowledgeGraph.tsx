import React, { useEffect, useRef } from 'react';

const KnowledgeGraph: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let particles: Particle[] = [];
        let pulses: Pulse[] = [];
        let dataPackets: DataPacket[] = [];
        
        const clusterCount = 5;
        const particlesPerCluster = 15;
        const connectionDistance = 120;
        const techTokens = ['RAG', 'LLM', 'ML', 'FastAPI', 'Vector', 'Prompt', 'Chain'];

        class Particle {
            x: number;
            y: number;
            baseX: number;
            baseY: number;
            vx: number;
            vy: number;
            size: number;
            clusterId: number;
            label: string | null;

            constructor(width: number, height: number, clusterId: number) {
                this.clusterId = clusterId;
                const centerX = (width / (clusterCount + 1)) * (clusterId + 1);
                const centerY = height / 2 + (Math.random() - 0.5) * (height / 3);
                
                this.x = centerX + (Math.random() - 0.5) * 300;
                this.y = centerY + (Math.random() - 0.5) * 300;
                this.baseX = this.x;
                this.baseY = this.y;
                
                this.vx = (Math.random() - 0.5) * 0.3;
                this.vy = (Math.random() - 0.5) * 0.3;
                this.size = Math.random() * 2 + 1;
                this.label = Math.random() > 0.95 ? techTokens[Math.floor(Math.random() * techTokens.length)] : null;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                // Subtle float around base position
                if (Math.abs(this.x - this.baseX) > 50) this.vx *= -1;
                if (Math.abs(this.y - this.baseY) > 50) this.vy *= -1;
            }

            draw() {
                if (!ctx) return;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(56, 189, 248, 0.4)';
                ctx.fill();

                if (this.label) {
                    ctx.font = '700 8px Arial';
                    ctx.fillStyle = 'rgba(56, 189, 248, 0.3)';
                    ctx.fillText(this.label, this.x + 5, this.y + 5);
                }
            }
        }

        class Pulse {
            x: number;
            y: number;
            radius: number;
            maxRadius: number;
            opacity: number;

            constructor(x: number, y: number) {
                this.x = x;
                this.y = y;
                this.radius = 0;
                this.maxRadius = 250;
                this.opacity = 0.5;
            }

            update() {
                this.radius += 2;
                this.opacity -= 0.005;
            }

            draw() {
                if (!ctx) return;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(56, 189, 248, ${this.opacity})`;
                ctx.lineWidth = 1;
                ctx.stroke();
            }
        }

        class DataPacket {
            x: number;
            y: number;
            targetX: number;
            targetY: number;
            progress: number;
            speed: number;

            constructor(width: number, height: number) {
                this.progress = 0;
                this.speed = Math.random() * 0.005 + 0.002;
                
                const startSide = Math.floor(Math.random() * 4);
                if (startSide === 0) { this.x = Math.random() * width; this.y = 0; this.targetX = this.x; this.targetY = height; }
                else if (startSide === 1) { this.x = width; this.y = Math.random() * height; this.targetX = 0; this.targetY = this.y; }
                else if (startSide === 2) { this.x = Math.random() * width; this.y = height; this.targetX = this.x; this.targetY = 0; }
                else { this.x = 0; this.y = Math.random() * height; this.targetX = width; this.targetY = this.y; }
            }

            update() {
                this.progress += this.speed;
            }

            draw() {
                if (!ctx) return;
                const currentX = this.x + (this.targetX - this.x) * this.progress;
                const currentY = this.y + (this.targetY - this.y) * this.progress;
                
                ctx.fillStyle = 'rgba(56, 189, 248, 0.4)';
                ctx.fillRect(currentX - 1.5, currentY - 1.5, 3, 3);
                
                // Glow effect
                ctx.shadowBlur = 10;
                ctx.shadowColor = '#38bdf8';
                ctx.fillRect(currentX - 1, currentY - 1, 2, 2);
                ctx.shadowBlur = 0;
            }
        }

        const init = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            particles = [];
            for (let c = 0; c < clusterCount; c++) {
                for (let i = 0; i < particlesPerCluster; i++) {
                    particles.push(new Particle(canvas.width, canvas.height, c));
                }
            }
        };

        const drawConnections = () => {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    if (particles[i].clusterId !== particles[j].clusterId) continue;
                    
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < connectionDistance) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(56, 189, 248, ${0.1 * (1 - distance / connectionDistance)})`;
                        ctx.lineWidth = 1;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Randomly start some events
            if (Math.random() < 0.005) {
                const randomParticle = particles[Math.floor(Math.random() * particles.length)];
                pulses.push(new Pulse(randomParticle.x, randomParticle.y));
            }
            if (Math.random() < 0.2 && dataPackets.length < 15) {
                dataPackets.push(new DataPacket(canvas.width, canvas.height));
            }

            particles.forEach(p => {
                p.update();
                p.draw();
            });

            pulses = pulses.filter(p => p.opacity > 0);
            pulses.forEach(p => {
                p.update();
                p.draw();
            });

            dataPackets = dataPackets.filter(p => p.progress < 1);
            dataPackets.forEach(p => {
                p.update();
                p.draw();
            });

            drawConnections();
            animationFrameId = requestAnimationFrame(animate);
        };

        init();
        animate();

        const handleResize = () => {
            init();
        };

        window.addEventListener('resize', handleResize);

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            id="knowledge-graph"
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 0,
                pointerEvents: 'none',
                opacity: 1
            }}
        />
    );
};

export default KnowledgeGraph;
