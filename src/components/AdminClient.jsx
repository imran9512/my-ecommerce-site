// src/components/AdminClient.jsx
import { useEffect, useState } from 'react';
import { useSession, signIn } from 'next-auth/react';

export default function AdminClient() {
  const { data: session, status } = useSession();

  if (status === 'loading') return <p>Loading…</p>;
  if (!session) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <h1>Admin Login</h1>
        <button onClick={() => signIn('github')}>Login with GitHub</button>
      </div>
    );
  }

  return <p>Welcome to the admin panel</p>;
}