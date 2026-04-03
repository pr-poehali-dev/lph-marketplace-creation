import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Link } from 'react-router-dom';

const BENEFITS = [
  { emoji: '🆓', title: 'Бесплатная регистрация', desc: 'Создайте магазин за 5 минут, без скрытых платежей' },
  { emoji: '📦', title: 'Простое управление', desc: 'Добавляйте товары, отслеживайте заказы в одном месте' },
  { emoji: '🚚', title: 'Встроенная логистика', desc: 'Партнёрские службы доставки по всей России' },
  { emoji: '💰', title: 'Быстрые выплаты', desc: 'Деньги на счёт в течение 3 рабочих дней' },
  { emoji: '📊', title: 'Аналитика продаж', desc: 'Статистика, отчёты, популярные товары' },
  { emoji: '🤝', title: 'Поддержка продавцов', desc: 'Персональный менеджер и обучающие материалы' },
];

const STEPS = [
  { num: '01', title: 'Зарегистрируйтесь', desc: 'Заполните анкету продавца, укажите данные хозяйства и регион' },
  { num: '02', title: 'Добавьте товары', desc: 'Загрузите фото, описание, цену и количество доступных продуктов' },
  { num: '03', title: 'Получайте заказы', desc: 'Покупатели найдут вас по региону и категории товаров' },
  { num: '04', title: 'Зарабатывайте', desc: 'Собирайте и отправляйте заказы. Получайте оплату напрямую' },
];

const TARIFFS = [
  {
    name: 'Стартовый',
    price: '0',
    period: 'всегда бесплатно',
    color: 'border-border',
    features: ['До 20 товаров', 'Комиссия 8%', 'Базовая статистика', 'Поддержка по email'],
    cta: 'Начать бесплатно',
  },
  {
    name: 'Фермерский',
    price: '990',
    period: 'в месяц',
    color: 'border-primary bg-[hsl(28,55%,35%,0.04)]',
    badge: 'Популярный',
    features: ['До 200 товаров', 'Комиссия 5%', 'Расширенная аналитика', 'Приоритетная поддержка', 'Выделение в поиске'],
    cta: 'Выбрать тариф',
  },
  {
    name: 'Хозяйство',
    price: '2 490',
    period: 'в месяц',
    color: 'border-border',
    features: ['Безлимит товаров', 'Комиссия 3%', 'Полная аналитика', 'Личный менеджер', 'Первое место в регионе', 'API-интеграция'],
    cta: 'Выбрать тариф',
  },
];

