import DuelSearch from './DuelSearch';
import SlidingImage from './SlidingImage';

function HeroSection() {
  return (
    <section className="relative min-h-[85vh] flex items-start px-6 md:px-12 pt-24 md:pt-28">
      <SlidingImage />

      <div className="relative z-20 mx-auto w-full grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-8 -mt-10 md:-mt-16">
          <div>
            <span className="inline-block px-4 py-1.5 bg-secondary-container text-on-secondary-container rounded-full text-sm font-semibold tracking-wide mb-4">
              CONNECTING LOCAL TALENT
            </span>

            <h1 className="text-5xl md:text-6xl font-bold text-on-surface leading-tight tracking-tight">
              Work Smarter,
              <br />
              <span className="text-primary">Hire Better.</span>
            </h1>

            <p className="mt-6 text-lg text-on-surface-variant leading-relaxed max-w-lx">
              The premier platform connecting skilled freelancers with
              homeowners and businesses in Nepal. Fast, secure, and local.
            </p>
          </div>

          <DuelSearch />
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
