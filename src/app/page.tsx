import OpeningHero from "@/components/hero/OpeningHero";
import BrandPhilosophy from "@/components/layout/BrandPhilosophy";
import SignatureCollection from "@/components/products/SignatureCollection";
import IngredientStory from "@/components/ingredients/IngredientStory";
import ProductBenefits from "@/components/products/ProductBenefits";
import LuxuryPackaging from "@/components/products/LuxuryPackaging";
import FeaturedProducts from "@/components/products/FeaturedProducts";
import LifestyleGallery from "@/components/gallery/LifestyleGallery";
import CustomerExperience from "@/components/layout/CustomerExperience";
import BrandStory from "@/components/layout/BrandStory";
import Awards from "@/components/layout/Awards";
import FinalCollection from "@/components/products/FinalCollection";
import NewsletterFooter from "@/components/layout/NewsletterFooter";

export default function Home() {
  return (
    <main className="relative w-full">
      <OpeningHero />
      <BrandPhilosophy />
      <SignatureCollection />
      <IngredientStory />
      <ProductBenefits />
      <LuxuryPackaging />
      <FeaturedProducts />
      <LifestyleGallery />
      <CustomerExperience />
      <BrandStory />
      <Awards />
      <FinalCollection />
      <NewsletterFooter />
    </main>
  );
}
