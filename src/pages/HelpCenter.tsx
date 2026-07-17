import {
  Briefcase,
  HelpCircle,
  Mail,
  MapPin,
  MessageCircle,
  Shield,
  User,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HelpCenter() {
  const faqs = [
    {
      question: 'How do I create an account?',
      answer:
        'Click on Sign Up, enter your details, verify your email address, and complete your profile to start using NepWork.',
      icon: User,
    },
    {
      question: 'How can I apply for a job?',
      answer:
        'Browse available jobs, open the job details page, and click the Apply button to submit your application.',
      icon: Briefcase,
    },
    {
      question: 'How do I hire someone for a service?',
      answer:
        'Go to the Services section, choose a verified provider, and contact them or send a request through the platform.',
      icon: MessageCircle,
    },
    {
      question: 'How does location-based discovery work?',
      answer:
        'NepWork uses location information to help users discover nearby jobs and services more easily.',
      icon: MapPin,
    },
    {
      question: 'How do I report suspicious activity?',
      answer:
        'If you notice fake profiles, spam, or inappropriate content, please contact our support team immediately.',
      icon: Shield,
    },
  ];

  return (
    <main className="bg-background min-h-screen">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 space-y-16">
        {/* Header */}
        <section className="text-center max-w-4xl mx-auto">
          <span className="text-primary font-semibold uppercase tracking-widest">
            Help Center
          </span>

          <h1 className="text-headline-lg font-bold text-on-surface mt-4">
            How can we help you?
          </h1>

          <p className="text-body-md text-on-surface-variant mt-6 leading-8">
            Find answers to common questions and learn how to make the most of
            NepWork's job and service marketplace.
          </p>
        </section>

        {/* FAQs */}
        <section>
          <div className="grid md:grid-cols-2 gap-6">
            {faqs.map((faq) => {
              const Icon = faq.icon;

              return (
                <div
                  key={faq.question}
                  className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6"
                >
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-5">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>

                  <h3 className="text-label-md font-bold text-on-surface mb-3">
                    {faq.question}
                  </h3>

                  <p className="text-body-md text-on-surface-variant leading-7">
                    {faq.answer}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Contact Support */}
        <section className="bg-surface-container-high border border-outline-variant rounded-2xl p-8 md:p-12">
          <div className="text-center max-w-3xl mx-auto">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <HelpCircle className="w-8 h-8 text-primary" />
            </div>

            <h2 className="text-headline-md font-bold text-on-surface">
              Still Need Help?
            </h2>

            <p className="text-body-md text-on-surface-variant mt-5 leading-8">
              If you cannot find the answer you are looking for, our support
              team is here to help.
            </p>

            <div className="flex justify-center mt-8">
              <Link
                to="/contact-us"
                className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition"
              >
                <Mail className="w-5 h-5" />
                Contact Support
              </Link>
            </div>
          </div>
        </section>

        {/* Quick Links */}
        <section>
          <h2 className="text-headline-md font-bold text-on-surface text-center mb-8">
            Quick Links
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <Link
              to="/about"
              className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6 hover:border-primary/30 transition"
            >
              <h3 className="font-semibold text-on-surface mb-2">
                About NepWork
              </h3>
              <p className="text-body-md text-on-surface-variant">
                Learn more about our mission and vision.
              </p>
            </Link>

            <Link
              to="/privacy-policy"
              className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6 hover:border-primary/30 transition"
            >
              <h3 className="font-semibold text-on-surface mb-2">
                Privacy Policy
              </h3>
              <p className="text-body-md text-on-surface-variant">
                Understand how your information is protected.
              </p>
            </Link>

            <Link
              to="/terms-of-service"
              className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6 hover:border-primary/30 transition"
            >
              <h3 className="font-semibold text-on-surface mb-2">
                Terms of Service
              </h3>
              <p className="text-body-md text-on-surface-variant">
                Read the rules and guidelines of using NepWork.
              </p>
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}