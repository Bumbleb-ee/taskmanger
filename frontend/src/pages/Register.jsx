import { useState, useEffect, useContext } from "react";
import MeshBackground from "../components/MeshBackground";
import { globalCSS } from "../theme";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
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
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" /><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" /><line x1="1" y1="1" x2="23" y2="23" />
        </svg>
    ) : (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
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
            <style>{globalCSS}</style>
            <MeshBackground />

            <div style={{
                position: "relative", zIndex: 2, minHeight: "100vh",
                display: "flex", alignItems: "center", justifyContent: "center", padding: "24px",
            }}>
                <div style={{
                    width: "100%", maxWidth: "420px",
                    opacity: mounted ? 1 : 0,
                    transform: mounted ? "translateY(0)" : "translateY(24px)",
                    transition: "all 0.6s cubic-bezier(0.16,1,0.3,1)",
                }}>

                    {/* Glow border */}
                    <div style={{
                        position: "absolute", inset: "-1px", borderRadius: "25px",
                        background: "linear-gradient(135deg,rgba(99,102,241,0.3),rgba(6,182,212,0.15),rgba(139,92,246,0.3))",
                        zIndex: -1, filter: "blur(1px)",
                    }} />

                    <div className="tf-card" style={{ padding: "40px" }}>

                        {/* Logo */}
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "28px" }}>
                            <div style={{
                                width: 36, height: 36, borderRadius: "10px",
                                background: "linear-gradient(135deg,#6366f1,#06b6d4)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                boxShadow: "0 4px 14px rgba(99,102,241,0.4)",
                            }}>
                                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
                                </svg>
                            </div>
                            <span style={{ fontFamily: "'Syne',sans-serif", fontSize: "19px", fontWeight: 700, color: "#f1f5f9", letterSpacing: "-0.02em" }}>
                                TaskFlow
                            </span>
                        </div>

                        {/* Step indicator */}
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "24px" }}>
                            {[1, 2].map(s => (
                                <div key={s} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                    <div style={{
                                        width: 24, height: 24, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                                        fontSize: "11px", fontWeight: 700, fontFamily: "'Syne',sans-serif",
                                        background: step >= s ? "linear-gradient(135deg,#6366f1,#8b5cf6)" : "rgba(255,255,255,0.06)",
                                        color: step >= s ? "white" : "rgba(148,163,184,0.5)",
                                        transition: "all 0.3s",
                                        boxShadow: step >= s ? "0 2px 10px rgba(99,102,241,0.4)" : "none",
                                    }}>{s}</div>
                                    {s < 2 && <div style={{ width: 32, height: 1, background: step > s ? "rgba(99,102,241,0.5)" : "rgba(255,255,255,0.08)", transition: "all 0.3s" }} />}
                                </div>
                            ))}
                            <span style={{ marginLeft: "4px", fontSize: "12px", color: "rgba(148,163,184,0.5)" }}>
                                {step === 1 ? "Your info" : "Set password"}
                            </span>
                        </div>

                        <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: "24px", fontWeight: 800, color: "#f8fafc", letterSpacing: "-0.03em", marginBottom: "4px" }}>
                            {step === 1 ? "Create account" : "Secure your account"}
                        </h1>
                        <p style={{ fontSize: "13px", color: "rgba(148,163,184,0.7)", marginBottom: "28px", fontWeight: 300 }}>
                            {step === 1 ? "Start organizing your work smarter" : "Choose a strong password"}
                        </p>

                        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>

                            {step === 1 && <>
                                <div style={{ animation: "slideUp 0.4s ease both" }}>
                                    <label className="tf-label">Full Name</label>
                                    <input className="tf-input" type="text" placeholder="Your name" value={form.name} onChange={set("name")} required />
                                </div>
                                <div style={{ animation: "slideUp 0.4s 0.07s ease both" }}>
                                    <label className="tf-label">Email address</label>
                                    <input className="tf-input" type="email" placeholder="you@example.com" value={form.email} onChange={set("email")} required />
                                </div>
                            </>}

                            {step === 2 && <>
                                <div style={{ animation: "slideUp 0.4s ease both" }}>
                                    <label className="tf-label">Password</label>
                                    <div style={{ position: "relative" }}>
                                        <input className="tf-input" type={showPass ? "text" : "password"} placeholder="Min. 8 characters"
                                            value={form.password} onChange={set("password")} style={{ paddingRight: "44px" }} required />
                                        <button type="button" onClick={() => setShowPass(!showPass)} style={{
                                            position: "absolute", right: "13px", top: "50%", transform: "translateY(-50%)",
                                            background: "none", border: "none", cursor: "pointer", color: "rgba(148,163,184,0.5)",
                                            display: "flex", alignItems: "center", transition: "color 0.2s",
                                        }}
                                            onMouseEnter={e => e.currentTarget.style.color = "#818cf8"}
                                            onMouseLeave={e => e.currentTarget.style.color = "rgba(148,163,184,0.5)"}
                                        ><EyeIcon open={showPass} /></button>
                                    </div>
                                    {/* Strength bar */}
                                    {form.password && (
                                        <div style={{ marginTop: "8px" }}>
                                            <div style={{ display: "flex", gap: "4px", marginBottom: "4px" }}>
                                                {[1, 2, 3, 4].map(i => (
                                                    <div key={i} style={{
                                                        flex: 1, height: "3px", borderRadius: "2px", transition: "all 0.3s",
                                                        background: i <= strength ? strengthColor : "rgba(255,255,255,0.08)",
                                                    }} />
                                                ))}
                                            </div>
                                            <span style={{ fontSize: "11px", color: strengthColor, fontWeight: 500 }}>{strengthLabel}</span>
                                        </div>
                                    )}
                                </div>
                                <div style={{ animation: "slideUp 0.4s 0.07s ease both" }}>
                                    <label className="tf-label">Confirm Password</label>
                                    <input className="tf-input" type="password" placeholder="Repeat password"
                                        value={form.confirm} onChange={set("confirm")}
                                        style={{ borderColor: form.confirm && form.confirm !== form.password ? "rgba(239,68,68,0.5)" : undefined }}
                                        required />
                                    {form.confirm && form.confirm !== form.password && (
                                        <p style={{ fontSize: "12px", color: "#ef4444", marginTop: "5px" }}>Passwords don't match</p>
                                    )}
                                </div>
                            </>}

                            <div style={{ marginTop: "6px", display: "flex", gap: "10px" }}>
                                {step === 2 && (
                                    <button type="button" className="tf-btn-ghost" onClick={() => setStep(1)} style={{ flex: "0 0 auto" }}>
                                        ← Back
                                    </button>
                                )}
                                <button className="tf-btn-primary" type="submit" disabled={loading} style={{ flex: 1 }}>
                                    {loading ? (
                                        <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" style={{ animation: "spin 0.8s linear infinite" }}>
                                                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                                            </svg>
                                            Creating account...
                                        </span>
                                    ) : step === 1 ? "Continue →" : "Create Account →"}
                                </button>
                            </div>
                        </form>

                        <div className="divider" />
                        <p style={{ textAlign: "center", fontSize: "13px", color: "rgba(148,163,184,0.6)" }}>
                            Already have an account?{" "}
                            <a href="/login" style={{ color: "#818cf8", fontWeight: 500, textDecoration: "none", borderBottom: "1px solid rgba(129,140,248,0.3)", paddingBottom: "1px" }}
                                onMouseEnter={e => { e.target.style.color = "#a5b4fc" }} onMouseLeave={e => { e.target.style.color = "#818cf8" }}
                            >Sign in</a>
                        </p>

                    </div>
                </div>
            </div>
        </>
    );
}
