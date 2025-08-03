// src/pages/index.js
import Link from 'next/link';
import { SITE_NAME } from '@/data/constants';

const Home = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 text-center">
      <h1 className="text-4xl font-bold text-sky-700 mb-4">
        Empowering Wellbeing for Men and Women
      </h1>

      <p className="text-lg text-gray-700 leading-relaxed">
        🌿 Welcome to <strong className="text-sky-600">{SITE_NAME}</strong> — your one-stop shop for addressing a variety of personal health concerns. We understand that intimate health can be a delicate topic, and we're here to provide discreet and reliable resources to help you feel your best.
      </p>

      <p className="mt-4 text-gray-700 leading-relaxed">
  Our wide-ranging collection is built for every body and mind. From everyday physical concerns to the issues you keep private, we offer discreet, effective solutions you can trust. Mental-health support is part of the journey too—products you can use regularly to feel balanced, confident, and in control.
</p>

      <p className="mt-4 text-gray-700 leading-relaxed">
        We prioritize discretion and privacy. Our platform allows you to browse and purchase products comfortably, with secure payment options and fast, confidential shipping. <strong>{SITE_NAME}</strong> is committed to empowering individuals to take control of their health. We believe in providing access to informative resources and effective products to help you achieve optimal well-being.
      </p>

      <Link href="/shop" className="mt-8 inline-block bg-sky-600 text-white px-6 py-3 rounded-md hover:bg-sky-700">
  Shop Now
</Link>
    </div>
  );
};

export default Home;