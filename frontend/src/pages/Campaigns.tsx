import { useState } from 'react';
import {
  Plus,
  Search,
  MoreVertical,
  Play,
  Pause,
  Users,
  Mail,
  MessageSquare,
  Bell,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useCampaigns, useSegments } from '../hooks/useApiData';
import { BarChart } from '../components/charts/BarChart';

type CampaignStatus = 'active' | 'scheduled' | 'completed' | 'draft' | 'paused';
type CampaignType = 'email' | 'sms' | 'push' | 'kakao';

interface Campaign {
  id: string;
  name: string;
  type: CampaignType;
  status: CampaignStatus;
  targetSegment: string;
  targetCount: number;
  sentCount: number;
  openRate: number;
  clickRate: number;
  conversionRate: number;
  revenue: number;
  scheduledAt?: string;
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
}

const statusConfig: Record<CampaignStatus, { label: string; color: string; icon: React.ElementType }> = {
  active: { label: '진행중', color: 'bg-green-100 text-green-700', icon: Play },
  scheduled: { label: '예약됨', color: 'bg-blue-100 text-blue-700', icon: Clock },
  completed: { label: '완료', color: 'bg-gray-100 text-gray-700', icon: CheckCircle },
  draft: { label: '초안', color: 'bg-yellow-100 text-yellow-700', icon: AlertCircle },
  paused: { label: '일시정지', color: 'bg-orange-100 text-orange-700', icon: Pause },
};

const typeConfig: Record<CampaignType, { label: string; icon: React.ElementType; color: string }> = {
  email: { label: '이메일', icon: Mail, color: 'text-blue-500' },
  sms: { label: 'SMS', icon: MessageSquare, color: 'text-green-500' },
  push: { label: '푸시', icon: Bell, color: 'text-purple-500' },
  kakao: { label: '카카오톡', icon: MessageSquare, color: 'text-yellow-500' },
};

function LoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="grid grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="card">
            <div className="h-4 w-20 bg-gray-200 rounded mb-2" />
            <div className="h-8 w-16 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
      <div className="card">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-16 bg-gray-100 rounded mb-2" />
        ))}
      </div>
    </div>
  );
}

interface CreateCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  segments: Array<{ id: string; name: string; count: number }>;
}

