import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { globalCSS } from "../theme";
import { AuthContext } from "../context/AuthContext";

const NAV = [
    { icon: "grid", label: "Dashboard", path: "/dashboard" },
    { icon: "check-square", label: "Tasks", path: "/dashboard/tasks" },
];

const Icon = ({ name, size = 16 }) => {
    const icons = {
        grid: <><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></>,
        "check-square": <><polyline points="9 11 12 14 22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" /></>,
        "bar-chart": <><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></>,
        settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" /></>,
        logout: <><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></>,
        chevron: <polyline points="15 18 9 12 15 6" />,
        menu: <><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></>,
    };
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            {icons[name]}
        </svg>
    );
};

export { Icon };

export default function Sidebar({ activePath = "/dashboard" }) {
    const [collapsed, setCollapsed] = useState(false);
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    }

    return (
        <>
            <style>{globalCSS}</style>
            <style>{`
        .sidebar { transition: width 0.3s cubic-bezier(0.16,1,0.3,1); }
        .sidebar-label { transition: opacity 0.2s, width 0.3s; white-space:nowrap; overflow:hidden; }
      `}</style>
            <aside className="sidebar" style={{
                width: collapsed ? 64 : 220,
                minHeight: "100vh",
                background: "rgba(6,9,20,0.9)",
                backdropFilter: "blur(20px)",
                borderRight: "1px solid rgba(255,255,255,0.06)",
                display: "flex", flexDirection: "column",
                padding: collapsed ? "20px 10px" : "20px 14px",
                position: "sticky", top: 0,
                zIndex: 10, flexShrink: 0,
            }}>

                {/* Logo + collapse */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: collapsed ? "center" : "space-between", marginBottom: "28px" }}>
                    {!collapsed && (
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <div style={{
                                width: 30, height: 30, borderRadius: "8px",
                                background: "linear-gradient(135deg,#6366f1,#06b6d4)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                boxShadow: "0 3px 10px rgba(99,102,241,0.4)", flexShrink: 0,
                            }}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                                    <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
                                </svg>
                            </div>
                            <span style={{ fontFamily: "'Syne',sans-serif", fontSize: "16px", fontWeight: 700, color: "#f1f5f9", letterSpacing: "-0.02em" }}>TaskFlow</span>
                        </div>
                    )}
                    <button onClick={() => setCollapsed(!collapsed)} style={{
                        background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)",
                        borderRadius: "8px", width: 28, height: 28, cursor: "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: "rgba(148,163,184,0.6)", transition: "all 0.2s", flexShrink: 0,
                    }}
                        onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "#f1f5f9"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = "rgba(148,163,184,0.6)"; }}
                    >
                        <Icon name={collapsed ? "menu" : "chevron"} size={14} />
                    </button>
                </div>

                {/* Nav */}
                <nav style={{ display: "flex", flexDirection: "column", gap: "4px", flex: 1 }}>
                    {!collapsed && (
                        <p style={{ fontSize: "10px", fontWeight: 600, color: "rgba(148,163,184,0.35)", letterSpacing: "0.1em", textTransform: "uppercase", padding: "0 6px", marginBottom: "6px" }}>
                            Menu
                        </p>
                    )}
                    {NAV.map(item => (
                        <Link key={item.path} to={item.path}
                            className={`nav-item ${activePath === item.path ? "active" : ""}`}
                            style={{ justifyContent: collapsed ? "center" : "flex-start", padding: collapsed ? "10px" : "10px 14px" }}
                            title={collapsed ? item.label : undefined}
                        >
                            <Icon name={item.icon} size={16} />
                            <span className="sidebar-label" style={{ opacity: collapsed ? 0 : 1, width: collapsed ? 0 : "auto" }}>
                                {item.label}
                            </span>
                            {!collapsed && activePath === item.path && (
                                <div style={{ marginLeft: "auto", width: 5, height: 5, borderRadius: "50%", background: "#818cf8" }} />
                            )}
                        </Link>
                    ))}
                </nav>

                {/* User */}
                {user && (
                    <div style={{ marginTop: "auto" }}>
                        <div className="divider" style={{ margin: "16px 0" }} />
                        {collapsed ? (
                            <div style={{
                                width: 34, height: 34, borderRadius: "50%", margin: "0 auto",
                                background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: "13px", fontWeight: 700, color: "white", fontFamily: "'Syne',sans-serif",
                            }}>{user.name?.[0]}</div>
                        ) : (
                            <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 10px", borderRadius: "12px", background: "rgba(255,255,255,0.03)" }}>
                                <div style={{
                                    width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
                                    background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    fontSize: "13px", fontWeight: 700, color: "white", fontFamily: "'Syne',sans-serif",
                                }}>{user.name?.[0]}</div>
                                <div style={{ flex: 1, overflow: "hidden" }}>
                                    <p style={{ fontSize: "13px", fontWeight: 500, color: "#f1f5f9", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user.name}</p>
                                    <p style={{ fontSize: "11px", color: "rgba(148,163,184,0.5)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user.email}</p>
                                </div>
                                <button onClick={handleLogout} style={{
                                    background: "none", border: "none", cursor: "pointer", color: "rgba(148,163,184,0.4)",
                                    display: "flex", alignItems: "center", transition: "color 0.2s", padding: "2px", flexShrink: 0,
                                }}
                                    onMouseEnter={e => e.currentTarget.style.color = "#ef4444"}
                                    onMouseLeave={e => e.currentTarget.style.color = "rgba(148,163,184,0.4)"}
                                    title="Sign out"
                                >
                                    <Icon name="logout" size={14} />
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </aside>
        </>
    );
}
