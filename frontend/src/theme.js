export const colors = {
    bg: "#020817",
    card: "rgba(8,12,28,0.85)",
    border: "rgba(255,255,255,0.07)",
    borderHover: "rgba(99,102,241,0.4)",
    primary: "#6366f1",
    primaryLight: "#818cf8",
    primaryLighter: "#a5b4fc",
    cyan: "#06b6d4",
    violet: "#8b5cf6",
    text: "#f8fafc",
    textMuted: "rgba(148,163,184,0.8)",
    textFaint: "rgba(148,163,184,0.45)",
    success: "#10b981",
    warning: "#f59e0b",
    danger: "#ef4444",
};

export const globalCSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body, #root { height: 100%; }
  body { background: #020817; font-family: 'DM Sans', sans-serif; color: #f8fafc; -webkit-font-smoothing: antialiased; }

  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: rgba(255,255,255,0.02); }
  ::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.3); border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: rgba(99,102,241,0.5); }

  @keyframes floatOrb   { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-18px) scale(1.04)} }
  @keyframes slideUp    { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn     { from{opacity:0} to{opacity:1} }
  @keyframes shimmer    { 0%{background-position:-200% center} 100%{background-position:200% center} }
  @keyframes spin       { to{transform:rotate(360deg)} }
  @keyframes pulse      { 0%,100%{opacity:1} 50%{opacity:.5} }
  @keyframes slideRight { from{opacity:0;transform:translateX(-20px)} to{opacity:1;transform:translateX(0)} }

  .tf-input {
    width:100%; background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08);
    border-radius:12px; padding:13px 16px; color:#f1f5f9;
    font-family:'DM Sans',sans-serif; font-size:14px; outline:none; transition:all 0.25s;
  }
  .tf-input::placeholder { color:rgba(148,163,184,0.4); }
  .tf-input:focus { border-color:rgba(99,102,241,0.6); background:rgba(99,102,241,0.06); box-shadow:0 0 0 3px rgba(99,102,241,0.12); }
  .tf-input:-webkit-autofill,.tf-input:-webkit-autofill:focus {
    -webkit-box-shadow:0 0 0 1000px #0d1224 inset; -webkit-text-fill-color:#f1f5f9;
  }

  .tf-btn-primary {
    background:linear-gradient(135deg,#6366f1,#8b5cf6,#06b6d4); background-size:200% auto;
    color:white; border:none; border-radius:12px; padding:13px 20px;
    font-family:'Syne',sans-serif; font-size:14px; font-weight:600; letter-spacing:0.04em;
    cursor:pointer; transition:all 0.3s; position:relative; overflow:hidden;
    box-shadow:0 4px 20px rgba(99,102,241,0.35);
  }
  .tf-btn-primary:hover:not(:disabled) { background-position:right center; box-shadow:0 6px 28px rgba(99,102,241,0.5); transform:translateY(-1px); }
  .tf-btn-primary:active:not(:disabled) { transform:translateY(0); }
  .tf-btn-primary:disabled { opacity:0.6; cursor:not-allowed; }
  .tf-btn-primary::before {
    content:''; position:absolute; inset:0;
    background:linear-gradient(135deg,transparent 30%,rgba(255,255,255,0.08) 50%,transparent 70%);
    background-size:200% auto; animation:shimmer 3s linear infinite;
  }

  .tf-btn-ghost {
    background:rgba(255,255,255,0.04); color:rgba(148,163,184,0.8); border:1px solid rgba(255,255,255,0.08);
    border-radius:10px; padding:9px 16px; font-family:'DM Sans',sans-serif; font-size:13px;
    font-weight:500; cursor:pointer; transition:all 0.2s;
  }
  .tf-btn-ghost:hover { background:rgba(255,255,255,0.08); color:#f1f5f9; border-color:rgba(255,255,255,0.15); }

  .tf-card {
    background:rgba(8,12,28,0.85); backdrop-filter:blur(24px); -webkit-backdrop-filter:blur(24px);
    border-radius:20px; border:1px solid rgba(255,255,255,0.07);
    box-shadow:0 24px 64px rgba(0,0,0,0.5);
  }

  .tf-label {
    display:block; margin-bottom:7px; font-size:11px; font-weight:500;
    color:rgba(148,163,184,0.7); letter-spacing:0.07em; text-transform:uppercase;
  }

  .nav-item {
    display:flex; align-items:center; gap:10px; padding:10px 14px; border-radius:10px;
    color:rgba(148,163,184,0.7); font-size:14px; font-weight:500; cursor:pointer;
    transition:all 0.2s; text-decoration:none; border:none; background:none; width:100%;
  }
  .nav-item:hover { background:rgba(255,255,255,0.05); color:#f1f5f9; }
  .nav-item.active { background:rgba(99,102,241,0.15); color:#818cf8; }

  .stat-card {
    background:rgba(8,12,28,0.7); border:1px solid rgba(255,255,255,0.07);
    border-radius:16px; padding:20px; transition:all 0.25s; cursor:default;
  }
  .stat-card:hover { border-color:rgba(99,102,241,0.25); transform:translateY(-2px); box-shadow:0 12px 32px rgba(0,0,0,0.3); }

  .task-row {
    background:rgba(255,255,255,0.025); border:1px solid rgba(255,255,255,0.06);
    border-radius:14px; padding:16px 20px; transition:all 0.2s; display:flex;
    align-items:center; gap:14px;
  }
  .task-row:hover { background:rgba(99,102,241,0.06); border-color:rgba(99,102,241,0.2); transform:translateX(2px); }

  .badge {
    display:inline-flex; align-items:center; padding:3px 10px; border-radius:20px;
    font-size:11px; font-weight:600; letter-spacing:0.05em; text-transform:uppercase;
  }

  .divider { height:1px; background:linear-gradient(to right,transparent,rgba(255,255,255,0.07),transparent); margin:20px 0; }
`;
