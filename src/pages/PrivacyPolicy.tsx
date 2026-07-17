export default function PrivacyPolicy() {
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
                Privacy Policy
              </h1>

              <p className="text-on-surface-variant">
                Last updated: July 2026
              </p>
            </div>
          </div>

          <div className="space-y-10 text-on-surface-variant leading-8">
            <section>
              <h2 className="text-headline-md font-bold text-on-surface mb-4">
                1. Introduction
              </h2>

              <p>
                Welcome to NepWork. Your privacy is important to us. This
                Privacy Policy explains how we collect, use, and protect your
                information when you use our platform.
              </p>
            </section>

            <section>
              <h2 className="text-headline-md font-bold text-on-surface mb-4">
                2. Information We Collect
              </h2>

              <ul className="list-disc pl-6 space-y-2">
                <li>Name and profile information</li>
                <li>Email address and account details</li>
                <li>Profile picture and uploaded documents</li>
                <li>Job applications and service requests</li>
                <li>Location information used for nearby discovery</li>
                <li>Messages exchanged through the platform</li>
              </ul>
            </section>

            <section>
              <h2 className="text-headline-md font-bold text-on-surface mb-4">
                3. How We Use Your Information
              </h2>

              <ul className="list-disc pl-6 space-y-2">
                <li>To create and manage your account.</li>
                <li>To connect job seekers, employers, and service providers.</li>
                <li>To improve recommendations and search results.</li>
                <li>To provide location-based discovery features.</li>
                <li>To maintain the security and integrity of the platform.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-headline-md font-bold text-on-surface mb-4">
                4. Location Information
              </h2>

              <p>
                NepWork may use your location information to help you discover
                nearby jobs and services. Your location is used only to improve
                platform functionality and is not sold to third parties.
              </p>
            </section>

            <section>
              <h2 className="text-headline-md font-bold text-on-surface mb-4">
                5. Job Applications and Uploaded Files
              </h2>

              <p>
                Resumes, profile pictures, and other uploaded documents are
                stored securely and are only accessible to authorized users and
                employers involved in the application process.
              </p>
            </section>

            <section>
              <h2 className="text-headline-md font-bold text-on-surface mb-4">
                6. Data Sharing
              </h2>

              <p>
                NepWork does not sell your personal information. We may share
                limited information with employers, service providers, or when
                required by law.
              </p>
            </section>

            <section>
              <h2 className="text-headline-md font-bold text-on-surface mb-4">
                7. Data Security
              </h2>

              <p>
                We implement reasonable security measures to protect your data
                against unauthorized access, alteration, or disclosure.
              </p>
            </section>

            <section>
              <h2 className="text-headline-md font-bold text-on-surface mb-4">
                8. Cookies and Analytics
              </h2>

              <p>
                NepWork may use cookies and similar technologies to improve user
                experience and understand how the platform is used.
              </p>
            </section>

            <section>
              <h2 className="text-headline-md font-bold text-on-surface mb-4">
                9. Your Rights
              </h2>

              <p>
                You may update your profile information, request corrections,
                or contact us regarding your personal data at any time.
              </p>
            </section>

            <section>
              <h2 className="text-headline-md font-bold text-on-surface mb-4">
                10. Changes to This Policy
              </h2>

              <p>
                We may update this Privacy Policy from time to time. Any changes
                will be posted on this page with an updated revision date.
              </p>
            </section>

            <section>
              <h2 className="text-headline-md font-bold text-on-surface mb-4">
                11. Contact Us
              </h2>

              <p>
                If you have any questions regarding this Privacy Policy, please
                contact the NepWork team through our support channels.
              </p>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}