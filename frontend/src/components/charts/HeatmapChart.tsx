interface HeatmapCell {
  x: string | number;
  y: string | number;
  value: number;
  label?: string;
}

interface HeatmapChartProps {
  data: HeatmapCell[];
  xLabels: (string | number)[];
  yLabels: (string | number)[];
  height?: number;
  colorScale?: {
    min: string;
    mid: string;
    max: string;
  };
  formatValue?: (value: number) => string;
  showValues?: boolean;
  xAxisLabel?: string;
  yAxisLabel?: string;
}

export function HeatmapChart({
  data,
  xLabels,
  yLabels,
  height = 400,
  colorScale = {
    min: '#fee2e2',
    mid: '#fef9c3',
    max: '#bbf7d0',
  },
  formatValue,
  showValues = true,
  xAxisLabel,
  yAxisLabel,
}: HeatmapChartProps) {
  const values = data.map((d) => d.value);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);

  const getColor = (value: number) => {
    const range = maxValue - minValue;
    if (range === 0) return colorScale.mid;

    const normalized = (value - minValue) / range;

    if (normalized < 0.5) {
      return interpolateColor(colorScale.min, colorScale.mid, normalized * 2);
    } else {
      return interpolateColor(colorScale.mid, colorScale.max, (normalized - 0.5) * 2);
    }
  };

  const interpolateColor = (color1: string, color2: string, factor: number) => {
    const hex = (color: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
      return result
        ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
        : [0, 0, 0];
    };

    const c1 = hex(color1);
    const c2 = hex(color2);
    const r = Math.round(c1[0] + factor * (c2[0] - c1[0]));
    const g = Math.round(c1[1] + factor * (c2[1] - c1[1]));
    const b = Math.round(c1[2] + factor * (c2[2] - c1[2]));
    return `rgb(${r}, ${g}, ${b})`;
  };

  const getCellValue = (x: string | number, y: string | number) => {
    const cell = data.find((d) => d.x === x && d.y === y);
    return cell?.value;
  };

  const getCellLabel = (x: string | number, y: string | number) => {
    const cell = data.find((d) => d.x === x && d.y === y);
    return cell?.label;
  };

  const cellHeight = (height - 60) / yLabels.length;

  return (
    <div className="w-full overflow-x-auto">
      <div style={{ minWidth: Math.max(xLabels.length * 60, 400) }}>
        {/* X-axis label */}
        {xAxisLabel && (
          <div className="text-center text-sm text-gray-500 mb-2">{xAxisLabel}</div>
        )}

        {/* Chart container */}
        <div className="flex">
          {/* Y-axis */}
          <div className="flex flex-col justify-around pr-2" style={{ height: height - 60 }}>
            {yLabels.map((label, index) => (
              <div
                key={index}
                className="text-xs text-gray-600 text-right whitespace-nowrap"
                style={{ height: cellHeight }}
              >
                <span className="flex items-center justify-end h-full">{label}</span>
              </div>
            ))}
          </div>

          {/* Grid */}
          <div className="flex-1">
            <div
              className="grid gap-1"
              style={{
                gridTemplateColumns: `repeat(${xLabels.length}, 1fr)`,
                height: height - 60,
              }}
            >
              {yLabels.map((y) =>
                xLabels.map((x) => {
                  const value = getCellValue(x, y);
                  const label = getCellLabel(x, y);
                  const displayValue = value !== undefined
                    ? (formatValue ? formatValue(value) : value.toFixed(1))
                    : '-';

                  return (
                    <div
                      key={`${x}-${y}`}
                      className="flex items-center justify-center text-xs font-medium rounded cursor-pointer hover:opacity-80 transition-opacity group relative"
                      style={{
                        backgroundColor: value !== undefined ? getColor(value) : '#f3f4f6',
                        color: value !== undefined && value > (maxValue - minValue) / 2 + minValue ? '#1f2937' : '#374151',
                      }}
                    >
                      {showValues && displayValue}

                      {/* Tooltip */}
                      <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-white p-2 rounded-lg shadow-lg border border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap pointer-events-none">
                        <p className="text-xs text-gray-500">{y} / {x}</p>
                        <p className="text-sm font-medium text-gray-900">
                          {label || displayValue}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* X-axis labels */}
            <div
              className="grid gap-1 mt-2"
              style={{ gridTemplateColumns: `repeat(${xLabels.length}, 1fr)` }}
            >
              {xLabels.map((label, index) => (
                <div key={index} className="text-xs text-gray-600 text-center truncate">
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Y-axis label */}
        {yAxisLabel && (
          <div className="text-center text-sm text-gray-500 mt-4">{yAxisLabel}</div>
        )}

        {/* Legend */}
        <div className="flex items-center justify-center gap-4 mt-4">
          <span className="text-xs text-gray-500">낮음</span>
          <div
            className="w-32 h-3 rounded"
            style={{
              background: `linear-gradient(to right, ${colorScale.min}, ${colorScale.mid}, ${colorScale.max})`,
            }}
          />
          <span className="text-xs text-gray-500">높음</span>
        </div>
      </div>
    </div>
  );
}

// Cohort-specific heatmap for retention analysis
interface CohortHeatmapProps {
  data: {
    cohort: string;
    totalUsers: number;
    retention: number[];
  }[];
  height?: number;
  maxMonths?: number;
}

export function CohortHeatmap({
  data,
  maxMonths = 12,
}: CohortHeatmapProps) {
  const months = Array.from({ length: maxMonths }, (_, i) => `M${i}`);

  const getColor = (value: number) => {
    if (value >= 80) return '#22c55e';
    if (value >= 60) return '#84cc16';
    if (value >= 40) return '#eab308';
    if (value >= 20) return '#f97316';
    if (value > 0) return '#ef4444';
    return '#f3f4f6';
  };

  const getTextColor = (value: number) => {
    return value >= 40 ? '#ffffff' : '#374151';
  };

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="text-left text-xs font-medium text-gray-500 p-2 sticky left-0 bg-white">
              코호트
            </th>
            <th className="text-center text-xs font-medium text-gray-500 p-2">
              고객수
            </th>
            {months.map((month, index) => (
              <th key={month} className="text-center text-xs font-medium text-gray-500 p-2">
                {index === 0 ? '가입월' : `+${index}개월`}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.cohort}>
              <td className="text-xs font-medium text-gray-900 p-2 sticky left-0 bg-white">
                {row.cohort}
              </td>
              <td className="text-xs text-gray-600 text-center p-2">
                {row.totalUsers.toLocaleString()}
              </td>
              {row.retention.slice(0, maxMonths).map((value, index) => (
                <td key={index} className="p-1">
                  <div
                    className="w-full h-8 flex items-center justify-center rounded text-xs font-medium cursor-pointer hover:opacity-80 transition-opacity"
                    style={{
                      backgroundColor: getColor(value),
                      color: getTextColor(value),
                    }}
                    title={`${row.cohort} - ${index === 0 ? '가입월' : `+${index}개월`}: ${value.toFixed(1)}%`}
                  >
                    {value > 0 ? `${value.toFixed(0)}%` : '-'}
                  </div>
                </td>
              ))}
              {/* Fill empty cells if retention data is shorter */}
              {Array.from({ length: Math.max(0, maxMonths - row.retention.length) }).map((_, index) => (
                <td key={`empty-${index}`} className="p-1">
                  <div className="w-full h-8 flex items-center justify-center rounded text-xs text-gray-400 bg-gray-100">
                    -
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-6">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">이탈 위험</span>
          <div className="flex gap-1">
            {[
              { color: '#ef4444', label: '0-20%' },
              { color: '#f97316', label: '20-40%' },
              { color: '#eab308', label: '40-60%' },
              { color: '#84cc16', label: '60-80%' },
              { color: '#22c55e', label: '80%+' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-1">
                <div
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-xs text-gray-500">{item.label}</span>
              </div>
            ))}
          </div>
          <span className="text-xs text-gray-500">우수 유지</span>
        </div>
      </div>
    </div>
  );
}
