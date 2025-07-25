// src/pages/products/[id].js
import { useRouter } from 'next/router';
import ProductDetail from '@/components/ProductDetail';
import TabsSection from '@/components/TabsSection';
import RelatedProducts from '@/components/RelatedProducts';
import products from '@/data/products';

export default function ProductPage({ product, related }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <ProductDetail product={product} />
      <TabsSection product={product} />
      <RelatedProducts products={related} />
    </div>
  );
}

// getServerSideProps ya getStaticProps: product fetch
export async function getStaticPaths() {
  const paths = products.map((p) => ({ params: { id: p.id } }));
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const product = products.find((p) => p.id === params.id);
  const related = products.filter((p) => product.related?.includes(p.id));
  return { props: { product, related } };
}