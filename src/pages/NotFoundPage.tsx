import NotFound from '@/components/ui/NotFound';

export default function NotFoundPage() {
  return (
    <NotFound
      fullScreen
      title="Page not found"
      message="The page you're looking for doesn't exist or has been moved."
      actionLabel="Go Home"
      actionTo="/"
    />
  );
}
