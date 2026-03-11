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
            t += 0.002;
            const { width, height } = canvas;

            // Draw stunning, distinctly colorful spatial background
            const bgGradient = ctx.createRadialGradient(
                width / 2, -height * 0.1, 0,
                width / 2, height, width * 1.2
            );
            // Light, beautiful crisp blue/purple bento glow
            bgGradient.addColorStop(0, "#eef2ff"); // Indigo tint at top
            bgGradient.addColorStop(0.5, "#f3f4f6"); // Cool slate middle
            bgGradient.addColorStop(1, "#e0e7ff"); // Light indigo edges

            ctx.fillStyle = bgGradient;
            ctx.fillRect(0, 0, width, height);

            // Unmistakable deep blue accent glow floating in top right
            const glowGradient = ctx.createRadialGradient(
                width * 0.85, height * 0.15, 0,
                width * 0.85, height * 0.15, width * 0.5
            );
            glowGradient.addColorStop(0, "rgba(59, 130, 246, 0.15)"); // 15% Blue glow
            glowGradient.addColorStop(1, "rgba(59, 130, 246, 0)");
            ctx.fillStyle = glowGradient;
            ctx.fillRect(0, 0, width, height);

            // Unmistakable violet accent glow in bottom left
            const purpleGlow = ctx.createRadialGradient(
                width * 0.15, height * 0.85, 0,
                width * 0.15, height * 0.85, width * 0.5
            );
            purpleGlow.addColorStop(0, "rgba(139, 92, 246, 0.12)"); // 12% Violet glow
            purpleGlow.addColorStop(1, "rgba(139, 92, 246, 0)");
            ctx.fillStyle = purpleGlow;
            ctx.fillRect(0, 0, width, height);

            // Highly visible Dot grid
            ctx.fillStyle = "rgba(17, 24, 39, 0.15)"; // 15% Opacity dark dots (very visible)
            const spacing = 36;

            const offsetX = (t * 8) % spacing;
            const offsetY = (t * 4) % spacing;

            for (let x = -spacing; x < width + spacing; x += spacing) {
                for (let y = -spacing; y < height + spacing; y += spacing) {
                    ctx.beginPath();
                    ctx.arc(x + offsetX, y + offsetY, 1.2, 0, Math.PI * 2); // Larger, 1.2px dots
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
            position: "fixed", inset: 0, width: "100%", height: "100%", zIndex: 0, pointerEvents: "none"
        }} />
    );
}
