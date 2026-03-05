import Sidebar from "./Sidebar";

export default function Layout({ children }) {
    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-secondary)', width: '100%' }}>
            <Sidebar />
            <main style={{
                flex: 1,
                padding: '2rem 3rem',
                maxWidth: '1200px',
                margin: '0 auto',
                width: '100%'
            }}>
                {children}
            </main>
        </div>
    );
}
