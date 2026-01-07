interface FunnelStep {
  label: string;
  value: number;
  percentage: number;
  dropoff?: number;
  color?: string;
}

interface FunnelChartProps {
  data: FunnelStep[];
  height?: number;
  showValues?: boolean;
  showPercentages?: boolean;
  showDropoff?: boolean;
  colors?: string[];
  formatValue?: (value: number) => string;
}

export function FunnelChart({
  data,
  height = 400,
  showValues = true,
  showPercentages = true,
  showDropoff = true,
  colors = ['#00a8e8', '#0096d4', '#0084bf', '#0072ab', '#006096'],
  formatValue,
}: FunnelChartProps) {
  const maxValue = Math.max(...data.map((d) => d.value));

  return (
    <div className="w-full" style={{ height }}>
      <div className="flex flex-col items-center gap-1 h-full justify-between py-4">
        {data.map((step, index) => {
          const widthPercent = (step.value / maxValue) * 100;
          const minWidth = 30;
          const width = Math.max(widthPercent, minWidth);
          const color = step.color || colors[index % colors.length];
          const displayValue = formatValue ? formatValue(step.value) : step.value.toLocaleString();

          return (
            <div key={index} className="w-full flex items-center">
              <div className="flex-1 flex justify-center">
                <div
                  className="relative transition-all duration-300 hover:opacity-90 cursor-pointer group"
                  style={{
                    width: `${width}%`,
                    minWidth: '200px',
                    maxWidth: '100%',
                  }}
                >
                  {/* Funnel segment */}
                  <div
                    className="relative py-4 px-6 text-center"
                    style={{
                      backgroundColor: color,
                      clipPath: index === data.length - 1
                        ? 'polygon(5% 0%, 95% 0%, 95% 100%, 5% 100%)'
                        : 'polygon(0% 0%, 100% 0%, 95% 100%, 5% 100%)',
                    }}
                  >
                    <div className="text-white font-medium text-sm md:text-base">
                      {step.label}
                    </div>
                    <div className="flex items-center justify-center gap-2 mt-1">
                      {showValues && (
                        <span className="text-white/90 text-xs md:text-sm font-semibold">
                          {displayValue}
                        </span>
                      )}
                      {showPercentages && (
                        <span className="text-white/70 text-xs">
                          ({step.percentage.toFixed(1)}%)
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Tooltip */}
                  <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 bg-white p-3 rounded-lg shadow-lg border border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap">
                    <p className="font-medium text-gray-900">{step.label}</p>
                    <p className="text-sm text-gray-600">
                      {displayValue} ({step.percentage.toFixed(1)}%)
                    </p>
                    {showDropoff && step.dropoff !== undefined && step.dropoff > 0 && (
                      <p className="text-sm text-red-500 mt-1">
                        -{step.dropoff.toFixed(1)}% 이탈
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Dropoff indicator */}
              {showDropoff && index < data.length - 1 && step.dropoff !== undefined && (
                <div className="absolute right-4 flex items-center text-sm">
                  <span className="text-red-500 font-medium">
                    -{step.dropoff.toFixed(1)}%
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Alternative horizontal funnel chart
export function HorizontalFunnelChart({
  data,
  height = 100,
  showLabels = true,
  colors = ['#00a8e8', '#0096d4', '#0084bf', '#0072ab', '#006096'],
  formatValue,
}: FunnelChartProps & { showLabels?: boolean }) {
  const maxValue = data[0]?.value || 1;

  return (
    <div className="w-full">
      <div className="flex items-end gap-1" style={{ height }}>
        {data.map((step, index) => {
          const heightPercent = (step.value / maxValue) * 100;
          const color = step.color || colors[index % colors.length];
          const displayValue = formatValue ? formatValue(step.value) : step.value.toLocaleString();

          return (
            <div
              key={index}
              className="flex-1 flex flex-col items-center group"
            >
              <div className="relative w-full flex justify-center">
                <div
                  className="w-full max-w-20 rounded-t-md transition-all duration-300 hover:opacity-80 cursor-pointer"
                  style={{
                    height: `${heightPercent}%`,
                    minHeight: '20px',
                    backgroundColor: color,
                  }}
                >
                  {/* Tooltip */}
                  <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-white p-2 rounded-lg shadow-lg border border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap">
                    <p className="font-medium text-gray-900 text-sm">{step.label}</p>
                    <p className="text-xs text-gray-600">
                      {displayValue} ({step.percentage.toFixed(1)}%)
                    </p>
                  </div>
                </div>
              </div>
              {showLabels && (
                <div className="mt-2 text-center">
                  <p className="text-xs text-gray-600 truncate max-w-16">{step.label}</p>
                  <p className="text-sm font-medium text-gray-900">{step.percentage.toFixed(0)}%</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
