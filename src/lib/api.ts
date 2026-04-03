const URLS = {
  auth: 'https://functions.poehali.dev/a6adefb7-7a2f-44f9-84c6-4becf1e7fa4b',
  products: 'https://functions.poehali.dev/6fbdb065-be7f-4b65-9ab8-9b3cb62fa578',
  cart: 'https://functions.poehali.dev/e98a4db7-1ba2-4e0d-9781-f77d0b31d81b',
  orders: 'https://functions.poehali.dev/fddd5458-e788-4de2-8b92-27a4c7a818a9',
};

function getSessionId(): string | null {
  return localStorage.getItem('session_id');
}

function setSessionId(sid: string) {
  localStorage.setItem('session_id', sid);
}

function clearSessionId() {
  localStorage.removeItem('session_id');
}

function authHeaders(): Record<string, string> {
  const sid = getSessionId();
  return sid ? { 'X-Session-Id': sid } : {};
}

async function request(url: string, options: RequestInit = {}) {
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
      ...(options.headers || {}),
    },
  });
  const text = await res.text();
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    data = { error: text };
  }
  return { ok: res.ok, status: res.status, data };
}

// AUTH
export async function authMe() {
  return request(URLS.auth);
}

export async function authRegister(email: string, password: string, name: string) {
  const r = await request(URLS.auth, {
    method: 'POST',
    body: JSON.stringify({ action: 'register', email, password, name }),
  });
  if (r.ok && (r.data as { session_id?: string }).session_id) {
    setSessionId((r.data as { session_id: string }).session_id);
  }
  return r;
}

export async function authLogin(email: string, password: string) {
  const r = await request(URLS.auth, {
    method: 'POST',
    body: JSON.stringify({ action: 'login', email, password }),
  });
  if (r.ok && (r.data as { session_id?: string }).session_id) {
    setSessionId((r.data as { session_id: string }).session_id);
  }
  return r;
}

export async function authLogout() {
  await request(URLS.auth, {
    method: 'POST',
    body: JSON.stringify({ action: 'logout' }),
  });
  clearSessionId();
}

export async function authUpdateProfile(data: { name?: string; phone?: string; address?: string; region?: string }) {
  return request(URLS.auth, {
    method: 'POST',
    body: JSON.stringify({ action: 'update_profile', ...data }),
  });
}

// PRODUCTS
export async function getProducts(params: {
  category?: string;
  region?: string;
  search?: string;
  sort?: string;
  limit?: number;
  offset?: number;
} = {}) {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => { if (v !== undefined) qs.set(k, String(v)); });
  const url = `${URLS.products}${qs.toString() ? '?' + qs.toString() : ''}`;
  return request(url);
}

export async function getProduct(id: number) {
  return request(`${URLS.products}?id=${id}`);
}

export async function createProduct(data: Record<string, unknown>) {
  return request(URLS.products, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// CART
export async function getCart() {
  return request(URLS.cart);
}

export async function addToCart(product_id: number, qty = 1) {
  return request(URLS.cart, {
    method: 'POST',
    body: JSON.stringify({ product_id, qty }),
  });
}

export async function updateCartItem(product_id: number, qty: number) {
  return request(URLS.cart, {
    method: 'PUT',
    body: JSON.stringify({ product_id, qty }),
  });
}

export async function removeFromCart(product_id: number) {
  return request(URLS.cart, {
    method: 'DELETE',
    body: JSON.stringify({ product_id }),
  });
}

export async function clearCart() {
  return request(URLS.cart, { method: 'DELETE', body: JSON.stringify({}) });
}

// ORDERS
export async function getOrders() {
  return request(URLS.orders);
}

export async function getOrder(id: number) {
  return request(`${URLS.orders}?id=${id}`);
}

export async function createOrder(data: {
  delivery_address: string;
  delivery_method: string;
  payment_method: string;
}) {
  return request(URLS.orders, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export { getSessionId, setSessionId, clearSessionId };
