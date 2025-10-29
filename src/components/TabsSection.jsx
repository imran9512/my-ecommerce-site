// src/components/TabsSection.jsx
import { useState, useEffect } from 'react';
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
  const [isExpanded, setIsExpanded] = useState(false);
  const [previewText, setPreviewText] = useState(''); // State for preview text

  // Reset isExpanded to false on product change (new product or refresh)
  useEffect(() => {
    setIsExpanded(false);
  }, [product.id]);

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

  const fullHtml = Array.isArray(product.longDesc)
    ? product.longDesc.join('')
    : product.longDesc || 'No details available.';

  // Compute preview text only on client-side (after SSR)
  useEffect(() => {
    if (typeof window !== 'undefined' && fullHtml) { // Added check for fullHtml to avoid unnecessary runs
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = fullHtml;
      const text = tempDiv.textContent || tempDiv.innerText || '';
      if (text.trim()) { // Only process if text exists
        const words = text.trim().split(/\s+/);
        setPreviewText(words.slice(0, 50).join(' ')); // Keep 50 words, or change to your desired number
      } else {
        setPreviewText('No description available.'); // Fallback for empty content
      }
    }
  }, [fullHtml]); // Dependency remains the same

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
          <div className="description-wrapper">
            {/* Single wrapper div for entire description with conditional content */}
            <div className={`prose max-w-none mb-4 transition-all duration-300 ease-in-out overflow-hidden`}>
              {isExpanded ? (
                // Full HTML when expanded
                <div
                  dangerouslySetInnerHTML={{ __html: fullHtml }}
                />
              ) : (
                // Preview: First 200 words as text, with fade if needed
                <div className="relative">
                  <p className="text-gray-800 leading-relaxed">
                    {previewText ? `${previewText}...` : 'Loading description...'}
                  </p>
                  {/* Fade overlay for preview */}
                  {previewText && (
                    <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent pointer-events-none" />
                  )}
                </div>
              )}
              {product.fullDesc && (
                <div className="mb-4 mt-4">
                  <a
                    href={product.fullDesc}
                    className="inline-flex items-center px-2 py-1 text-sm font-medium bg-yellow-100 rounded-md hover:bg-yellow-200"
                  >
                    Read Full Article
                  </a>
                </div>
              )}
            </div>

            {/* Read More / Show Less Button - always visible */}
            <div className="mt-4 flex justify-center">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors duration-200"
              >
                {isExpanded ? 'Show Less' : 'Read More'}
              </button>
            </div>

            {/* Medical Information Dropdown - moved outside for consistency */}
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