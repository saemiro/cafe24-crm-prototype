import React from "react";

interface FeedbackHeatmapCardProps {
  segments: string[];
  campaigns: string[];
  feedbackMatrix: Record<string, Record<string, number>>;
  threshold?: number;
  onCellClick?: (segment: string, campaign: string, score: number) => void;
}

const FeedbackHeatmapCard: React.FC<FeedbackHeatmapCardProps> = ({
  segments,
  campaigns,
  feedbackMatrix,
  threshold = 0,
  onCellClick,
}) => {
  const getHeatmapColor = (score: number, maxScore: number) => {
    const normalizedScore = score / maxScore;
    if (normalizedScore >= 0.8) return "bg-red-600";
    if (normalizedScore >= 0.6) return "bg-orange-500";
    if (normalizedScore >= 0.4) return "bg-yellow-400";
    if (normalizedScore >= 0.2) return "bg-blue-300";
    return "bg-blue-100";
  };

  const getMaxScore = () => {
    let max = 0;
    segments.forEach((segment) => {
      campaigns.forEach((campaign) => {
        const score = feedbackMatrix[segment]?.[campaign] || 0;
        if (score > max) max = score;
      });
    });
    return Math.max(max, 1);
  };

  const maxScore = getMaxScore();

  const handleCellClick = (segment: string, campaign: string) => {
    const score = feedbackMatrix[segment]?.[campaign] || 0;
    if (onCellClick) {
      onCellClick(segment, campaign, score);
    }
  };

  const filteredSegments = segments.filter((segment) => {
    return campaigns.some(
      (campaign) => (feedbackMatrix[segment]?.[campaign] || 0) >= threshold
    );
  });

  return (
    <div className="w-full bg-white rounded-lg shadow-md p-6">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-1">
          Feedback Heatmap
        </h2>
        <p className="text-sm text-gray-600">
          Customer feedback density across segments and campaigns
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="w-24 text-left text-xs font-semibold text-gray-700 p-2 border-b border-gray-300">
                Segment
              </th>
              {campaigns.map((campaign) => (
                <th
                  key={campaign}
                  className="px-3 py-2 text-center text-xs font-semibold text-gray-700 border-b border-gray-300 whitespace-nowrap"
                >
                  {campaign}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredSegments.length > 0 ? (
              filteredSegments.map((segment) => (
                <tr key={segment} className="hover:bg-gray-50">
                  <td className="px-2 py-2 text-xs font-medium text-gray-700 border-b border-gray-200 bg-gray-50">
                    {segment}
                  </td>
                  {campaigns.map((campaign) => {
                    const score = feedbackMatrix[segment]?.[campaign] || 0;
                    const isAboveThreshold = score >= threshold;

                    return (
                      <td
                        key={`${segment}-${campaign}`}
                        className={`p-2 border-b border-gray-200 cursor-pointer transition-all duration-200 hover:opacity-80 ${
                          isAboveThreshold
                            ? getHeatmapColor(score, maxScore)
                            : "bg-gray-100"
                        }`}
                        onClick={() => handleCellClick(segment, campaign)}
                        title={`${segment} - ${campaign}: ${score}`}
                      >
                        <div className="text-center">
                          <span className="text-xs font-semibold text-white">
                            {score}
                          </span>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={campaigns.length + 1}
                  className="px-4 py-8 text-center text-gray-500"
                >
                  No feedback data meets the current threshold
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <p className="text-xs font-semibold text-gray-700 mb-3">Legend</p>
        <div className="grid grid-cols-5 gap-2">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-100 rounded"></div>
            <span className="text-xs text-gray-600">Very Low</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-300 rounded"></div>
            <span className="text-xs text-gray-600">Low</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-400 rounded"></div>
            <span className="text-xs text-gray-600">Medium</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-500 rounded"></div>
            <span className="text-xs text-gray-600">High</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-600 rounded"></div>
            <span className="text-xs text-gray-600">Very High</span>
          </div>
        </div>
      </div>

      {threshold > 0 && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
          <p className="text-xs text-blue-800">
            📊 Threshold active: {threshold}+ feedback interactions
          </p>
        </div>
      )}
    </div>
  );
};

export default FeedbackHeatmapCard;
