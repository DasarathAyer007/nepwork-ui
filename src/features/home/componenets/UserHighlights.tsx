import { Briefcase, Eye, MessageCircle, Trophy } from 'lucide-react';

function UserHighlights() {
  const stats = [
    {
      icon: Briefcase,
      value: '12',
      label: 'Applications',
    },
    {
      icon: MessageCircle,
      value: '5',
      label: 'Messages',
    },
    {
      icon: Eye,
      value: '127',
      label: 'Profile Views',
    },
    {
      icon: Trophy,
      value: '8',
      label: 'Completed Projects',
    },
  ];

  return (
    <section className="py-24 px-6 md:px-12 bg-surface border-y border-outline-variant/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-on-surface">Your Progress</h2>

          <p className="text-on-surface-variant mt-2">
            Keep growing your professional journey on NepWork.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {stats.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={index}
                className="bg-surface-container-lowest rounded-2xl p-8 border border-outline-variant text-center">
                <Icon className="mx-auto text-primary mb-4" size={28} />

                <h3 className="text-3xl font-bold">{item.value}</h3>

                <p className="text-on-surface-variant mt-2">{item.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default UserHighlights;
