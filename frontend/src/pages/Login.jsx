import { useState, useEffect, useRef, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

// ─── Animated mesh-gradient background ───────────────────────────────────────
function MeshBackground() {
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    let t = 0;
    const orbs = [
      { x: 0.2, y: 0.3, r: 0.45, color: "15,23,42" },
      { x: 0.8, y: 0.2, r: 0.4, color: "99,102,241" },
      { x: 0.5, y: 0.8, r: 0.5, color: "6,182,212" },
      { x: 0.1, y: 0.7, r: 0.35, color: "139,92,246" },
      { x: 0.9, y: 0.85, r: 0.38, color: "34,211,238" },
    ];

    const draw = () => {
      t += 0.003;
      const w = canvas.width, h = canvas.height;
      ctx.fillStyle = "#020817";
      ctx.fillRect(0, 0, w, h);

      orbs.forEach((orb, i) => {
        const ox = (orb.x + Math.sin(t + i * 1.3) * 0.12) * w;
        const oy = (orb.y + Math.cos(t + i * 0.9) * 0.1) * h;
        const r = orb.r * Math.min(w, h);
        const g = ctx.createRadialGradient(ox, oy, 0, ox, oy, r);
        g.addColorStop(0, `rgba(${orb.color},0.18)`);
        g.addColorStop(1, `rgba(${orb.color},0)`);
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
      });

      // Subtle grid lines
      ctx.strokeStyle = "rgba(99,102,241,0.04)";
      ctx.lineWidth = 1;
      const gs = 60;
      for (let x = 0; x < w; x += gs) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
      for (let y = 0; y < h; y += gs) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(animRef.current); window.removeEventListener("resize", resize); };
  }, []);

  return (
    <canvas ref={canvasRef} style={{
      position: "fixed", inset: 0, width: "100%", height: "100%", zIndex: 0,
    }} />
  );
}

