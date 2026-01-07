import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Brain,
  LogOut,
  PieChart,
  TrendingUp,
  GitBranch,
  Sparkles,
  Megaphone,
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: '대시보드' },
  { path: '/customers', icon: Users, label: '고객 관리' },
  { path: '/rfm', icon: PieChart, label: 'RFM 분석' },
  { path: '/funnel', icon: TrendingUp, label: '퍼널 분석' },
  { path: '/cohort', icon: GitBranch, label: '코호트 분석' },
  { path: '/recommendations', icon: Sparkles, label: '상품 추천' },
  { path: '/campaigns', icon: Megaphone, label: '캠페인' },
  { path: '/ai-insights', icon: Brain, label: 'AI 인사이트' },
];

export function Layout() {
  const { mallId, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200">
        <div className="p-6">
          <h1 className="text-xl font-bold text-cafe24-secondary">
            Cafe24 CRM
          </h1>
          <p className="text-sm text-gray-500 mt-1">{mallId}</p>
        </div>

        <nav className="mt-4">
          {navItems.map(({ path, icon: Icon, label }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-cafe24-primary/10 text-cafe24-primary border-r-2 border-cafe24-primary'
                    : 'text-gray-600 hover:bg-gray-50'
                }`
              }
            >
              <Icon className="w-5 h-5 mr-3" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="absolute bottom-0 w-64 p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5 mr-3" />
            로그아웃
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
