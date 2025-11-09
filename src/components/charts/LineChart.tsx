import { useMemo } from 'react';

interface DataPoint {
  x: string | number;
  y: number;
  label?: string;
}

interface LineChartProps {
  data: DataPoint[];
  width?: number;
  height?: number;
  color?: string;
  showGrid?: boolean;
  showDots?: boolean;
}

export function LineChart({
  data,
  width = 300,
  height = 200,
  color = '#00635D',
  showGrid = true,
  showDots = true,
}: LineChartProps) {
  const { minY, maxY, minX, maxX } = useMemo(() => {
    if (data.length === 0) {
      return { minY: 0, maxY: 100, minX: 0, maxX: 100 };
    }

    const yValues = data.map((d) => d.y);
    const xValues = data.map((d) => (typeof d.x === 'number' ? d.x : 0));

    return {
      minY: Math.min(...yValues),
      maxY: Math.max(...yValues),
      minX: Math.min(...xValues),
      maxX: Math.max(...xValues),
    };
  }, [data]);

  const padding = 40;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  const scaleX = (x: number | string) => {
    const numX = typeof x === 'number' ? x : parseFloat(String(x));
    return padding + ((numX - minX) / (maxX - minX || 1)) * chartWidth;
  };

  const scaleY = (y: number) => {
    return height - padding - ((y - minY) / (maxY - minY || 1)) * chartHeight;
  };

  const pathData = data
    .map((point, index) => {
      const x = scaleX(point.x);
      const y = scaleY(point.y);
      return index === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
    })
    .join(' ');

  if (data.length === 0) {
    return (
      <div
        className="flex items-center justify-center bg-slate-50 rounded-lg"
        style={{ width, height }}
      >
        <p className="text-sm text-slate-500">No data available</p>
      </div>
    );
  }

  return (
    <svg width={width} height={height} className="overflow-visible">
      {/* Grid lines */}
      {showGrid && (
        <g>
          {[0, 1, 2, 3, 4].map((i) => {
            const y = padding + (chartHeight / 4) * i;
            return (
              <line
                key={i}
                x1={padding}
                y1={y}
                x2={width - padding}
                y2={y}
                stroke="#e2e8f0"
                strokeWidth={1}
              />
            );
          })}
        </g>
      )}

      {/* Line */}
      <path
        d={pathData}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Dots */}
      {showDots &&
        data.map((point, index) => {
          const x = scaleX(point.x);
          const y = scaleY(point.y);
          return (
            <circle
              key={index}
              cx={x}
              cy={y}
              r={4}
              fill={color}
              className="hover:r-6 transition-all"
            />
          );
        })}

      {/* Axes */}
      <line
        x1={padding}
        y1={height - padding}
        x2={width - padding}
        y2={height - padding}
        stroke="#94a3b8"
        strokeWidth={1}
      />
      <line
        x1={padding}
        y1={padding}
        x2={padding}
        y2={height - padding}
        stroke="#94a3b8"
        strokeWidth={1}
      />
    </svg>
  );
}
