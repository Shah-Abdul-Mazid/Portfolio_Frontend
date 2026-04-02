import React, { useEffect, useRef } from 'react';

/**
 * ═══════════════════════════════════════════════════════════════════
 *  COSMIC NEURAL UNIVERSE
 *  Deep space AI engineering portfolio background
 *
 *  LAYERS (bottom → top):
 *  1. Deep space gradient base
 *  2. Shifting nebula clouds (hue-animated)
 *  3. Star field (800 stars, twinkling, colour-varied)
 *  4. Aurora curtains (slow vertical waves)
 *  5. Holographic perspective grid (lower third)
 *  6. Neural constellation (tech nodes + connection threads + quantum entanglement arcs)
 *  7. Orbital system  (LLM sun + planet nodes on circuit paths)
 *  8. Data-pulse streams (gradient-trailed beams between nodes)
 *  9. Cosmic dust  (500 particles, sine-wave drift)
 *  10. Shooting Comets
 *  11. Warp Burst 
 *  12. Holographic Scan line
 * ═══════════════════════════════════════════════════════════════════
 */

// Tech nodes scattered through the background  
const TECH_NODES = [
    'Python','PyTorch','TensorFlow','BERT','GPT-4','LoRA',
    'CNN','LSTM','Diffusion','Embeddings','Vector DB','ChromaDB',
    'Transformer','Attention','Docker','Streamlit','MongoDB',
    'Deep Learning','Image Classification','OpenAI','Gemini',
    'Automation','REST API','SQL','Git','LlamaIndex','Sklearn',
];

// LLM sun + orbiting planet nodes
const ORBITALS = [
    { name: 'LLM',       orbitR: 0,   orbitSpeed: 0,      angle: 0,    color: '#00f7ff', size: 22, rings: 3 },
    { name: 'RAG',       orbitR: 165, orbitSpeed: 0.00080, angle: 0,    color: '#bd00ff', size: 14 },
    { name: 'FastAPI',   orbitR: 125, orbitSpeed: 0.00120, angle: 2.09, color: '#06d6a0', size: 12 },
    { name: 'LangChain', orbitR: 215, orbitSpeed: 0.00060, angle: 1.05, color: '#f72585', size: 11 },
    { name: 'AutoML',    orbitR: 260, orbitSpeed: 0.00045, angle: 3.67, color: '#ffb703', size: 11 },
    { name: 'NLP',       orbitR: 300, orbitSpeed: 0.00035, angle: 5.24, color: '#4cc9f0', size: 10 },
    { name: 'Vision',    orbitR: 340, orbitSpeed: 0.00028, angle: 0.52, color: '#a78bfa', size: 10 },
];

const PALETTE = ['#00f7ff','#bd00ff','#06d6a0','#ffb703','#f72585','#4cc9f0','#a78bfa'];
const LIGHT_PALETTE = ['#0284c7','#7c3aed','#ea580c','#059669','#e11d48','#4338ca','#9333ea'];

const hex2rgb = (hex: string) => ({
    r: parseInt(hex.slice(1,3),16),
    g: parseInt(hex.slice(3,5),16),
    b: parseInt(hex.slice(5,7),16),
});

