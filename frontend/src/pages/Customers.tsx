import { useState } from 'react';
import { Search, Filter, Download } from 'lucide-react';

const customers = [
  { id: 1, name: '김철수', email: 'kim@example.com', segment: 'VIP', orders: 15, revenue: 2340000, lastOrder: '2024-12-28' },
  { id: 2, name: '이영희', email: 'lee@example.com', segment: 'Regular', orders: 8, revenue: 890000, lastOrder: '2024-12-25' },
  { id: 3, name: '박민수', email: 'park@example.com', segment: 'New', orders: 2, revenue: 156000, lastOrder: '2024-12-30' },
  { id: 4, name: '최지은', email: 'choi@example.com', segment: 'VIP', orders: 22, revenue: 4120000, lastOrder: '2024-12-29' },
  { id: 5, name: '정수진', email: 'jung@example.com', segment: 'Regular', orders: 5, revenue: 450000, lastOrder: '2024-12-20' },
  { id: 6, name: '강민호', email: 'kang@example.com', segment: 'Dormant', orders: 3, revenue: 280000, lastOrder: '2024-10-15' },
];

export function Customers() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSegment, setSelectedSegment] = useState<string>('all');

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch = customer.name.includes(searchQuery) || customer.email.includes(searchQuery);
    const matchesSegment = selectedSegment === 'all' || customer.segment === selectedSegment;
    return matchesSearch && matchesSegment;
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(value);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">고객 관리</h1>
          <p className="text-gray-500 mt-1">고객 정보를 조회하고 관리하세요</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Download className="w-4 h-4" />
          내보내기
        </button>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="이름 또는 이메일로 검색"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={selectedSegment}
              onChange={(e) => setSelectedSegment(e.target.value)}
              className="input w-auto"
            >
              <option value="all">전체 세그먼트</option>
              <option value="VIP">VIP</option>
              <option value="Regular">Regular</option>
              <option value="New">New</option>
              <option value="Dormant">Dormant</option>
            </select>
          </div>
        </div>
      </div>

      {/* Customers Table */}
      <div className="card overflow-hidden p-0">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">고객명</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">이메일</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">세그먼트</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">주문 수</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">총 매출</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">마지막 주문</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredCustomers.map((customer) => (
              <tr key={customer.id} className="hover:bg-gray-50 cursor-pointer">
                <td className="py-4 px-6 text-sm font-medium text-gray-900">{customer.name}</td>
                <td className="py-4 px-6 text-sm text-gray-600">{customer.email}</td>
                <td className="py-4 px-6">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      customer.segment === 'VIP'
                        ? 'bg-purple-100 text-purple-700'
                        : customer.segment === 'New'
                        ? 'bg-green-100 text-green-700'
                        : customer.segment === 'Dormant'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {customer.segment}
                  </span>
                </td>
                <td className="py-4 px-6 text-sm text-gray-600">{customer.orders}</td>
                <td className="py-4 px-6 text-sm text-gray-900 font-medium">
                  {formatCurrency(customer.revenue)}
                </td>
                <td className="py-4 px-6 text-sm text-gray-600">{customer.lastOrder}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
