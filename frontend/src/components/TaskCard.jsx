import { format, isValid } from "date-fns";
import { Edit2, Trash2, CheckCircle2, Circle, AlertCircle } from "lucide-react";

export default function TaskCard({ task, onUpdate, onDelete, onEdit }) {

    const toggleStatus = (e) => {
        e.stopPropagation();
        const newStatus = task.status === "completed" ? "pending" : "completed";
        onUpdate(task._id, { status: newStatus });
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case "high": return "var(--priority-high)";
            case "medium": return "var(--priority-medium)";
            case "low": return "var(--priority-low)";
            default: return "var(--text-secondary)";
        }
    };

    const isCompleted = task.status === "completed";

    return (
        <div className="glass-panel" style={{
            padding: '1.25rem',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            opacity: isCompleted ? 0.7 : 1,
            transition: 'opacity 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease',
            position: 'relative',
        }}
            onMouseOver={(e) => {
                if (!isCompleted) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                }
            }}
            onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
            }}
        >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <button
                    onClick={toggleStatus}
                    style={{
                        padding: 0,
                        backgroundColor: 'transparent',
                        color: isCompleted ? 'var(--status-completed)' : 'var(--text-tertiary)',
                        marginTop: '0.125rem'
                    }}
                >
                    {isCompleted ? <CheckCircle2 size={22} /> : <Circle size={22} />}
                </button>

                <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 style={{
                        fontSize: '1.05rem',
                        fontWeight: '600',
                        color: 'var(--text-primary)',
                        textDecoration: isCompleted ? 'line-through' : 'none',
                        wordBreak: 'break-word',
                        marginBottom: '0.25rem'
                    }}>
                        {task.title}
                    </h3>

                    {task.description && (
                        <p style={{
                            fontSize: '0.875rem',
                            color: 'var(--text-secondary)',
                            display: '-webkit-box',
                            WebkitLineClamp: '2',
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            textDecoration: isCompleted ? 'line-through' : 'none'
                        }}>
                            {task.description}
                        </p>
                    )}
                </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingLeft: '2.1rem', marginTop: 'auto' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        color: getPriorityColor(task.priority),
                        backgroundColor: `${getPriorityColor(task.priority)}15`,
                        padding: '0.125rem 0.625rem',
                        borderRadius: '999px',
                        textTransform: 'capitalize',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem'
                    }}>
                        <AlertCircle size={12} />
                        {task.priority}
                    </span>

                    {task.dueDate && isValid(new Date(task.dueDate)) && (
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: '500' }}>
                            Due {format(new Date(task.dueDate), 'MMM d, yyyy')}
                        </span>
                    )}
                </div>

                <div style={{ display: 'flex', gap: '0.25rem' }}>
                    <button
                        onClick={() => onEdit(task)}
                        style={{ padding: '0.35rem', color: 'var(--text-secondary)', backgroundColor: 'transparent' }}
                        title="Edit"
                    >
                        <Edit2 size={16} />
                    </button>
                    <button
                        onClick={() => onDelete(task._id)}
                        style={{ padding: '0.35rem', color: 'var(--priority-high)', backgroundColor: 'transparent' }}
                        title="Delete"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}
