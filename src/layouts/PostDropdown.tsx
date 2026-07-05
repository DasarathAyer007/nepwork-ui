import { useEffect, useRef, useState } from 'react';

import { Briefcase, ChevronDown, Plus, Wrench } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PostDropdown() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  return (
    <div ref={containerRef} className="relative inline-flex">
      <div className="flex items-stretch rounded-md bg-primary text-on-primary shadow-sm overflow-hidden">
        <button
          onClick={() => {
            setOpen(false);
            navigate('/create');
          }}
          className="flex items-center gap-2 px-4 py-2 font-medium hover:brightness-110 active:brightness-95 transition-[filter]">
          <Plus size={18} />
          <span>Post</span>
        </button>

        <div className="w-px bg-on-primary/25" />

        <button
          onClick={() => setOpen((v) => !v)}
          aria-label="Show post options"
          aria-expanded={open}
          className="flex items-center px-2.5 hover:brightness-110 active:brightness-95 transition-[filter]">
          <ChevronDown
            size={16}
            className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          />
        </button>
      </div>

      {open && (
        <div className="absolute right-0 top-[calc(100%+8px)] w-56 rounded-md border border-border bg-card shadow-lg z-50 overflow-hidden">
          <button
            onClick={() => {
              setOpen(false);
              navigate('/create/job');
            }}
            className="w-full flex items-center gap-3 text-left px-4 py-3 text-text hover:bg-surface-variant transition-colors">
            <Briefcase size={18} className="text-primary shrink-0" />
            <div>
              <p className="text-body-md font-medium leading-none">
                Post a Job
              </p>
              <p className="text-label-md text-muted mt-1">Hire for a role</p>
            </div>
          </button>

          <div className="h-px bg-border" />

          <button
            onClick={() => {
              setOpen(false);
              navigate('/create/service');
            }}
            className="w-full flex items-center gap-3 text-left px-4 py-3 text-text hover:bg-surface-variant transition-colors">
            <Wrench size={18} className="text-primary shrink-0" />
            <div>
              <p className="text-body-md font-medium leading-none">
                Post a Service
              </p>
              <p className="text-label-md text-muted mt-1">Offer your skills</p>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}
