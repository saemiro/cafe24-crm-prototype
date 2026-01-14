import React from "react";

interface DataQualityDashboardProps {
  entityTypes: string[];
  timeRange?: string;
  qualityThreshold?: number;
  onEntityClick?: (entityType: string) => void;
}

interface EntityMetrics {
  name: string;
  totalRecords: number;
  completeRecords: number;
  staleRecords: number;
  missingFields: { [key: string]: number };
  pipelineHealth: number;
}

const DataQualityDashboard: React.FC<DataQualityDashboardProps> = ({
  entityTypes,
  timeRange = "30d",
  qualityThreshold = 85,
  onEntityClick,
}) => {
  const [selectedEntity, setSelectedEntity] = React.useState<string | null>(null);

  const mockMetrics: { [key: string]: EntityMetrics } = {
    Customer: {
      name: "Customer",
      totalRecords: 15420,
      completeRecords: 13890,
      staleRecords: 245,
      missingFields: {
        email: 342,
        phone: 128,
        address: 89,
      },
      pipelineHealth: 90,
    },
    Order: {
      name: "Order",
      totalRecords: 42150,
      completeRecords: 39200,
      staleRecords: 1850,
      missingFields: {
        trackingNumber: 1205,
        shipDate: 445,
        estimatedDelivery: 892,
      },
      pipelineHealth: 78,
    },
    Product: {
      name: "Product",
      totalRecords: 8920,
      completeRecords: 8450,
      staleRecords: 320,
      missingFields: {
        description: 156,
        category: 89,
        price: 45,
      },
      pipelineHealth: 95,
    },
    Campaign: {
      name: "Campaign",
      totalRecords: 245,
      completeRecords: 198,
      staleRecords: 45,
      missingFields: {
        budget: 23,
        endDate: 12,
        targetAudience: 34,
      },
      pipelineHealth: 81,
    },
    Segment: {
      name: "Segment",
      totalRecords: 567,
      completeRecords: 489,
      staleRecords: 78,
      missingFields: {
        criteria: 45,
        lastUpdated: 67,
        memberCount: 23,
      },
      pipelineHealth: 86,
    },
  };

  const getQualityStatus = (health: number) => {
    if (health >= qualityThreshold) return "✓ Healthy";
    if (health >= 70) return "⚠ At Risk";
    return "✗ Critical";
  };

  const getStatusColor = (health: number) => {
    if (health >= qualityThreshold)
      return "bg-green-50 border-green-200 text-green-800";
    if (health >= 70) return "bg-yellow-50 border-yellow-200 text-yellow-800";
    return "bg-red-50 border-red-200 text-red-800";
  };

  const getHealthBarColor = (health: number) => {
    if (health >= qualityThreshold) return "bg-green-500";
    if (health >= 70) return "bg-yellow-500";
    return "bg-red-500";
  };

  const handleEntityClick = (entityType: string) => {
    setSelectedEntity(selectedEntity === entityType ? null : entityType);
    onEntityClick?.(entityType);
  };

  const filteredEntities = entityTypes
    .map((type) => mockMetrics[type])
    .filter(Boolean);

  return (
    <div className="w-full bg-white">
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Data Quality Dashboard
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Monitor data completeness and pipeline health across CRM entities
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs font-medium text-gray-500">Time Range</p>
              <p className="text-sm font-semibold text-gray-900">{timeRange}</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-medium text-gray-500">Quality Target</p>
              <p className="text-sm font-semibold text-gray-900">
                {qualityThreshold}%+
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="divide-y divide-gray-200">
        {filteredEntities.map((entity) => (
          <div key={entity.name}>
            <div
              onClick={() => handleEntityClick(entity.name)}
              className={`cursor-pointer border-l-4 px-6 py-4 transition-all ${
                selectedEntity === entity.name
                  ? "border-l-blue-500 bg-blue-50"
                  : "border-l-gray-200 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {entity.name}
                    </h3>
                    <span
                      className={`inline-block rounded-full px-3 py-1 text-xs font-medium border ${getStatusColor(entity.pipelineHealth)}`}
                    >
                      {getQualityStatus(entity.pipelineHealth)}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-gray-600">
                    {entity.completeRecords.toLocaleString()} of{" "}
                    {entity.totalRecords.toLocaleString()} records complete •{" "}
                    {entity.staleRecords.toLocaleString()} stale
                  </p>
                </div>

                <div className="ml-4 text-right">
                  <div className="mb-2 flex items-center gap-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${getHealthBarColor(entity.pipelineHealth)}`}
                        style={{
                          width: `${entity.pipelineHealth}%`,
                        }}
                      ></div>
                    </div>
                    <span className="text-lg font-bold text-gray-900">
                      {entity.pipelineHealth}%
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">Pipeline Health</p>
                </div>
              </div>
            </div>

            {selectedEntity === entity.name && (
              <div className="border-t border-gray-100 bg-gray-50 px-6 py-4">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="mb-3 text-sm font-semibold text-gray-900">
                      📊 Records Overview
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">
                          Total Records
                        </span>
                        <span className="font-medium text-gray-900">
                          {entity.totalRecords.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Complete</span>
                        <span className="font-medium text-green-600">
                          {entity.completeRecords.toLocaleString()} (
                          {Math.round(
                            (entity.completeRecords / entity.totalRecords) * 100
                          )}
                          %)
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Stale</span>
                        <span className="font-medium text-orange-600">
                          {entity.staleRecords.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="mb-3 text-sm font-semibold text-gray-900">
                      ⚠️ Missing Fields
                    </h4>
                    <div className="space-y-2">
                      {Object.entries(entity.missingFields).map(
                        ([field, count]) => (
                          <div key={field} className="flex justify-between">
                            <span className="text-sm text-gray-600">
                              {field}
                            </span>
                            <span className="font-medium text-red-600">
                              {count} missing
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
        <div className="grid grid-cols-5 gap-4">
          {filteredEntities.map((entity) => (
            <div
              key={entity.name}
              className="rounded-lg border border-gray-200 bg-white p-4 text-center"
            >
              <p className="text-sm font-medium text-gray-600">{entity.name}</p>
              <p className="mt-2 text-2xl font-bold text-gray-900">
                {entity.pipelineHealth}%
              </p>
              <div className="mt-2 flex h-1 w-full overflow-hidden rounded-full bg-gray-200">
                <div
                  className={`${getHealthBarColor(entity.pipelineHealth)}`}
                  style={{ width: `${entity.pipelineHealth}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DataQualityDashboard;
