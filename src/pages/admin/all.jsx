// src/pages/admin/all.jsx
import dynamic from 'next/dynamic';

// Render the React admin **only** on the client
const AdminClient = dynamic(() => import('../../components/AdminClient'), {
  ssr: false,
});

export default AdminClient;