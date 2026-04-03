import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import ProductCard from '@/components/ProductCard';
import { CATEGORIES } from '@/data/products';
import { getProducts } from '@/lib/api';

interface ApiProduct {
  id: number; name: string; description?: string; price: number; unit: string;
  category: string; region: string; emoji: string; badge?: string | null;
  stock?: number; rating: number; reviews_count?: number; seller?: string;
}

const HERO_IMAGE = 'https://cdn.poehali.dev/projects/896a8549-f3d7-44ee-802e-7c35ff62a322/files/3151a76e-2d53-484f-911f-a904b3d15968.jpg';

const REVIEWS = [
  { name: 'Анна К.', region: 'Москва', text: 'Заказываю мёд и творог уже полгода — качество потрясающее, как у бабушки в деревне!', rating: 5, emoji: '👩' },
  { name: 'Дмитрий П.', region: 'Санкт-Петербург', text: 'Наконец-то нашёл настоящее козье молоко. Ребёнок пьёт с удовольствием.', rating: 5, emoji: '👨' },
  { name: 'Наталья С.', region: 'Казань', text: 'Свежие овощи с Краснодара — вкус из детства. Буду заказывать регулярно!', rating: 5, emoji: '👩‍🦱' },
];

const STATS = [
  { value: '4 800+', label: 'Продавцов', emoji: '🏡' },
  { value: '82', label: 'Региона России', emoji: '🗺️' },
  { value: '47 000+', label: 'Покупателей', emoji: '🛒' },
  { value: '99%', label: 'Натуральные продукты', emoji: '🌿' },
];

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<ApiProduct[]>([]);

  useEffect(() => {
    getProducts({ limit: 8, sort: 'popular' }).then((r) => {
      if (r.ok) setFeaturedProducts((r.data as { products: ApiProduct[] }).products || []);
    });
  }, []);

  return (
    <main>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={HERO_IMAGE}
            alt="Деревенский маркетплейс"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[hsl(25,55%,15%,0.85)] via-[hsl(25,45%,20%,0.6)] to-transparent" />
        </div>

        <div className="relative container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-xl animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-[hsl(38,88%,52%,0.9)] text-[hsl(25,40%,18%)] px-4 py-1.5 rounded-full text-sm font-semibold font-body mb-6">
              <span>🌱</span> Прямо от фермера — без посредников
            </div>
            <h1 className="font-display text-5xl md:text-7xl font-bold text-[hsl(42,60%,95%)] leading-tight mb-6">
              Вкус настоящей<br />
              <span className="text-[hsl(38,88%,65%)] italic">деревни</span>
            </h1>
            <p className="text-[hsl(42,30%,80%)] text-lg font-body leading-relaxed mb-8">
              Покупайте свежие продукты у владельцев личных подсобных хозяйств<br />
              со всей России. Мёд, молочное, овощи, заготовки — всё натуральное.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/catalog" className="btn-accent inline-flex items-center gap-2 text-base px-6 py-3">
                <Icon name="ShoppingBasket" size={20} />
                Перейти в каталог
              </Link>
              <Link to="/regions" className="inline-flex items-center gap-2 bg-white/15 text-white border border-white/30 backdrop-blur-sm px-6 py-3 rounded-xl font-body font-semibold text-base hover:bg-white/25 transition-all">
                <Icon name="MapPin" size={20} />
                Выбрать регион
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-[hsl(25,45%,28%)] py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl mb-1">{stat.emoji}</div>
                <div className="font-display text-3xl font-bold text-[hsl(38,88%,65%)]">{stat.value}</div>
                <div className="text-sm text-[hsl(42,30%,72%)] font-body mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-sm font-body font-semibold text-[hsl(var(--forest))] uppercase tracking-wider mb-1">
              Что ищете?
            </p>
            <h2 className="font-display text-4xl font-bold text-foreground">Категории товаров</h2>
          </div>
          <Link to="/catalog" className="text-primary font-body font-semibold hover:underline text-sm flex items-center gap-1">
            Все категории <Icon name="ArrowRight" size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.name}
              to={`/catalog?category=${encodeURIComponent(cat.name)}`}
              className="group flex flex-col items-center gap-3 p-6 bg-card rounded-2xl border border-border hover:border-primary hover:bg-[hsl(42,40%,96%)] transition-all duration-200 card-hover text-center"
            >
              <span className="text-4xl group-hover:scale-110 transition-transform duration-200">
                {cat.emoji}
              </span>
              <div>
                <div className="font-display text-base font-semibold text-foreground">{cat.name}</div>
                <div className="text-xs text-muted-foreground font-body">{cat.count} товаров</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <hr className="section-divider container mx-auto" />

      {/* Featured Products */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-sm font-body font-semibold text-[hsl(var(--forest))] uppercase tracking-wider mb-1">
              Выбор покупателей
            </p>
            <h2 className="font-display text-4xl font-bold text-foreground">Популярные товары</h2>
          </div>
          <Link to="/catalog" className="text-primary font-body font-semibold hover:underline text-sm flex items-center gap-1">
            Смотреть все <Icon name="ArrowRight" size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {featuredProducts.length > 0
            ? featuredProducts.map((product) => <ProductCard key={product.id} product={product} />)
            : Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-card rounded-2xl border border-border h-80 animate-pulse" />
              ))
          }
        </div>
      </section>

      {/* Regional Banner */}
      <section className="relative overflow-hidden mx-4 md:mx-8 rounded-3xl my-8">
        <img
          src="https://cdn.poehali.dev/projects/896a8549-f3d7-44ee-802e-7c35ff62a322/files/a924084d-0c6a-438f-afeb-89827e8ff0dc.jpg"
          alt="Регионы России"
          className="w-full h-64 md:h-80 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[hsl(115,28%,20%,0.9)] to-[hsl(115,28%,20%,0.4)]" />
        <div className="absolute inset-0 flex items-center px-8 md:px-16">
          <div className="max-w-lg">
            <p className="text-[hsl(88,50%,75%)] font-body font-semibold text-sm uppercase tracking-wider mb-2">
              🗺️ 82 региона
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
              Найдите продавца в вашем регионе
            </h2>
            <p className="text-[hsl(42,30%,80%)] font-body mb-6">
              Свежие продукты поблизости — меньше доставка, больше свежести
            </p>
            <Link to="/regions" className="btn-accent inline-flex items-center gap-2">
              <Icon name="MapPin" size={18} />
              Выбрать регион
            </Link>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <p className="text-sm font-body font-semibold text-[hsl(var(--forest))] uppercase tracking-wider mb-1">
            Они уже попробовали
          </p>
          <h2 className="font-display text-4xl font-bold text-foreground">Отзывы покупателей</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {REVIEWS.map((review, i) => (
            <div key={i} className="bg-card rounded-2xl border border-border p-6 relative texture-linen">
              <div className="text-4xl mb-3">{review.emoji}</div>
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: review.rating }).map((_, j) => (
                  <Icon key={j} name="Star" size={16} className="text-accent fill-accent" />
                ))}
              </div>
              <p className="font-body text-foreground leading-relaxed mb-4 text-sm">
                «{review.text}»
              </p>
              <div>
                <div className="font-display font-semibold text-foreground">{review.name}</div>
                <div className="text-xs text-muted-foreground font-body flex items-center gap-1">
                  <Icon name="MapPin" size={12} />
                  {review.region}
                </div>
              </div>
              <div className="absolute top-4 right-4 text-5xl opacity-10 font-display font-bold">"</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Seller */}
      <section className="bg-gradient-to-br from-[hsl(42,50%,92%)] to-[hsl(88,20%,88%)] texture-linen py-16 mx-4 md:mx-8 rounded-3xl mb-8">
        <div className="text-center max-w-xl mx-auto px-4">
          <div className="text-6xl mb-4">🏡</div>
          <h2 className="font-display text-4xl font-bold text-foreground mb-4">
            Есть своё хозяйство?
          </h2>
          <p className="font-body text-muted-foreground mb-6 leading-relaxed">
            Продавайте свои продукты тысячам покупателей по всей России.
            Регистрация бесплатна, комиссия только с продаж.
          </p>
          <Link to="/sellers" className="btn-village inline-flex items-center gap-2 text-base px-8 py-3">
            <Icon name="Store" size={20} />
            Стать продавцом
          </Link>
        </div>
      </section>
    </main>
  );
}