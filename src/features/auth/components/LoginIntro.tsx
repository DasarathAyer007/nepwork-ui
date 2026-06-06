import { BriefcaseBusiness, CircleUser } from 'lucide-react';
import { Link } from 'react-router-dom';

import workspaceImage from '../assets/work_space.png';

function LoginIntro() {
  return (
    <>
      <section className="relative hidden md:flex md:w-1/2  bg-primary overflow-hidden items-center justify-center p-xl">
        <div className="absolute inset-0 z-0">
          <img
            alt="Professional coworking space"
            className="w-full h-full object-cover opacity-50"
            src={workspaceImage}
          />
          <div className="absolute inset-0 bg-linear-to-tr from-primary via-primary/40 to-transparent"></div>
        </div>

        <div className="relative z-10 w-full  px-lg">
          <div className="mb-xl">
            <Link to="/">
              <div className="flex items-center gap-sm">
                <img
                  alt="NepWork Logo"
                  className="h-14 w-auto drop-shadow-md"
                  src="favicon.svg"
                />
                <span className="text-on-primary font-bold text-2xl tracking-tight">
                  NepWork
                </span>
              </div>
            </Link>
          </div>
          <div className="glass-panel p-xl rounded-lg text-on-primary shadow-ambient">
            <div className="flex gap-xs mb-md">
              <span
                className="material-symbols-outlined text-on-primary/90"
                style={{ fontVariationSettings: "'FILL' 1" }}>
                <BriefcaseBusiness />
              </span>
              <span
                className="material-symbols-outlined text-on-primary/90"
                style={{ fontVariationSettings: "'FILL' 1" }}>
                <BriefcaseBusiness />
              </span>
              <span
                className="material-symbols-outlined text-on-primary/90"
                style={{ fontVariationSettings: "'FILL' 1" }}>
                <BriefcaseBusiness />
              </span>
              <span
                className="material-symbols-outlined text-on-primary/90"
                style={{ fontVariationSettings: "'FILL' 1" }}>
                <BriefcaseBusiness />
              </span>
              <span
                className="material-symbols-outlined text-on-primary/90"
                style={{ fontVariationSettings: "'FILL' 1" }}>
                <BriefcaseBusiness />
              </span>
            </div>
            <p className="text-lg font-medium italic mb-lg leading-relaxed text-on-primary/95">
              "NepWork is a professional networking platform built to connect
              talented individuals, freelancers, and employers across Nepal.
              Discover opportunities, showcase your skills, and build meaningful
              professional relationships in one trusted community."
            </p>
            <div className="flex items-center gap-md">
              <CircleUser className="w-12 h-12 rounded-full overflow-hidden border-2 border-on-primary/30 shadow-sm" />

              <div>
                <p className="font-bold text-base leading-tight">NepWork</p>
                <p className="text-white/70 text-xs font-semibold uppercase tracking-wider">
                  Connecting Nepal's Professionals
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-base right-base text-white/10 pointer-events-none">
          <span
            className="material-symbols-outlined text-[140px]"
            style={{ fontVariationSettings: "'wght' 100" }}>
            hub
          </span>
        </div>
      </section>
    </>
  );
}

export default LoginIntro;
