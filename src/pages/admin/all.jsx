// src/pages/admin/all.jsx
import Head from 'next/head';

export default function AdminPage() {
  return (
    <>
      <Head>
        <title>Admin Panel</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div id="root" style={{ height: '100vh' }} />
      <script src="/admin/admin.js" defer></script>
    </>
  );
}