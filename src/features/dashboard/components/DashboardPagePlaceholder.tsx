type DashboardPagePlaceholderProps = {
  title: string;
};

export default function DashboardPagePlaceholder({
  title,
}: DashboardPagePlaceholderProps) {
  return (
    <div className="flex items-center justify-center">
      <h1 className="text-headline-sm font-semibold text-on-surface">
        {title}
      </h1>
    </div>
  );
}
