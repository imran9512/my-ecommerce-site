// src/data/constants.js
export const GOOGLE_FORM_URL =
'https://docs.google.com/forms/d/e/1FAIpQLScP9cDlIf1Ml38opCMK9amrYXKi9oXqVQDAMtXW9Gf05-GzZg/formResponse';

export const GOOGLE_FORM_FIELDS = {
  order_id:  'entry.1569884057',
  name:      'entry.1942248175',
  phone:     'entry.2033882025',
  city:      'entry.1433680367',
  address:   'entry.81208404',
  instructions: 'entry.1588560176',
  payment_method: 'entry.2080387436',
  courier_option: 'entry.1532278178',
  products_json: 'entry.2042780537',
  subtotal:  'entry.706630286',
  discount:  'entry.2035867855',
  grand_total: 'entry.1062659703',
};


// courier
export const COURIER_OPTIONS = [
  { name: 'Regular', charge: 0 },
  { name: 'Leopard', charge: 200 },
  { name: 'TCS', charge: 299 },
];

// discount
export const ONLINE_DISCOUNT_PERCENT = 4;

// misc
export const SITE_NAME = 'AAP KI SEHAT';
export const WHATSAPP_NUMBER = '+923001234567';

// helper – generate order id
export const generateOrderId = (orderNum = 1) => {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);
  const month = String.fromCharCode(65 + now.getMonth()); // A=Jan … L=Dec
  const day = now.getDate().toString().padStart(2, '0');
  return `${year}${month}${day}O${orderNum}`;
};