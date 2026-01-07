import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { api } from '../api/client';

export function Callback() {
  const [searchParams] = useSearchParams();
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  useEffect(() => {
    const processCallback = async () => {
      // Demo mode
      if (searchParams.get('demo') === 'true') {
        login('demo-mall', 'demo-token', 'demo-refresh', 3600);
        navigate('/');
        return;
      }

      // Real OAuth callback
      const code = searchParams.get('code');
      const mallId = sessionStorage.getItem('cafe24_mall_id');

      if (!code || !mallId) {
        setError('인증 정보가 없습니다');
        return;
      }

      try {
        const { data } = await api.exchangeToken(mallId, code);
        login(
          mallId,
          data.access_token,
          data.refresh_token,
          data.expires_in
        );
        sessionStorage.removeItem('cafe24_mall_id');
        navigate('/');
      } catch (err) {
        setError('토큰 교환에 실패했습니다');
      }
    };

    processCallback();
  }, [searchParams, login, navigate]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center">
          <div className="text-red-500 text-lg mb-4">{error}</div>
          <button
            onClick={() => navigate('/login')}
            className="btn-primary"
          >
            로그인으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin w-12 h-12 border-4 border-cafe24-primary border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-gray-600">인증 처리 중...</p>
      </div>
    </div>
  );
}
