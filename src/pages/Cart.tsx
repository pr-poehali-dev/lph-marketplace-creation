import { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { PRODUCTS } from '@/data/products';

interface CartItem {
  product: (typeof PRODUCTS)[0];
  qty: number;
}

type Step = 'cart' | 'delivery' | 'payment' | 'success';

export default function Cart() {
  const [step, setStep] = useState<Step>('cart');
  const [items, setItems] = useState<CartItem[]>([
    { product: PRODUCTS[0], qty: 1 },
    { product: PRODUCTS[1], qty: 2 },
  ]);
  const [paymentMethod, setPaymentMethod] = useState('card');

  const total = items.reduce((sum, i) => sum + i.product.price * i.qty, 0);
  const delivery = total > 3000 ? 0 : 290;

  const updateQty = (id: number, delta: number) => {
    setItems((prev) =>
      prev
        .map((i) => i.product.id === id ? { ...i, qty: i.qty + delta } : i)
        .filter((i) => i.qty > 0)
    );
  };

  if (step === 'success') {
    return (
      <main className="container mx-auto px-4 py-20 max-w-md text-center">
        <div className="text-8xl mb-6 animate-fade-in">🎉</div>
        <h1 className="font-display text-4xl font-bold mb-3">Заказ оформлен!</h1>
        <p className="text-muted-foreground font-body mb-2">
          Номер заказа: <strong className="text-primary">#5021</strong>
        </p>
        <p className="text-muted-foreground font-body mb-8">
          Продавцы получили уведомления и скоро свяжутся с вами для подтверждения.
          Статус заказа можно отследить в личном кабинете.
        </p>
        <div className="flex flex-col gap-3">
          <Link to="/account" className="btn-village text-base py-3 text-center">
            Перейти в мои заказы
          </Link>
          <Link to="/catalog" className="py-3 rounded-xl border border-border font-body font-semibold text-sm hover:bg-muted transition-colors text-center">
            Продолжить покупки
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Steps indicator */}
      <div className="flex items-center justify-center gap-3 mb-10">
        {(['cart', 'delivery', 'payment'] as Step[]).map((s, i) => {
          const labels: Record<string, string> = { cart: 'Корзина', delivery: 'Доставка', payment: 'Оплата' };
          const steps: Step[] = ['cart', 'delivery', 'payment'];
          const isActive = s === step;
          const isDone = steps.indexOf(step) > i;
          return (
            <div key={s} className="flex items-center gap-3">
              <div className={`flex items-center gap-2 ${isActive ? 'text-primary' : isDone ? 'text-[hsl(115,28%,32%)]' : 'text-muted-foreground'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold font-body border-2 transition-all ${
                  isActive ? 'bg-primary text-primary-foreground border-primary' :
                  isDone ? 'bg-[hsl(115,28%,32%)] text-white border-[hsl(115,28%,32%)]' :
                  'bg-card border-border'
                }`}>
                  {isDone ? <Icon name="Check" size={14} /> : i + 1}
                </div>
                <span className="text-sm font-body font-medium hidden sm:block">{labels[s]}</span>
              </div>
              {i < 2 && <div className={`w-8 h-0.5 rounded ${isDone ? 'bg-[hsl(115,28%,32%)]' : 'bg-border'}`} />}
            </div>
          );
        })}
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main content */}
        <div className="flex-1 min-w-0">
          {step === 'cart' && (
            <div>
              <h1 className="font-display text-4xl font-bold mb-6">Корзина</h1>
              {items.length === 0 ? (
                <div className="text-center py-16 bg-card rounded-2xl border border-border">
                  <div className="text-6xl mb-4">🛒</div>
                  <h3 className="font-display text-2xl font-bold mb-2">Корзина пуста</h3>
                  <p className="text-muted-foreground font-body mb-6">
                    Добавьте товары из каталога
                  </p>
                  <Link to="/catalog" className="btn-village">Перейти в каталог</Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.product.id} className="bg-card rounded-2xl border border-border p-4 flex items-center gap-4">
                      <span className="text-4xl flex-shrink-0">{item.product.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-display text-lg font-semibold truncate">{item.product.name}</div>
                        <div className="text-sm text-muted-foreground font-body">{item.product.seller}</div>
                        <div className="badge-region mt-1 inline-block">{item.product.region}</div>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQty(item.product.id, -1)}
                            className="w-8 h-8 rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-colors"
                          >
                            <Icon name="Minus" size={14} />
                          </button>
                          <span className="w-6 text-center font-body font-semibold text-sm">{item.qty}</span>
                          <button
                            onClick={() => updateQty(item.product.id, 1)}
                            className="w-8 h-8 rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-colors"
                          >
                            <Icon name="Plus" size={14} />
                          </button>
                        </div>
                        <div className="font-display text-xl font-bold text-primary min-w-20 text-right">
                          {item.product.price * item.qty} ₽
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {step === 'delivery' && (
            <div>
              <h1 className="font-display text-4xl font-bold mb-6">Доставка</h1>
              <div className="bg-card rounded-2xl border border-border p-6 space-y-4">
                {[
                  { id: 'courier', label: 'Курьером', desc: 'Доставка 1-3 дня', price: '290 ₽', emoji: '🚚' },
                  { id: 'pickup', label: 'Самовывоз', desc: 'Из пункта выдачи', price: 'Бесплатно', emoji: '📦' },
                  { id: 'post', label: 'Почта России', desc: 'Доставка 5-14 дней', price: '200 ₽', emoji: '📮' },
                ].map((opt) => (
                  <label key={opt.id} className="flex items-center gap-4 p-4 rounded-xl border-2 border-border hover:border-primary cursor-pointer transition-all has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                    <input type="radio" name="delivery" value={opt.id} className="accent-primary" />
                    <span className="text-2xl">{opt.emoji}</span>
                    <div className="flex-1">
                      <div className="font-body font-semibold">{opt.label}</div>
                      <div className="text-xs text-muted-foreground font-body">{opt.desc}</div>
                    </div>
                    <span className="font-display font-bold text-primary">{opt.price}</span>
                  </label>
                ))}

                <hr className="section-divider" />
                <div className="space-y-3">
                  <h3 className="font-display text-lg font-semibold">Адрес доставки</h3>
                  {[
                    { label: 'Город', placeholder: 'Москва' },
                    { label: 'Улица, дом, квартира', placeholder: 'ул. Садовая, д. 15, кв. 42' },
                  ].map((f) => (
                    <div key={f.label}>
                      <label className="block text-xs font-body font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                        {f.label}
                      </label>
                      <input
                        type="text"
                        placeholder={f.placeholder}
                        className="w-full px-4 py-2.5 rounded-xl border border-border bg-background font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 'payment' && (
            <div>
              <h1 className="font-display text-4xl font-bold mb-6">Оплата</h1>
              <div className="bg-card rounded-2xl border border-border p-6 space-y-4">
                {[
                  { id: 'card', label: 'Банковская карта', emoji: '💳' },
                  { id: 'sbp', label: 'СБП (Система быстрых платежей)', emoji: '⚡' },
                  { id: 'cash', label: 'Наличными при получении', emoji: '💵' },
                ].map((opt) => (
                  <label
                    key={opt.id}
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      paymentMethod === opt.id ? 'border-primary bg-primary/5' : 'border-border hover:border-primary'
                    }`}
                    onClick={() => setPaymentMethod(opt.id)}
                  >
                    <input type="radio" name="payment" value={opt.id} checked={paymentMethod === opt.id} onChange={() => setPaymentMethod(opt.id)} className="accent-primary" />
                    <span className="text-2xl">{opt.emoji}</span>
                    <span className="font-body font-semibold">{opt.label}</span>
                  </label>
                ))}

                {paymentMethod === 'card' && (
                  <div className="p-4 bg-muted/50 rounded-xl space-y-3 animate-fade-in">
                    <div>
                      <label className="block text-xs font-body font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                        Номер карты
                      </label>
                      <input
                        type="text"
                        placeholder="0000 0000 0000 0000"
                        className="w-full px-4 py-2.5 rounded-xl border border-border bg-card font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                      />
                    </div>
                    <div className="flex gap-3">
                      <div className="flex-1">
                        <label className="block text-xs font-body font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                          Срок
                        </label>
                        <input type="text" placeholder="MM/YY" className="w-full px-4 py-2.5 rounded-xl border border-border bg-card font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs font-body font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                          CVV
                        </label>
                        <input type="text" placeholder="•••" className="w-full px-4 py-2.5 rounded-xl border border-border bg-card font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="lg:w-80 flex-shrink-0">
          <div className="bg-card rounded-2xl border border-border p-6 sticky top-24">
            <h3 className="font-display text-xl font-bold mb-4">Ваш заказ</h3>
            <div className="space-y-2 mb-4">
              {items.map((i) => (
                <div key={i.product.id} className="flex justify-between text-sm font-body">
                  <span className="text-muted-foreground truncate pr-2">
                    {i.product.emoji} {i.product.name} × {i.qty}
                  </span>
                  <span className="font-semibold whitespace-nowrap">{i.product.price * i.qty} ₽</span>
                </div>
              ))}
            </div>
            <hr className="section-divider mb-4" />
            <div className="space-y-2 text-sm font-body mb-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Товары</span>
                <span>{total} ₽</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Доставка</span>
                <span>{delivery === 0 ? <span className="text-[hsl(115,28%,32%)] font-semibold">Бесплатно</span> : `${delivery} ₽`}</span>
              </div>
            </div>
            <div className="flex justify-between font-display text-xl font-bold text-primary mb-5">
              <span>Итого</span>
              <span>{total + delivery} ₽</span>
            </div>

            {step === 'cart' && items.length > 0 && (
              <button onClick={() => setStep('delivery')} className="btn-village w-full text-base py-3">
                Перейти к доставке
              </button>
            )}
            {step === 'delivery' && (
              <button onClick={() => setStep('payment')} className="btn-village w-full text-base py-3">
                Перейти к оплате
              </button>
            )}
            {step === 'payment' && (
              <button onClick={() => setStep('success')} className="btn-accent w-full text-base py-3">
                Оплатить {total + delivery} ₽
              </button>
            )}

            {delivery > 0 && (
              <p className="text-xs text-muted-foreground font-body text-center mt-3">
                🚚 Бесплатная доставка от 3 000 ₽
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
