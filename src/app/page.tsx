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
import DropletCanvas from "@/components/3d/DropletCanvas";
import ScrollPath from "@/components/3d/ScrollPath";
import DropletController from "@/components/3d/DropletController";

import GlassFilters from "@/components/ui/GlassFilters";

export default function Home() {
  return (
    <main className="relative w-full">
      <GlassFilters />
      {/* 3D Global Elements */}
      <DropletCanvas />
      <ScrollPath />
      <DropletController />

      {/* Narrative Scenes */}
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
