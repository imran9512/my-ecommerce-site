// src/pages/admin/all.tsx
import { NextPage } from 'next';
import Head from 'next/head';

const AdminPage: NextPage = () => (
  <>
    <Head>
      <title>Admin Panel</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </Head>
    <div id="root"></div>
    <script src="/admin/admin.js" defer></script>
  </>
);

export default AdminPage;