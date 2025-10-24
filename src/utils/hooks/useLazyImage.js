// src/utils/hooks/useLazyImage.js
import { useEffect, useState } from 'react';

export default function useLazyImage() {
    const [show, setShow] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setShow(true), 240); // 120 ms delay
        return () => clearTimeout(timer);
    }, []);

    return show;
}