import { useState } from 'react';

import { AlertCircle, Loader2 } from 'lucide-react';
import { Document, Page, pdfjs } from 'react-pdf';

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

interface ResumePdfPreviewProps {
  file: File | string;
  maxHeightClassName?: string;
}

function ResumePdfPreview({ file, maxHeightClassName }: ResumePdfPreviewProps) {
  const previewKey =
    typeof file === 'string' ? file : `${file.name}-${file.size}-${file.lastModified}`;

  return (
    <ResumePdfPreviewContent
      key={previewKey}
      file={file}
      maxHeightClassName={maxHeightClassName}
    />
  );
}

interface ResumePdfPreviewContentProps {
  file: File | string;
  maxHeightClassName?: string;
}

function ResumePdfPreviewContent({
  file,
  maxHeightClassName = 'max-h-120',
}: ResumePdfPreviewContentProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="border border-outline-variant rounded-lg overflow-hidden bg-surface-container">
      {error ? (
        <div className="flex items-center gap-2 text-error text-body-md p-4">
          <AlertCircle size={18} />
          {error}
        </div>
      ) : (
        <div
          className={`${maxHeightClassName} overflow-y-auto flex flex-col items-center gap-2 p-4`}>
          <Document
            file={file}
            onLoadSuccess={({ numPages: pages }) => setNumPages(pages)}
            onLoadError={(e) => setError(e.message ?? 'Failed to load PDF.')}
            loading={
              <div className="flex items-center gap-2 text-on-surface-variant text-body-md py-8">
                <Loader2 size={18} className="animate-spin" />
                Loading preview...
              </div>
            }>
            {Array.from({ length: numPages ?? 0 }, (_, index) => (
              <Page
                key={index}
                pageNumber={index + 1}
                width={480}
                className="shadow-sm"
                renderTextLayer={false}
                renderAnnotationLayer={false}
              />
            ))}
          </Document>
        </div>
      )}
    </div>
  );
}

export default ResumePdfPreview;
