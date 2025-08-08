// pages/api/products.js
import products from '../../data/products.js';

export default function handler(req, res) {
  // allow CORS if you need to call this from another origin
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.status(200).json(products);
}