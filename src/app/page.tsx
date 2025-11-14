
import HeroSlider from '@/components/home/hero-slider';
import CategorySection from '@/components/home/category-section';
import ReviewsSection from '@/components/home/reviews-section';
import AdBanner from '@/components/home/ad-banner';
import ProductShowcase from '@/components/home/product-showcase';
import { getProducts } from '@/lib/actions/product.actions';
import type { IProduct } from '@/models/Product';

export default async function HomePage() {
  const allProducts: IProduct[] = await getProducts();

  const newArrivals = allProducts.slice(0, 4);
  const under499 = allProducts.filter(p => (p.salePrice || p.price) < 499).slice(0, 4);

  return (
    <div>
      <HeroSlider />
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <CategorySection />
        {newArrivals.length > 0 && (
          <ProductShowcase 
            title="New Arrivals"
            description="Check out the latest additions to our collection."
            products={newArrivals}
          />
        )}
        <AdBanner />
        {under499.length > 0 && (
           <ProductShowcase 
            title="Best Deals Under ₹499"
            description="Great quality products at an affordable price."
            products={under499}
          />
        )}
        {allProducts.length > 0 && (
          <ProductShowcase 
            title="All Products"
            description="Browse our complete collection."
            products={allProducts}
          />
        )}
        <ReviewsSection />
      </div>
    </div>
  );
}
