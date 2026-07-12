import { useEffect, useRef, useState } from 'react';

import { Download, Eye, X } from 'lucide-react';

import { useClickOutside } from '@/hooks/useClickOutSide';

import ResumePdfPreview from './ResumePdfPreview';

interface ResumeFieldProps {
  resumeUrl: string | null | undefined;
  applicantName?: string;
}

function ResumePreviewModal({
  resumeUrl,
  applicantName,
  onClose,
}: {
  resumeUrl: string;
  applicantName?: string;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useClickOutside(dialogRef, onClose);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-surface/80 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="resume-preview-title">
      <div
        ref={dialogRef}
        className="bg-surface-container-lowest rounded-xl  w-full max-h-[95vh] shadow-lg border border-outline-variant flex flex-col overflow-hidden">
        <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-outline-variant shrink-0">
          <h2
            id="resume-preview-title"
            className="text-title-md font-bold text-on-surface truncate">
            {applicantName ? `${applicantName}'s Resume` : 'Resume Preview'}
          </h2>
          <div className="flex items-center gap-1.5 shrink-0">
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-outline-variant text-on-surface rounded-lg text-body-sm font-medium hover:bg-surface-container transition-all">
              <Download size={14} />
              Download
            </a>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close preview"
              className="p-2 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors cursor-pointer">
              <X size={18} />
            </button>
          </div>
        </div>
        <div className="p-4 overflow-y-auto">
          <ResumePdfPreview file={resumeUrl} maxHeightClassName="h-full" />
        </div>
      </div>
    </div>
  );
}

function ResumeField({ resumeUrl, applicantName }: ResumeFieldProps) {
  const [previewOpen, setPreviewOpen] = useState(false);

  if (!resumeUrl) return <>Not attached</>;

  return (
    <>
      <div className="flex items-center gap-3 flex-wrap">
        <button
          type="button"
          onClick={() => setPreviewOpen(true)}
          className="inline-flex items-center gap-1.5 text-primary font-medium hover:underline cursor-pointer">
          <Eye size={15} />
          Preview
        </button>
        <a
          href={resumeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-primary font-medium hover:underline">
          <Download size={15} />
          Download resume
        </a>
      </div>

      {previewOpen && (
        <ResumePreviewModal
          resumeUrl={resumeUrl}
          applicantName={applicantName}
          onClose={() => setPreviewOpen(false)}
        />
      )}
    </>
  );
}

export default ResumeField;
