// src/data/constants.js

{/*export const GOOGLE_FORM_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLScP9cDlIf1Ml38opCMK9amrYXKi9oXqVQDAMtXW9Gf05-GzZg/formResponse';

export const GOOGLE_FORM_FIELDS = {
  order_id: 'entry.1569884057',
  name: 'entry.1942248175',
  phone: 'entry.2033882025',
  city: 'entry.1433680367',
  address: 'entry.81208404',
  instructions: 'entry.1588560176',
  payment_method: 'entry.2080387436',
  courier_option: 'entry.1532278178',
  products_json: 'entry.2042780537',
  subtotal: 'entry.706630286',
  discount: 'entry.2035867855',
  delivery_charges: 'entry.2077670955',
  grand_total: 'entry.1062659703',
}; */}

// categories
export const categories = [
  {
    name: 'ADHD',
    sub: [
      { title: 'Methylphenidate', children: [] },
      { title: 'Lisdexamfetamine', children: [] },
      { title: 'Modafinil', children: [] },
      { title: 'Atomoxetine', children: [] },
      { title: 'Clonidine', children: [] }
    ]
  },
  {
    name: 'For-Men',
    sub: [
      { title: 'VIAGRA', children: ["Viagra-Alternatives"] },
      { title: 'CIALIS', children: ["Cialis-Alternatives"] },
      { title: 'Dapoxitine', children: [] },
      { title: 'Combo', children: [] }
    ]
  },
  {
    name: 'Fitness',
    sub: [
      { title: 'Delay-Timing', children: [] },
      { title: 'Erection', children: [] }
    ]
  },
  {
    name: 'Others',
    sub: [
      { title: 'For-women', children: [] },
      { title: 'Miscellaneous', children: ['Cabergoline', 'Pfizer'] }
    ]
  }
];

// courier
export const COURIER_OPTIONS = [
  { name: 'Regular', charge: 0 },
  { name: 'Leopard', charge: 199 },
  { name: 'TCS', charge: 299 },
];
export const STRIP_DELIVERY_CHARGE = 240;
// website URL
export const SITE_URL = 'https://www.aapkisehat.com';

// discount
export const ONLINE_DISCOUNT_PERCENT = 3;

// misc
export const SITE_NAME = 'AAP KI SEHAT';
export const SITE_DESCRIPTION = '🌿 Welcome to AAP KI SEHAT — We’re here whenever you need a quiet, judgment-free space to look after your body and mind. From everyday questions to the things you’d rather not say out loud';
export const WHATSAPP_NUMBER = '+923142831690';

// Search COnsol Tag
export const GOOGLE_SEARCH_CONSOLE_TAG =
  '<meta name="google-site-verification" content="sOnCpM6SQ-KSOKNcbOK-DdmuZzykafxV-YnlXvljEZU" />';