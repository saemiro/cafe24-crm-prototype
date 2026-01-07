import { useSearchParams, Link } from 'react-router-dom';

export function AuthError() {
  const [searchParams] = useSearchParams();
  const mallId = searchParams.get('mall_id');
  const error = searchParams.get('error');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">인증 실패</h1>
        <p className="text-gray-600 mb-4">
          {mallId && <span className="block">몰: {mallId}</span>}
          {error && <span className="block text-red-600 text-sm mt-2">{error}</span>}
        </p>
        <Link
          to="/login"
          className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          다시 시도
        </Link>
      </div>
    </div>
  );
}
