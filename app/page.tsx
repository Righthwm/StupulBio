import { HeroSection } from "@/components/home/HeroSection";
import { TrustBar } from "@/components/home/TrustBar";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { SeasonBanner } from "@/components/home/SeasonBanner";
import { StorySection } from "@/components/home/StorySection";
import { BenefitsSection } from "@/components/home/BenefitsSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { ExitIntentPopup } from "@/components/home/ExitIntentPopup";
import { SeoContent, homeFaqs } from "@/components/home/SeoContent";
import { faqSchema, jsonLd } from "@/lib/seo";

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(faqSchema(homeFaqs)) }}
      />
      <HeroSection />
      <TrustBar />
      <FeaturedProducts />
      <SeasonBanner />
      <StorySection />
      <BenefitsSection />
      <TestimonialsSection />
      <SeoContent />
      <ExitIntentPopup />
    </>
  );
}
