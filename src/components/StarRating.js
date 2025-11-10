// src/components/StarRating.js
import { StarIconSolid, StarIcon, StarIconHalf } from '@/components/icons';

export default function StarRating({ rating, className = '' }) {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
        if (i <= Math.floor(rating)) {
            stars.push(<StarIconSolid key={i} className={className} />);
        } else if (i === Math.ceil(rating) && rating % 1) {
            // fractional star
            const percent = Math.round((rating % 1) * 100);
            stars.push(<StarIconHalf key={i} percent={percent} className={className} />);
        } else {
            stars.push(<StarIcon key={i} className={className} />);
        }
    }
    return <>{stars}</>;
}