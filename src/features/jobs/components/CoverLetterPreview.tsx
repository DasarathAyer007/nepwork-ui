import DOMPurify from 'dompurify';

const COVER_LETTER_ALLOWED_TAGS = [
  'p',
  'br',
  'strong',
  'b',
  'em',
  'i',
  'u',
  's',
  'ul',
  'ol',
  'li',
  'h1',
  'h2',
  'h3',
  'blockquote',
  'a',
];
const COVER_LETTER_ALLOWED_ATTR = ['href', 'rel', 'target'];

interface CoverLetterPreviewProps {
  html: string | null | undefined;
}

function CoverLetterPreview({ html }: CoverLetterPreviewProps) {
  if (!html) return <>No cover letter added</>;

  const sanitized = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: COVER_LETTER_ALLOWED_TAGS,
    ALLOWED_ATTR: COVER_LETTER_ALLOWED_ATTR,
  });

  return (
    <div
      className="max-w-none text-body-md text-on-surface [&_p]:my-1 [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mt-4 [&_h1]:mb-2 [&_h1]:text-on-surface [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mt-3 [&_h2]:mb-1 [&_h2]:text-on-surface [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-2 [&_h3]:mb-1 [&_h3]:text-on-surface [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_blockquote]:border-l-2 [&_blockquote]:border-outline-variant [&_blockquote]:pl-3 [&_blockquote]:text-on-surface-variant [&_blockquote]:italic [&_a]:text-primary [&_a]:underline [&_u]:underline"
      dangerouslySetInnerHTML={{ __html: sanitized }}
    />
  );
}

export default CoverLetterPreview;
