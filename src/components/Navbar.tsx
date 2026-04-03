import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { useApp } from '@/context/AppContext';
import AuthModal from '@/components/AuthModal';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const location = useLocation();
  const { user, cartItems } = useApp();
  const cartCount = cartItems.reduce((s, i) => s + i.qty, 0);

  const links = [
    { to: '/', label: 'Главная' },
    { to: '/catalog', label: 'Каталог' },
    { to: '/regions', label: 'Регионы' },
    { to: '/sellers', label: 'Продавцам' },
  ];

  const isActive = (path: string) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-[hsl(42,45%,94%,0.95)] backdrop-blur-sm">
      <div className="container mx-auto flex items-center justify-between py-3 px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="text-3xl">🌾</div>
          <div>
            <div className="font-display text-xl font-bold text-[hsl(var(--earth))] leading-tight">
              ЛПХ Маркет
            </div>
            <div className="text-xs text-muted-foreground font-body leading-none">
              от фермера — на ваш стол
            </div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-4 py-2 rounded-lg font-body font-medium text-sm transition-all duration-200 ${
                isActive(link.to)
                  ? 'bg-primary text-primary-foreground'
                  : 'text-foreground hover:bg-muted'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <Link
            to="/cart"
            className="relative flex items-center gap-1.5 px-3 py-2 rounded-lg bg-accent text-accent-foreground font-body font-semibold text-sm hover:bg-[hsl(38,80%,44%)] transition-all duration-200"
          >
            <Icon name="ShoppingBasket" size={18} />
            <span className="hidden sm:inline">Корзина</span>
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
          </Link>
          {user ? (
            <Link
              to="/account"
              className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors"
              title="Личный кабинет"
            >
              <Icon name="CircleUserRound" size={20} className="text-primary" />
              <span className="text-sm font-body font-medium text-foreground">{user.name.split(' ')[0]}</span>
            </Link>
          ) : (
            <button
              onClick={() => setShowAuth(true)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border hover:bg-muted transition-colors text-sm font-body font-medium"
            >
              <Icon name="LogIn" size={18} className="text-primary" />
              Войти
            </button>
          )}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <Icon name={menuOpen ? 'X' : 'Menu'} size={22} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-border bg-[hsl(42,45%,94%)] px-4 py-3 flex flex-col gap-1 animate-fade-in">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className={`px-4 py-2.5 rounded-lg font-body font-medium text-sm transition-all ${
                isActive(link.to)
                  ? 'bg-primary text-primary-foreground'
                  : 'text-foreground hover:bg-muted'
              }`}
            >
              {link.label}
            </Link>
          ))}
          {user ? (
            <Link to="/account" onClick={() => setMenuOpen(false)} className="px-4 py-2.5 rounded-lg font-body font-medium text-sm hover:bg-muted flex items-center gap-2">
              <Icon name="CircleUserRound" size={17} className="text-primary" /> {user.name}
            </Link>
          ) : (
            <button onClick={() => { setMenuOpen(false); setShowAuth(true); }} className="px-4 py-2.5 rounded-lg font-body font-medium text-sm hover:bg-muted text-left flex items-center gap-2">
              <Icon name="LogIn" size={17} className="text-primary" /> Войти
            </button>
          )}
        </div>
      )}

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </header>
  );
}