function CreateCampaignModal({ isOpen, onClose, segments }: CreateCampaignModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    type: 'email' as CampaignType,
    segment: '',
    subject: '',
    content: '',
    scheduledAt: '',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would call an API
    console.log('Creating campaign:', formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">새 캠페인 만들기</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Campaign Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              캠페인 이름
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cafe24-primary focus:border-transparent outline-none"
              placeholder="예: 봄 시즌 할인 안내"
              required
            />
          </div>

          {/* Campaign Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              캠페인 유형
            </label>
            <div className="grid grid-cols-4 gap-3">
              {(Object.entries(typeConfig) as [CampaignType, typeof typeConfig[CampaignType]][]).map(
                ([type, config]) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFormData({ ...formData, type })}
                    className={`flex flex-col items-center p-4 rounded-lg border-2 transition-colors ${
                      formData.type === type
                        ? 'border-cafe24-primary bg-cafe24-primary/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <config.icon className={`w-6 h-6 ${config.color}`} />
                    <span className="text-sm font-medium mt-2">{config.label}</span>
                  </button>
                )
              )}
            </div>
          </div>

          {/* Target Segment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              타겟 세그먼트
            </label>
            <select
              value={formData.segment}
              onChange={(e) => setFormData({ ...formData, segment: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cafe24-primary focus:border-transparent outline-none"
              required
            >
              <option value="">세그먼트 선택</option>
              {segments.map((segment) => (
                <option key={segment.id} value={segment.id}>
                  {segment.name} ({segment.count.toLocaleString()}명)
                </option>
              ))}
            </select>
          </div>

          {/* Subject (for email) */}
          {formData.type === 'email' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                이메일 제목
              </label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cafe24-primary focus:border-transparent outline-none"
                placeholder="이메일 제목을 입력하세요"
              />
            </div>
          )}

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              메시지 내용
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cafe24-primary focus:border-transparent outline-none resize-none"
              placeholder="캠페인 메시지 내용을 입력하세요"
              required
            />
          </div>

          {/* Schedule */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              발송 예약 (선택)
            </label>
            <input
              type="datetime-local"
              value={formData.scheduledAt}
              onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cafe24-primary focus:border-transparent outline-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              비워두면 초안으로 저장됩니다
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              className="btn-primary"
            >
              캠페인 생성
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function CampaignRow({ campaign }: { campaign: Campaign }) {
  const status = statusConfig[campaign.status];
  const type = typeConfig[campaign.type];
  const StatusIcon = status.icon;
  const TypeIcon = type.icon;

  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50">
      <td className="py-4 px-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg bg-gray-100`}>
            <TypeIcon className={`w-4 h-4 ${type.color}`} />
          </div>
          <div>
            <p className="font-medium text-gray-900">{campaign.name}</p>
            <p className="text-sm text-gray-500">{type.label}</p>
          </div>
        </div>
      </td>
      <td className="py-4 px-4">
        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
          <StatusIcon className="w-3 h-3" />
          {status.label}
        </span>
      </td>
      <td className="py-4 px-4">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-900">{campaign.targetSegment}</span>
          <span className="text-xs text-gray-500">({campaign.targetCount.toLocaleString()}명)</span>
        </div>
      </td>
      <td className="py-4 px-4">
        <div className="flex items-center gap-4 text-sm">
          <div>
            <span className="text-gray-500">오픈</span>
            <span className="ml-1 font-medium text-gray-900">{campaign.openRate}%</span>
          </div>
          <div>
            <span className="text-gray-500">클릭</span>
            <span className="ml-1 font-medium text-gray-900">{campaign.clickRate}%</span>
          </div>
          <div>
            <span className="text-gray-500">전환</span>
            <span className="ml-1 font-medium text-cafe24-primary">{campaign.conversionRate}%</span>
          </div>
        </div>
      </td>
      <td className="py-4 px-4 text-right">
        <p className="font-medium text-gray-900">{campaign.revenue.toLocaleString()}원</p>
      </td>
      <td className="py-4 px-4">
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <MoreVertical className="w-4 h-4 text-gray-400" />
        </button>
      </td>
    </tr>
  );
}

function CalendarView({ campaigns }: { campaigns: Campaign[] }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const days = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const monthNames = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];

  const getCampaignsForDay = (day: number | null) => {
    if (!day) return [];
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return campaigns.filter((c) => {
      const campaignDate = c.scheduledAt || c.startedAt || c.createdAt;
      return campaignDate.startsWith(dateStr);
    });
  };

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">캠페인 캘린더</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={prevMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <span className="text-sm font-medium text-gray-900 w-24 text-center">
            {year}년 {monthNames[month]}
          </span>
          <button
            onClick={nextMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden">
        {dayNames.map((day) => (
          <div key={day} className="bg-gray-50 py-2 text-center text-xs font-medium text-gray-500">
            {day}
          </div>
        ))}
        {days.map((day, index) => {
          const dayCampaigns = getCampaignsForDay(day);
          return (
            <div
              key={index}
              className={`bg-white min-h-[100px] p-2 ${!day ? 'bg-gray-50' : ''}`}
            >
              {day && (
                <>
                  <span className={`text-sm ${
                    day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear()
                      ? 'bg-cafe24-primary text-white w-6 h-6 rounded-full flex items-center justify-center'
                      : 'text-gray-700'
                  }`}>
                    {day}
                  </span>
                  <div className="mt-1 space-y-1">
                    {dayCampaigns.slice(0, 2).map((campaign) => (
                        <div
                          key={campaign.id}
                          className={`text-xs px-1.5 py-0.5 rounded truncate ${
                            campaign.status === 'active'
                              ? 'bg-green-100 text-green-700'
                              : campaign.status === 'scheduled'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                          title={campaign.name}
                        >
                          {campaign.name}
                        </div>
                      ))}
                    {dayCampaigns.length > 2 && (
                      <div className="text-xs text-gray-400">
                        +{dayCampaigns.length - 2}개 더
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function Campaigns() {
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [statusFilter, setStatusFilter] = useState<CampaignStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<CampaignType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { data: campaigns, isLoading: campaignsLoading } = useCampaigns();
  const { data: segments, isLoading: segmentsLoading } = useSegments();

  const isLoading = campaignsLoading || segmentsLoading;

  const filteredCampaigns = campaigns?.filter((campaign) => {
    if (statusFilter !== 'all' && campaign.status !== statusFilter) return false;
    if (typeFilter !== 'all' && campaign.type !== typeFilter) return false;
    if (searchQuery && !campaign.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  }) || [];

  // Calculate KPIs
  const activeCampaigns = campaigns?.filter((c) => c.status === 'active').length || 0;
  const scheduledCampaigns = campaigns?.filter((c) => c.status === 'scheduled').length || 0;
  const totalSent = campaigns?.reduce((sum, c) => sum + c.sentCount, 0) || 0;
  const totalRevenue = campaigns?.reduce((sum, c) => sum + c.revenue, 0) || 0;
  const avgConversion = campaigns?.length
    ? campaigns.reduce((sum, c) => sum + c.conversionRate, 0) / campaigns.length
    : 0;

  // Performance data for chart
  const performanceData = [
    { type: '이메일', 오픈율: 24.5, 클릭률: 3.2, 전환율: 1.8 },
    { type: 'SMS', 오픈율: 0, 클릭률: 2.1, 전환율: 1.2 },
    { type: '푸시', 오픈율: 18.3, 클릭률: 4.5, 전환율: 2.1 },
    { type: '카카오톡', 오픈율: 35.2, 클릭률: 8.4, 전환율: 3.5 },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">캠페인 관리</h1>
          <p className="text-gray-500 mt-1">마케팅 캠페인을 생성하고 관리하세요</p>
        </div>
        <LoadingSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">캠페인 관리</h1>
          <p className="text-gray-500 mt-1">마케팅 캠페인을 생성하고 관리하세요</p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          새 캠페인
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Play className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">진행중</p>
              <p className="text-2xl font-bold text-gray-900">{activeCampaigns}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">예약됨</p>
              <p className="text-2xl font-bold text-gray-900">{scheduledCampaigns}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Mail className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">총 발송</p>
              <p className="text-2xl font-bold text-gray-900">{totalSent.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cafe24-primary/10 rounded-lg">
              <TrendingUp className="w-5 h-5 text-cafe24-primary" />
            </div>
            <div>
              <p className="text-sm text-gray-500">평균 전환율</p>
              <p className="text-2xl font-bold text-gray-900">{avgConversion.toFixed(1)}%</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">총 매출</p>
              <p className="text-2xl font-bold text-gray-900">
                {(totalRevenue / 10000).toFixed(0)}만원
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Channel Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">채널별 성과</h2>
          <BarChart
            data={performanceData}
            xKey="type"
            bars={[
              { key: '오픈율', name: '오픈율', color: '#00a8e8' },
              { key: '클릭률', name: '클릭률', color: '#0077b6' },
              { key: '전환율', name: '전환율', color: '#48cae4' },
            ]}
            height={250}
            formatYAxis={(v) => `${v}%`}
          />
        </div>

        <CalendarView campaigns={filteredCampaigns} />
      </div>

      {/* Filters and Search */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          {/* View Toggle */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                viewMode === 'list' ? 'bg-white shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              목록
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                viewMode === 'calendar' ? 'bg-white shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              캘린더
            </button>
          </div>

          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="캠페인 검색..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cafe24-primary focus:border-transparent outline-none"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as CampaignStatus | 'all')}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cafe24-primary focus:border-transparent outline-none"
          >
            <option value="all">모든 상태</option>
            <option value="active">진행중</option>
            <option value="scheduled">예약됨</option>
            <option value="completed">완료</option>
            <option value="draft">초안</option>
            <option value="paused">일시정지</option>
          </select>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as CampaignType | 'all')}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cafe24-primary focus:border-transparent outline-none"
          >
            <option value="all">모든 유형</option>
            <option value="email">이메일</option>
            <option value="sms">SMS</option>
            <option value="push">푸시</option>
            <option value="kakao">카카오톡</option>
          </select>
        </div>

        {/* Campaign List */}
        {viewMode === 'list' && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">캠페인</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">상태</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">타겟</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">성과</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">매출</th>
                  <th className="py-3 px-4"></th>
                </tr>
              </thead>
              <tbody>
                {filteredCampaigns.map((campaign) => (
                  <CampaignRow key={campaign.id} campaign={campaign} />
                ))}
              </tbody>
            </table>

            {filteredCampaigns.length === 0 && (
              <div className="text-center py-12">
                <XCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">검색 결과가 없습니다</p>
              </div>
            )}
          </div>
        )}

        {/* Calendar View (already shown above, this is a placeholder for when only calendar view is selected) */}
        {viewMode === 'calendar' && (
          <div className="text-center py-8 text-gray-500">
            캘린더 뷰는 위에 표시됩니다
          </div>
        )}
      </div>

      {/* Create Campaign Modal */}
      <CreateCampaignModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        segments={segments || []}
      />
    </div>
  );
}
