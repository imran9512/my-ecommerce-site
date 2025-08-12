// components/TabsSection.jsx
import ReviewsSection from './ReviewsSection';

// existing tabs code mein review tab add karo
const tabs = [
  { label: 'Details', content: <div>{product.longDesc}</div> },
  { label: 'Reviews', content: <ReviewsSection product={product} /> },
  // baaki tabs
];