import { useState, useEffect, useContext } from "react";
import MeshBackground from "../components/MeshBackground";
import Sidebar, { Icon } from "../components/Sidebar";
import { globalCSS } from "../theme";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

const priorityColors = { high: "#ef4444", medium: "#f59e0b", low: "#10b981" };
const statusColors = { "in progress": "#6366f1", completed: "#10b981", pending: "rgba(148,163,184,0.5)" };
const statusBg = { "in progress": "rgba(99,102,241,0.12)", completed: "rgba(16,185,129,0.1)", pending: "rgba(148,163,184,0.08)" };

export default function Dashboard() {
  const [mounted, setMounted] = useState(false);
  const [stats, setStats] = useState(null);
  const [recentTasks, setRecentTasks] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    setTimeout(() => setMounted(true), 50);
    const fetchData = async () => {
      try {
        const [statsRes, tasksRes] = await Promise.all([
          API.get("/tasks/stats"),
          API.get("/tasks", { params: { limit: 5 } })
        ]);
        setStats(statsRes.data);
        setRecentTasks(tasksRes.data.tasks || []);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      }
    };
    fetchData();
  }, []);

  const total = stats?.totalTasks || 0;
  const completed = stats?.completedTasks || 0;
  const pending = stats?.pendingTasks || 0;
  const progress = stats?.completionRate || 0;

  const STATS = [
    { label: "Total Tasks", value: total, delta: "Overall recorded", color: "#6366f1", icon: "check-square" },
    { label: "Pending", value: pending, delta: "Needs attention", color: "#f59e0b", icon: "bar-chart" },
    { label: "Completed", value: completed, delta: `${progress}% completion`, color: "#10b981", icon: "grid" },
    { label: "Overdue", value: 0, delta: "Tracking coming soon", color: "#ef4444", icon: "settings" },
  ];

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <>
      <style>{globalCSS + `
        .stat-num { font-family:'Syne',sans-serif; font-size:30px; font-weight:800; color:#f8fafc; letter-spacing:-0.03em; }
        .page-enter { opacity:0; transform:translateY(16px); }
        .page-enter-done { opacity:1; transform:translateY(0); transition:all 0.5s cubic-bezier(0.16,1,0.3,1); }
      `}</style>
      <MeshBackground />

      <div style={{ position: "relative", zIndex: 2, display: "flex", minHeight: "100vh" }}>
        <Sidebar activePath="/dashboard" />

        {/* Main */}
        <main style={{
          flex: 1, padding: "32px 36px", overflow: "auto",
          opacity: mounted ? 1 : 0, transform: mounted ? "none" : "translateY(16px)",
          transition: "all 0.5s cubic-bezier(0.16,1,0.3,1)",
        }}>

          {/* Header */}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "32px" }}>
            <div>
              <p style={{ fontSize: "12px", color: "rgba(148,163,184,0.5)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "4px" }}>
                {today}
              </p>
              <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: "28px", fontWeight: 800, color: "#f8fafc", letterSpacing: "-0.03em" }}>
                Good morning, {user?.name?.split(' ')[0]} 👋
              </h1>
              <p style={{ fontSize: "14px", color: "rgba(148,163,184,0.6)", marginTop: "4px", fontWeight: 300 }}>
                You have {pending} tasks pending. Let's get them done.
              </p>
            </div>
            <Link to="/dashboard/tasks" className="tf-btn-primary" style={{
              textDecoration: "none", display: "flex", alignItems: "center", gap: "8px",
              padding: "10px 18px", animation: "slideUp 0.4s 0.2s ease both",
            }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
              View Tasks
            </Link>
          </div>

          {/* Stats grid */}
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "16px", marginBottom: "28px",
          }}>
            {STATS.map((s, i) => (
              <div key={i} className="stat-card" style={{ animation: `slideUp 0.4s ${i * 0.07}s ease both` }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
                  <p style={{ fontSize: "12px", color: "rgba(148,163,184,0.6)", fontWeight: 500, letterSpacing: "0.03em" }}>{s.label}</p>
                  <div style={{
                    width: 32, height: 32, borderRadius: "9px", display: "flex", alignItems: "center", justifyContent: "center",
                    background: `${s.color}18`, color: s.color,
                  }}>
                    <Icon name={s.icon} size={14} />
                  </div>
                </div>
                <p className="stat-num">{s.value}</p>
                <p style={{ fontSize: "12px", color: "rgba(148,163,184,0.45)", marginTop: "4px" }}>{s.delta}</p>
              </div>
            ))}
          </div>

          {/* Progress bar */}
          <div className="tf-card" style={{ padding: "24px", marginBottom: "24px", animation: "slideUp 0.4s 0.3s ease both" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
              <div>
                <h3 style={{ fontFamily: "'Syne',sans-serif", fontSize: "15px", fontWeight: 700, color: "#f1f5f9", marginBottom: "2px" }}>Overall Progress</h3>
                <p style={{ fontSize: "12px", color: "rgba(148,163,184,0.5)" }}>{completed} of {total} tasks completed</p>
              </div>
              <span style={{ fontFamily: "'Syne',sans-serif", fontSize: "22px", fontWeight: 800, color: "#10b981" }}>{progress}%</span>
            </div>
            <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: "99px", height: "8px", overflow: "hidden" }}>
              <div style={{
                width: `${progress}%`, height: "100%", borderRadius: "99px",
                background: "linear-gradient(90deg,#6366f1,#10b981)",
                boxShadow: "0 0 12px rgba(16,185,129,0.4)",
                transition: "width 1s cubic-bezier(0.16,1,0.3,1)",
              }} />
            </div>
            <div style={{ display: "flex", gap: "20px", marginTop: "14px" }}>
              {[
                { label: "Pending", count: pending, color: "rgba(148,163,184,0.4)" },
                { label: "Completed", count: completed, color: "#10b981" },
              ].map(l => (
                <div key={l.label} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <div style={{ width: 7, height: 7, borderRadius: "50%", background: l.color }} />
                  <span style={{ fontSize: "12px", color: "rgba(148,163,184,0.6)" }}>{l.label}</span>
                  <span style={{ fontSize: "12px", fontWeight: 600, color: "rgba(148,163,184,0.8)" }}>{l.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent tasks */}
          <div className="tf-card" style={{ padding: "24px", animation: "slideUp 0.4s 0.38s ease both" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
              <h3 style={{ fontFamily: "'Syne',sans-serif", fontSize: "15px", fontWeight: 700, color: "#f1f5f9" }}>Recent Tasks</h3>
              <Link to="/dashboard/tasks" style={{ fontSize: "12px", color: "#818cf8", textDecoration: "none", fontWeight: 500 }}
                onMouseEnter={e => e.target.style.color = "#a5b4fc"} onMouseLeave={e => e.target.style.color = "#818cf8"}
              >View all →</Link>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {recentTasks.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)' }}>No tasks found.</p>
              ) : recentTasks.map((t, i) => (
                <div key={t._id} className="task-row" style={{ animation: `slideUp 0.3s ${0.1 + i * 0.06}s ease both` }}>
                  <div style={{
                    width: 3, alignSelf: "stretch", borderRadius: "2px",
                    background: priorityColors[t.priority?.toLowerCase()] || priorityColors.medium, flexShrink: 0,
                  }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: "14px", color: "#e2e8f0", fontWeight: 400, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t.title}</p>
                    <p style={{ fontSize: "11px", color: "rgba(148,163,184,0.45)", marginTop: "2px" }}>
                      {t.dueDate ? `Due: ${new Date(t.dueDate).toLocaleDateString()}` : "No due date"}
                    </p>
                  </div>
                  <span className="badge" style={{ background: statusBg[t.status?.toLowerCase()] || statusBg.pending, color: statusColors[t.status?.toLowerCase()] || statusColors.pending, flexShrink: 0 }}>
                    {t.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </main>
      </div>
    </>
  );
}