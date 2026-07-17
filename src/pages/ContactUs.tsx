import {
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from 'lucide-react';

export default function ContactUs() {
  return (
    <main className="bg-background min-h-screen">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 space-y-20">
        {/* Header */}
        <section className="text-center max-w-4xl mx-auto">
          <span className="text-primary font-semibold uppercase tracking-widest">
            Contact Us
          </span>

          <h1 className="text-headline-lg font-bold text-on-surface mt-4">
            We&apos;d Love to Hear From You
          </h1>

          <p className="text-body-md text-on-surface-variant mt-6 leading-8">
            Have questions, suggestions, or need support? Our team is here to
            help you make the most of NepWork.
          </p>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side */}
          <div className="space-y-6">
            {/* Contact Information */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6 md:p-8">
              <h2 className="text-headline-md font-bold text-on-surface mb-8">
                Get in Touch
              </h2>

              <div className="space-y-8">
                {/* Email */}
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>

                  <div>
                    <h3 className="font-semibold text-on-surface">Email</h3>

                    <a
                      href="mailto:support@nepwork.com"
                      className="text-on-surface-variant hover:text-primary transition-colors"
                    >
                      support@nepwork.com
                    </a>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>

                  <div>
                    <h3 className="font-semibold text-on-surface">Phone</h3>

                    <a
                      href="tel:+97798XXXXXXXX"
                      className="text-on-surface-variant hover:text-primary transition-colors"
                    >
                      +977-98XXXXXXXX
                    </a>
                  </div>
                </div>

                {/* Location */}
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>

                  <div>
                    <h3 className="font-semibold text-on-surface">
                      Location
                    </h3>

                    <a
                      href="https://maps.google.com/?q=Dhangadhi,Kailali,Nepal"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-on-surface-variant hover:text-primary transition-colors"
                    >
                      Dhangadhi, Kailali, Nepal
                    </a>
                  </div>
                </div>

                {/* Support Hours */}
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <MessageCircle className="w-6 h-6 text-primary" />
                  </div>

                  <div>
                    <h3 className="font-semibold text-on-surface">
                      Support Hours
                    </h3>

                    <p className="text-on-surface-variant">
                      Sunday - Friday
                    </p>

                    <p className="text-on-surface-variant">
                      9:00 AM - 6:00 PM (NPT)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Info Card */}
            <div className="bg-surface-container-high border border-outline-variant rounded-lg p-6">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <MessageCircle className="w-7 h-7 text-primary" />
                </div>

                <div>
                  <h3 className="text-label-md font-semibold text-on-surface mb-2">
                    Reach Out Anytime
                  </h3>

                  <p className="text-body-md text-on-surface-variant leading-7">
                    We value every question, suggestion, and piece of feedback
                    from our community. Feel free to contact us whenever you
                    need assistance, have ideas to improve NepWork, or want to
                    report an issue.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-8 flex flex-col justify-center">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <MessageCircle className="w-10 h-10 text-primary" />
              </div>

              <h2 className="text-headline-md font-bold text-on-surface mb-4">
                Quick Contact
              </h2>

              <p className="text-body-md text-on-surface-variant leading-8 mb-10">
                Choose your preferred way to reach our team. We are always happy
                to assist you and answer your questions.
              </p>

              <div className="space-y-5">
                <a
                  href="mailto:support@nepwork.com"
                  className="flex items-center justify-center gap-3 text-primary font-medium hover:underline"
                >
                  <Mail className="w-5 h-5" />
                  support@nepwork.com
                </a>

                <a
                  href="tel:+97798XXXXXXXX"
                  className="flex items-center justify-center gap-3 text-primary font-medium hover:underline"
                >
                  <Phone className="w-5 h-5" />
                  +977-98XXXXXXXX
                </a>

                <a
                  href="https://maps.google.com/?q=Dhangadhi,Kailali,Nepal"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 text-primary font-medium hover:underline"
                >
                  <MapPin className="w-5 h-5" />
                  Dhangadhi, Kailali, Nepal
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}