import { useEffect, useRef, useState } from 'react';

import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

import JobCard, { type Job } from './JobCard';

const jobs: Job[] = [
  {
    type: 'High Priority',
    typeColor: 'bg-tertiary-container text-on-tertiary-container',
    salary: 'NPR 15,000',
    title: 'Commercial Building Electrician',
    location: 'Kathmandu, Nepal',
    name: 'Bishal K.',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    postedAt: '2h ago',
    tags: ['Electrician', 'Full-time', 'On-site'],
  },
  {
    type: 'Freelance',
    typeColor: 'bg-secondary-container text-on-secondary-container',
    salary: 'NPR 8,000',
    title: 'Social Media Content Creator',
    location: 'Remote / Patan',
    name: 'Anjali R.',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    postedAt: '5h ago',
    tags: ['Marketing', 'Remote', 'Part-time'],
  },
  {
    type: 'Contract',
    typeColor: 'bg-primary-container text-on-primary-container',
    salary: 'NPR 45,000',
    title: 'Senior Frontend Developer',
    location: 'Lalitpur, Nepal',
    name: 'Suman T.',
    avatar: 'https://randomuser.me/api/portraits/men/65.jpg',
    postedAt: '1d ago',
    tags: ['React', 'TypeScript', 'Hybrid'],
  },
  {
    type: 'Full-time',
    typeColor: 'bg-primary-fixed text-on-primary-fixed',
    salary: 'NPR 25,000',
    title: 'House Plumber & Pipe Fitter',
    location: 'Bhaktapur, Nepal',
    name: 'Ramesh P.',
    avatar: 'https://randomuser.me/api/portraits/men/41.jpg',
    postedAt: '3h ago',
    tags: ['Plumbing', 'Full-time', 'On-site'],
  },
  {
    type: 'Freelance',
    typeColor: 'bg-secondary-container text-on-secondary-container',
    salary: 'NPR 12,000',
    title: 'Photography & Event Coverage',
    location: 'Pokhara, Nepal',
    name: 'Sunita M.',
    avatar: 'https://randomuser.me/api/portraits/women/31.jpg',
    postedAt: '6h ago',
    tags: ['Photography', 'Events', 'Freelance'],
  },
  {
    type: 'Contract',
    typeColor: 'bg-primary-container text-on-primary-container',
    salary: 'NPR 30,000',
    title: 'UI/UX Designer for Mobile App',
    location: 'Remote / Kathmandu',
    name: 'Priya S.',
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    postedAt: '12h ago',
    tags: ['Figma', 'UI/UX', 'Remote'],
  },
];

function TrendingJob() {
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
      left: direction === 'left' ? -340 : 340,
      behavior: 'smooth',
    });
  };

  return (
    <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-end mb-10">
        <div>
          <h2 className="text-3xl font-bold text-on-surface mb-2">
            Trending Jobs Near You
          </h2>
          <p className="text-on-surface-variant">
            Fresh opportunities posted today.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <button className="hidden md:flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline underline-offset-4">
            Browse All <ArrowRight className="w-4 h-4" />
          </button>

          <div className="flex gap-2">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className="p-2 rounded-full bg-surface-container-lowest border border-outline-variant hover:bg-primary hover:text-on-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200">
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className="p-2 rounded-full bg-surface-container-lowest border border-outline-variant hover:bg-primary hover:text-on-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Scroll track with fade edges */}
      <div className="relative">
        {/* Left fade */}
        <div
          className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 bg-linear-to-r from-background to-transparent z-10 transition-opacity duration-300"
          style={{ opacity: canScrollLeft ? 1 : 0 }}
        />
        {/* Right fade */}
        <div
          className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 bg-linear-to-l from-background to-transparent z-10 transition-opacity duration-300"
          style={{ opacity: canScrollRight ? 1 : 0 }}
        />

        {/* Scrollable list */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pt-2 no-scrollbar pb-2">
          {jobs.map((job, i) => (
            <div key={i} className="shrink-0 max-w-4xs">
              <JobCard job={job} />
            </div>
          ))}
        </div>
      </div>

      {/* Mobile browse all */}
      <div className="mt-8 flex justify-center md:hidden">
        <button className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline underline-offset-4">
          Browse All Jobs <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
}

export default TrendingJob;
