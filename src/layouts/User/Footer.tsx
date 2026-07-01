function Footer() {
  return (
    <>
      <footer className="bg-surface-container-high dark:bg-surface-container-high border-t border-outline-variant mt-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 w-full px-6 md:px-12 py-12 max-w-7xl mx-auto">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              {/* <img
                alt="NepWork Logo"
                className="h-8"
                src="https://lh3.googleusercontent.com/aida/AP1WRLt3hNw3JuAWJRY-AKyc5z66_4EZ7uEthgXj26ZNRy9LJuLRLQ6lhM4dHDxXITBb-rRS159HT4VH1jsLM6PbvKnhiOxxZEqJvo4sqck8trpfl_G2Ouf0_B01915M3NjmVzvF2jMYlgAiV-D0iNrbfAqqoYVkQ6qppZ2uFvkMYD4JOdw19g3sha8Dbs2epCtQdse4U1xKPA7aB0cdQ5Seyq9rLggTNgtVEbwQbxE1cj5P6b9tm3jfmMJ1YWM"
              /> */}
              <span className="text-headline-sm font-bold text-on-surface dark:text-on-surface">
                NepWork
              </span>
            </div>
            <p className="text-on-surface-variant font-body text-body-md leading-relaxed">
              Connecting the skilled and the seekers across Nepal. Building a
              future of decentralized, local work.
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="font-bold text-on-surface">Platform</h4>
            <ul className="space-y-2 text-on-surface-variant font-body text-body-md">
              <li>
                <a
                  className="hover:text-primary dark:hover:text-primary-fixed underline decoration-2 transition-opacity"
                  href="jobs">
                  Find Jobs
                </a>
              </li>
              <li>
                <a
                  className="hover:text-primary dark:hover:text-primary-fixed underline decoration-2 transition-opacity"
                  href="#">
                  Hire Experts
                </a>
              </li>
              <li>
                <a
                  className="hover:text-primary dark:hover:text-primary-fixed underline decoration-2 transition-opacity"
                  href="#">
                  Marketplace
                </a>
              </li>
              <li>
                <a
                  className="hover:text-primary dark:hover:text-primary-fixed underline decoration-2 transition-opacity"
                  href="#">
                  Post a Task
                </a>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-bold text-on-surface">Company</h4>
            <ul className="space-y-2 text-on-surface-variant font-body text-body-md">
              <li>
                <a
                  className="hover:text-primary dark:hover:text-primary-fixed underline decoration-2 transition-opacity"
                  href="#">
                  About Us
                </a>
              </li>
              <li>
                <a
                  className="hover:text-primary dark:hover:text-primary-fixed underline decoration-2 transition-opacity"
                  href="#">
                  Careers
                </a>
              </li>
              <li>
                <a
                  className="hover:text-primary dark:hover:text-primary-fixed underline decoration-2 transition-opacity"
                  href="#">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  className="hover:text-primary dark:hover:text-primary-fixed underline decoration-2 transition-opacity"
                  href="#">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-bold text-on-surface">Support</h4>
            <ul className="space-y-2 text-on-surface-variant font-body text-body-md">
              <li>
                <a
                  className="hover:text-primary dark:hover:text-primary-fixed underline decoration-2 transition-opacity"
                  href="#">
                  Help Center
                </a>
              </li>
              <li>
                <a
                  className="hover:text-primary dark:hover:text-primary-fixed underline decoration-2 transition-opacity"
                  href="#">
                  Contact Us
                </a>
              </li>
              <li>
                <a
                  className="hover:text-primary dark:hover:text-primary-fixed underline decoration-2 transition-opacity"
                  href="#">
                  Safety Center
                </a>
              </li>
              <li>
                <a
                  className="hover:text-primary dark:hover:text-primary-fixed underline decoration-2 transition-opacity"
                  href="#">
                  Community
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="w-full px-6 md:px-12 py-6 border-t border-outline-variant/30 text-center text-on-surface-variant text-body-md max-w-7xl mx-auto">
          © 2026 NepWork. All rights reserved.
        </div>
      </footer>
    </>
  );
}

export default Footer;
