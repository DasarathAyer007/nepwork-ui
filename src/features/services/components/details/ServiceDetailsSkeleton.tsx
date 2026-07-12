function Block({ className = '' }: { className?: string }) {
  return (
    <div
      className={`bg-surface-container-high animate-pulse rounded-lg ${className}`}
    />
  );
}

function ServiceDetailsSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 space-y-6">
      <Block className="h-40" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Block className="h-72" />
          <Block className="h-48" />
        </div>

        <div className="space-y-6">
          <Block className="h-64" />
          <Block className="h-56" />
        </div>
      </div>
    </div>
  );
}

export default ServiceDetailsSkeleton;