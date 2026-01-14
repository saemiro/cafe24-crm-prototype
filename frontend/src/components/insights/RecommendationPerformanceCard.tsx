/**
 * RecommendationPerformanceCard - 추천 엔진 성능 대시보드
 * 
 * @description
 * Qdrant 벡터DB의 AI 추천 시스템 관련 인사이트를 기반으로 자동 생성된 컴포넌트입니다.
 * 추천 알고리즘의 핵심 성능 지표를 한눈에 파악할 수 있는 대시보드를 제공합니다.
 * 
 * @features
 * - 클릭률(CTR), 전환율, 정확도 지표 시각화
 * - 협업 필터링 vs 컨텐츠 기반 필터링 성능 비교
 * - 색상 코딩된 성능 등급 (녹색: 80%+, 파랑: 60%+, 노랑: 40%+, 빨강: 40% 미만)
 * - 기간별 총 추천 수 표시
 * 
 * @generated 2025-01-13 by n8n v12 워크플로우
 * @insight AI 추천 시스템 성능 측정 요구사항 기반
 */
import React from "react";

interface RecommendationPerformanceCardProps {
  clickThroughRate: number;
  conversionRate: number;
  accuracyScore: number;
  collaborativeFilteringScore?: number;
  contentBasedFilteringScore?: number;
  totalRecommendations: number;
  period?: string;
}

const RecommendationPerformanceCard: React.FC<RecommendationPerformanceCardProps> = ({
  clickThroughRate,
  conversionRate,
  accuracyScore,
  collaborativeFilteringScore,
  contentBasedFilteringScore,
  totalRecommendations,
  period = "최근 30일",
}) => {
  const formatPercentage = (value: number): string => {
    return `${(value * 100).toFixed(1)}%`;
  };

  const formatNumber = (value: number): string => {
    return value.toLocaleString();
  };

  const getScoreColor = (score: number): string => {
    if (score >= 0.8) return "text-green-600";
    if (score >= 0.6) return "text-blue-600";
    if (score >= 0.4) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBgColor = (score: number): string => {
    if (score >= 0.8) return "bg-green-50 border-green-200";
    if (score >= 0.6) return "bg-blue-50 border-blue-200";
    if (score >= 0.4) return "bg-yellow-50 border-yellow-200";
    return "bg-red-50 border-red-200";
  };

  const getScoreLabel = (score: number): string => {
    if (score >= 0.8) return "우수";
    if (score >= 0.6) return "양호";
    if (score >= 0.4) return "보통";
    return "개선필요";
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">📊 추천 엔진 성능</h2>
        <p className="text-sm text-gray-500 mt-1">{period}</p>
      </div>

      {/* 핵심 지표 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className={`p-4 rounded-lg border ${getScoreBgColor(accuracyScore)}`}>
          <div className="text-sm text-gray-600 mb-1">정확도</div>
          <div className={`text-2xl font-bold ${getScoreColor(accuracyScore)}`}>
            {formatPercentage(accuracyScore)}
          </div>
          <div className={`text-xs mt-1 ${getScoreColor(accuracyScore)}`}>
            {getScoreLabel(accuracyScore)}
          </div>
        </div>
        
        <div className={`p-4 rounded-lg border ${getScoreBgColor(clickThroughRate * 10)}`}>
          <div className="text-sm text-gray-600 mb-1">클릭률 (CTR)</div>
          <div className={`text-2xl font-bold ${getScoreColor(clickThroughRate * 10)}`}>
            {formatPercentage(clickThroughRate)}
          </div>
        </div>
        
        <div className={`p-4 rounded-lg border ${getScoreBgColor(conversionRate * 10)}`}>
          <div className="text-sm text-gray-600 mb-1">전환율</div>
          <div className={`text-2xl font-bold ${getScoreColor(conversionRate * 10)}`}>
            {formatPercentage(conversionRate)}
          </div>
        </div>
        
        <div className="p-4 rounded-lg border bg-gray-50 border-gray-200">
          <div className="text-sm text-gray-600 mb-1">총 추천</div>
          <div className="text-2xl font-bold text-gray-800">
            {formatNumber(totalRecommendations)}
          </div>
        </div>
      </div>

      {/* 알고리즘 비교 */}
      {(collaborativeFilteringScore || contentBasedFilteringScore) && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">🔬 알고리즘 성능 비교</h3>
          <div className="grid grid-cols-2 gap-4">
            {collaborativeFilteringScore && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">협업 필터링</span>
                <span className={`font-bold ${getScoreColor(collaborativeFilteringScore)}`}>
                  {formatPercentage(collaborativeFilteringScore)}
                </span>
              </div>
            )}
            {contentBasedFilteringScore && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">컨텐츠 기반</span>
                <span className={`font-bold ${getScoreColor(contentBasedFilteringScore)}`}>
                  {formatPercentage(contentBasedFilteringScore)}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RecommendationPerformanceCard;
