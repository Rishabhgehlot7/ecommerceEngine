import HeroSlider from '@/components/home/hero-slider';
import CategorySection from '@/components/home/category-section';
import BestSellersSection from '@/components/home/best-sellers-section';
import OnSaleSection from '@/components/home/on-sale-section';
import ReviewsSection from '@/components/home/reviews-section';

export default function HomePage() {
  return (
    <div>
      <HeroSlider />
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <CategorySection />
        <BestSellersSection />
        <OnSaleSection />
        <ReviewsSection />
      </div>
    </div>
  );
}
