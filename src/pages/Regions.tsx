import { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { REGIONS } from '@/data/products';

const REGION_ICONS: Record<string, string> = {
  'Краснодарский край': '🌻',
  'Алтайский край': '🏔️',
  'Башкортостан': '🍯',
  'Брянская область': '🌲',
  'Воронежская область': '🌾',
  'Карелия': '🫐',
  'Белгородская область': '🥩',
  'Тверская область': '🥛',
  'Вологодская область': '🍄',
  'Самарская область': '🍓',
  'Ленинградская область': '🧀',
  'Астраханская область': '🐟',
};

const SPECIALTIES: Record<string, string> = {
  'Краснодарский край': 'Овощи, фрукты, вина',
  'Алтайский край': 'Мёд, травы, кедровые орехи',
  'Башкортостан': 'Башкирский мёд, кумыс',
  'Брянская область': 'Картофель, грибы, ягоды',
  'Воронежская область': 'Молочные продукты, зерно',
  'Карелия': 'Ягоды, рыба, лесные дары',
  'Белгородская область': 'Мясо, сало, птица',
  'Тверская область': 'Молоко, творог, сыры',
  'Вологодская область': 'Вологодское масло, грибы',
  'Самарская область': 'Садовые ягоды, мёд',
  'Ленинградская область': 'Сыры, молоко, птица',
  'Астраханская область': 'Рыба, арбузы, томаты',
};

export default function Regions() {
  const [search, setSearch] = useState('');

  const filtered = REGIONS.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <p className="text-sm font-body font-semibold text-[hsl(115,28%,32%)] uppercase tracking-wider mb-2">
          🗺️ 82 региона России
        </p>
        <h1 className="font-display text-5xl font-bold text-foreground mb-4">
          Выберите регион
        </h1>
        <p className="text-muted-foreground font-body max-w-md mx-auto">
          Найдите продавцов рядом с вами или выберите регион, известный особыми продуктами
        </p>
      </div>

      {/* Search */}
      <div className="max-w-md mx-auto mb-10">
        <div className="relative">
          <Icon name="Search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Найти регион..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-2xl border border-border bg-card font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
      </div>

      {/* Map placeholder */}
      <div className="relative rounded-3xl overflow-hidden mb-12 h-56 md:h-72">
        <img
          src="https://cdn.poehali.dev/projects/896a8549-f3d7-44ee-802e-7c35ff62a322/files/a924084d-0c6a-438f-afeb-89827e8ff0dc.jpg"
          alt="Карта регионов"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[hsl(25,45%,20%,0.55)]" />
        <div className="absolute inset-0 flex items-center justify-center text-center">
          <div>
            <p className="text-white font-display text-2xl md:text-3xl font-bold mb-2">
              Интерактивная карта регионов
            </p>
            <p className="text-[hsl(42,40%,82%)] font-body text-sm">
              Скоро появится полная карта с маркерами продавцов
            </p>
          </div>
        </div>
      </div>

      {/* Regions Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((region) => (
          <Link
            key={region.name}
            to={`/catalog?region=${encodeURIComponent(region.name)}`}
            className="group bg-card rounded-2xl border border-border p-5 card-hover transition-all duration-200 hover:border-primary"
          >
            <div className="flex items-start gap-4">
              <span className="text-3xl flex-shrink-0 group-hover:scale-110 transition-transform duration-200">
                {REGION_ICONS[region.name] || '🌾'}
              </span>
              <div className="min-w-0">
                <h3 className="font-display text-lg font-semibold text-foreground leading-tight mb-1">
                  {region.name}
                </h3>
                <p className="text-xs text-muted-foreground font-body mb-2 truncate">
                  {SPECIALTIES[region.name]}
                </p>
                <div className="flex items-center gap-1.5">
                  <div className="h-1.5 flex-1 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${Math.min((region.products / 500) * 100, 100)}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-primary font-body whitespace-nowrap">
                    {region.products} товаров
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <div className="text-5xl mb-3">🗺️</div>
          <p className="font-display text-xl font-bold mb-1">Регион не найден</p>
          <p className="text-muted-foreground font-body text-sm">
            Попробуйте другой запрос
          </p>
        </div>
      )}

      {/* CTA */}
      <div className="mt-12 bg-gradient-to-br from-[hsl(42,50%,92%)] to-[hsl(88,20%,88%)] rounded-3xl p-8 text-center texture-linen">
        <p className="text-sm font-body font-semibold text-[hsl(115,28%,32%)] uppercase tracking-wider mb-2">
          Не нашли свой регион?
        </p>
        <h2 className="font-display text-3xl font-bold text-foreground mb-3">
          Станьте первым продавцом
        </h2>
        <p className="text-muted-foreground font-body mb-6 max-w-sm mx-auto">
          Зарегистрируйтесь и начните продавать продукты из своего хозяйства
        </p>
        <Link to="/sellers" className="btn-village inline-flex items-center gap-2">
          <Icon name="Store" size={18} />
          Зарегистрироваться как продавец
        </Link>
      </div>
    </main>
  );
}
