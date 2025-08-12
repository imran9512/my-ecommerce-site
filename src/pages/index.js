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
        🌿 Welcome to <strong className="text-sky-600">{SITE_NAME}</strong> — We’re here whenever you need a quiet, judgment-free space to look after your body and mind. From everyday questions to the things you’d rather not say out loud, our hand-picked guides and products are chosen to help you feel confident, comfortable and in control.
      </p>

      <p className="mt-4 text-gray-700 leading-relaxed">
          From everyday physical concerns to the issues you keep private, we offer discreet, effective solutions you can trust. Mental-health support is part of the journey too—products you can use regularly to feel balanced, confident, and in control.
      </p>

      <p className="mt-4 text-gray-700 leading-relaxed">
       We prioritise discretion. Your privacy is our priority. Shop at your own pace, pay without worry, and receive every order in plain, unmarked packaging that keeps your choices between you and your doorstep. At <strong>{SITE_NAME}</strong> we’re here to give you the straightforward information and practical tools you need to feel steady, strong, and in charge of your * wellbeing.
      </p>

      <Link href="/shop" className="mt-8 inline-block bg-sky-600 text-white px-6 py-3 rounded-md hover:bg-sky-700">
  Shop Now
</Link>
    </div>
  );
};

export default Home;