import { Link } from 'react-router-dom';

import { LoginForm, LoginIntro, SocialMediaLogin } from '../features/auth';

function LogIn() {
  return (
    <>
      <div className="bg-background text-on-surface font-body overflow-x-hidden">
        <main className="min-h-screen flex flex-col md:flex-row">
          <LoginIntro />
          <section className="flex-1 bg-background flex flex-col justify-center items-center px-margin py-xl relative gap-8">
            <Link
              to="/"
              className="md:hidden  top-lg left-margin flex items-center gap-xs left-8 self-start pl-8">
              <img
                alt="NepWork Logo"
                className="h-10 w-auto"
                src="favicon.svg"
              />
              <span className="text-primary font-bold text-xl">NepWork</span>
            </Link>
            <div className="w-full max-w-105 bg-surface p-lg md:p-0 rounded-lg md:bg-transparent shadow-form md:shadow-none">
              <div className="mb-xl text-center md:text-left">
                <h1 className="text-headline-lg font-extrabold text-on-surface mb-xs tracking-tight">
                  Welcome Back
                </h1>
                <p className="text-on-surface-variant font-medium text-body-md ">
                  Access your professional network and projects.
                </p>
              </div>

              <SocialMediaLogin />

              <div className="relative mb-xl flex items-center justify-center">
                <div className="border-t border-outline-variant w-full absolute"></div>
                <span className="relative bg-surface md:bg-background px-md text-on-surface-variant font-bold text-xs uppercase tracking-[0.2em]">
                  OR
                </span>
              </div>

              <LoginForm />

              <div className="mt-xl text-center">
                <p className="text-sm font-medium text-on-surface-variant">
                  Don't have an account?
                  <Link
                    className="text-primary pl-sm font-extrabold hover:underline underline-offset-4"
                    to="/signup">
                    Create Account
                  </Link>
                </p>
              </div>
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
export default LogIn;
