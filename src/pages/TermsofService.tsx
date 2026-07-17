export default function TermsOfService() {
  return (
    <main className="bg-background min-h-screen">
      <div className="max-w-5xl mx-auto px-4 md:px-8 py-16">
        <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 md:p-10">
          <div className="flex items-center gap-3 mb-8">
            <img
              src="/favicon.svg"
              alt="NepWork Logo"
              className="w-10 h-10"
            />

            <div>
              <h1 className="text-headline-lg font-bold text-on-surface">
                Terms of Service
              </h1>

              <p className="text-on-surface-variant">
                Last updated: July 2026
              </p>
            </div>
          </div>

          <div className="space-y-10 text-on-surface-variant leading-8">
            <section>
              <h2 className="text-headline-md font-bold text-on-surface mb-4">
                1. Acceptance of Terms
              </h2>

              <p>
                By accessing or using NepWork, you agree to be bound by these
                Terms of Service. If you do not agree with these terms, please
                do not use our platform.
              </p>
            </section>

            <section>
              <h2 className="text-headline-md font-bold text-on-surface mb-4">
                2. Eligibility
              </h2>

              <p>
                You must provide accurate information when creating an account
                and comply with all applicable laws and regulations while using
                NepWork.
              </p>
            </section>

            <section>
              <h2 className="text-headline-md font-bold text-on-surface mb-4">
                3. User Accounts
              </h2>

              <ul className="list-disc pl-6 space-y-2">
                <li>You are responsible for maintaining your account security.</li>
                <li>You must keep your login credentials confidential.</li>
                <li>You are responsible for all activities under your account.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-headline-md font-bold text-on-surface mb-4">
                4. Jobs and Services
              </h2>

              <p>
                NepWork provides a platform for connecting job seekers,
                employers, service providers, and customers. NepWork does not
                guarantee employment, service quality, or the completion of any
                transaction between users.
              </p>
            </section>

            <section>
              <h2 className="text-headline-md font-bold text-on-surface mb-4">
                5. User Responsibilities
              </h2>

              <ul className="list-disc pl-6 space-y-2">
                <li>Provide truthful and accurate information.</li>
                <li>Respect other users and communicate professionally.</li>
                <li>Use the platform only for lawful purposes.</li>
                <li>Comply with all applicable laws and regulations.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-headline-md font-bold text-on-surface mb-4">
                6. Prohibited Activities
              </h2>

              <ul className="list-disc pl-6 space-y-2">
                <li>Posting false or misleading information.</li>
                <li>Impersonating another person or organization.</li>
                <li>Uploading malicious software or harmful content.</li>
                <li>Harassing, threatening, or abusing other users.</li>
                <li>Using the platform for fraudulent activities.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-headline-md font-bold text-on-surface mb-4">
                7. Intellectual Property
              </h2>

              <p>
                All trademarks, logos, branding, and platform content related to
                NepWork remain the property of NepWork and its creators unless
                otherwise stated.
              </p>
            </section>

            <section>
              <h2 className="text-headline-md font-bold text-on-surface mb-4">
                8. Account Suspension and Termination
              </h2>

              <p>
                NepWork reserves the right to suspend or terminate accounts that
                violate these Terms of Service or engage in activities that may
                harm the platform or its users.
              </p>
            </section>

            <section>
              <h2 className="text-headline-md font-bold text-on-surface mb-4">
                9. Limitation of Liability
              </h2>

              <p>
                NepWork acts solely as a platform for connecting users and shall
                not be liable for disputes, losses, damages, or unsuccessful
                transactions between users.
              </p>
            </section>

            <section>
              <h2 className="text-headline-md font-bold text-on-surface mb-4">
                10. Changes to These Terms
              </h2>

              <p>
                We may modify these Terms of Service from time to time. Updated
                versions will be posted on this page with a revised date.
              </p>
            </section>

            <section>
              <h2 className="text-headline-md font-bold text-on-surface mb-4">
                11. Contact Us
              </h2>

              <p>
                If you have questions regarding these Terms of Service, please
                contact the NepWork team through our support channels.
              </p>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}