export default function Sellers() {
  const [formStep, setFormStep] = useState(0);

  return (
    <main>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-[hsl(25,45%,22%)] to-[hsl(115,28%,22%)] overflow-hidden py-20">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 text-9xl">🌾</div>
          <div className="absolute top-20 right-20 text-8xl">🏡</div>
          <div className="absolute bottom-10 left-1/3 text-7xl">🥛</div>
        </div>
        <div className="container mx-auto px-4 text-center relative">
          <div className="inline-flex items-center gap-2 bg-[hsl(38,88%,52%,0.9)] text-[hsl(25,40%,18%)] px-4 py-1.5 rounded-full text-sm font-semibold font-body mb-6">
            🌱 Для владельцев ЛПХ
          </div>
          <h1 className="font-display text-5xl md:text-7xl font-bold text-white mb-6">
            Продавайте продукты<br />
            <span className="text-[hsl(38,88%,65%)] italic">всей России</span>
          </h1>
          <p className="text-[hsl(42,30%,78%)] font-body text-lg max-w-xl mx-auto mb-10">
            Тысячи покупателей ищут натуральные продукты прямо сейчас.
            Создайте свой магазин за 5 минут — это бесплатно.
          </p>
          <button
            onClick={() => setFormStep(1)}
            className="btn-accent inline-flex items-center gap-2 text-lg px-8 py-4"
          >
            <Icon name="Store" size={22} />
            Стать продавцом
          </button>
          <p className="text-[hsl(42,25%,60%)] text-sm font-body mt-3">
            Уже 4 800+ продавцов доверяют нам
          </p>
        </div>
      </section>

      {/* Benefits */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <h2 className="font-display text-4xl font-bold mb-2">Почему выбирают нас</h2>
          <p className="text-muted-foreground font-body">Мы создали платформу специально для малых хозяйств</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {BENEFITS.map((b) => (
            <div key={b.title} className="bg-card rounded-2xl border border-border p-6 card-hover">
              <div className="text-4xl mb-4">{b.emoji}</div>
              <h3 className="font-display text-xl font-bold mb-2">{b.title}</h3>
              <p className="text-muted-foreground font-body text-sm leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-gradient-to-br from-[hsl(42,50%,92%)] to-[hsl(88,20%,88%)] texture-linen py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl font-bold mb-2">Как начать продавать</h2>
            <p className="text-muted-foreground font-body">4 простых шага до первой продажи</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map((step, i) => (
              <div key={step.num} className="relative">
                {i < STEPS.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-border to-transparent z-0" />
                )}
                <div className="bg-card rounded-2xl border border-border p-5 relative z-10">
                  <div className="font-display text-4xl font-bold text-primary/20 mb-3">{step.num}</div>
                  <h3 className="font-display text-lg font-bold mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground font-body leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tariffs */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <h2 className="font-display text-4xl font-bold mb-2">Тарифы</h2>
          <p className="text-muted-foreground font-body">Начните бесплатно, масштабируйтесь по мере роста</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {TARIFFS.map((tariff) => (
            <div key={tariff.name} className={`relative bg-card rounded-2xl border-2 p-6 ${tariff.color}`}>
              {tariff.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground px-4 py-1 rounded-full text-xs font-bold font-body">
                  {tariff.badge}
                </div>
              )}
              <h3 className="font-display text-2xl font-bold mb-1">{tariff.name}</h3>
              <div className="mb-1">
                <span className="font-display text-4xl font-bold text-primary">
                  {tariff.price === '0' ? 'Бесплатно' : `${tariff.price} ₽`}
                </span>
              </div>
              <p className="text-xs text-muted-foreground font-body mb-5">{tariff.period}</p>
              <ul className="space-y-2 mb-6">
                {tariff.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm font-body">
                    <Icon name="Check" size={15} className="text-[hsl(115,28%,32%)] flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => setFormStep(1)}
                className={tariff.badge ? 'btn-village w-full' : 'w-full py-2.5 rounded-xl border-2 border-primary text-primary font-body font-semibold text-sm hover:bg-primary/5 transition-colors'}
              >
                {tariff.cta}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Registration Form */}
      {formStep > 0 && (
        <section className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-3xl border border-border p-8 max-w-md w-full animate-scale-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-2xl font-bold">Регистрация продавца</h2>
              <button
                onClick={() => setFormStep(0)}
                className="p-2 rounded-xl hover:bg-muted transition-colors"
              >
                <Icon name="X" size={20} />
              </button>
            </div>
            <div className="space-y-4">
              {[
                { label: 'Имя и фамилия', placeholder: 'Иван Иванов', type: 'text' },
                { label: 'Телефон', placeholder: '+7 (___) ___-__-__', type: 'tel' },
                { label: 'Регион', placeholder: 'Краснодарский край', type: 'text' },
                { label: 'Что производите', placeholder: 'Мёд, овощи, молочные...', type: 'text' },
              ].map((field) => (
                <div key={field.label}>
                  <label className="block text-xs font-body font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    placeholder={field.placeholder}
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
              ))}
              <button
                onClick={() => setFormStep(0)}
                className="btn-village w-full text-base py-3 mt-2"
              >
                Отправить заявку
              </button>
              <p className="text-xs text-center text-muted-foreground font-body">
                Нажимая кнопку, вы соглашаетесь с{' '}
                <Link to="#" className="text-primary hover:underline">условиями оферты</Link>
              </p>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
