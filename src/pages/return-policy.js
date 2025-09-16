// src/pages/return-policy.js  (rename file if you keep it here)
import Head from 'next/head';
import { SITE_NAME, SITE_URL, WHATSAPP_NUMBER } from '@/data/constants';

export default function ReturnPolicy() {
    const canonical = `${SITE_URL}/return-policy`;

    return (
        <>
            <Head>
                <title>Return Policy | {SITE_NAME}</title>
                <meta
                    name="description"
                    content="Because medicines need special storage, we cannot accept returns. Wrong/damaged items are replaced free—no return necessary."
                />
                <link rel="canonical" href={canonical} />
            </Head>

            <div className="max-w-3xl mx-auto px-4 py-10 text-gray-700 leading-relaxed">
                <h1 className="text-3xl font-bold mb-6">Return & Refund Policy</h1>

                <p className="mb-4">
                    Medicines are sensitive products that must stay in controlled temperatures
                    (15-25 °C) and sealed packaging. Once a parcel leaves our pharmacy it travels
                    through unknown storage conditions; if it comes back days later we can no
                    longer guarantee its safety or efficacy. For this reason we <strong>
                        accept returns in a different way</strong>
                </p>

                <p className="mb-4">
                    Delivery within Pakistan usually takes 1–3 working days, while a return
                    shipment can take 10–15 extra days. That extra time exposes tablets, syrups
                    and capsules to heat, humidity and light, so the product could degrade
                    before it reaches us again. To keep every customer safe we cannot re-sell—or
                    even destroy and credit—such stock.
                </p>

                <p className="mb-4">
                    If we send the <strong>wrong item</strong> or it arrives <strong>damaged / expired</strong>,
                    contact on
                    <a
                        href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi`}
                        className="inline-flex items-center justify-center bg-green-400 text-white px-3 py-0.5 rounded-md ml-2"
                    >
                        <img src="/whatsapp.png" alt="WhatsApp" className="w-5 h-5 mr-1.5" />
                        WhatsApp
                    </a>
                    {" "}with clear photos. After verification we will dispatch a replacement
                    <strong> at no extra cost</strong>; no return necessary.<strong>( so we Accept returns for defective/wrong products only)</strong>
                </p>

                <p className="mb-4">
                    Please double-check your order before breaking the safety seal. Once a seal
                    is opened we cannot accept the product back, and refunds or exchanges will
                    not be possible. By placing an order you agree to these conditions.
                </p>

                <p>
                    Our goal is to provide 100 % genuine, safely-stored medicine every time.
                    Thank you for helping us maintain the highest quality standards.
                </p>
            </div>
        </>
    );
}