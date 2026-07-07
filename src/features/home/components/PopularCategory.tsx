import { useEffect, useRef, useState } from 'react';

import {
  Bike,
  BookOpen,
  Camera,
  ChevronLeft,
  ChevronRight,
  Code,
  Dumbbell,
  Home,
  Palette,
  Scissors,
  Sparkles,
  Truck,
  Utensils,
  Wrench,
} from 'lucide-react';

const categories = [
  {
    title: 'Home Repair',
    icon: Home,
    count: '1.2k+',
    iconBg: 'bg-primary-fixed',
    iconColor: 'text-primary',
  },
  {
    title: 'Digital Tasks',
    icon: Code,
    count: '850+',
    iconBg: 'bg-secondary-container',
    iconColor: 'text-secondary',
  },
  {
    title: 'Delivery',
    icon: Bike,
    count: '2.4k+',
    iconBg: 'bg-tertiary-fixed',
    iconColor: 'text-tertiary',
  },
  {
    title: 'Cleaning',
    icon: Sparkles,
    count: '600+',
    iconBg: 'bg-primary-fixed',
    iconColor: 'text-primary',
  },
  {
    title: 'Electrician',
    icon: Wrench,
    count: '450+',
    iconBg: 'bg-secondary-container',
    iconColor: 'text-secondary',
  },
  {
    title: 'Design',
    icon: Palette,
    count: '320+',
    iconBg: 'bg-tertiary-fixed',
    iconColor: 'text-tertiary',
  },
  {
    title: 'Photography',
    icon: Camera,
    count: '280+',
    iconBg: 'bg-primary-fixed',
    iconColor: 'text-primary',
  },
  {
    title: 'Tutoring',
    icon: BookOpen,
    count: '500+',
    iconBg: 'bg-secondary-container',
    iconColor: 'text-secondary',
  },
  {
    title: 'Cooking',
    icon: Utensils,
    count: '190+',
    iconBg: 'bg-tertiary-fixed',
    iconColor: 'text-tertiary',
  },
  {
    title: 'Fitness',
    icon: Dumbbell,
    count: '230+',
    iconBg: 'bg-primary-fixed',
    iconColor: 'text-primary',
  },
  {
    title: 'Moving',
    icon: Truck,
    count: '370+',
    iconBg: 'bg-secondary-container',
    iconColor: 'text-secondary',
  },
  {
    title: 'Beauty',
    icon: Scissors,
    count: '410+',
    iconBg: 'bg-tertiary-fixed',
    iconColor: 'text-tertiary',
  },
];

function PopularCategory() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollState = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 8);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateScrollState();
    el.addEventListener('scroll', updateScrollState, { passive: true });
    return () => el.removeEventListener('scroll', updateScrollState);
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    scrollRef.current?.scrollBy({
      left: direction === 'left' ? -320 : 320,
      behavior: 'smooth',
    });
  };

  return (
    <section className="bg-surface-container-low py-15 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold text-on-surface mb-2">
              Popular Categories
            </h2>
            <p className="text-on-surface-variant">
              Explore the most demanded services in your area.
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* <button className="hidden md:flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline underline-offset-4">
              View All <ArrowRight className="w-4 h-4" />
            </button> */}

            {/* Arrow controls */}
            <div className="flex gap-2">
              <button
                onClick={() => scroll('left')}
                disabled={!canScrollLeft}
                className="p-2 rounded-full bg-surface-container-lowest border border-outline-variant hover:bg-primary hover:text-on-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => scroll('right')}
                disabled={!canScrollRight}
                className="p-2 rounded-full bg-surface-container-lowest border border-outline-variant hover:bg-primary hover:text-on-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Scroll track with fade edges */}
        <div className="relative">
          {/* Left fade */}
          <div
            className="pointer-events-none absolute left-0 top-0 bottom-2 w-16 bg-linear-to-r from-surface-container-low to-transparent z-10 transition-opacity duration-300"
            style={{ opacity: canScrollLeft ? 1 : 0 }}
          />
          {/* Right fade */}
          <div
            className="pointer-events-none absolute right-0 top-0 bottom-2 w-16 bg-linear-to-l from-surface-container-low to-transparent z-10 transition-opacity duration-300"
            style={{ opacity: canScrollRight ? 1 : 0 }}
          />

          {/* Scrollable list */}
          <div
            ref={scrollRef}
            className="flex gap-5 overflow-x-auto no-scrollbar pb-2 pt-2">
            {categories.map((cat, idx) => {
              const Icon = cat.icon;
              return (
                <div
                  key={idx}
                  className="group shrink-0 w-48 bg-surface-container-lowest rounded-2xl py-6 flex flex-col items-center gap-3 border border-outline-variant/40 cursor-pointer hover:bg-primary hover:border-primary hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  {/* Icon container */}
                  <div
                    className={`w-14 h-14 rounded-xl flex items-center justify-center ${cat.iconBg} ${cat.iconColor} group-hover:bg-white/20 group-hover:text-on-primary transition-all duration-300`}>
                    <Icon className="w-7 h-7" />
                  </div>

                  <h4 className="font-bold text-on-surface group-hover:text-on-primary transition-colors duration-300 text-center leading-tight">
                    {cat.title}
                  </h4>

                  {/* Count badge */}
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface-variant group-hover:bg-white/20 group-hover:text-on-primary transition-all duration-300">
                    {cat.count} Experts
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile "View All"
        <div className="mt-8 flex justify-center md:hidden">
          <button className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline underline-offset-4">
            View All Categories <ArrowRight className="w-4 h-4" />
          </button>
        </div> */}
      </div>
    </section>
  );
}

export default PopularCategory;
