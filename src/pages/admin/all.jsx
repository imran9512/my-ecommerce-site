// src/pages/admin/all.jsx
import Head from 'next/head';
export default function AdminPage() {
  return (
    <>
      <Head>
        <title>Admin Panel</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <iframe
        src="/admin/index.html"   // pure static file
        className="w-full h-screen border-0"
        title="Admin"
      />
    </>
  );
}