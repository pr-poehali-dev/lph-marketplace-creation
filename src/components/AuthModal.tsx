import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { authLogin, authRegister } from '@/lib/api';
import { useApp } from '@/context/AppContext';

interface AuthModalProps {
  onClose: () => void;
}

export default function AuthModal({ onClose }: AuthModalProps) {
  const { refreshUser, refreshCart } = useApp();
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    let r;
    if (tab === 'login') {
      r = await authLogin(email, password);
    } else {
      if (!name.trim()) { setError('Введите имя'); setLoading(false); return; }
      r = await authRegister(email, password, name);
    }
    setLoading(false);
    if (r.ok) {
      await refreshUser();
      await refreshCart();
      onClose();
    } else {
      setError((r.data as { error?: string }).error || 'Ошибка. Попробуйте снова.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-card rounded-3xl border border-border p-8 max-w-sm w-full animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl font-bold">
            {tab === 'login' ? 'Войти' : 'Регистрация'}
          </h2>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-muted transition-colors">
            <Icon name="X" size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex bg-muted rounded-xl p-1 mb-6">
          {(['login', 'register'] as const).map((t) => (
            <button
              key={t}
              onClick={() => { setTab(t); setError(''); }}
              className={`flex-1 py-2 rounded-lg text-sm font-body font-semibold transition-all ${
                tab === t ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground'
              }`}
            >
              {t === 'login' ? 'Войти' : 'Создать аккаунт'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {tab === 'register' && (
            <div>
              <label className="block text-xs font-body font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                Имя
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Иван Иванов"
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                required
              />
            </div>
          )}
          <div>
            <label className="block text-xs font-body font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-body font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
              Пароль
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              minLength={6}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              required
            />
          </div>

          {error && (
            <div className="bg-destructive/10 text-destructive text-sm font-body px-4 py-2.5 rounded-xl">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-village w-full text-base py-3 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Icon name="Loader" size={18} className="animate-spin" />
                {tab === 'login' ? 'Входим...' : 'Регистрируемся...'}
              </span>
            ) : (
              tab === 'login' ? 'Войти' : 'Зарегистрироваться'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
