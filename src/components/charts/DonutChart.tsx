interface DonutSegment {
  label: string;
  value: number;
  color: string;
}

interface DonutChartProps {
  data: DonutSegment[];
  size?: number;
  strokeWidth?: number;
  showLegend?: boolean;
}

export function DonutChart({
  data,
  size = 200,
  strokeWidth = 20,
  showLegend = true,
}: DonutChartProps) {
  const total = data.reduce((sum, segment) => sum + segment.value, 0);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  let currentOffset = 0;

  const segments = data.map((segment) => {
    const percentage = (segment.value / total) * 100;
    const strokeDasharray = (percentage / 100) * circumference;
    const strokeDashoffset = circumference - (currentOffset / total) * circumference;
    const offset = currentOffset;
    currentOffset += segment.value;

    return {
      ...segment,
      percentage,
      strokeDasharray,
      strokeDashoffset,
      offset,
    };
  });

  if (data.length === 0 || total === 0) {
    return (
      <div
        className="flex items-center justify-center bg-slate-50 rounded-full"
        style={{ width: size, height: size }}
      >
        <p className="text-sm text-slate-500">No data</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {segments.map((segment, index) => (
            <circle
              key={index}
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke={segment.color}
              strokeWidth={strokeWidth}
              strokeDasharray={segment.strokeDasharray}
              strokeDashoffset={segment.strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-300"
            />
          ))}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className="text-2xl font-bold text-slate-900">{total}</p>
            <p className="text-xs text-slate-600">Total</p>
          </div>
        </div>
      </div>

      {showLegend && (
        <div className="w-full space-y-2">
          {segments.map((segment, index) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: segment.color }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-900">
                    {segment.label}
                  </span>
                  <span className="text-sm text-slate-600">
                    {segment.percentage.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
