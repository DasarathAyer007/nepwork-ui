const steps = [
  {
    number: 1,
    title: 'Create Profile',
    description:
      'List your skills or describe your project needs with just a few clicks.',
  },
  {
    number: 2,
    title: 'Connect',
    description:
      'Review applications, proposals, and communicate directly with professionals.',
  },
  {
    number: 3,
    title: 'Get Things Done',
    description:
      'Complete projects confidently and build your reputation on NepWork.',
  },
];

function HowItWorks() {
  return (
    <section className="bg-surface py-24 px-6 md:px-12 border-y border-outline-variant/30">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-on-surface mb-3">
          How NepWork Works
        </h2>

        <p className="text-on-surface-variant mb-16 max-w-2xl mx-auto">
          Whether you're looking for work or hiring talent, getting started on
          NepWork is quick and easy.
        </p>

        <div className="grid md:grid-cols-3 gap-16 relative">
          {/* Connector line */}
          <div className="hidden md:block absolute top-10 left-1/4 right-1/4 h-0.5 bg-linear-to-r from-primary/10 via-primary/50 to-primary/10 -z-10" />

          {steps.map((step) => (
            <div key={step.number} className="space-y-4">
              <div className="w-20 h-20 bg-primary text-on-primary rounded-full flex items-center justify-center mx-auto text-3xl font-bold shadow-lg transition-transform duration-300 hover:scale-105">
                {step.number}
              </div>

              <h4 className="text-xl font-bold text-on-surface">
                {step.title}
              </h4>

              <p className="text-on-surface-variant leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
