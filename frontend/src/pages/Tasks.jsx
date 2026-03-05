import { useState, useEffect, useCallback } from "react";
import MeshBackground from "../components/MeshBackground";
import Sidebar, { Icon } from "../components/Sidebar";
import { globalCSS } from "../theme";
import API from "../api/axios";

const PRI_COLOR = { high: "#ef4444", medium: "#f59e0b", low: "#10b981" };
const PRI_BG = { high: "rgba(239,68,68,0.1)", medium: "rgba(245,158,11,0.1)", low: "rgba(16,185,129,0.1)" };
const STS_COLOR = { "in progress": "#6366f1", completed: "#10b981", pending: "rgba(148,163,184,0.6)" };
const STS_BG = { "in progress": "rgba(99,102,241,0.12)", completed: "rgba(16,185,129,0.1)", pending: "rgba(148,163,184,0.07)" };

function TaskModal({ task, onClose, onSave }) {
    const [form, setForm] = useState(task || { title: "", description: "", priority: "medium", status: "pending", due: "" });
    const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));
    const isEdit = !!task?._id;

    // Format date if editing
    useEffect(() => {
        if (task?.dueDate) {
            setForm(f => ({ ...f, due: new Date(task.dueDate).toISOString().split('T')[0] }));
        }
    }, [task]);

    const handleSubmit = () => {
        const submitData = {
            title: form.title,
            description: form.description,
            priority: form.priority.toLowerCase(),
            status: form.status.toLowerCase(),
            dueDate: form.due || undefined
        };
        if (isEdit) submitData._id = task._id;
        onSave(submitData);
    };

    return (
        <div style={{
            position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center",
            background: "rgba(2,8,23,0.8)", backdropFilter: "blur(8px)", padding: "20px",
            animation: "fadeIn 0.2s ease",
        }} onClick={e => e.target === e.currentTarget && onClose()}>
            <div className="tf-card" style={{
                width: "100%", maxWidth: "480px", padding: "32px",
                animation: "slideUp 0.3s cubic-bezier(0.16,1,0.3,1)",
                border: "1px solid rgba(99,102,241,0.2)",
            }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                    <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: "18px", fontWeight: 700, color: "#f8fafc" }}>
                        {isEdit ? "Edit Task" : "New Task"}
                    </h2>
                    <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(148,163,184,0.5)", display: "flex" }}
                        onMouseEnter={e => e.currentTarget.style.color = "#f1f5f9"} onMouseLeave={e => e.currentTarget.style.color = "rgba(148,163,184,0.5)"}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                    </button>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                    <div>
                        <label className="tf-label">Task Title</label>
                        <input className="tf-input" value={form.title} onChange={set("title")} placeholder="What needs to be done?" />
                    </div>
                    <div>
                        <label className="tf-label">Description</label>
                        <textarea className="tf-input" value={form.description} onChange={set("description")} placeholder="Add details..."
                            style={{ resize: "vertical", minHeight: "80px", lineHeight: "1.5" }} />
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                        <div>
                            <label className="tf-label">Priority</label>
                            <select className="tf-input" value={form.priority} onChange={set("priority")} style={{ cursor: "pointer", textTransform: "capitalize" }}>
                                <option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option>
                            </select>
                        </div>
                        <div>
                            <label className="tf-label">Status</label>
                            <select className="tf-input" value={form.status} onChange={set("status")} style={{ cursor: "pointer", textTransform: "capitalize" }}>
                                <option value="pending">Pending</option><option value="completed">Completed</option>
                            </select>
                        </div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "12px" }}>
                        <div>
                            <label className="tf-label">Due Date</label>
                            <input className="tf-input" type="date" value={form.due} onChange={set("due")} />
                        </div>
                    </div>
                </div>

                <div style={{ display: "flex", gap: "10px", marginTop: "24px" }}>
                    <button className="tf-btn-ghost" onClick={onClose} style={{ flex: 1 }}>Cancel</button>
                    <button className="tf-btn-primary" onClick={handleSubmit} style={{ flex: 2 }}>
                        {isEdit ? "Save Changes" : "Create Task"} →
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function Tasks() {
    const [tasks, setTasks] = useState([]);
    const [search, setSearch] = useState("");
    const [searchSubmit, setSearchSubmit] = useState("");
    const [filterStatus, setFilterStatus] = useState("All");
    const [filterPriority, setFilterPriority] = useState("All");
    const [modal, setModal] = useState(null); // null | "new" | task object
    const [mounted, setMounted] = useState(false);

    const fetchTasks = useCallback(async () => {
        try {
            const { data } = await API.get("/tasks", {
                params: {
                    search: searchSubmit,
                    status: filterStatus === "All" ? "" : filterStatus.toLowerCase(),
                    priority: filterPriority === "All" ? "" : filterPriority.toLowerCase(),
                    limit: 50 // simplistic
                }
            });
            setTasks(data.tasks);
        } catch (err) {
            console.error(err);
        }
    }, [searchSubmit, filterStatus, filterPriority]);

    useEffect(() => {
        setTimeout(() => setMounted(true), 50);
        fetchTasks();
    }, [fetchTasks]);

    const saveTask = async (form) => {
        try {
            if (form._id) {
                await API.put(`/tasks/${form._id}`, form);
            } else {
                await API.post(`/tasks`, form);
            }
            setModal(null);
            fetchTasks();
        } catch (err) {
            console.error(err);
            alert("Error saving task");
        }
    };

    const deleteTask = async (id) => {
        if (!window.confirm("Delete this task?")) return;
        try {
            await API.delete(`/tasks/${id}`);
            fetchTasks();
        } catch (err) {
            console.error(err);
        }
    };

    const toggleStatus = async (id) => {
        const task = tasks.find(t => t._id === id);
        if (!task) return;
        const newStatus = task.status === "completed" ? "pending" : "completed";

        // Optimistic update
        setTasks(ts => ts.map(t => t._id === id ? { ...t, status: newStatus } : t));

        try {
            await API.put(`/tasks/${id}`, { status: newStatus });
        } catch (err) {
            console.error(err);
            fetchTasks(); // revert on error
        }
    };

    const FilterBtn = ({ label, active, onClick }) => (
        <button onClick={onClick} style={{
            padding: "6px 14px", borderRadius: "8px", border: "none", cursor: "pointer", fontSize: "12px", fontWeight: 500,
            fontFamily: "'DM Sans',sans-serif", transition: "all 0.2s",
            background: active ? "rgba(99,102,241,0.2)" : "rgba(255,255,255,0.04)",
            color: active ? "#818cf8" : "rgba(148,163,184,0.6)",
            border: active ? "1px solid rgba(99,102,241,0.3)" : "1px solid rgba(255,255,255,0.06)",
        }}>{label}</button>
    );

    return (
        <>
            <style>{globalCSS}</style>
            <MeshBackground />
            {modal && <TaskModal task={modal === "new" ? null : modal} onClose={() => setModal(null)} onSave={saveTask} />}

            <div style={{ position: "relative", zIndex: 2, display: "flex", minHeight: "100vh" }}>
                <Sidebar activePath="/dashboard/tasks" />

                <main style={{
                    flex: 1, padding: "32px 36px", overflow: "auto",
                    opacity: mounted ? 1 : 0, transform: mounted ? "none" : "translateY(16px)",
                    transition: "all 0.5s cubic-bezier(0.16,1,0.3,1)",
                }}>

                    {/* Header */}
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "28px" }}>
                        <div>
                            <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: "26px", fontWeight: 800, color: "#f8fafc", letterSpacing: "-0.03em" }}>Tasks</h1>
                            <p style={{ fontSize: "13px", color: "rgba(148,163,184,0.55)", marginTop: "3px" }}>{tasks.length} total · {tasks.filter(t => t.status === "completed").length} completed</p>
                        </div>
                        <button className="tf-btn-primary" onClick={() => setModal("new")} style={{ display: "flex", alignItems: "center", gap: "7px", padding: "10px 18px" }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                            New Task
                        </button>
                    </div>

                    {/* Filters */}
                    <div className="tf-card" style={{ padding: "16px 20px", marginBottom: "20px", display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                        <form onSubmit={e => { e.preventDefault(); setSearchSubmit(search); }} style={{ position: "relative", flex: "1", minWidth: "200px" }}>
                            <svg onClick={() => setSearchSubmit(search)} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "rgba(148,163,184,0.4)", cursor: "pointer" }}>
                                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                            </svg>
                            <input className="tf-input" placeholder="Search tasks... (Hit Enter)" value={search} onChange={e => setSearch(e.target.value)}
                                style={{ paddingLeft: "36px", borderRadius: "9px" }} />
                        </form>
                        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                            {["All", "Pending", "Completed"].map(s => (
                                <FilterBtn key={s} label={s} active={filterStatus === s} onClick={() => setFilterStatus(s)} />
                            ))}
                        </div>
                        <div style={{ display: "flex", gap: "6px" }}>
                            {["All", "High", "Medium", "Low"].map(p => (
                                <FilterBtn key={p} label={p} active={filterPriority === p} onClick={() => setFilterPriority(p)} />
                            ))}
                        </div>
                    </div>

                    {/* Task list */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        {tasks.length === 0 && (
                            <div style={{ textAlign: "center", padding: "60px 20px", color: "rgba(148,163,184,0.4)" }}>
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={{ margin: "0 auto 12px", display: "block" }}>
                                    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                                </svg>
                                <p style={{ fontSize: "14px" }}>No tasks found</p>
                            </div>
                        )}
                        {tasks.map((t, i) => {
                            const pColor = PRI_COLOR[t.priority?.toLowerCase()] || PRI_COLOR.medium;
                            const pBg = PRI_BG[t.priority?.toLowerCase()] || PRI_BG.medium;
                            const sColor = STS_COLOR[t.status?.toLowerCase()] || STS_COLOR.pending;
                            const sBg = STS_BG[t.status?.toLowerCase()] || STS_BG.pending;

                            return (
                                <div key={t._id} className="task-row" style={{ animation: `slideUp 0.3s ${i * 0.04}s ease both` }}>
                                    {/* Priority stripe */}
                                    <div style={{ width: 3, alignSelf: "stretch", borderRadius: "2px", background: pColor, flexShrink: 0 }} />

                                    {/* Checkbox */}
                                    <button onClick={() => toggleStatus(t._id)} style={{
                                        width: 20, height: 20, borderRadius: "6px", flexShrink: 0, cursor: "pointer",
                                        border: `1.5px solid ${t.status === "completed" ? "#10b981" : "rgba(148,163,184,0.25)"}`,
                                        background: t.status === "completed" ? "rgba(16,185,129,0.15)" : "transparent",
                                        display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s",
                                    }}>
                                        {t.status === "completed" && (
                                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>
                                        )}
                                    </button>

                                    {/* Content */}
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <p style={{
                                            fontSize: "14px", color: t.status === "completed" ? "rgba(148,163,184,0.4)" : "#e2e8f0",
                                            textDecoration: t.status === "completed" ? "line-through" : "none",
                                            fontWeight: 400, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                                        }}>{t.title}</p>
                                        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "3px", flexWrap: "wrap" }}>
                                            {t.dueDate && <span style={{ fontSize: "11px", color: "rgba(148,163,184,0.4)" }}>Due {new Date(t.dueDate).toLocaleDateString()}</span>}
                                        </div>
                                    </div>

                                    {/* Badges */}
                                    <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
                                        <span className="badge" style={{ background: pBg, color: pColor }}>{t.priority}</span>
                                        <span className="badge" style={{ background: sBg, color: sColor }}>{t.status}</span>
                                    </div>

                                    {/* Actions */}
                                    <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
                                        <button onClick={() => setModal(t)} className="tf-btn-ghost" style={{ padding: "6px 10px", fontSize: "12px" }}>Edit</button>
                                        <button onClick={() => deleteTask(t._id)} style={{
                                            background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)",
                                            borderRadius: "8px", padding: "6px 10px", fontSize: "12px", color: "rgba(239,68,68,0.7)",
                                            cursor: "pointer", fontFamily: "'DM Sans',sans-serif", fontWeight: 500, transition: "all 0.2s",
                                        }}
                                            onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,0.15)"; e.currentTarget.style.color = "#ef4444"; }}
                                            onMouseLeave={e => { e.currentTarget.style.background = "rgba(239,68,68,0.08)"; e.currentTarget.style.color = "rgba(239,68,68,0.7)"; }}
                                        >Delete</button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </main>
            </div>
        </>
    );
}
