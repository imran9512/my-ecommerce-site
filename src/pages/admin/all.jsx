// src/pages/admin/all.jsx
export default function AdminPage() {
  if (typeof window !== 'undefined') {
    window.location.replace('/admin/index.html');
  }
  return null;
}