import { useEffect, useRef, useState } from 'react';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

import CategoryIcon from '@/components/CategoryIcon';

import { useGetPopularCategoriesQuery } from '../../services/serviceApi';

// service Category
function PopularCategory() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const { data: categories, isLoading } = useGetPopularCategoriesQuery();

  const updateScrollState = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 8);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', updateScrollState, { passive: true });
    return () => el.removeEventListener('scroll', updateScrollState);
  }, []);

  useEffect(() => {
    updateScrollState();
  }, [isLoading, categories]);

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
            {isLoading &&
              Array.from({ length: 6 }).map((_, idx) => (
                <div
                  key={idx}
                  className="shrink-0 w-48 h-[168px] rounded-2xl bg-surface-container-lowest border border-outline-variant/40 animate-pulse"
                />
              ))}

            {!isLoading &&
              categories?.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/services?category=${cat.id}`}
                  className="group shrink-0 w-48 bg-surface-container-lowest rounded-2xl py-6 flex flex-col items-center gap-3 border border-outline-variant/40 cursor-pointer hover:bg-primary hover:border-primary hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  {/* Icon container */}
                  <div
                    style={{
                      backgroundColor: `${cat.color}1a`,
                      color: cat.color,
                    }}
                    className="w-14 h-14 rounded-xl flex items-center justify-center group-hover:bg-white/20 group-hover:text-on-primary transition-all duration-300">
                    <CategoryIcon
                      className="group-hover:text-on-primary"
                      iconname={cat.icon}
                      size={28}
                      color="currentColor"
                    />
                  </div>

                  <h4 className="font-bold text-on-surface group-hover:text-on-primary transition-colors duration-300 text-center leading-tight">
                    {cat.name}
                  </h4>

                  {/* Count badge */}
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface-variant group-hover:bg-white/20 group-hover:text-on-primary transition-all duration-300">
                    {cat.count} Services
                  </span>
                </Link>
              ))}

            {!isLoading && categories?.length === 0 && (
              <p className="text-on-surface-variant py-6">
                No popular categories yet.
              </p>
            )}
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
