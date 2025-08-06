// src/pages/admin/all.jsx
export default function AdminAll() {
  return (
    <div className="w-full h-screen">
      <iframe
        src="/admin/client"          // client-only route
        className="w-full h-full border-0"
        title="Admin"
      />
    </div>
  );
}