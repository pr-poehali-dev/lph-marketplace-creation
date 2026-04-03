import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { useApp } from '@/context/AppContext';
import { authUpdateProfile, getOrders } from '@/lib/api';
import AuthModal from '@/components/AuthModal';

type Tab = 'profile' | 'orders' | 'favorites' | 'settings';

interface Order {
  id: number;
  status: string;
  status_ru: string;
  total: number;
  delivery_cost: number;
  created_at: string;
  item_names: string[];
}

const STATUS_COLORS: Record<string, string> = {
  'pending': 'bg-muted text-muted-foreground border-border',
  'confirmed': 'bg-[hsl(38,88%,52%,0.12)] text-[hsl(28,55%,35%)] border-[hsl(38,88%,52%,0.3)]',
  'shipping': 'bg-[hsl(38,88%,52%,0.12)] text-[hsl(28,55%,35%)] border-[hsl(38,88%,52%,0.3)]',
  'delivered': 'bg-[hsl(115,28%,32%,0.12)] text-[hsl(115,28%,32%)] border-[hsl(115,28%,32%,0.25)]',
  'cancelled': 'bg-destructive/10 text-destructive border-destructive/20',
};

export default function Account() {
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const { user, setUser, logout, loadingUser } = useApp();
  const [showAuth, setShowAuth] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: '', phone: '', address: '', region: '' });

  useEffect(() => {
    if (user) {
      setProfileForm({ name: user.name || '', phone: user.phone || '', address: user.address || '', region: user.region || '' });
      getOrders().then((r) => {
        if (r.ok) setOrders((r.data as { orders: Order[] }).orders || []);
      });
    }
  }, [user]);

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    const r = await authUpdateProfile(profileForm);
    if (r.ok) setUser((r.data as { user: typeof user }).user);
    setSavingProfile(false);
  };

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

  if (loadingUser) {
    return (
      <main className="container mx-auto px-4 py-20 text-center">
        <div className="text-5xl mb-4 animate-pulse">🌾</div>
        <p className="font-body text-muted-foreground">Загружаем данные...</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="container mx-auto px-4 py-20 max-w-md text-center">
        <div className="text-7xl mb-6">🔑</div>
        <h1 className="font-display text-4xl font-bold mb-3">Личный кабинет</h1>
        <p className="text-muted-foreground font-body mb-8">
          Войдите, чтобы видеть свои заказы, избранное и управлять профилем
        </p>
        <button onClick={() => setShowAuth(true)} className="btn-village w-full text-base py-3 mb-3">
          Войти / Зарегистрироваться
        </button>
        {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
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
                {user.role === 'seller' ? '👨‍🌾' : '👩‍🌾'}
              </div>
              <div className="font-display text-lg font-bold text-foreground">{user.name}</div>
              <div className="text-xs text-muted-foreground font-body">
                {user.role === 'seller' ? 'Продавец' : 'Покупатель'}{user.region ? ` · ${user.region}` : ''}
              </div>
              <div className="mt-2 text-xs text-[hsl(115,28%,32%)] font-body font-medium">
                🌿 {orders.length} заказов
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
              <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-body text-destructive hover:bg-destructive/10 transition-colors">
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
                <div>
                  <label className="block text-xs font-body font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Имя</label>
                  <input type="text" value={profileForm.name} onChange={(e) => setProfileForm(f => ({...f, name: e.target.value}))}
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
                <div>
                  <label className="block text-xs font-body font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Email</label>
                  <input type="email" value={user.email} disabled
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-muted font-body text-sm text-muted-foreground cursor-not-allowed" />
                </div>
                <div>
                  <label className="block text-xs font-body font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Телефон</label>
                  <input type="tel" value={profileForm.phone} onChange={(e) => setProfileForm(f => ({...f, phone: e.target.value}))}
                    placeholder="+7 (999) 000-00-00"
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
                <div>
                  <label className="block text-xs font-body font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Регион</label>
                  <input type="text" value={profileForm.region} onChange={(e) => setProfileForm(f => ({...f, region: e.target.value}))}
                    placeholder="Москва"
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-xs font-body font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Адрес доставки</label>
                <input type="text" value={profileForm.address} onChange={(e) => setProfileForm(f => ({...f, address: e.target.value}))}
                  placeholder="Улица, дом, квартира"
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-background font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              <button onClick={handleSaveProfile} disabled={savingProfile} className="btn-village disabled:opacity-60">
                {savingProfile ? 'Сохраняем...' : 'Сохранить изменения'}
              </button>
            </div>
          )}

          {activeTab === 'orders' && (
            <div>
              <h2 className="font-display text-2xl font-bold mb-6">Мои заказы</h2>
              {orders.length === 0 ? (
                <div className="text-center py-12 bg-card rounded-2xl border border-border">
                  <div className="text-5xl mb-3">📦</div>
                  <p className="font-display text-xl font-bold mb-1">Заказов пока нет</p>
                  <p className="text-muted-foreground font-body text-sm">Перейдите в каталог и сделайте первый заказ</p>
                </div>
              ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="bg-card rounded-2xl border border-border p-5">
                    <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                      <div>
                        <div className="font-display text-lg font-bold">#{order.id}</div>
                        <div className="text-sm text-muted-foreground font-body">
                          {new Date(order.created_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold font-body border ${STATUS_COLORS[order.status] || STATUS_COLORS['pending']}`}>
                          {order.status_ru}
                        </span>
                        <span className="font-display text-lg font-bold text-primary">
                          {order.total} ₽
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {order.item_names.map((item) => (
                        <span key={item} className="text-xs bg-muted px-2.5 py-1 rounded-lg font-body text-muted-foreground">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              )}
            </div>
          )}

          {activeTab === 'favorites' && (
            <div>
              <h2 className="font-display text-2xl font-bold mb-6">Избранное</h2>
              <div className="text-center py-12 bg-card rounded-2xl border border-border">
                <div className="text-5xl mb-3">❤️</div>
                <p className="font-display text-xl font-bold mb-1">Избранное пока пусто</p>
                <p className="text-muted-foreground font-body text-sm">Нажмите сердечко на карточке товара</p>
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