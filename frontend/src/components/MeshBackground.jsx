import { useEffect, useRef } from "react";

export default function MeshBackground() {
    const canvasRef = useRef(null);
    const animRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
        resize();
        window.addEventListener("resize", resize);

        let t = 0;
        const orbs = [
            { x: 0.15, y: 0.25, r: 0.42, color: "15,23,42" },
            { x: 0.82, y: 0.18, r: 0.38, color: "99,102,241" },
            { x: 0.5, y: 0.82, r: 0.48, color: "6,182,212" },
            { x: 0.08, y: 0.72, r: 0.32, color: "139,92,246" },
            { x: 0.92, y: 0.88, r: 0.36, color: "34,211,238" },
        ];

        const draw = () => {
            t += 0.003;
            const { width: w, height: h } = canvas;
            ctx.fillStyle = "#020817";
            ctx.fillRect(0, 0, w, h);
            orbs.forEach((o, i) => {
                const ox = (o.x + Math.sin(t + i * 1.3) * 0.1) * w;
                const oy = (o.y + Math.cos(t + i * 0.9) * 0.09) * h;
                const r = o.r * Math.min(w, h);
                const g = ctx.createRadialGradient(ox, oy, 0, ox, oy, r);
                g.addColorStop(0, `rgba(${o.color},0.16)`);
                g.addColorStop(1, `rgba(${o.color},0)`);
                ctx.fillStyle = g;
                ctx.fillRect(0, 0, w, h);
            });
            ctx.strokeStyle = "rgba(99,102,241,0.035)";
            ctx.lineWidth = 1;
            for (let x = 0; x < w; x += 64) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
            for (let y = 0; y < h; y += 64) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
            animRef.current = requestAnimationFrame(draw);
        };
        animRef.current = requestAnimationFrame(draw);
        return () => { cancelAnimationFrame(animRef.current); window.removeEventListener("resize", resize); };
    }, []);

    return (
        <canvas ref={canvasRef} style={{
            position: "fixed", inset: 0, width: "100%", height: "100%", zIndex: 0, pointerEvents: "none",
        }} />
    );
}
