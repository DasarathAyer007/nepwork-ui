import { bucketByDay } from '@/features/dashboard/utils/overviewHelpers';
import { useGetJobApplicationsQuery } from '@/features/jobs/jobApi';
import { useGetServiceRequestsQuery } from '@/features/services/serviceApi';
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts';

function MiniBarChart({
  title,
  totalLabel,
  data,
}: {
  title: string;
  totalLabel: string;
  data: { label: string; count: number }[];
}) {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-4 md:p-5">
      <div className="flex items-baseline justify-between mb-2">
        <h3 className="text-title-md font-bold text-on-surface">{title}</h3>
        <span className="text-label-md text-on-surface-variant">
          {totalLabel}
        </span>
      </div>
      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 4, right: 4, left: 4, bottom: 0 }}>
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: 'var(--color-on-surface-variant)' }}
            />
            <Tooltip
              cursor={{ fill: 'var(--color-surface-container)' }}
              contentStyle={{
                fontSize: 12,
                borderRadius: 8,
                border: '1px solid var(--color-outline-variant)',
              }}
            />
            <Bar
              dataKey="count"
              fill="var(--color-primary)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default function AnalyticsSection() {
  const { data: applications } = useGetJobApplicationsQuery({
    scope: 'received',
    page_size: 100,
    ordering: '-created_at',
  });
  const { data: requests } = useGetServiceRequestsQuery({
    scope: 'received',
    page_size: 100,
    ordering: '-created_at',
  });

  const applicationsData = bucketByDay(applications?.results ?? []);
  const requestsData = bucketByDay(requests?.results ?? []);

  const applicationsTotal = applicationsData.reduce(
    (sum, d) => sum + d.count,
    0
  );
  const requestsTotal = requestsData.reduce((sum, d) => sum + d.count, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <MiniBarChart
        title="Applications"
        totalLabel={`${applicationsTotal} this week`}
        data={applicationsData}
      />
      <MiniBarChart
        title="Service Requests"
        totalLabel={`${requestsTotal} this week`}
        data={requestsData}
      />
    </div>
  );
}
