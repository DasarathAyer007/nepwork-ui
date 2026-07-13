import { ArrowBigRight, Handshake, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Card } from '@/components/ui/Card';

function EntryCard() {
  return (
    <>
      <div className="grid md:grid-cols-2 gap-8">
        {/* <!-- Worker Entry --> */}
        <Card variant="interactive" className="group p-8 hover:-translate-y-2">
          <div className="flex items-start justify-between">
            <div className="space-y-4">
              <div className="w-14 h-14 bg-primary-fixed rounded-xl flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-3xl">
                  <UserPlus />
                </span>
              </div>
              <h3 className="text-2xl font-bold text-on-surface">
                I want to work
              </h3>
              <p className="text-on-surface-variant leading-relaxed">
                Join thousands of professionals finding daily tasks, long-term
                contracts, and quick gigs.
              </p>
              <Link
                to="/jobs"
                className="flex items-center gap-2 text-primary font-bold group-hover:gap-4 transition-all">
                Browse Jobs{' '}
                <span className="material-symbols-outlined">
                  <ArrowBigRight />
                </span>
              </Link>
            </div>
          </div>
        </Card>
        {/* <!-- Employer Entry --> */}
        <Card variant="interactive" className="group p-8 hover:-translate-y-2">
          <div className="flex items-start justify-between">
            <div className="space-y-4">
              <div className="w-14 h-14 bg-secondary-container rounded-xl flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined text-3xl">
                  <Handshake />
                </span>
              </div>
              <h3 className="text-2xl font-bold text-on-surface">
                I want to hire
              </h3>
              <p className="text-on-surface-variant leading-relaxed">
                Find verified experts for home repair, digital marketing, or
                seasonal household help.
              </p>
              <Link
                to="/services"
                className="flex items-center gap-2 text-primary font-bold group-hover:gap-4 transition-all">
                Browse Services{' '}
                <span className="material-symbols-outlined">
                  <ArrowBigRight />
                </span>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}

export default EntryCard;
