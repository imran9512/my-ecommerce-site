// src/components/TabsSection.jsx
import { useState } from 'react';
//import { StarIcon } from '@heroicons/react/24/solid';
import { reviews } from '@/data/reviews';
import products from '@/data/products';
//import { descById } from '@/data/productDesc';
//import { faqsByProduct } from '@/data/faq';
import { StarIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid';

export default function TabsSection({ product, faqItems }) {
  const [active, setActive] = useState('desc');
  const [showMeta, setShowMeta] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const toggleFaq = (idx) =>
    setOpenFaq(openFaq === idx ? null : idx);

  // reviews jo is product k hain
  const productReviews = reviews.filter((r) => r.productId === product.id);

  // 3 preview
  //const preview = productReviews.slice(0, 3);

  /*const renderStars = (rating) =>
    [...Array(5)].map((_, i) => (
      <StarIcon
        key={i}
        className={`w-5 h-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
      />
    ));*/

  //const getProductName = (pid) => products.find((p) => p.id === pid)?.name || '';


  return (
    <div className="mt-10">
      {/* Tab buttons */}
      <div className="flex border-b">
        {['desc', 'reviews', 'uses', 'faq'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className={`px-4 py-2 font-semibold ${active === tab
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-600'
              }`}
          >
            {tab === 'desc'
              ? 'Description'
              : tab === 'reviews'
                ? 'Reviews'
                : tab === 'uses'
                  ? 'Uses'
                  : 'FAQs'
            }
          </button>
        ))}
      </div>

      <div className="mt-4">
        {/* DESCRIPTION */}
        {active === 'desc' && (
          <div>
            <div
              className="prose max-w-none mb-4"
              dangerouslySetInnerHTML={{
                __html: Array.isArray(product.longDesc)
                  ? product.longDesc.join('')
                  : product.longDesc || 'No details available.'
              }}
            />
            {product.fullDesc && (
              <div className="mb-4">
                <a
                  href={product.fullDesc}
                  className="inline-flex items-center px-2 py-1 text-sm font-medium text-white bg-blue-400 rounded-md hover:bg-blue-700"
                >
                  Read Full Details
                </a>
              </div>
            )}

            {/* Medical Information Dropdown */}
            {(() => {
              const hasNonPropName = product.nonProprietaryName?.trim();
              const hasDosageForm = product.dosageForm?.trim();
              const hasAdminRoute = product.administrationRoute?.trim();
              const hasDrugClass = product.drugClass?.trim();
              const hasPregnancyCat = product.pregnancyCategory?.trim();
              const hasTitle = product.metaTitle?.trim();
              const hasDesc = product.metaDescription?.trim();
              const hasTags = product.tags?.length > 0;
              const hasAnyMeta = hasNonPropName || hasDosageForm || hasAdminRoute || hasDrugClass || hasPregnancyCat || hasTitle || hasDesc || hasTags;
              if (!hasAnyMeta) return null;

              const panelId = 'medical-info-panel';
              const buttonId = 'medical-info-toggle';

              return (
                <div className="pt-4">
                  <button
                    id={buttonId}
                    onClick={() => setShowMeta(!showMeta)}
                    aria-expanded={showMeta ? 'true' : 'false'}
                    aria-controls={panelId}
                    aria-label="Toggle Medical Information"
                    className="flex items-center justify-between w-full text-left px-4 py-2 rounded-md"
                    role="button"
                  >
                    <span className="font-semibold text-gray-500">Medical Information</span>
                    {showMeta ? (
                      <ChevronUpIcon className="w-5 h-5 text-gray-500" aria-hidden="true" />
                    ) : (
                      <ChevronDownIcon className="w-5 h-5 text-gray-500" aria-hidden="true" />
                    )}
                  </button>

                  {showMeta && (
                    <div
                      id={panelId}
                      role="region"
                      aria-labelledby={buttonId}
                      className="mt-2 text-sm text-gray-600 space-y-2 p-4 rounded-md"
                    >
                      {hasNonPropName && (
                        <p>
                          <strong>Non-Proprietary Name:</strong>{' '}
                          {typeof product.nonProprietaryName === 'string'
                            ? product.nonProprietaryName
                            : JSON.stringify(product.nonProprietaryName)}
                        </p>
                      )}
                      {hasDosageForm && (
                        <p>
                          <strong>Dosage Form:</strong>{' '}
                          {typeof product.dosageForm === 'string'
                            ? product.dosageForm
                            : JSON.stringify(product.dosageForm)}
                        </p>
                      )}
                      {hasAdminRoute && (
                        <p>
                          <strong>Administration Route:</strong>{' '}
                          {typeof product.administrationRoute === 'string'
                            ? product.administrationRoute
                            : JSON.stringify(product.administrationRoute)}
                        </p>
                      )}
                      {hasDrugClass && (
                        <p>
                          <strong>Drug Class:</strong>{' '}
                          {typeof product.drugClass === 'string'
                            ? product.drugClass
                            : JSON.stringify(product.drugClass)}
                        </p>
                      )}
                      {hasPregnancyCat && (
                        <p>
                          <strong>Pregnancy Category:</strong>{' '}
                          {typeof product.pregnancyCategory === 'string'
                            ? product.pregnancyCategory
                            : JSON.stringify(product.pregnancyCategory)}
                        </p>
                      )}
                      {hasTitle && (
                        <p>
                          <strong>Title:</strong>{' '}
                          {typeof product.metaTitle === 'string'
                            ? product.metaTitle
                            : JSON.stringify(product.metaTitle)}
                        </p>
                      )}
                      {hasDesc && (
                        <p>
                          <strong>Description:</strong>{' '}
                          {typeof product.metaDescription === 'string'
                            ? product.metaDescription
                            : JSON.stringify(product.metaDescription)}
                        </p>
                      )}
                      {hasTags && (
                        <p>
                          <strong>Tags:</strong>{' '}
                          {Array.isArray(product.tags)
                            ? product.tags.join(', ')
                            : product.tags}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        )}

        {/* REVIEWS */}
        {active === 'reviews' && (
          <>
            {/* swipeable container */}
            <div className="flex overflow-x-auto space-x-4 pb-2">
              {productReviews.map((r) => {
                const productName =
                  products.find((p) => p.id === r.productId)?.name || 'Unknown';
                return (
                  <div
                    key={r.id}
                    className="min-w-[300px] w-full md:w-1/3 lg:w-1/3 shrink-0 border border-gray-200 rounded-xl p-4"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p>
                          <span className="font-semibold text-sm">{r.name}</span> -
                          <span className="text-xs text-gray-500"> {r.date}</span>
                        </p>
                        <p className="text-xs">
                          Purchased:{' '}
                          <span className="text-xs text-blue-600 mt-0.5">
                            {productName}
                          </span>
                        </p>
                      </div>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon
                            key={i}
                            className={`w-4 h-4 ${i < r.rating ? 'text-yellow-400' : 'text-gray-300'
                              }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-800 mt-2">{r.comment}</p>
                  </div>
                );
              })}
              {/* 2. Other reviews (different product IDs) */}
              {reviews
                .filter((r) => r.productId !== product.id)
                .map((r) => {
                  const productName =
                    products.find((p) => p.id === r.productId)?.name || 'Unknown';
                  return (
                    <div
                      key={r.id}
                      className="min-w-[300px] w-full md:w-1/3 lg:w-1/3 shrink-0 border border-gray-200 rounded-xl p-4"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p>
                            <span className="font-semibold text-sm">{r.name}</span> -
                            <span className="text-xs text-gray-500"> {r.date}</span>
                          </p>
                          <p className="text-xs">
                            Purchased:{' '}
                            <span className="text-xs text-blue-600 mt-0.5">
                              {productName}
                            </span>
                          </p>
                        </div>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <StarIcon
                              key={i}
                              className={`w-4 h-4 ${i < r.rating ? 'text-yellow-400' : 'text-gray-300'
                                }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-gray-800 mt-2">{r.comment}</p>
                    </div>
                  );
                })}
            </div>

            {/* button */}
            <button
              onClick={() => window.open('/reviews', '_blank')}
              className="mx-auto mt-2 px-4 py-2 shadow-md text-sm rounded"
            >
              View All Reviews
            </button>
          </>
        )}

        {/* USES */}
        {active === 'uses' && (
          <div className="prose max-w-none">
            <div
              dangerouslySetInnerHTML={{
                __html: Array.isArray(product.uses) ? product.uses.join('') : product.uses || 'No usage information available'
              }}
            />
          </div>
        )}

        {/* FAQs */}
        {active === 'faq' && (
          <div className="max-w-none">
            {faqItems && faqItems.length ? (
              faqItems.map((item, idx) => (
                <div key={idx} className="border-b">
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full flex justify-between items-center py-3 text-left font-medium focus:outline-none"
                  >
                    <span>{item.q}</span>
                    {openFaq === idx ? (
                      <ChevronUpIcon className="w-5 h-5 text-blue-500" />
                    ) : (
                      <ChevronDownIcon className="w-5 h-5 text-blue-500" />
                    )}
                  </button>
                  {openFaq === idx && (
                    <div className="pb-3 text-sm text-gray-700">
                      {item.a}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p>No FAQs available yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}