// ─── Floating orb decorations ─────────────────────────────────────────────────
function FloatingOrbs() {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1, pointerEvents: "none", overflow: "hidden" }}>
      {[
        { size: 300, top: "-80px", left: "-80px", color: "99,102,241", delay: "0s" },
        { size: 200, bottom: "10%", right: "-60px", color: "6,182,212", delay: "1s" },
        { size: 150, top: "40%", left: "5%", color: "139,92,246", delay: "2s" },
      ].map((o, i) => (
        <div key={i} style={{
          position: "absolute",
          width: o.size, height: o.size,
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(${o.color},0.15) 0%, transparent 70%)`,
          top: o.top, bottom: o.bottom, left: o.left, right: o.right,
          animation: `floatOrb 6s ease-in-out infinite`,
          animationDelay: o.delay,
          filter: "blur(2px)",
        }} />
      ))}
    </div>
  );
}

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [focused, setFocused] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => setMounted(true), 50);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post("/auth/login", { email, password });
      login(res.data);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body { background: #020817; }

        @keyframes floatOrb {
          0%, 100% { transform: translateY(0px) scale(1); }
          50%       { transform: translateY(-20px) scale(1.05); }
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(32px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @keyframes pulse-ring {
          0%   { transform: scale(0.8); opacity: 1; }
          100% { transform: scale(1.4); opacity: 0; }
        }

        .login-input {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          padding: 14px 18px;
          color: #f1f5f9;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          outline: none;
          transition: all 0.25s ease;
          letter-spacing: 0.01em;
        }

        .login-input::placeholder { color: rgba(148,163,184,0.5); }

        .login-input:focus {
          border-color: rgba(99,102,241,0.6);
          background: rgba(99,102,241,0.06);
          box-shadow: 0 0 0 3px rgba(99,102,241,0.12), 0 0 20px rgba(99,102,241,0.08);
        }

        .login-input:-webkit-autofill,
        .login-input:-webkit-autofill:focus {
          -webkit-box-shadow: 0 0 0 1000px #0d1224 inset;
          -webkit-text-fill-color: #f1f5f9;
        }

        .sign-btn {
          width: 100%;
          padding: 15px;
          border: none;
          border-radius: 12px;
          font-family: 'Syne', sans-serif;
          font-size: 15px;
          font-weight: 600;
          letter-spacing: 0.04em;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
          background: linear-gradient(135deg, #6366f1, #8b5cf6, #06b6d4);
          background-size: 200% auto;
          color: white;
          box-shadow: 0 4px 24px rgba(99,102,241,0.35);
        }

        .sign-btn:hover:not(:disabled) {
          background-position: right center;
          box-shadow: 0 6px 32px rgba(99,102,241,0.5);
          transform: translateY(-1px);
        }

        .sign-btn:active:not(:disabled) { transform: translateY(0); }

        .sign-btn:disabled { opacity: 0.7; cursor: not-allowed; }

        .sign-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%);
          background-size: 200% auto;
          animation: shimmer 3s linear infinite;
        }

        .card-glow {
          position: absolute;
          inset: -1px;
          border-radius: 25px;
          background: linear-gradient(135deg, rgba(99,102,241,0.3), rgba(6,182,212,0.15), rgba(139,92,246,0.3));
          z-index: -1;
          filter: blur(1px);
        }

        .divider-line {
          flex: 1;
          height: 1px;
          background: linear-gradient(to right, transparent, rgba(255,255,255,0.08), transparent);
        }
      `}</style>

      <MeshBackground />
      <FloatingOrbs />

      {/* Page layout */}
      <div style={{
        position: "relative", zIndex: 2,
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        fontFamily: "'DM Sans', sans-serif",
      }}>

        {/* Card */}
        <div style={{
          position: "relative",
          width: "100%",
          maxWidth: "420px",
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : "translateY(24px)",
          transition: "all 0.6s cubic-bezier(0.16,1,0.3,1)",
        }}>
          {/* Glow border */}
          <div className="card-glow" />

          {/* Card body */}
          <div style={{
            background: "rgba(8,12,28,0.85)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            borderRadius: "24px",
            border: "1px solid rgba(255,255,255,0.07)",
            padding: "44px 40px",
            boxShadow: "0 32px 80px rgba(0,0,0,0.6)",
          }}>

            {/* Logo mark */}
            <div style={{
              display: "flex", alignItems: "center", gap: "10px",
              marginBottom: "32px",
              animation: "slideUp 0.5s ease both",
            }}>
              <div style={{
                width: 38, height: 38, borderRadius: "10px",
                background: "linear-gradient(135deg, #6366f1, #06b6d4)",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 4px 16px rgba(99,102,241,0.4)",
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 11l3 3L22 4" />
                  <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
                </svg>
              </div>
              <span style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: "20px", fontWeight: 700,
                color: "#f1f5f9", letterSpacing: "-0.02em",
              }}>TaskFlow</span>
            </div>

            {/* Heading */}
            <div style={{ marginBottom: "28px", animation: "slideUp 0.5s 0.08s ease both" }}>
              <h1 style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: "26px", fontWeight: 800,
                color: "#f8fafc", letterSpacing: "-0.03em",
                marginBottom: "6px",
              }}>Welcome back</h1>
              <p style={{ fontSize: "14px", color: "rgba(148,163,184,0.8)", fontWeight: 300 }}>
                Sign in to continue managing your tasks
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

              {/* Email */}
              <div style={{ animation: "slideUp 0.5s 0.15s ease both" }}>
                <label style={{
                  display: "block", marginBottom: "7px",
                  fontSize: "12px", fontWeight: 500,
                  color: "rgba(148,163,184,0.9)", letterSpacing: "0.06em", textTransform: "uppercase",
                }}>Email</label>
                <input
                  className="login-input"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* Password */}
              <div style={{ animation: "slideUp 0.5s 0.22s ease both" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "7px" }}>
                  <label style={{
                    fontSize: "12px", fontWeight: 500,
                    color: "rgba(148,163,184,0.9)", letterSpacing: "0.06em", textTransform: "uppercase",
                  }}>Password</label>
                  <a href="#" style={{
                    fontSize: "12px", color: "#818cf8",
                    textDecoration: "none", fontWeight: 400,
                    transition: "color 0.2s",
                  }}
                    onMouseEnter={e => e.target.style.color = "#a5b4fc"}
                    onMouseLeave={e => e.target.style.color = "#818cf8"}
                  >Forgot password?</a>
                </div>
                <div style={{ position: "relative" }}>
                  <input
                    className="login-input"
                    type={showPass ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    style={{ paddingRight: "48px" }}
                    required
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)} style={{
                    position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)",
                    background: "none", border: "none", cursor: "pointer",
                    color: "rgba(148,163,184,0.5)", padding: "4px",
                    transition: "color 0.2s",
                    display: "flex", alignItems: "center",
                  }}
                    onMouseEnter={e => e.currentTarget.style.color = "#818cf8"}
                    onMouseLeave={e => e.currentTarget.style.color = "rgba(148,163,184,0.5)"}
                  >
                    {showPass ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
                        <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <div style={{ marginTop: "8px", animation: "slideUp 0.5s 0.28s ease both" }}>
                <button className="sign-btn" type="submit" disabled={loading}>
                  {loading ? (
                    <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"
                        style={{ animation: "spin 0.8s linear infinite" }}>
                        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                      </svg>
                      Signing in...
                    </span>
                  ) : "Sign In →"}
                </button>
              </div>
            </form>

            {/* Divider */}
            <div style={{
              display: "flex", alignItems: "center", gap: "12px",
              margin: "24px 0",
              animation: "slideUp 0.5s 0.34s ease both",
            }}>
              <div className="divider-line" />
              <span style={{ fontSize: "11px", color: "rgba(148,163,184,0.4)", letterSpacing: "0.08em", whiteSpace: "nowrap" }}>
                OR
              </span>
              <div className="divider-line" />
            </div>

            {/* Register link */}
            <p style={{
              textAlign: "center", fontSize: "14px",
              color: "rgba(148,163,184,0.6)",
              animation: "slideUp 0.5s 0.38s ease both",
            }}>
              Don't have an account?{" "}
              <a href="/register" style={{
                color: "#818cf8", fontWeight: 500, textDecoration: "none",
                transition: "color 0.2s",
                borderBottom: "1px solid rgba(129,140,248,0.3)",
                paddingBottom: "1px",
              }}
                onMouseEnter={e => { e.target.style.color = "#a5b4fc"; e.target.style.borderBottomColor = "rgba(165,180,252,0.5)"; }}
                onMouseLeave={e => { e.target.style.color = "#818cf8"; e.target.style.borderBottomColor = "rgba(129,140,248,0.3)"; }}
              >
                Create account
              </a>
            </p>

          </div>
        </div>
      </div>
    </>
  );
}