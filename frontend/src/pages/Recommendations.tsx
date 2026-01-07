import { useState } from 'react';
import { Sparkles, Heart, ShoppingBag, TrendingUp, Filter, Grid, List } from 'lucide-react';
import {
  useProductRecommendations,
  useFrequentlyBoughtTogether,
  useCategoryRecommendations,
} from '../hooks/useApiData';

const categories = ['전체', '의류', '가방', '신발', '액세서리'];

function LoadingSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="card p-0">
            <div className="aspect-square bg-gray-200 rounded-t-xl" />
            <div className="p-4 space-y-2">
              <div className="h-4 w-3/4 bg-gray-200 rounded" />
              <div className="h-4 w-1/2 bg-gray-200 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    category: string;
    price: number;
    imageUrl: string;
    score: number;
    reason: string;
  };
  viewMode: 'grid' | 'list';
}

function ProductCard({ product, viewMode }: ProductCardProps) {
  if (viewMode === 'list') {
    return (
      <div className="card flex items-center gap-4 p-4 hover:shadow-md transition-shadow cursor-pointer">
        <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-gray-900 truncate">{product.name}</p>
          <p className="text-sm text-gray-500">{product.category}</p>
          <p className="text-xs text-gray-400 mt-1">{product.reason}</p>
        </div>
        <div className="text-right">
          <p className="font-bold text-gray-900">{product.price.toLocaleString()}원</p>
          <div className="flex items-center gap-1 justify-end mt-1">
            <Sparkles className="w-3 h-3 text-cafe24-primary" />
            <span className="text-sm text-cafe24-primary font-medium">
              {Math.round(product.score * 100)}%
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-0 overflow-hidden hover:shadow-md transition-shadow cursor-pointer group">
      <div className="aspect-square bg-gray-100 relative overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-cafe24-primary" />
          <span className="text-xs font-medium text-cafe24-primary">
            {Math.round(product.score * 100)}%
          </span>
        </div>
        <button className="absolute top-2 right-2 p-2 bg-white/90 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white">
          <Heart className="w-4 h-4 text-gray-400 hover:text-red-500 transition-colors" />
        </button>
      </div>
      <div className="p-4">
        <span className="text-xs text-gray-400">{product.category}</span>
        <p className="font-medium text-gray-900 mt-1 truncate">{product.name}</p>
        <p className="text-lg font-bold text-gray-900 mt-1">
          {product.price.toLocaleString()}원
        </p>
        <p className="text-xs text-gray-400 mt-2 line-clamp-2">{product.reason}</p>
      </div>
    </div>
  );
}

export function Recommendations() {
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const { data: products, isLoading: productsLoading } = useProductRecommendations({
    category: selectedCategory === '전체' ? undefined : selectedCategory,
  });
  const { data: frequentlyBought, isLoading: fbtLoading } = useFrequentlyBoughtTogether();
  const { data: categoryRecs, isLoading: categoryLoading } = useCategoryRecommendations();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">상품 추천</h1>
          <p className="text-gray-500 mt-1">AI 기반 개인화 상품 추천</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'grid' ? 'bg-white shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'list' ? 'bg-white shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="card">
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-4 h-4 text-gray-400" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                selectedCategory === cat
                  ? 'bg-cafe24-primary text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Top Recommendations */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-cafe24-primary" />
          <h2 className="text-lg font-semibold text-gray-900">인기 추천 상품</h2>
        </div>
        {productsLoading ? (
          <LoadingSkeleton />
        ) : (
          <div className={
            viewMode === 'grid'
              ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'
              : 'space-y-3'
          }>
            {products?.map((product) => (
              <ProductCard key={product.id} product={product} viewMode={viewMode} />
            ))}
          </div>
        )}
      </div>

      {/* Frequently Bought Together */}
      <div className="card">
        <div className="flex items-center gap-2 mb-6">
          <ShoppingBag className="w-5 h-5 text-cafe24-primary" />
          <h2 className="text-lg font-semibold text-gray-900">함께 구매한 상품</h2>
        </div>
        {fbtLoading ? (
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-gray-100 rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {frequentlyBought?.map((group, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-500">
                    함께 구매 확률: <span className="font-medium text-gray-900">{Math.round(group.confidence * 100)}%</span>
                  </span>
                  <button className="text-sm text-cafe24-primary hover:underline">
                    세트 추가
                  </button>
                </div>
                <div className="flex items-center gap-4">
                  {group.products.map((product, pIndex) => (
                    <div key={product.id} className="flex items-center gap-4">
                      <div className="w-20 h-20 bg-white rounded-lg overflow-hidden">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{product.name}</p>
                        <p className="text-sm text-gray-500">{product.price.toLocaleString()}원</p>
                      </div>
                      {pIndex < group.products.length - 1 && (
                        <div className="w-8 h-8 rounded-full bg-cafe24-primary/10 flex items-center justify-center">
                          <span className="text-cafe24-primary text-lg">+</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Category Recommendations */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-cafe24-primary" />
          <h2 className="text-lg font-semibold text-gray-900">카테고리별 추천</h2>
        </div>
        {categoryLoading ? (
          <div className="animate-pulse space-y-6">
            {[1, 2].map((i) => (
              <div key={i}>
                <div className="h-6 w-24 bg-gray-200 rounded mb-4" />
                <div className="grid grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map((j) => (
                    <div key={j} className="h-48 bg-gray-100 rounded-lg" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-8">
            {categoryRecs?.filter((cat) => cat.products.length > 0).map((category) => (
              <div key={category.category}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-gray-900">{category.category}</h3>
                  <button className="text-sm text-cafe24-primary hover:underline">
                    더보기
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {category.products.slice(0, 4).map((product) => (
                    <ProductCard key={product.id} product={product} viewMode="grid" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* AI Recommendation Info */}
      <div className="card bg-gradient-to-r from-cafe24-primary/5 to-cafe24-accent/5">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-cafe24-primary/10 rounded-lg">
            <Sparkles className="w-5 h-5 text-cafe24-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">AI 추천 엔진</h3>
            <p className="text-sm text-gray-600 mt-1">
              고객의 구매 이력, 브라우징 패턴, 선호 카테고리를 분석하여 개인화된 상품을 추천합니다.
              추천 정확도는 지속적인 학습을 통해 개선됩니다.
            </p>
            <div className="flex gap-6 mt-4">
              <div>
                <p className="text-2xl font-bold text-cafe24-primary">85%</p>
                <p className="text-xs text-gray-500">추천 정확도</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-cafe24-primary">23%</p>
                <p className="text-xs text-gray-500">전환율 향상</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-cafe24-primary">1.5배</p>
                <p className="text-xs text-gray-500">AOV 증가</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
