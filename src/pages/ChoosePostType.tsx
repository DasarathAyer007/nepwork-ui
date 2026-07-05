import { ArrowRight, Briefcase, Wrench } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const OPTIONS = [
  {
    title: 'Create a Job',
    description:
      'Hire someone for a role. Set pay, location, and requirements so the right people can apply.',
    icon: Briefcase,
    route: '/create/job',
  },
  {
    title: 'Create a Service',
    description:
      'Offer something you do — a skill, a task, a gig. List what you provide and your rate.',
    icon: Wrench,
    route: '/create/service',
  },
];

export default function ChoosePostType() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[60vh] w-full flex flex-col items-center justify-center px-6 py-16 bg-bg">
      <div className="max-w-2xl w-full text-center mb-10">
        <h1 className="text-headline-md font-semibold text-text">
          What do you want to post?
        </h1>
        <p className="text-body-md text-muted mt-2">
          Choose the option that fits what you're offering.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-5 w-full max-w-2xl">
        {OPTIONS.map(({ title, description, icon: Icon, route }) => (
          <button
            key={route}
            onClick={() => navigate(route)}
            className="group flex flex-col items-start text-left gap-4 p-6 rounded-lg border border-border bg-card hover:border-primary hover:shadow-md transition-all">
            <span className="flex items-center justify-center w-11 h-11 rounded-md bg-primary-container text-primary">
              <Icon size={22} />
            </span>

            <div>
              <h2 className="text-body-lg font-semibold text-text">{title}</h2>
              <p className="text-body-md text-muted mt-1">{description}</p>
            </div>

            <span className="flex items-center gap-1 text-body-md font-medium text-primary mt-auto pt-2 group-hover:gap-2 transition-[gap]">
              Continue
              <ArrowRight size={16} />
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
