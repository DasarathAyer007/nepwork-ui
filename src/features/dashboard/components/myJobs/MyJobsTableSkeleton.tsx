function Block({ className = '' }: { className?: string }) {
  return (
    <div
      className={`bg-surface-container-high animate-pulse rounded-md ${className}`}
    />
  );
}

const COLUMN_WIDTHS = ['w-8', 'w-40', 'w-20', 'w-20', 'w-16', 'w-24', 'w-12'];

export default function MyJobsTableSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-lg overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-outline-variant">
            {COLUMN_WIDTHS.map((_, i) => (
              <th key={i} className="px-4 py-3">
                <Block className="h-3 w-16" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }, (_, rowIndex) => (
            <tr
              key={rowIndex}
              className="border-b border-outline-variant/50 last:border-0">
              {COLUMN_WIDTHS.map((width, colIndex) => (
                <td key={colIndex} className="px-4 py-3">
                  <Block className={`h-4 ${width}`} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
