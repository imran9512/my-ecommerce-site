// src/components/Footer.js
export default function footer() {
  return (
    <footer className="bg-gray-100 text-center py-4">
      <p className="text-sm text-gray-600">
        © {new Date().getFullYear()} MyShop. All rights reserved.
      </p>
    </footer>
  );
}
