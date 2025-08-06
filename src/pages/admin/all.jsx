// src/pages/admin/all.jsx
import dynamic from 'next/dynamic';

const AdminClient = dynamic(() => import('../../components/AdminClient'), {
  ssr: false, // 100 % client-side
});

export default AdminClient;