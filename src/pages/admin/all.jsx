// src/pages/admin/all.jsx
import dynamic from 'next/dynamic';

const AdminClient = dynamic(
  () => import('../../components/AdminClient'),
  { ssr: false } // never render on server
);

export default AdminClient;