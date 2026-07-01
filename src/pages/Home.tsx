import TrustSection from '../features/home/componenets/TrustSection';
import {
  EntryCard,
  HeroSection,
  HowItWorks,
  PopularCategory,
  TrendingJob,
  UserHighlights,
} from '../features/home/index';

function Home() {
  return (
    <>
      <div className="bg-background text-on-background antialiased overflow-x-hidden">
        <main className="">
          <HeroSection />

          <section className="max-w-7xl mx-auto px-6 md:px-12 -mt-16 relative z-10 pb-20">
            <EntryCard />
          </section>

          <PopularCategory />

          <TrendingJob />

          <HowItWorks />

          <UserHighlights />

          <TrustSection />
        </main>
      </div>
    </>
  );
}

export default Home;
