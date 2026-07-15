import { useEffect, useRef, useState } from 'react';

import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

import { useGetTrendingJobsQuery } from '../../jobs/jobApi';
import JobCard from './JobCard';

function TrendingJob() {
  const { data, isLoading } = useGetTrendingJobsQuery();
  const jobs = data?.results ?? [];
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
          <Link
            to="/jobs"
            className="hidden md:flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline underline-offset-4">
            Browse All <ArrowRight className="w-4 h-4" />
          </Link>

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
          {isLoading &&
            Array.from({ length: 4 }).map((_, idx) => (
              <div
                key={idx}
                className="shrink-0 w-80 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 animate-pulse"
                // Give a minimum height to keep the loading state visually stable
                style={{ minHeight: '360px' }}
              />
            ))}

          {!isLoading &&
            jobs.map((job) => (
              <div key={job.id} className="shrink-0">
                <JobCard job={job} />
              </div>
            ))}

          {!isLoading && jobs.length === 0 && (
            <p className="text-on-surface-variant py-6">
              No trending jobs right now.
            </p>
          )}
        </div>
      </div>

      {/* Mobile browse all */}
      <div className="mt-8 flex justify-center md:hidden">
        <Link
          to="/jobs"
          className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline underline-offset-4">
          Browse All Jobs <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}

export default TrendingJob;
