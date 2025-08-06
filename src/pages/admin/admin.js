// public/admin/admin.js
/* 1.  Load NextAuth client */
import('https://cdn.skypack.dev/next-auth/react').then(({ useSession, signIn }) => {
  const { createRoot } = require('react-dom/client');
  const { StrictMode } = require('react');

  const AdminApp = () => {
    const [session, setSession] = React.useState(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
      useSession().then(({ data }) => {
        setSession(data);
        setLoading(false);
      });
    }, []);

    if (loading) return <p>Loading…</p>;
    if (!session) {
      return (
        <div style={{ padding: 40, textAlign: 'center' }}>
          <h1>Admin Login</h1>
          <button onClick={() => signIn('github')}>Login with GitHub</button>
        </div>
      );
    }

    /* ---- full admin panel ---- */
    return <div>Admin panel here (or import your own bundle)</div>;
  };

  const root = createRoot(document.getElementById('root'));
  root.render(
    <StrictMode>
      <AdminApp />
    </StrictMode>
  );
});