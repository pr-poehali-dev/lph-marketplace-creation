import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import ProductCard from '@/components/ProductCard';
import { CATEGORIES, REGIONS } from '@/data/products';
import { getProducts } from '@/lib/api';

const SORT_OPTIONS = [
  { value: 'popular', label: 'По популярности' },
  { value: 'price_asc', label: 'Цена: по возрастанию' },
  { value: 'price_desc', label: 'Цена: по убыванию' },
  { value: 'rating', label: 'По рейтингу' },
];

interface ApiProduct {
  id: number; name: string; description?: string; price: number; unit: string;
  category: string; region: string; emoji: string; badge?: string | null;
  stock?: number; rating: number; reviews_count?: number; seller?: string;
}

export default function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [sort, setSort] = useState('popular');
  const [search, setSearch] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const selectedCategory = searchParams.get('category') || '';
  const selectedRegion = searchParams.get('region') || '';

  const setFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) { params.set(key, value); } else { params.delete(key); }
    setSearchParams(params);
  };

  useEffect(() => {
    setLoading(true);
    getProducts({ category: selectedCategory || undefined, region: selectedRegion || undefined, search: search || undefined, sort }).then((r) => {
      if (r.ok) {
        const d = r.data as { products: ApiProduct[]; total: number };
        setProducts(d.products || []);
        setTotal(d.total || 0);
      }
      setLoading(false);
    });
  }, [selectedCategory, selectedRegion, search, sort]);

  const resetFilters = () => {
    setSearchParams({});
    setSearch('');
  };

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-5xl font-bold text-foreground mb-2">Каталог товаров</h1>
        <p className="text-muted-foreground font-body">
          Натуральные продукты от фермеров и ЛПХ со всей России
        </p>
      </div>

      {/* Search + Sort bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Icon name="Search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Поиск товаров..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-card font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-border bg-card font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 text-foreground"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <button
          onClick={() => setFiltersOpen(!filtersOpen)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border font-body text-sm font-medium transition-all sm:hidden ${filtersOpen ? 'bg-primary text-primary-foreground border-primary' : 'bg-card border-border'}`}
        >
          <Icon name="SlidersHorizontal" size={16} />
          Фильтры
        </button>
      </div>

      <div className="flex gap-6">
        {/* Sidebar Filters */}
        <aside className={`${filtersOpen ? 'block' : 'hidden'} sm:block w-full sm:w-56 flex-shrink-0`}>
          <div className="bg-card rounded-2xl border border-border p-5 sticky top-24">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-lg font-semibold">Фильтры</h3>
              {(selectedCategory || selectedRegion) && (
                <button onClick={resetFilters} className="text-xs text-primary font-body hover:underline">
                  Сбросить
                </button>
              )}
            </div>

            {/* Categories */}
            <div className="mb-5">
              <h4 className="font-body font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-3">
                Категории
              </h4>
              <div className="space-y-1">
                <button
                  onClick={() => setFilter('category', '')}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-sm font-body transition-colors ${!selectedCategory ? 'bg-primary text-primary-foreground font-semibold' : 'hover:bg-muted'}`}
                >
                  Все категории
                </button>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.name}
                    onClick={() => setFilter('category', cat.name)}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-sm font-body transition-colors flex items-center gap-2 ${selectedCategory === cat.name ? 'bg-primary text-primary-foreground font-semibold' : 'hover:bg-muted'}`}
                  >
                    <span>{cat.emoji}</span>
                    <span className="truncate">{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Regions */}
            <div>
              <h4 className="font-body font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-3">
                Регион
              </h4>
              <div className="space-y-1 max-h-56 overflow-y-auto">
                <button
                  onClick={() => setFilter('region', '')}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-sm font-body transition-colors ${!selectedRegion ? 'bg-primary text-primary-foreground font-semibold' : 'hover:bg-muted'}`}
                >
                  Все регионы
                </button>
                {REGIONS.map((reg) => (
                  <button
                    key={reg.name}
                    onClick={() => setFilter('region', reg.name)}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-sm font-body transition-colors flex items-center justify-between gap-1 ${selectedRegion === reg.name ? 'bg-primary text-primary-foreground font-semibold' : 'hover:bg-muted'}`}
                  >
                    <span className="truncate">{reg.name}</span>
                    <span className={`text-xs ${selectedRegion === reg.name ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                      {reg.products}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Products Grid */}
        <div className="flex-1 min-w-0">
          {/* Active filters */}
          {(selectedCategory || selectedRegion) && (
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedCategory && (
                <span className="inline-flex items-center gap-1 bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-full text-sm font-body font-medium">
                  {selectedCategory}
                  <button onClick={() => setFilter('category', '')} className="ml-1 hover:opacity-70">
                    <Icon name="X" size={13} />
                  </button>
                </span>
              )}
              {selectedRegion && (
                <span className="inline-flex items-center gap-1 bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-full text-sm font-body font-medium">
                  {selectedRegion}
                  <button onClick={() => setFilter('region', '')} className="ml-1 hover:opacity-70">
                    <Icon name="X" size={13} />
                  </button>
                </span>
              )}
            </div>
          )}

          <p className="text-sm text-muted-foreground font-body mb-4">
            Найдено: <strong>{total}</strong> товаров
          </p>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-card rounded-2xl border border-border h-80 animate-pulse" />
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🌾</div>
              <h3 className="font-display text-2xl font-bold mb-2">Товары не найдены</h3>
              <p className="text-muted-foreground font-body mb-4">
                Попробуйте изменить параметры поиска
              </p>
              <button onClick={resetFilters} className="btn-village">
                Сбросить фильтры
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}