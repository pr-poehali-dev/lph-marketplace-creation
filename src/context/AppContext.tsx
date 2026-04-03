import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { authMe, authLogout, getCart } from '@/lib/api';
import { getSessionId } from '@/lib/api';

interface User {
  id: number;
  email: string;
  name: string;
  phone?: string;
  address?: string;
  role: string;
  region?: string;
}

interface CartItem {
  cart_item_id: number;
  product_id: number;
  qty: number;
  name: string;
  price: number;
  unit: string;
  emoji: string;
  region: string;
  seller: string;
}

interface AppContextType {
  user: User | null;
  cartItems: CartItem[];
  cartTotal: number;
  loadingUser: boolean;
  setUser: (u: User | null) => void;
  logout: () => Promise<void>;
  refreshCart: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AppContext = createContext<AppContextType>({
  user: null,
  cartItems: [],
  cartTotal: 0,
  loadingUser: true,
  setUser: () => {},
  logout: async () => {},
  refreshCart: async () => {},
  refreshUser: async () => {},
});

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [loadingUser, setLoadingUser] = useState(true);

  const refreshUser = useCallback(async () => {
    if (!getSessionId()) {
      setUser(null);
      setLoadingUser(false);
      return;
    }
    const r = await authMe();
    if (r.ok) {
      setUser((r.data as { user: User }).user);
    } else {
      setUser(null);
    }
    setLoadingUser(false);
  }, []);

  const refreshCart = useCallback(async () => {
    if (!getSessionId()) {
      setCartItems([]);
      setCartTotal(0);
      return;
    }
    const r = await getCart();
    if (r.ok) {
      const d = r.data as { items: CartItem[]; total: number };
      setCartItems(d.items || []);
      setCartTotal(d.total || 0);
    }
  }, []);

  const logout = useCallback(async () => {
    await authLogout();
    setUser(null);
    setCartItems([]);
    setCartTotal(0);
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  useEffect(() => {
    if (user) refreshCart();
  }, [user, refreshCart]);

  return (
    <AppContext.Provider value={{ user, cartItems, cartTotal, loadingUser, setUser, logout, refreshCart, refreshUser }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