const IntelligenceMatrix: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d')!;
        let animId: number;
        let W = window.innerWidth, H = window.innerHeight;
        canvas.width = W; canvas.height = H;

        const resize = () => {
            W = window.innerWidth; H = window.innerHeight;
            canvas.width = W; canvas.height = H;
        };
        window.addEventListener('resize', resize);

        // ── 1. STARS ────────────────────────────────────────────────────────
        const stars = Array.from({ length: 900 }, () => ({
            x: Math.random() * W, y: Math.random() * H,
            r: Math.random() * 1.6 + 0.2,
            phase: Math.random() * Math.PI * 2,
            speed: 0.008 + Math.random() * 0.025,
            color: ['#ffffff','#aee4ff','#ffe8a0','#e8ccff'][Math.floor(Math.random()*4)],
        }));

        // ── 2. AURORA BANDS ────────────────────────────────────────────────
        const auroras = Array.from({ length: 5 }, (_, i) => ({
            x: (W / 5) * i + Math.random() * W * 0.2,
            phase: Math.random() * Math.PI * 2,
            speed: 0.003 + Math.random() * 0.004,
            hue: [190, 260, 175, 320, 45][i],
            width: 120 + Math.random() * 160,
        }));

        // ── 3. CONSTELLATION NODES ─────────────────────────────────────────
        const constNodes = TECH_NODES.map((tag, i) => ({
            x: 80 + Math.random() * (W - 160),
            y: 80 + Math.random() * (H - 160),
            vx: (Math.random() - 0.5) * 0.10,
            vy: (Math.random() - 0.5) * 0.10,
            tag,
            colorIndex: i % PALETTE.length,
            size: 3 + Math.random() * 2.5,
            alpha: 0.35 + Math.random() * 0.45,
            phase: Math.random() * Math.PI * 2,
        }));

        // ── 4. ORBITAL SYSTEM ─────────────────────────────────────────────
        const orbs = ORBITALS.map(o => ({ ...o, x: 0, y: 0 }));

        // ── 5. DATA BEAMS ──────────────────────────────────────────────────
        interface Beam { fx:number;fy:number;tx:number;ty:number;t:number;speed:number;colorIndex:number;trail:{x:number;y:number}[] }
        const beams: Beam[] = [];
        let beamTimer = 0;
        const spawnBeam = () => {
            const from = orbs[Math.floor(Math.random() * orbs.length)];
            const to   = constNodes[Math.floor(Math.random() * constNodes.length)];
            beams.push({ fx: from.x, fy: from.y, tx: to.x, ty: to.y, t: 0, speed: 0.009 + Math.random() * 0.009, colorIndex: orbs.indexOf(from), trail: [] });
        };
        for (let i = 0; i < 12; i++) spawnBeam();

        // ── 6. COSMIC DUST ─────────────────────────────────────────────────
        const dust = Array.from({ length: 550 }, () => ({
            x: Math.random() * W, y: Math.random() * H,
            vx: (Math.random() - 0.5) * 0.07, vy: (Math.random() - 0.5) * 0.07,
            r:  0.4 + Math.random() * 0.9,
            colorIndex: Math.floor(Math.random() * PALETTE.length),
            a: 0.025 + Math.random() * 0.065,
            wave: Math.random() * Math.PI * 2, waveSpeed: 0.006 + Math.random() * 0.01,
        }));

        // ── 7. SHOOTING COMETS ────────────────────────────────────────────
        interface Comet { x:number;y:number;vx:number;vy:number;len:number;colorIndex:number;life:number;maxLife:number }
        const comets: Comet[] = [];
        let cometTimer = 0;
        const spawnComet = () => {
            const angle = Math.random() * Math.PI * 2;
            const speed = 6 + Math.random() * 8;
            const startX = Math.random() < 0.5 ? -50 : W + 50;
            const startY = Math.random() * H * 0.6;
            comets.push({ x: startX, y: startY,
                vx: (startX < 0 ? 1 : -1) * speed * Math.cos(angle * 0.15),
                vy: speed * 0.3 + Math.random() * 0.5,
                len: 80 + Math.random() * 120,
                colorIndex: Math.floor(Math.random() * PALETTE.length),
                life: 0, maxLife: 120 + Math.random() * 80,
            });
        };

        // ── 8. WARP BURST ─────────────────────────────────────────────────
        let warpFrame = 0; // tracks when to next burst
        let warpActive = false; let warpT = 0;

        // ── 9. HOLOGRAPHIC SCAN LINE ──────────────────────────────────────
        let scanY = -40;

        // ── DRAW ───────────────────────────────────────────────────────────
        let frame = 0;
        const draw = () => {
            frame++;
            W = canvas.width; H = canvas.height;
            const cx = W / 2, cy = H * 0.42;

            const isLight = document.documentElement.classList.contains('light-mode');
            const currentPalette = isLight ? LIGHT_PALETTE : PALETTE;

            // ─ Background ─────────────────────────────────────────────────
            ctx.fillStyle = isLight ? '#f0f4f8' : '#010612';
            ctx.fillRect(0, 0, W, H);

            // ─ Nebula clouds (slow hue drift) ─────────────────────────────
            const hDrift = frame * 0.04;
            [
                { x: W*0.18, y: H*0.18, r: H*0.38, hBase: 195 },
                { x: W*0.82, y: H*0.22, r: H*0.32, hBase: 265 },
                { x: W*0.50, y: H*0.72, r: H*0.42, hBase: 175 },
                { x: W*0.08, y: H*0.75, r: H*0.28, hBase: 305 },
                { x: W*0.92, y: H*0.78, r: H*0.30, hBase: 48  },
            ].forEach(n => {
                const h = (n.hBase + hDrift) % 360;
                const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r);
                if (isLight) {
                    g.addColorStop(0, `hsla(${h},70%,65%,0.10)`);
                    g.addColorStop(0.5,`hsla(${h},60%,60%,0.04)`);
                } else {
                    g.addColorStop(0, `hsla(${h},90%,62%,0.065)`);
                    g.addColorStop(0.5,`hsla(${h},80%,50%,0.025)`);
                }
                g.addColorStop(1, 'transparent');
                ctx.fillStyle = g;
                ctx.fillRect(0, 0, W, H);
            });

            // ─ Stars ──────────────────────────────────────────────────────
            ctx.save();
            stars.forEach(s => {
                s.phase += s.speed;
                const bright = 0.3 + Math.sin(s.phase) * 0.7;
                ctx.globalAlpha = Math.max(0, bright) * (s.r > 1.2 ? 0.95 : 0.45);
                ctx.fillStyle = isLight ? '#94a3b8' : s.color;
                ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill();
            });
            ctx.globalAlpha = 1;
            ctx.restore();

            // ─ Shooting comets ────────────────────────────────────────────
            cometTimer++;
            if (cometTimer > 180) { cometTimer = 0; spawnComet(); }
            for (let i = comets.length - 1; i >= 0; i--) {
                const cm = comets[i];
                cm.x += cm.vx; cm.y += cm.vy; cm.life++;
                const fade = 1 - cm.life / cm.maxLife;
                const rgb = hex2rgb(currentPalette[cm.colorIndex]);
                // Tail gradient
                const tailGrad = ctx.createLinearGradient(
                    cm.x - cm.vx * (cm.len / Math.hypot(cm.vx, cm.vy)),
                    cm.y - cm.vy * (cm.len / Math.hypot(cm.vx, cm.vy)),
                    cm.x, cm.y
                );
                tailGrad.addColorStop(0, 'transparent');
                tailGrad.addColorStop(0.6, `rgba(${rgb.r},${rgb.g},${rgb.b},${fade * 0.25})`);
                tailGrad.addColorStop(1, `rgba(255,255,255,${fade * 0.9})`);
                ctx.save();
                ctx.strokeStyle = tailGrad;
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.moveTo(cm.x - cm.vx * (cm.len / Math.hypot(cm.vx, cm.vy)), cm.y - cm.vy * (cm.len / Math.hypot(cm.vx, cm.vy)));
                ctx.lineTo(cm.x, cm.y);
                ctx.stroke();
                // Bright head
                const hGlow = ctx.createRadialGradient(cm.x, cm.y, 0, cm.x, cm.y, 8);
                hGlow.addColorStop(0, `rgba(255,255,255,${fade})`);
                hGlow.addColorStop(1, 'transparent');
                ctx.fillStyle = hGlow;
                ctx.beginPath(); ctx.arc(cm.x, cm.y, 8, 0, Math.PI * 2); ctx.fill();
                ctx.restore();
                if (cm.life >= cm.maxLife || cm.x < -200 || cm.x > W + 200 || cm.y > H + 50) comets.splice(i, 1);
            }

            // ─ Aurora bands ───────────────────────────────────────────────
            ctx.save();
            auroras.forEach(a => {
                a.phase += a.speed;
                const yOff = Math.sin(a.phase) * H * 0.12;
                a.x += Math.sin(a.phase * 0.3) * 0.15;
                if (a.x < -a.width) a.x = W + a.width;
                if (a.x > W + a.width) a.x = -a.width;
                const grad = ctx.createLinearGradient(a.x - a.width, 0, a.x + a.width, 0);
                grad.addColorStop(0, 'transparent');
                grad.addColorStop(0.5, `hsla(${a.hue},90%,65%,0.035)`);
                grad.addColorStop(1, 'transparent');
                const vgrad = ctx.createLinearGradient(0, yOff, 0, H * 0.55 + yOff);
                vgrad.addColorStop(0, 'transparent');
                vgrad.addColorStop(0.4, `hsla(${a.hue},90%,65%,0.03)`);
                vgrad.addColorStop(1, 'transparent');
                ctx.fillStyle = grad; ctx.fillRect(0, 0, W, H);
            });
            ctx.restore();

            // ─ Holographic perspective grid (lower third) ─────────────────
            ctx.save();
            ctx.globalAlpha = isLight ? 0.15 : 0.06;
            ctx.strokeStyle = isLight ? '#0284c7' : '#00f7ff';
            ctx.lineWidth = 0.7;
            const gridH = H * 0.62;
            // Horizontal lines (squish toward horizon)
            for (let i = 0; i <= 14; i++) {
                const t = i / 14;
                const y = gridH + (H - gridH) * (t * t);
                ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
            }
            // Vertical lines (radiate from vanishing point)
            for (let i = -16; i <= 32; i++) {
                ctx.beginPath();
                ctx.moveTo(cx + (i - 8) * 12, gridH);
                ctx.lineTo(cx + (i - 8) * 90, H);
                ctx.stroke();
            }
            ctx.restore();

            // ─ Constellation connections ───────────────────────────────────
            for (let i = 0; i < constNodes.length; i++) {
                for (let j = i + 1; j < constNodes.length; j++) {
                    const a = constNodes[i], b = constNodes[j];
                    const d = Math.hypot(a.x - b.x, a.y - b.y);
                    if (d > 190) continue;
                    const alpha = (1 - d / 190) * (isLight ? 0.05 : 0.11);
                    const parsedRgb = hex2rgb(currentPalette[a.colorIndex]);
                    ctx.strokeStyle = `rgba(${parsedRgb.r},${parsedRgb.g},${parsedRgb.b},${alpha})`;
                    ctx.lineWidth = 0.6;
                    ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
                }
            }

            // ─ Quantum entanglement (bidirectional dashed arcs between distant nodes) ─
            ctx.save();
            if (frame % 3 === 0) { // every 3rd frame shift dash offset for animation
                ctx.setLineDash([6, 6]);
                ctx.lineDashOffset = -(frame / 3) % 12;
            }
            for (let i = 0; i < constNodes.length; i += 4) {
                const a = constNodes[i], b = constNodes[(i + 13) % constNodes.length];
                const d = Math.hypot(a.x - b.x, a.y - b.y);
                if (d < 100) continue;
                const alpha = (isLight ? 0.02 : 0.06) + Math.sin(frame * 0.02 + i) * 0.03;
                const rgb = hex2rgb(currentPalette[a.colorIndex]);
                ctx.strokeStyle = `rgba(${rgb.r},${rgb.g},${rgb.b},${alpha})`;
                ctx.lineWidth = 0.6;
                ctx.beginPath();
                // Curved arc
                const mx = (a.x + b.x) / 2 + (b.y - a.y) * 0.25;
                const my = (a.y + b.y) / 2 - (b.x - a.x) * 0.25;
                ctx.moveTo(a.x, a.y);
                ctx.quadraticCurveTo(mx, my, b.x, b.y);
                ctx.stroke();
            }
            ctx.setLineDash([]); ctx.lineDashOffset = 0;
            ctx.restore();

            // ─ Constellation nodes ─────────────────────────────────────────
            ctx.save();
            constNodes.forEach(n => {
                n.x += n.vx; n.y += n.vy;
                if (n.x < 50 || n.x > W - 50) n.vx *= -1;
                if (n.y < 50 || n.y > H - 50) n.vy *= -1;
                n.phase += 0.018;
                const p = Math.sin(n.phase) * 0.5 + 0.5;
                const a = n.alpha * (0.5 + p * 0.5);

                const nodeColor = currentPalette[n.colorIndex];
                
                // Soft glow
                const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.size * 5);
                g.addColorStop(0, nodeColor + Math.round(a * (isLight ? 0.15 : 0.4) * 255).toString(16).padStart(2,'0'));
                g.addColorStop(1, 'transparent');
                ctx.fillStyle = g;
                ctx.beginPath(); ctx.arc(n.x, n.y, n.size * 5, 0, Math.PI * 2); ctx.fill();

                // Core dot
                ctx.beginPath(); ctx.arc(n.x, n.y, n.size * (0.8 + p * 0.4), 0, Math.PI * 2);
                ctx.fillStyle = nodeColor + Math.round(a * (isLight ? 1 : 1) * 255).toString(16).padStart(2,'0');
                ctx.fill();

                // Label
                ctx.globalAlpha = a * 0.52;
                ctx.font = '9px "Courier New"';
                ctx.fillStyle = isLight ? '#0f172a' : nodeColor;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'bottom';
                ctx.fillText(n.tag, n.x, n.y - n.size - 3);
                ctx.globalAlpha = 1;
            });
            ctx.restore();

            // ─ Orbital paths ───────────────────────────────────────────────
            orbs.slice(1).forEach((o, idx) => {
                const orbColor = currentPalette[(idx + 1) % currentPalette.length];
                ctx.save();
                ctx.strokeStyle = orbColor + (isLight ? '15' : '25');
                ctx.lineWidth = 0.8;
                ctx.setLineDash([5, 9]);
                ctx.beginPath(); ctx.arc(cx, cy, o.orbitR, 0, Math.PI * 2); ctx.stroke();
                ctx.setLineDash([]);
                ctx.restore();
                // Line to center
                ctx.save();
                ctx.strokeStyle = orbColor + '18';
                ctx.lineWidth = 0.4;
                ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(o.x, o.y); ctx.stroke();
                ctx.restore();
            });

            // ─ Orbital nodes ───────────────────────────────────────────────
            orbs.forEach((o, i) => {
                const orbColor = currentPalette[i % currentPalette.length];
                if (i === 0) { o.x = cx; o.y = cy; }
                else { o.angle += o.orbitSpeed; o.x = cx + Math.cos(o.angle) * o.orbitR; o.y = cy + Math.sin(o.angle) * o.orbitR; }

                const pulse = Math.sin(frame * 0.035 + i * 1.2) * 0.5 + 0.5;

                // Outer aura
                const aura = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.size * (i===0 ? 5 : 4));
                aura.addColorStop(0, orbColor + Math.round((0.25 + pulse * 0.25) * (isLight ? 0.3 : 1) * 255).toString(16).padStart(2,'0'));
                aura.addColorStop(0.4, orbColor + (isLight ? '0a' : '18'));
                aura.addColorStop(1, 'transparent');
                ctx.fillStyle = aura;
                ctx.beginPath(); ctx.arc(o.x, o.y, o.size * (i===0 ? 5 : 4), 0, Math.PI * 2); ctx.fill();

                // Rings for LLM core
                if (i === 0 && (o as any).rings) {
                    for (let r = 1; r <= 3; r++) {
                        const rAlpha = (0.18 - r * 0.04 + pulse * 0.08) * (isLight ? 0.4 : 1);
                        ctx.beginPath();
                        ctx.arc(o.x, o.y, o.size * 1.8 + r * 14 + pulse * 4, 0, Math.PI * 2);
                        ctx.strokeStyle = orbColor + Math.round(Math.max(0,rAlpha) * 255).toString(16).padStart(2,'0');
                        ctx.lineWidth = r === 1 ? 1.5 : 0.8;
                        ctx.stroke();
                    }
                }

                // Core sphere (radial highlight)
                const cg = ctx.createRadialGradient(o.x - o.size * 0.3, o.y - o.size * 0.3, 0, o.x, o.y, o.size);
                cg.addColorStop(0, '#ffffff');
                cg.addColorStop(0.35, orbColor);
                cg.addColorStop(1, orbColor + 'aa');
                ctx.fillStyle = cg;
                ctx.beginPath(); ctx.arc(o.x, o.y, o.size, 0, Math.PI * 2); ctx.fill();

                // Label
                ctx.save();
                ctx.font = `bold ${i === 0 ? 11 : 9}px "Courier New"`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'top';
                ctx.fillStyle = isLight ? '#0f172a' : orbColor;
                ctx.globalAlpha = 0.92;
                ctx.fillText(o.name, o.x, o.y + o.size + 5);
                ctx.restore();
            });

            // ─ Data beams ──────────────────────────────────────────────────
            beamTimer++;
            if (beamTimer > 60 && beams.length < 18) { beamTimer = 0; spawnBeam(); }
            for (let i = beams.length - 1; i >= 0; i--) {
                const bm = beams[i];
                bm.t += bm.speed;
                const px = bm.fx + (bm.tx - bm.fx) * bm.t;
                const py = bm.fy + (bm.ty - bm.fy) * bm.t;
                bm.trail.push({ x: px, y: py });
                if (bm.trail.length > 28) bm.trail.shift();

                bm.trail.forEach((pt, idx) => {
                    const nt = idx / bm.trail.length;
                    const bmColor = currentPalette[bm.colorIndex%currentPalette.length] || currentPalette[0];
                    const rgb = hex2rgb(bmColor);
                    ctx.beginPath(); ctx.arc(pt.x, pt.y, 2.5 * nt, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(${rgb.r},${rgb.g},${rgb.b},${nt * (isLight ? 0.3 : 0.8)})`;
                    ctx.fill();
                });
                // Bright head
                const bmColorH = currentPalette[bm.colorIndex%currentPalette.length] || currentPalette[0];
                const hg = ctx.createRadialGradient(px, py, 0, px, py, 14);
                hg.addColorStop(0, isLight ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.9)');
                hg.addColorStop(0.2, bmColorH);
                hg.addColorStop(1,'transparent');
                ctx.fillStyle = hg;
                ctx.beginPath(); ctx.arc(px, py, 14, 0, Math.PI * 2); ctx.fill();

                if (bm.t >= 1) beams.splice(i, 1);
            }

            // ─ LLM Core lens flare (starburst spikes) ────────────────────
            const llm = orbs[0];
            const flareAlpha = (0.12 + Math.sin(frame * 0.04) * 0.06) * (isLight ? 0.2 : 1);
            const spikeLen = llm.size * 4.5 + Math.sin(frame * 0.05) * 8;
            [0, 45, 90, 135, 180, 225, 270, 315].forEach(deg => {
                const rad = deg * Math.PI / 180;
                const x2 = llm.x + Math.cos(rad) * spikeLen;
                const y2 = llm.y + Math.sin(rad) * spikeLen;
                const sg = ctx.createLinearGradient(llm.x, llm.y, x2, y2);
                const flareColor = hex2rgb(currentPalette[0]);
                sg.addColorStop(0, `rgba(${flareColor.r},${flareColor.g},${flareColor.b},${flareAlpha})`);
                sg.addColorStop(1, 'transparent');
                ctx.strokeStyle = sg;
                ctx.lineWidth = deg % 90 === 0 ? 1.2 : 0.6;
                ctx.beginPath(); ctx.moveTo(llm.x, llm.y); ctx.lineTo(x2, y2); ctx.stroke();
            });

            // ─ Warp burst (every ~500 frames) ────────────────────────────
            warpFrame++;
            if (warpFrame > 500) { warpFrame = 0; warpActive = true; warpT = 0; }
            if (warpActive) {
                warpT += 0.04;
                const wR = warpT * Math.max(W, H) * 0.8;
                const wAlpha = Math.max(0, 0.18 * (1 - warpT));
                ctx.save();
                for (let s = 0; s < 24; s++) {
                    const ang = (s / 24) * Math.PI * 2;
                    const wg = ctx.createLinearGradient(cx, cy, cx + Math.cos(ang) * wR, cy + Math.sin(ang) * wR);
                    wg.addColorStop(0, `rgba(0,247,255,${wAlpha * 1.5})`);
                    wg.addColorStop(0.4, `rgba(189,0,255,${wAlpha})`);
                    wg.addColorStop(1, 'transparent');
                    ctx.strokeStyle = wg;
                    ctx.lineWidth = 0.8;
                    ctx.beginPath(); ctx.moveTo(cx, cy);
                    ctx.lineTo(cx + Math.cos(ang) * wR, cy + Math.sin(ang) * wR);
                    ctx.stroke();
                }
                ctx.restore();
                if (warpT >= 1) warpActive = false;
            }

            // ─ Holographic scan line ──────────────────────────────────────
            scanY += 0.6;
            if (scanY > H + 40) scanY = -40;
            const scanG = ctx.createLinearGradient(0, scanY - 20, 0, scanY + 20);
            scanG.addColorStop(0, 'transparent');
            scanG.addColorStop(0.5, isLight ? 'rgba(2, 132, 199, 0.08)' : 'rgba(0, 247, 255, 0.04)');
            scanG.addColorStop(1, 'transparent');
            ctx.fillStyle = scanG;
            ctx.fillRect(0, scanY - 20, W, 40);
            // Thin bright line at center of scan
            ctx.strokeStyle = isLight ? 'rgba(2, 132, 199, 0.15)' : 'rgba(0, 247, 255, 0.06)';
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(0, scanY); ctx.lineTo(W, scanY); ctx.stroke();

            // ─ Cosmic dust ─────────────────────────────────────────────────
            dust.forEach(d => {
                d.wave += d.waveSpeed;
                d.x += d.vx + Math.sin(d.wave) * 0.06;
                d.y += d.vy + Math.cos(d.wave * 0.71) * 0.06;
                if (d.x < 0) d.x = W; if (d.x > W) d.x = 0;
                if (d.y < 0) d.y = H; if (d.y > H) d.y = 0;
                ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
                const rgb = hex2rgb(currentPalette[d.colorIndex]);
                ctx.fillStyle = `rgba(${rgb.r},${rgb.g},${rgb.b},${d.a * (isLight ? 1.5 : 1)})`;
                ctx.fill();
            });

            animId = requestAnimationFrame(draw);
        };
        draw();

        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener('resize', resize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed', top: 0, left: 0,
                width: '100vw', height: '100vh',
                zIndex: -1, display: 'block', pointerEvents: 'none',
            }}
        />
    );
};

export default IntelligenceMatrix;
