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
            t += 0.0015; // Very slow, elegant drift
            const { width, height } = canvas;

            // Draw stunning soft spatial gradient background
            const bgGradient = ctx.createRadialGradient(
                width / 2, -height * 0.2, 0,
                width / 2, height, width * 1.5
            );
            bgGradient.addColorStop(0, "#ffffff"); // Pure white glow at the very top
            bgGradient.addColorStop(0.3, "#f8fafc"); // Cool slate transition
            bgGradient.addColorStop(1, "#f1f5f9"); // Slightly darker slate at bottom edges

            ctx.fillStyle = bgGradient;
            ctx.fillRect(0, 0, width, height);

            // Add a subtle accent glow in the top right
            const glowGradient = ctx.createRadialGradient(
                width * 0.8, height * 0.2, 0,
                width * 0.8, height * 0.2, width * 0.6
            );
            glowGradient.addColorStop(0, "rgba(59, 130, 246, 0.04)"); // Faint blue accent
            glowGradient.addColorStop(1, "rgba(59, 130, 246, 0)");
            ctx.fillStyle = glowGradient;
            ctx.fillRect(0, 0, width, height);

            // Soft dot grid
            ctx.fillStyle = "rgba(17, 24, 39, 0.04)"; // Dark slate dots
            const spacing = 40; // Perfect balance spacing

            // Subtle parallax/drift effect
            const offsetX = (t * 6) % spacing;
            const offsetY = (t * 3) % spacing;

            for (let x = -spacing; x < width + spacing; x += spacing) {
                for (let y = -spacing; y < height + spacing; y += spacing) {
                    ctx.beginPath();
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
            position: "fixed", inset: 0, width: "100%", height: "100%", zIndex: 0, pointerEvents: "none"
        }} />
    );
}
