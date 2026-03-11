import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios";
import MeshBackground from "../components/MeshBackground";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
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
        .login-container {
          position: relative;
          z-index: 2;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
        }
        
        .login-card {
          width: 100%;
          max-width: 440px;
          background: #ffffff;
          border-radius: 24px;
          padding: 48px;
          box-shadow: 0 20px 40px -8px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.02);
          border: 1px solid rgba(0,0,0,0.04);
          opacity: 0;
          transform: translateY(24px);
          animation: popIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .login-logo {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          background: #111827;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 32px;
          box-shadow: 0 8px 16px -4px rgba(17,24,39,0.2);
        }

        .form-group {
          animation: slideUpFade 0.5s ease both;
        }
        
        .link-text {
          color: #3b82f6;
          font-weight: 600;
          text-decoration: none;
          transition: opacity 0.2s;
        }
        .link-text:hover { opacity: 0.8; }
        
        .pass-toggle {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: #9ca3af;
          padding: 4px;
          display: flex;
          align-items: center;
          transition: color 0.2s;
        }
        .pass-toggle:hover { color: #111827; }
      `}</style>

      <MeshBackground />

      <div className="login-container">
        <div className="login-card" style={{ animationDelay: '0.1s' }}>

          <div className="login-logo">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 11l3 3L22 4" />
              <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
            </svg>
          </div>

          <div style={{ marginBottom: "32px", animation: "slideUpFade 0.5s 0.1s ease both" }}>
            <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#111827", letterSpacing: "-0.03em", marginBottom: "8px" }}>
              Welcome back
            </h1>
            <p style={{ fontSize: "15px", color: "#6b7280", fontWeight: 500 }}>
              Sign in to manage your tasks efficiently.
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

            <div className="form-group" style={{ animationDelay: "0.2s" }}>
              <label className="tf-label">Email Address</label>
              <input
                className="tf-input"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group" style={{ animationDelay: "0.25s" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                <label className="tf-label" style={{ marginBottom: 0 }}>Password</label>
                <a href="#" className="link-text" style={{ fontSize: "13px" }}>Forgot password?</a>
              </div>
              <div style={{ position: "relative" }}>
                <input
                  className="tf-input"
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  style={{ paddingRight: "48px" }}
                  required
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="pass-toggle">
                  {showPass ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="form-group" style={{ animationDelay: "0.3s", marginTop: "8px" }}>
              <button className="tf-btn-primary" type="submit" disabled={loading} style={{ width: "100%", padding: "14px" }}>
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </div>
          </form>

          <p style={{ textAlign: "center", fontSize: "14px", color: "#6b7280", marginTop: "32px", animation: "slideUpFade 0.5s 0.4s ease both" }}>
            Don't have an account?{" "}
            <Link to="/register" className="link-text">
              Create one
            </Link>
          </p>

        </div>
      </div>
    </>
  );
}