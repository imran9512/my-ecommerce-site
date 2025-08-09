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
  delivery_charges: 'entry.2077670955',
  grand_total: 'entry.1062659703',
};

// categories
export const categories = [
  { name: 'Fitness', sub: ['Delay/Timing', 'Erection', 'Combo'] },
  { name: 'ADHD', sub: ['Ritalin (Methylphenidate)', 'Lisdexamfetamine', 'Modafinil', 'Atomoxetine', 'Clonidine'] },
  { name: 'For Men', sub: ['VIAGRA+', 'CIALIS+', 'Dapoxitine'] },
  { name: 'Others', sub: ['For women', 'Miscellaneous'] },
]; 
/* Fitness > Delay/Timing - Erection - Combo
ADHD > Ritalin (Methylphenidate) - Lisdexamfetamine - Modafinil - Atomoxetine - Clonidine
For Men > VIAGRA+ - CIALIS+ - Dapoxitine
Others > For women - Miscellaneous */

// courier
export const COURIER_OPTIONS = [
  { name: 'Regular', charge: 0 },
  { name: 'Leopard', charge: 200 },
  { name: 'TCS', charge: 299 },
];

// discount
export const ONLINE_DISCOUNT_PERCENT = 3;

// misc
export const SITE_NAME = 'AAP KI SEHAT';
export const WHATSAPP_NUMBER = '+923142831690';

// Search COnsol Tag
export const GOOGLE_SEARCH_CONSOLE_TAG =
  '<meta name="google-site-verification" content="sOnCpM6SQ-KSOKNcbOK-DdmuZzykafxV-YnlXvljEZU" />';