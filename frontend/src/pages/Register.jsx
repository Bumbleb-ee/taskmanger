import { useState, useEffect, useContext } from "react";
import MeshBackground from "../components/MeshBackground";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios";

export default function Register() {
    const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [step, setStep] = useState(1); // 1 = info, 2 = password

    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => { setTimeout(() => setMounted(true), 50); }, []);

    const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (step === 1) { setStep(2); return; }
        if (form.password !== form.confirm) return;

        setLoading(true);
        try {
            const res = await API.post("/auth/register", { name: form.name, email: form.email, password: form.password });
            login(res.data);
            navigate("/dashboard");
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    const EyeIcon = ({ open }) => open ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" /><line x1="1" y1="1" x2="23" y2="23" />
        </svg>
    ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
        </svg>
    );

    const strength = (() => {
        const p = form.password;
        if (!p) return 0;
        let s = 0;
        if (p.length >= 8) s++;
        if (/[A-Z]/.test(p)) s++;
        if (/[0-9]/.test(p)) s++;
        if (/[^A-Za-z0-9]/.test(p)) s++;
        return s;
    })();

    const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][strength];
    const strengthColor = ["", "#ef4444", "#f59e0b", "#10b981", "#06b6d4"][strength];

    return (
        <>
            <style>{`
        .register-container {
          position: relative;
          z-index: 2;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
        }

        .register-card {
          width: 100%;
          max-width: 460px;
          background: #ffffff;
          border-radius: 24px;
          padding: 48px;
          box-shadow: 0 20px 40px -8px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.02);
          border: 1px solid rgba(0,0,0,0.04);
          opacity: 0;
          transform: translateY(24px);
          animation: popIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .register-logo {
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

        .step-circle {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          font-weight: 700;
          transition: all 0.3s;
        }

        .step-active {
          background: #111827;
          color: white;
          box-shadow: 0 4px 12px rgba(17,24,39,0.15);
        }

        .step-inactive {
          background: #f3f4f6;
          color: #9ca3af;
          border: 1px solid rgba(0,0,0,0.05);
        }

        .step-line {
          width: 40px;
          height: 2px;
          transition: all 0.3s;
        }

        .step-line-active { background: #111827; }
        .step-line-inactive { background: #e5e7eb; }

        .form-group { animation: slideUpFade 0.5s ease both; }
        
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

            <div className="register-container">
                <div className="register-card" style={{ animationDelay: '0.1s' }}>

                    {/* Logo */}
                    <div className="register-logo">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
                        </svg>
                    </div>

                    {/* Step indicator */}
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "28px" }}>
                        {[1, 2].map(s => (
                            <div key={s} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                <div className={`step-circle ${step >= s ? "step-active" : "step-inactive"}`}>
                                    {s}
                                </div>
                                {s < 2 && <div className={`step-line ${step > s ? "step-line-active" : "step-line-inactive"}`} />}
                            </div>
                        ))}
                        <span style={{ marginLeft: "6px", fontSize: "14px", fontWeight: 600, color: "#6b7280" }}>
                            {step === 1 ? "Your info" : "Set password"}
                        </span>
                    </div>

                    <div style={{ marginBottom: "32px", animation: "slideUpFade 0.5s 0.1s ease both" }}>
                        <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#111827", letterSpacing: "-0.03em", marginBottom: "8px" }}>
                            {step === 1 ? "Create account" : "Secure your account"}
                        </h1>
                        <p style={{ fontSize: "15px", color: "#6b7280", fontWeight: 500 }}>
                            {step === 1 ? "Start organizing your work smarter." : "Choose a strong password."}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

                        {step === 1 && <>
                            <div className="form-group" style={{ animationDelay: "0.2s" }}>
                                <label className="tf-label">Full Name</label>
                                <input className="tf-input" type="text" placeholder="John Doe" value={form.name} onChange={set("name")} required />
                            </div>
                            <div className="form-group" style={{ animationDelay: "0.25s" }}>
                                <label className="tf-label">Email address</label>
                                <input className="tf-input" type="email" placeholder="you@example.com" value={form.email} onChange={set("email")} required />
                            </div>
                        </>}

                        {step === 2 && <>
                            <div className="form-group" style={{ animationDelay: "0.2s" }}>
                                <label className="tf-label">Password</label>
                                <div style={{ position: "relative" }}>
                                    <input className="tf-input" type={showPass ? "text" : "password"} placeholder="Min. 8 characters"
                                        value={form.password} onChange={set("password")} style={{ paddingRight: "48px" }} required />
                                    <button type="button" onClick={() => setShowPass(!showPass)} className="pass-toggle">
                                        <EyeIcon open={showPass} />
                                    </button>
                                </div>
                                {/* Strength bar */}
                                {form.password && (
                                    <div style={{ marginTop: "12px" }}>
                                        <div style={{ display: "flex", gap: "6px", marginBottom: "6px" }}>
                                            {[1, 2, 3, 4].map(i => (
                                                <div key={i} style={{
                                                    flex: 1, height: "4px", borderRadius: "4px", transition: "all 0.3s",
                                                    background: i <= strength ? strengthColor : "#e5e7eb",
                                                }} />
                                            ))}
                                        </div>
                                        <span style={{ fontSize: "12px", color: strengthColor, fontWeight: 600 }}>{strengthLabel}</span>
                                    </div>
                                )}
                            </div>
                            <div className="form-group" style={{ animationDelay: "0.25s" }}>
                                <label className="tf-label">Confirm Password</label>
                                <input className="tf-input" type="password" placeholder="Repeat password"
                                    value={form.confirm} onChange={set("confirm")}
                                    style={{ borderColor: form.confirm && form.confirm !== form.password ? "#ef4444" : undefined }}
                                    required />
                                {form.confirm && form.confirm !== form.password && (
                                    <p style={{ fontSize: "13px", color: "#ef4444", marginTop: "6px", fontWeight: 500 }}>Passwords don't match</p>
                                )}
                            </div>
                        </>}

                        <div className="form-group" style={{ marginTop: "8px", display: "flex", gap: "12px", animationDelay: "0.3s" }}>
                            {step === 2 && (
                                <button type="button" className="tf-btn-ghost" onClick={() => setStep(1)} style={{ padding: "14px 20px" }}>
                                    Back
                                </button>
                            )}
                            <button className="tf-btn-primary" type="submit" disabled={loading || (step === 2 && form.password !== form.confirm)} style={{ flex: 1, padding: "14px" }}>
                                {loading ? "Creating..." : step === 1 ? "Continue" : "Create Account"}
                            </button>
                        </div>
                    </form>

                    <p style={{ textAlign: "center", fontSize: "14px", color: "#6b7280", marginTop: "32px", animation: "slideUpFade 0.5s 0.4s ease both" }}>
                        Already have an account?{" "}
                        <Link to="/login" className="link-text">
                            Sign in
                        </Link>
                    </p>

                </div>
            </div>
        </>
    );
}
