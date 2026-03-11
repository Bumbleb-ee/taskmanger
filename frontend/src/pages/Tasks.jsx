import { useState, useEffect, useCallback } from "react";
import MeshBackground from "../components/MeshBackground";
import Sidebar, { Icon } from "../components/Sidebar";
import API from "../api/axios";

const PRI_COLOR = { high: "#ef4444", medium: "#f59e0b", low: "#10b981" };
const PRI_BG = { high: "#fee2e2", medium: "#fef3c7", low: "#d1fae5" };
const STS_COLOR = { "in progress": "#4f46e5", completed: "#059669", pending: "#6b7280" };
const STS_BG = { "in progress": "#e0e7ff", completed: "#d1fae5", pending: "#f3f4f6" };

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
            background: "rgba(17,24,39,0.4)", backdropFilter: "blur(4px)", padding: "20px",
            animation: "fadeIn 0.2s ease",
        }} onClick={e => e.target === e.currentTarget && onClose()}>
            <div className="tf-card" style={{
                width: "100%", maxWidth: "480px", padding: "32px",
                animation: "popIn 0.3s cubic-bezier(0.16,1,0.3,1)",
                border: "1px solid rgba(0,0,0,0.06)",
                boxShadow: "0 24px 48px -12px rgba(0,0,0,0.18)",
            }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                    <h2 style={{ fontSize: "20px", fontWeight: 800, color: "#111827" }}>
                        {isEdit ? "Edit Task" : "New Task"}
                    </h2>
                    <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", display: "flex" }}
                        onMouseEnter={e => e.currentTarget.style.color = "#111827"} onMouseLeave={e => e.currentTarget.style.color = "#9ca3af"}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                    </button>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    <div>
                        <label className="tf-label">Task Title</label>
                        <input className="tf-input" value={form.title} onChange={set("title")} placeholder="What needs to be done?" />
                    </div>
                    <div>
                        <label className="tf-label">Description</label>
                        <textarea className="tf-input" value={form.description} onChange={set("description")} placeholder="Add details..."
                            style={{ resize: "vertical", minHeight: "80px", lineHeight: "1.5" }} />
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
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
                    <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "16px" }}>
                        <div>
                            <label className="tf-label">Due Date</label>
                            <input className="tf-input" type="date" value={form.due} onChange={set("due")} />
                        </div>
                    </div>
                </div>

                <div style={{ display: "flex", gap: "12px", marginTop: "32px" }}>
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
            padding: "8px 16px", borderRadius: "10px", border: "none", cursor: "pointer", fontSize: "13px", fontWeight: 600,
            transition: "all 0.2s",
            background: active ? "#111827" : "#f9fafb",
            color: active ? "#ffffff" : "#6b7280",
            border: active ? "1px solid #111827" : "1px solid #e5e7eb",
            boxShadow: active ? "0 2px 4px rgba(17,24,39,0.1)" : "none",
        }}
            onMouseEnter={e => { if (!active) { e.currentTarget.style.background = "#f3f4f6"; e.currentTarget.style.color = "#374151"; } }}
            onMouseLeave={e => { if (!active) { e.currentTarget.style.background = "#f9fafb"; e.currentTarget.style.color = "#6b7280"; } }}
        >{label}</button>
    );

    return (
        <>
            <MeshBackground />
            {modal && <TaskModal task={modal === "new" ? null : modal} onClose={() => setModal(null)} onSave={saveTask} />}

            <div style={{ position: "relative", zIndex: 2, display: "flex", minHeight: "100vh" }}>
                <Sidebar activePath="/dashboard/tasks" />

                <main style={{
                    flex: 1, padding: "40px 48px", overflow: "auto",
                    opacity: mounted ? 1 : 0, transform: mounted ? "none" : "translateY(16px)",
                    transition: "all 0.5s cubic-bezier(0.16,1,0.3,1)",
                }}>

                    {/* Header */}
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "36px" }}>
                        <div>
                            <h1 style={{ fontSize: "32px", fontWeight: 800, color: "#111827", letterSpacing: "-0.03em" }}>Tasks</h1>
                            <p style={{ fontSize: "14px", color: "#6b7280", marginTop: "6px", fontWeight: 500 }}>
                                {tasks.length} total · {tasks.filter(t => t.status === "completed").length} completed
                            </p>
                        </div>
                        <button className="tf-btn-primary" onClick={() => setModal("new")} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "12px 20px" }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                            New Task
                        </button>
                    </div>

                    {/* Filters */}
                    <div className="tf-card" style={{ padding: "20px 24px", marginBottom: "24px", display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap", animation: "slideUpFade 0.4s 0.1s ease both" }}>
                        <form onSubmit={e => { e.preventDefault(); setSearchSubmit(search); }} style={{ position: "relative", flex: "1", minWidth: "240px" }}>
                            <svg onClick={() => setSearchSubmit(search)} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#9ca3af", cursor: "pointer" }}>
                                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                            </svg>
                            <input className="tf-input" placeholder="Search tasks... (Hit Enter)" value={search} onChange={e => setSearch(e.target.value)}
                                style={{ paddingLeft: "40px" }} />
                        </form>
                        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                            {["All", "Pending", "Completed"].map(s => (
                                <FilterBtn key={s} label={s} active={filterStatus === s} onClick={() => setFilterStatus(s)} />
                            ))}
                        </div>
                        <div style={{ width: "1px", height: "24px", background: "#e5e7eb" }} />
                        <div style={{ display: "flex", gap: "8px" }}>
                            {["All", "High", "Medium", "Low"].map(p => (
                                <FilterBtn key={p} label={p} active={filterPriority === p} onClick={() => setFilterPriority(p)} />
                            ))}
                        </div>
                    </div>

                    {/* Task list */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px", animation: "slideUpFade 0.4s 0.2s ease both" }}>
                        {tasks.length === 0 && (
                            <div style={{ textAlign: "center", padding: "80px 20px", background: "#ffffff", borderRadius: "16px", border: "1px dashed #e5e7eb" }}>
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round" style={{ margin: "0 auto 16px", display: "block" }}>
                                    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                                </svg>
                                <p style={{ fontSize: "15px", color: "#6b7280", fontWeight: 500 }}>No tasks found matching your criteria</p>
                            </div>
                        )}
                        {tasks.map((t, i) => {
                            const pColor = PRI_COLOR[t.priority?.toLowerCase()] || PRI_COLOR.medium;
                            const pBg = PRI_BG[t.priority?.toLowerCase()] || PRI_BG.medium;
                            const sColor = STS_COLOR[t.status?.toLowerCase()] || STS_COLOR.pending;
                            const sBg = STS_BG[t.status?.toLowerCase()] || STS_BG.pending;
                            const isCompleted = t.status === "completed";

                            return (
                                <div key={t._id} className="tf-task-row" style={{ animation: `slideUpFade 0.3s ${0.1 + i * 0.05}s ease both`, opacity: isCompleted ? 0.7 : 1 }}>
                                    {/* Priority stripe */}
                                    <div style={{ width: 4, alignSelf: "stretch", borderRadius: "10px", background: pColor, flexShrink: 0 }} />

                                    {/* Checkbox */}
                                    <button onClick={() => toggleStatus(t._id)} style={{
                                        width: 24, height: 24, borderRadius: "6px", flexShrink: 0, cursor: "pointer",
                                        border: `2px solid ${isCompleted ? "#10b981" : "#d1d5db"}`,
                                        background: isCompleted ? "#10b981" : "transparent",
                                        display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s",
                                    }}>
                                        {isCompleted && (
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                                        )}
                                    </button>

                                    {/* Content */}
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <p style={{
                                            fontSize: "15px", color: isCompleted ? "#9ca3af" : "#111827",
                                            textDecoration: isCompleted ? "line-through" : "none",
                                            fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                                        }}>{t.title}</p>
                                        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "4px", flexWrap: "wrap" }}>
                                            {t.dueDate && <span style={{ fontSize: "12px", color: "#6b7280", fontWeight: 500 }}>Due {new Date(t.dueDate).toLocaleDateString()}</span>}
                                        </div>
                                    </div>

                                    {/* Badges */}
                                    <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
                                        <span className="tf-badge" style={{ background: pBg, color: pColor }}>{t.priority}</span>
                                        <span className="tf-badge" style={{ background: sBg, color: sColor }}>{t.status}</span>
                                    </div>

                                    {/* Actions */}
                                    <div style={{ display: "flex", gap: "8px", flexShrink: 0, marginLeft: "8px" }}>
                                        <button onClick={() => setModal(t)} className="tf-btn-ghost" style={{ padding: "8px 12px", fontSize: "13px" }}>Edit</button>
                                        <button onClick={() => deleteTask(t._id)} style={{
                                            background: "#fee2e2", border: "1px solid #fca5a5",
                                            borderRadius: "10px", padding: "8px 12px", fontSize: "13px", color: "#ef4444",
                                            cursor: "pointer", fontWeight: 600, transition: "all 0.2s",
                                        }}
                                            onMouseEnter={e => { e.currentTarget.style.background = "#fecaca"; e.currentTarget.style.border = "1px solid #f87171"; }}
                                            onMouseLeave={e => { e.currentTarget.style.background = "#fee2e2"; e.currentTarget.style.border = "1px solid #fca5a5"; }}
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
