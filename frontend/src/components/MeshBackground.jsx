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
            t += 0.002; // Slower animation for a calmer feel
            const { width, height } = canvas;

            // clear canvas
            ctx.clearRect(0, 0, width, height);

            // soft dot grid - more aesthetic, spaced out, finer dots
            ctx.fillStyle = "rgba(17, 24, 39, 0.03)"; // Very subtle dark slate dots
            const spacing = 48; // Wider spacing for cleaner look

            // Subtle parallax/drift effect
            const offsetX = (t * 8) % spacing;
            const offsetY = (t * 4) % spacing;

            for (let x = -spacing; x < width + spacing; x += spacing) {
                for (let y = -spacing; y < height + spacing; y += spacing) {
                    ctx.beginPath();
                    // Smaller 0.75px radius for a finer dot
                    ctx.arc(x + offsetX, y + offsetY, 0.8, 0, Math.PI * 2);
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
            background: "#f8fafc" // Slightly cooler, extremely light slate background
        }} />
    );
}
