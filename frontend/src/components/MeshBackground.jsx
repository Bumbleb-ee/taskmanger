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

        const draw = () => {
            t += 0.005;
            const { width, height } = canvas;

            // clear canvas
            ctx.clearRect(0, 0, width, height);

            // soft dot grid
            ctx.fillStyle = "rgba(0, 0, 0, 0.04)";
            const spacing = 32;

            const offsetX = (t * 10) % spacing;
            const offsetY = (t * 5) % spacing;

            for (let x = -spacing; x < width + spacing; x += spacing) {
                for (let y = -spacing; y < height + spacing; y += spacing) {
                    ctx.beginPath();
                    ctx.arc(x + offsetX, y + offsetY, 1, 0, Math.PI * 2);
                    ctx.fill();
                }
            }

            animRef.current = requestAnimationFrame(draw);
        };
        animRef.current = requestAnimationFrame(draw);
        return () => { cancelAnimationFrame(animRef.current); window.removeEventListener("resize", resize); };
    }, []);

    return (
        <canvas ref={canvasRef} style={{
            position: "fixed", inset: 0, width: "100%", height: "100%", zIndex: 0, pointerEvents: "none",
            background: "var(--bg-secondary)"
        }} />
    );
}
