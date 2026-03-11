import { useState, useEffect, useContext } from "react";
import MeshBackground from "../components/MeshBackground";
import Sidebar, { Icon } from "../components/Sidebar";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

const priorityColors = { high: "#ef4444", medium: "#f59e0b", low: "#10b981" };
const statusColors = { "in progress": "#4f46e5", completed: "#059669", pending: "#6b7280" };
const statusBg = { "in progress": "#e0e7ff", completed: "#d1fae5", pending: "#f3f4f6" };

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
    { label: "Total Tasks", value: total, delta: "Overall recorded", color: "#3b82f6", icon: "check-square" },
    { label: "Pending", value: pending, delta: "Needs attention", color: "#f59e0b", icon: "bar-chart" },
    { label: "Completed", value: completed, delta: `${progress}% completion`, color: "#10b981", icon: "grid" },
    { label: "Overdue", value: 0, delta: "Tracking coming soon", color: "#ef4444", icon: "settings" },
  ];

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <>
      <style>{`
        .stat-num { font-size:32px; font-weight:800; color:#111827; letter-spacing:-0.03em; }
        .page-enter { opacity:0; transform:translateY(16px); }
        .page-enter-done { opacity:1; transform:translateY(0); transition:all 0.5s cubic-bezier(0.16,1,0.3,1); }
      `}</style>
      <MeshBackground />

      <div style={{ position: "relative", zIndex: 2, display: "flex", minHeight: "100vh" }}>
        <Sidebar activePath="/dashboard" />

        {/* Main */}
        <main style={{
          flex: 1, padding: "40px 48px", overflow: "auto",
          opacity: mounted ? 1 : 0, transform: mounted ? "none" : "translateY(16px)",
          transition: "all 0.5s cubic-bezier(0.16,1,0.3,1)",
        }}>

          {/* Header */}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "40px" }}>
            <div>
              <p style={{ fontSize: "13px", color: "#6b7280", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "6px", fontWeight: 600 }}>
                {today}
              </p>
              <h1 style={{ fontSize: "32px", fontWeight: 800, color: "#111827", letterSpacing: "-0.03em" }}>
                Good morning, {user?.name?.split(' ')[0]} 👋
              </h1>
              <p style={{ fontSize: "15px", color: "#6b7280", marginTop: "6px", fontWeight: 500 }}>
                You have {pending} tasks pending. Let's get them done.
              </p>
            </div>
            <Link to="/dashboard/tasks" className="tf-btn-primary" style={{
              textDecoration: "none", display: "flex", alignItems: "center", gap: "8px",
              padding: "12px 20px", animation: "slideUpFade 0.4s 0.2s ease both",
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
              View Tasks
            </Link>
          </div>

          {/* Stats grid */}
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "20px", marginBottom: "32px",
          }}>
            {STATS.map((s, i) => (
              <div key={i} className="stat-card" style={{ animation: `slideUpFade 0.4s ${i * 0.07}s ease both` }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                  <p style={{ fontSize: "13px", color: "#6b7280", fontWeight: 600, letterSpacing: "0.02em" }}>{s.label}</p>
                  <div style={{
                    width: 36, height: 36, borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center",
                    background: `${s.color}15`, color: s.color,
                  }}>
                    <Icon name={s.icon} size={16} />
                  </div>
                </div>
                <p className="stat-num">{s.value}</p>
                <p style={{ fontSize: "13px", color: "#9ca3af", marginTop: "6px", fontWeight: 500 }}>{s.delta}</p>
              </div>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: "24px" }}>
            {/* Progress bar */}
            <div className="tf-card" style={{ animation: "slideUpFade 0.4s 0.3s ease both" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <div>
                  <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#111827", marginBottom: "4px" }}>Overall Progress</h3>
                  <p style={{ fontSize: "13px", color: "#6b7280" }}>{completed} of {total} tasks completed</p>
                </div>
                <span style={{ fontSize: "24px", fontWeight: 800, color: "#10b981" }}>{progress}%</span>
              </div>
              <div style={{ background: "#f3f4f6", borderRadius: "99px", height: "10px", overflow: "hidden" }}>
                <div style={{
                  width: `${progress}%`, height: "100%", borderRadius: "99px",
                  background: "linear-gradient(90deg, #3b82f6, #10b981)",
                  transition: "width 1s cubic-bezier(0.16,1,0.3,1)",
                }} />
              </div>
              <div style={{ display: "flex", gap: "24px", marginTop: "20px" }}>
                {[
                  { label: "Pending", count: pending, color: "#9ca3af" },
                  { label: "Completed", count: completed, color: "#10b981" },
                ].map(l => (
                  <div key={l.label} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: l.color }} />
                    <span style={{ fontSize: "13px", color: "#6b7280", fontWeight: 500 }}>{l.label}</span>
                    <span style={{ fontSize: "13px", fontWeight: 700, color: "#111827" }}>{l.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent tasks */}
            <div className="tf-card" style={{ animation: "slideUpFade 0.4s 0.38s ease both" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#111827" }}>Recent Tasks</h3>
                <Link to="/dashboard/tasks" style={{ fontSize: "13px", color: "#3b82f6", textDecoration: "none", fontWeight: 600 }}
                  onMouseEnter={e => e.target.style.opacity = "0.8"} onMouseLeave={e => e.target.style.opacity = "1"}
                >View all →</Link>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {recentTasks.length === 0 ? (
                  <div style={{ padding: "32px", textAlign: "center", background: "#f9fafb", borderRadius: "12px", border: "1px dashed #e5e7eb" }}>
                    <p style={{ color: "#6b7280", fontSize: "14px", fontWeight: 500 }}>No tasks found.</p>
                  </div>
                ) : recentTasks.map((t, i) => (
                  <div key={t._id} className="tf-task-row" style={{ animation: `slideUpFade 0.3s ${0.1 + i * 0.06}s ease both` }}>
                    <div style={{
                      width: 4, alignSelf: "stretch", borderRadius: "10px",
                      background: priorityColors[t.priority?.toLowerCase()] || priorityColors.medium, flexShrink: 0,
                    }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: "14px", color: "#111827", fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t.title}</p>
                      <p style={{ fontSize: "12px", color: "#6b7280", marginTop: "4px", fontWeight: 500 }}>
                        {t.dueDate ? `Due: ${new Date(t.dueDate).toLocaleDateString()}` : "No due date"}
                      </p>
                    </div>
                    <span className="tf-badge" style={{ background: statusBg[t.status?.toLowerCase()] || statusBg.pending, color: statusColors[t.status?.toLowerCase()] || statusColors.pending, flexShrink: 0 }}>
                      {t.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </main>
      </div>
    </>
  );
}