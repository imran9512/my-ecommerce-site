// src/components/PageFooter.js
import { SITE_NAME } from '@/data/constants';

const PageFooter = () => {
    return (
        <footer className="mb-11 py-2">
            <div className="max-w-7xl mx-auto px-4 text-center">
                <p>&copy; {SITE_NAME}. All rights reserved.</p>
                <p className="text-sm text-gray-800">Secure & Discreet Delivery</p>
            </div>
        </footer>
    );
};

export default PageFooter;