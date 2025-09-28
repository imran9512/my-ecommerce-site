// src/components/orderId.js
export const generateOrderId = () => {
  const d = new Date();
  const y = d.getFullYear().toString().slice(-2);
  const m = String.fromCharCode(65 + d.getMonth()); // A–L
  const day = d.getDate().toString().padStart(2, '0');
  const rand = Math.random().toString(36).substring(2, 5).toUpperCase(); // 3-char alpha-numeric
  return `${y}${m}${day}${rand}`; // e.g. 25H04AK9
};