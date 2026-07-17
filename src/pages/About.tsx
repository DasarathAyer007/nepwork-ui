import {
  Briefcase,
  Building2,
  CheckCircle,
  MapPin,
  MessageCircleMore,
  Wrench,
} from 'lucide-react';

export default function About() {
  const features = [
    {
      icon: Briefcase,
      title: 'For Job Seekers',
      text:
        'Access a curated list of verified job openings across Nepal. From tech startups in Kathmandu to agricultural experts in Pokhara, find your next role with confidence.',
    },
    {
      icon: Building2,
      title: 'For Employers',
      text:
        'Post jobs, track applications, and hire top-tier talent in minutes. Our advanced filtering and AI-powered matching ensure you find the right candidate for the right role.',
    },
    {
      icon: Wrench,
      title: 'Service Marketplace',
      text:
        'Looking for an electrician, a graphic designer, or a tutor? NepWork connects you with local, verified service providers who are ready to work within your budget.',
    },
  ];

  const trustFeatures = [
    {
      icon: CheckCircle,
      title: 'Verified Profiles',
    },
    {
      icon: MapPin,
      title: 'Location-Based Discovery',
    },
    {
      icon: MessageCircleMore,
      title: 'Community Support',
    },
  ];

  return (
    <main className="bg-background min-h-screen">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 space-y-20">
        {/* Hero Section */}
        <section className="text-center max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-2">
            <span className="text-primary font-semibold uppercase tracking-widest">
              About
            </span>

            <img
              src="/favicon.svg"
              alt="NepWork Logo"
              className="w-8 h-8"
            />

            <span className="text-primary font-semibold uppercase tracking-widest">
              <b>NepWork</b>
            </span>
          </div>

          <h1 className="text-headline-lg font-bold text-on-surface mt-4">
            Connecting Nepal’s Talent, One Opportunity at a Time.
          </h1>

          <h2 className="text-headline-md text-primary mt-4">
            Nepal’s Trusted Hub for Jobs and Local Services.
          </h2>

          <p className="text-body-md text-on-surface-variant mt-6 leading-8">
            NepWork is a decentralized, localized ecosystem built to bridge the
            gap between Nepal&apos;s skilled workforce and the businesses,
            communities, and individuals who need them.
          </p>
        </section>

        {/* Mission Section */}
        <section className="grid lg:grid-cols-2 gap-8 items-center">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6 md:p-8">
            <h2 className="text-headline-md font-bold text-on-surface mb-6">
              Our Mission
            </h2>

            <p className="text-body-md text-on-surface-variant leading-8">
              Our mission is to empower every Nepali professional—whether in
              Kathmandu or the remote hills—by providing a transparent, secure,
              and accessible platform to find meaningful work, showcase their
              skills, and build a sustainable career.
            </p>

            <p className="text-body-md text-on-surface-variant leading-8 mt-6">
              We envision a future where 100% of verified transactions lead to
              professional growth and community trust.
            </p>
          </div>

          <div className="flex justify-center">
            <div className="w-64 h-64 rounded-full bg-primary/10 flex items-center justify-center">
              <img
                src="/favicon.svg"
                alt="NepWork Logo"
                className="w-40 h-40 object-contain"
              />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-headline-md font-bold text-on-surface">
              What We Offer
            </h2>

            <p className="text-body-md text-on-surface-variant mt-3">
              A complete ecosystem for jobs, hiring, and local services.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6 md:p-8 hover:border-primary/30 hover:shadow-md transition-all"
                >
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                    <Icon className="w-7 h-7 text-primary" />
                  </div>

                  <h3 className="text-label-md font-bold text-on-surface mb-4">
                    {item.title}
                  </h3>

                  <p className="text-body-md text-on-surface-variant leading-7">
                    {item.text}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Trust Section */}
        <section className="bg-surface-container-high rounded-2xl border border-outline-variant p-8 md:p-12">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-headline-md font-bold text-on-surface">
              Built on Trust and Security
            </h2>

            <p className="text-body-md text-on-surface-variant mt-5 leading-8">
              We understand that trust is the currency of the digital economy.
              That&apos;s why NepWork is built on a foundation of security:
              Verified Profiles, Location-Based Discovery, and Community
              Support.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-12">
            {trustFeatures.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="bg-surface-container-lowest rounded-lg border border-outline-variant p-6 text-center"
                >
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5">
                    <Icon className="w-7 h-7 text-primary" />
                  </div>

                  <h3 className="text-label-md font-bold text-on-surface">
                    {item.title}
                  </h3>
                </div>
              );
            })}
          </div>
        </section>

        {/* Why Nepal Section */}
        <section className="grid lg:grid-cols-2 gap-10 items-center">
          <div className="flex justify-center">
            <div className="w-64 h-64 rounded-full bg-primary/10 flex items-center justify-center">
              <img
                src="/favicon.svg"
                alt="NepWork Logo"
                className="w-40 h-40 object-contain"
              />
            </div>
          </div>

          <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6 md:p-8">
            <h2 className="text-headline-md font-bold text-on-surface mb-6">
              Made for Nepal, by Nepalis
            </h2>

            <p className="text-body-md text-on-surface-variant leading-8">
              Nepal is a country of immense talent, resilience, and creativity.
              NepWork was founded to keep this talent close to home.
            </p>

            <p className="text-body-md text-on-surface-variant leading-8 mt-6">
              By empowering local professionals with digital tools, we are
              helping to strengthen Nepal&apos;s economy, one job at a time.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}