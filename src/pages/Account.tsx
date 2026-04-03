import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { PRODUCTS } from '@/data/products';

type Tab = 'profile' | 'orders' | 'favorites' | 'settings';

const ORDERS = [
  { id: '#4821', date: '28 марта 2024', status: 'Доставлено', total: 1240, items: ['Мёд цветочный', 'Яйца домашние'] },
  { id: '#4715', date: '15 марта 2024', status: 'Доставлено', total: 580, items: ['Варенье из черники', 'Огурцы малосольные'] },
  { id: '#4892', date: '2 апреля 2024', status: 'В пути', total: 890, items: ['Молоко козье', 'Творог домашний'] },
];

const STATUS_COLORS: Record<string, string> = {
  'Доставлено': 'bg-[hsl(115,28%,32%,0.12)] text-[hsl(115,28%,32%)] border-[hsl(115,28%,32%,0.25)]',
  'В пути': 'bg-[hsl(38,88%,52%,0.12)] text-[hsl(28,55%,35%)] border-[hsl(38,88%,52%,0.3)]',
  'Обрабатывается': 'bg-muted text-muted-foreground border-border',
};

export default function Account() {
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [isLoggedIn] = useState(true);

    const TAB_ICONS: Record<Tab, string> = {
    profile: 'CircleUserRound',
    orders: 'Package',
    favorites: 'Heart',
    settings: 'Settings',
  };

  const TAB_LABELS: Record<Tab, string> = {
    profile: 'Профиль',
    orders: 'Заказы',
    favorites: 'Избранное',
    settings: 'Настройки',
  };

  const tabs: Tab[] = ['profile', 'orders', 'favorites', 'settings'];

  if (!isLoggedIn) {
    return (
      <main className="container mx-auto px-4 py-20 max-w-md text-center">
        <div className="text-7xl mb-6">🔑</div>
        <h1 className="font-display text-4xl font-bold mb-3">Личный кабинет</h1>
        <p className="text-muted-foreground font-body mb-8">
          Войдите, чтобы видеть свои заказы, избранное и управлять профилем
        </p>
        <button className="btn-village w-full text-base py-3 mb-3">Войти</button>
        <button className="w-full py-3 rounded-xl border border-border font-body font-semibold text-base hover:bg-muted transition-colors">
          Зарегистрироваться
        </button>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="font-display text-4xl font-bold mb-8">Личный кабинет</h1>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <aside className="md:w-56 flex-shrink-0">
          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            {/* User info */}
            <div className="p-5 border-b border-border bg-gradient-to-br from-[hsl(42,50%,95%)] to-[hsl(88,20%,92%)] texture-linen">
              <div className="w-16 h-16 rounded-full bg-primary/15 flex items-center justify-center text-4xl mb-3">
                👩‍🌾
              </div>
              <div className="font-display text-lg font-bold text-foreground">Мария Новикова</div>
              <div className="text-xs text-muted-foreground font-body">Покупатель · Москва</div>
              <div className="mt-2 text-xs text-[hsl(115,28%,32%)] font-body font-medium">
                🌿 3 заказа выполнено
              </div>
            </div>

            {/* Tabs */}
            <nav className="p-2">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-body font-medium transition-all ${
                    activeTab === tab
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted text-foreground'
                  }`}
                >
                  <Icon name={TAB_ICONS[tab]} size={17} />
                  {TAB_LABELS[tab]}
                </button>
              ))}
            </nav>

            <div className="p-2 border-t border-border">
              <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-body text-destructive hover:bg-destructive/10 transition-colors">
                <Icon name="LogOut" size={17} />
                Выйти
              </button>
            </div>
          </div>
        </aside>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {activeTab === 'profile' && (
            <div className="bg-card rounded-2xl border border-border p-6">
              <h2 className="font-display text-2xl font-bold mb-6">Личные данные</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {[
                  { label: 'Имя', value: 'Мария', type: 'text' },
                  { label: 'Фамилия', value: 'Новикова', type: 'text' },
                  { label: 'Email', value: 'maria@example.com', type: 'email' },
                  { label: 'Телефон', value: '+7 (999) 123-45-67', type: 'tel' },
                ].map((field) => (
                  <div key={field.label}>
                    <label className="block text-xs font-body font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                      {field.label}
                    </label>
                    <input
                      type={field.type}
                      defaultValue={field.value}
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-background font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                ))}
              </div>
              <div className="mb-6">
                <label className="block text-xs font-body font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                  Адрес доставки
                </label>
                <input
                  type="text"
                  defaultValue="Москва, ул. Садовая, д. 15, кв. 42"
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-background font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <button className="btn-village">Сохранить изменения</button>
            </div>
          )}

          {activeTab === 'orders' && (
            <div>
              <h2 className="font-display text-2xl font-bold mb-6">Мои заказы</h2>
              <div className="space-y-4">
                {ORDERS.map((order) => (
                  <div key={order.id} className="bg-card rounded-2xl border border-border p-5">
                    <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                      <div>
                        <div className="font-display text-lg font-bold">{order.id}</div>
                        <div className="text-sm text-muted-foreground font-body">{order.date}</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold font-body border ${STATUS_COLORS[order.status]}`}>
                          {order.status}
                        </span>
                        <span className="font-display text-lg font-bold text-primary">
                          {order.total} ₽
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {order.items.map((item) => (
                        <span key={item} className="text-xs bg-muted px-2.5 py-1 rounded-lg font-body text-muted-foreground">
                          {item}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2 mt-4">
                      <button className="text-xs text-primary font-body font-semibold hover:underline">
                        Повторить заказ
                      </button>
                      <span className="text-muted-foreground">·</span>
                      <button className="text-xs text-muted-foreground font-body hover:underline">
                        Подробнее
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'favorites' && (
            <div>
              <h2 className="font-display text-2xl font-bold mb-6">Избранное</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {PRODUCTS.slice(0, 3).map((product) => (
                  <div key={product.id} className="bg-card rounded-2xl border border-border p-4 flex items-center gap-4">
                    <span className="text-4xl">{product.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-display font-semibold text-foreground truncate">{product.name}</div>
                      <div className="text-sm text-primary font-body font-bold">{product.price} ₽/{product.unit}</div>
                    </div>
                    <button className="p-2 rounded-xl hover:bg-muted transition-colors">
                      <Icon name="ShoppingBasket" size={16} className="text-primary" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="bg-card rounded-2xl border border-border p-6">
              <h2 className="font-display text-2xl font-bold mb-6">Настройки</h2>
              <div className="space-y-5">
                {[
                  { label: 'Email-уведомления о заказах', desc: 'Получать статус доставки на почту' },
                  { label: 'СМС-уведомления', desc: 'Оповещения об акциях и скидках' },
                  { label: 'Новинки от продавцов', desc: 'Сообщать о новых товарах из избранных хозяйств' },
                ].map((setting) => (
                  <div key={setting.label} className="flex items-start justify-between gap-4 py-3 border-b border-border last:border-0">
                    <div>
                      <div className="font-body font-semibold text-foreground text-sm">{setting.label}</div>
                      <div className="text-xs text-muted-foreground font-body mt-0.5">{setting.desc}</div>
                    </div>
                    <div className="relative flex-shrink-0">
                      <input type="checkbox" defaultChecked className="sr-only peer" id={setting.label} />
                      <label
                        htmlFor={setting.label}
                        className="block w-10 h-6 bg-muted rounded-full cursor-pointer peer-checked:bg-primary transition-colors relative after:content-[''] after:absolute after:top-1 after:left-1 after:w-4 after:h-4 after:bg-white after:rounded-full after:transition-all peer-checked:after:translate-x-4"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}