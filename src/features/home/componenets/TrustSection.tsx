import { BadgeCheck, CreditCard, MessageCircleMore, Star } from 'lucide-react';

const trustFeatures = [
  {
    icon: BadgeCheck,
    title: 'Verified Professionals',
  },
  {
    icon: CreditCard,
    title: 'Secure Payments',
  },
  {
    icon: MessageCircleMore,
    title: '24/7 Support',
  },
  {
    icon: Star,
    title: 'Real Reviews',
  },
];

const stats = [
  {
    value: '15k+',
    label: 'Active Workers',
  },
  {
    value: '4.8/5',
    label: 'Average Rating',
  },
  {
    value: '100%',
    label: 'Secure Payments',
  },
  {
    value: '50k+',
    label: 'Tasks Completed',
  },
];

function TrustSection() {
  return (
    <section className="py-20 px-6 md:px-12 max-w-7xl mx-auto">
      <div className="relative overflow-hidden rounded-3xl bg-surface-container-high p-12">
        {/* Background blur */}
        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-secondary/5 blur-3xl" />

        <div className="relative z-10 text-center">
          <h2 className="text-3xl font-bold text-on-surface mb-3">
            Built on Trust and Security
          </h2>

          <p className="text-on-surface-variant max-w-2xl mx-auto mb-14">
            NepWork helps professionals and employers connect with confidence
            through verified profiles, secure interactions, and community trust.
          </p>

          {/* Trust Features */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            {trustFeatures.map((feature) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="flex flex-col items-center gap-3 transition-transform duration-300 hover:-translate-y-1">
                  <Icon className="text-primary" size={38} />

                  <span className="font-semibold text-on-surface">
                    {feature.title}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label}>
                <div className="text-4xl font-bold text-primary">
                  {stat.value}
                </div>

                <div className="mt-2 text-sm text-on-surface-variant">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default TrustSection;
