import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Store } from 'lucide-react';
import { api } from '../api/client';

export function Login() {
  const [mallId, setMallId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mallId.trim()) {
      setError('쇼핑몰 ID를 입력해주세요');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { data } = await api.getAuthUrl(mallId);
      // Store mallId for callback
      sessionStorage.setItem('cafe24_mall_id', mallId);
      // Redirect to Cafe24 OAuth
      window.location.href = data.authorization_url;
    } catch (err) {
      setError('인증 URL을 가져오는데 실패했습니다');
      setLoading(false);
    }
  };

  // Demo mode for development
  const handleDemoLogin = () => {
    navigate('/callback?demo=true');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cafe24-primary/10 to-cafe24-secondary/10">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-cafe24-primary/10 rounded-full mb-4">
            <Store className="w-8 h-8 text-cafe24-primary" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Cafe24 CRM</h1>
          <p className="text-gray-500 mt-2">쇼핑몰 AI CRM 솔루션</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="mallId" className="block text-sm font-medium text-gray-700 mb-2">
              쇼핑몰 ID
            </label>
            <input
              id="mallId"
              type="text"
              value={mallId}
              onChange={(e) => setMallId(e.target.value)}
              placeholder="예: myshop"
              className="input"
              disabled={loading}
            />
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-3 flex items-center justify-center"
          >
            {loading ? (
              <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              'Cafe24로 로그인'
            )}
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">또는</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleDemoLogin}
            className="w-full py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            데모 모드로 시작
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Cafe24 쇼핑몰 계정이 필요합니다
        </p>
      </div>
    </div>
  );
}
