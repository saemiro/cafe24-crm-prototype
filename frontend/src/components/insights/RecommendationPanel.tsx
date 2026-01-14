/**
 * RecommendationPanel - AI 기반 상품 추천 패널
 * 
 * @description
 * Qdrant 벡터DB의 인사이트를 기반으로 자동 생성된 컴포넌트입니다.
 * 고객별 맞춤 상품 추천과 추천 성과 지표(CTR, 전환율 등)를 시각화합니다.
 * 
 * @features
 * - 고객 ID 기반 개인화 추천 표시
 * - 추천 신뢰도 점수 시각화 (선택적)
 * - CTR, 전환율, 노출/클릭/전환 수 대시보드
 * - 카테고리별 상품 가격 정보 표시
 * 
 * @generated 2025-01-13 by n8n v12 워크플로우
 * @insight AI 추천 시스템 구축 관련 인사이트 기반
 */
import React from "react";

interface Recommendation {
  id: string;
  productName: string;
  category: string;
  price: number;
  imageUrl?: string;
  confidenceScore?: number;
}

interface Metrics {
  ctr: number;
  conversionRate: number;
  impressions: number;
  clicks: number;
  conversions: number;
}

interface RecommendationPanelProps {
  recommendations: Recommendation[];
  metrics: Metrics;
  customerId?: string;
  showConfidenceScores?: boolean;
}

const RecommendationPanel: React.FC<RecommendationPanelProps> = ({
  recommendations,
  metrics,
  customerId,
  showConfidenceScores = false,
}) => {
  const formatPercentage = (value: number): string => {
    return `${(value * 100).toFixed(2)}%`;
  };

  const getConfidenceColor = (score?: number): string => {
    if (!score) return "bg-gray-200";
    if (score >= 0.8) return "bg-green-200";
    if (score >= 0.6) return "bg-yellow-200";
    return "bg-orange-200";
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          🛒 AI 상품 추천
        </h2>
        {customerId && (
          <p className="text-sm text-gray-600">고객 ID: {customerId}</p>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="text-sm text-gray-600 mb-1">클릭률 (CTR)</div>
          <div className="text-2xl font-bold text-blue-600">
            {formatPercentage(metrics.ctr)}
          </div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="text-sm text-gray-600 mb-1">전환율</div>
          <div className="text-2xl font-bold text-green-600">
            {formatPercentage(metrics.conversionRate)}
          </div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <div className="text-sm text-gray-600 mb-1">총 전환</div>
          <div className="text-2xl font-bold text-purple-600">
            {metrics.conversions.toLocaleString()}건
          </div>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">추천 상품</h3>
        <div className="space-y-3">
          {recommendations.map((rec) => (
            <div
              key={rec.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
            >
              <div className="flex-1">
                <div className="font-medium text-gray-800">{rec.productName}</div>
                <div className="text-sm text-gray-500">{rec.category}</div>
              </div>
              <div className="text-right">
                <div className="font-bold text-gray-800">
                  ₩{rec.price.toLocaleString()}
                </div>
                {showConfidenceScores && rec.confidenceScore && (
                  <div
                    className={`text-xs px-2 py-1 rounded-full ${getConfidenceColor(
                      rec.confidenceScore
                    )}`}
                  >
                    신뢰도 {(rec.confidenceScore * 100).toFixed(0)}%
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-xs text-gray-400 text-right mt-4">
        노출 {metrics.impressions.toLocaleString()} · 클릭 {metrics.clicks.toLocaleString()}
      </div>
    </div>
  );
};

export default RecommendationPanel;
