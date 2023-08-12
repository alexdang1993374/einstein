import LandingContent from "@/components/LandingContent";
import LandingHero from "@/components/LandingHero";
import LandingLayout from "@/components/LandingLayout";
import LandingNavbar from "@/components/LandingNavbar";

export default function Home() {
  return (
    <LandingLayout>
      <div className="h-full">
        <LandingNavbar />

        <LandingHero />

        <LandingContent />
      </div>
    </LandingLayout>
  );
}
