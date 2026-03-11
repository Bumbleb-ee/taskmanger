import { useState } from "react";
import { format } from "date-fns";
import { X } from "lucide-react";

export default function TaskForm({ initialData, onSubmit, onCancel }) {
    const [title, setTitle] = useState(initialData?.title || "");
    const [description, setDescription] = useState(initialData?.description || "");
    const [priority, setPriority] = useState(initialData?.priority || "medium");

    // Format the date for the date input (YYYY-MM-DD)
    const initialDate = initialData?.dueDate
        ? new Date(initialData.dueDate).toISOString().split('T')[0]
        : "";
    const [dueDate, setDueDate] = useState(initialDate);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            title,
            description,
            priority,
            dueDate: dueDate || undefined
        });
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(17, 24, 39, 0.4)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50,
            padding: '1rem'
        }}>
            <div className="tf-card" style={{
                padding: '2rem',
                width: '100%',
                maxWidth: '500px',
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                        {initialData ? "Edit Task" : "Create New Task"}
                    </h2>
                    <button
                        type="button"
                        onClick={onCancel}
                        style={{ padding: '0.25rem', backgroundColor: 'transparent', color: 'var(--text-tertiary)' }}
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-secondary)' }}>Title</label>
                        <input className="tf-input"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            placeholder="E.g., Finish MERN project"
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-secondary)' }}>Description</label>
                        <textarea className="tf-input"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            placeholder="Add more details about this task..."
                            style={{ resize: 'vertical' }}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                            <label style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-secondary)' }}>Priority</label>
                            <select className="tf-input" value={priority} onChange={(e) => setPriority(e.target.value)}>
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>

                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                            <label style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-secondary)' }}>Due Date (Optional)</label>
                            <input className="tf-input"
                                type="date"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                        <button type="button" className="tf-btn-ghost" onClick={onCancel}>
                            Cancel
                        </button>
                        <button type="submit" className="tf-btn-primary">
                            {initialData ? "Save Changes" : "Create Task"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
