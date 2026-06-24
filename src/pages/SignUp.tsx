import { Link } from 'react-router-dom';

import { SignUpForm, SignUpIntro, SocialMediaLogin } from '../features/auth';

function SignUp() {
  return (
    <>
      <div className="overflow-x-hidden antialiased bg-background text-on-surface font-body">
        <main className="min-h-screen flex flex-col md:flex-row">
          <SignUpIntro />

          <section className="flex-1 bg-background flex flex-col justify-center items-center px-margin py-xl relative gap-8">
            <div className="w-full max-w-105 bg-surface p-lg md:p-0 rounded-lg md:bg-transparent shadow-form md:shadow-none">
              <Link
                to="/"
                className="md:hidden flex flex-col items-center gap-sm mb-xl">
                <img
                  alt="NepWork Logo"
                  className="h-12 w-12"
                  src="favicon.svg"
                />
                <span className="font-bold text-headline-md text-primary">
                  NepWork
                </span>
              </Link>
              <div className="space-y-sm text-center md:text-left mb-xl">
                <h1 className=" font-extrabold mb-xs tracking-tight text-headline-lg text-on-surface">
                  Join NepWork
                </h1>
                <p className=" text-on-surface-variant font-medium text-body-md ">
                  Start your journey today by creating a new account.
                </p>
              </div>

              <SignUpForm />

              <div className="text-center mt-xl">
                <p className="font-body text-body-md text-on-surface-variant">
                  Already have an account?
                  <Link
                    to="/login"
                    className="text-primary hover:underline font-semibold transition-colors duration-200 ml-1">
                    Sign In
                  </Link>
                </p>
              </div>
              <div className="relative flex items-center py-base my-3">
                <div className="grow border-t border-outline-variant"></div>
                <span className="shrink mx-base text-outline text-label-md font-medium">
                  OR
                </span>
                <div className="grow border-t border-outline-variant"></div>
              </div>
              <SocialMediaLogin />
            </div>
            <footer className="mt-xl text-center w-full ">
              <p className="font-label-md text-label-md text-outline">
                © 2024 NepWork . All rights reserved.
              </p>
            </footer>
          </section>
        </main>
      </div>
    </>
  );
}

export default SignUp;
