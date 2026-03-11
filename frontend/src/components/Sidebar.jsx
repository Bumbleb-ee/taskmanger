import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
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
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
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
            <style>{`
              .sidebar { transition: width 0.3s cubic-bezier(0.16,1,0.3,1); }
              .sidebar-label { transition: opacity 0.2s, width 0.3s; white-space:nowrap; overflow:hidden; }
              
              .collapse-btn {
                background: #ffffff;
                border: 1px solid rgba(0,0,0,0.08);
                border-radius: 8px;
                width: 32px; height: 32px;
                cursor: pointer;
                display: flex; align-items: center; justify-content: center;
                color: #6b7280;
                transition: all 0.2s;
                box-shadow: 0 1px 2px rgba(0,0,0,0.04);
              }
              .collapse-btn:hover { background: #f9fafb; color: #111827; border-color: rgba(0,0,0,0.15); }
            `}</style>

            <aside className="sidebar" style={{
                width: collapsed ? 80 : 250,
                minHeight: "100vh",
                background: "#ffffff",
                borderRight: "1px solid rgba(0,0,0,0.06)",
                display: "flex", flexDirection: "column",
                padding: collapsed ? "24px 16px" : "24px 20px",
                position: "sticky", top: 0,
                zIndex: 10, flexShrink: 0,
            }}>

                {/* Logo + collapse */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: collapsed ? "center" : "space-between", marginBottom: "40px" }}>
                    {!collapsed && (
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <div style={{
                                width: 34, height: 34, borderRadius: "10px",
                                background: "#111827",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                flexShrink: 0,
                                boxShadow: "0 4px 8px -2px rgba(17,24,39,0.2)"
                            }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                                    <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
                                </svg>
                            </div>
                            <span style={{ fontSize: "17px", fontWeight: 800, color: "#111827", letterSpacing: "-0.02em" }}>TaskFlow</span>
                        </div>
                    )}
                    <button onClick={() => setCollapsed(!collapsed)} className="collapse-btn" style={{ flexShrink: 0 }}>
                        <Icon name={collapsed ? "menu" : "chevron"} size={16} />
                    </button>
                </div>

                {/* Nav */}
                <nav style={{ display: "flex", flexDirection: "column", gap: "6px", flex: 1 }}>
                    {!collapsed && (
                        <p style={{ fontSize: "11px", fontWeight: 700, color: "#9ca3af", letterSpacing: "0.06em", textTransform: "uppercase", padding: "0 10px", marginBottom: "8px" }}>
                            Main Menu
                        </p>
                    )}
                    {NAV.map(item => {
                        const isActive = activePath === item.path;
                        return (
                            <Link key={item.path} to={item.path}
                                className={`nav-item ${isActive ? "active" : ""}`}
                                style={{
                                    justifyContent: collapsed ? "center" : "flex-start",
                                    padding: collapsed ? "12px" : "12px 16px"
                                }}
                                title={collapsed ? item.label : undefined}
                            >
                                <Icon name={item.icon} size={18} />
                                <span className="sidebar-label" style={{ opacity: collapsed ? 0 : 1, width: collapsed ? 0 : "auto" }}>
                                    {item.label}
                                </span>
                            </Link>
                        )
                    })}
                </nav>

                {/* User */}
                {user && (
                    <div style={{ marginTop: "auto" }}>
                        <div className="divider" style={{ margin: "24px 0" }} />
                        {collapsed ? (
                            <div style={{
                                width: 40, height: 40, borderRadius: "50%", margin: "0 auto",
                                background: "#f3f4f6", border: "1px solid rgba(0,0,0,0.08)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: "15px", fontWeight: 800, color: "#111827",
                            }}>{user.name?.[0]}</div>
                        ) : (
                            <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px", borderRadius: "16px", background: "#f9fafb", border: "1px solid rgba(0,0,0,0.04)" }}>
                                <div style={{
                                    width: 38, height: 38, borderRadius: "50%", flexShrink: 0,
                                    background: "#e5e7eb",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    fontSize: "14px", fontWeight: 800, color: "#111827",
                                }}>{user.name?.[0]}</div>
                                <div style={{ flex: 1, overflow: "hidden" }}>
                                    <p style={{ fontSize: "14px", fontWeight: 600, color: "#111827", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user.name}</p>
                                    <p style={{ fontSize: "12px", color: "#6b7280", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user.email}</p>
                                </div>
                                <button onClick={handleLogout} style={{
                                    background: "none", border: "none", cursor: "pointer", color: "#9ca3af",
                                    display: "flex", alignItems: "center", transition: "color 0.2s", padding: "4px", flexShrink: 0,
                                }}
                                    onMouseEnter={e => e.currentTarget.style.color = "#ef4444"}
                                    onMouseLeave={e => e.currentTarget.style.color = "#9ca3af"}
                                    title="Sign out"
                                >
                                    <Icon name="logout" size={16} />
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </aside>
        </>
    );
}
