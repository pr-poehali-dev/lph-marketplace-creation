import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';

export default function Footer() {
  return (
    <footer className="bg-[hsl(25,35%,22%)] text-[hsl(42,40%,88%)] mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-3xl">🌾</span>
              <div>
                <div className="font-display text-xl font-bold text-[hsl(42,60%,90%)]">
                  ЛПХ Маркет
                </div>
                <div className="text-xs text-[hsl(42,30%,65%)]">от фермера — на ваш стол</div>
              </div>
            </div>
            <p className="text-sm text-[hsl(42,25%,65%)] leading-relaxed">
              Свежие продукты напрямую от владельцев личных подсобных хозяйств по всей России
            </p>
            <div className="flex gap-3 mt-4">
              <a href="#" className="p-2 rounded-lg bg-[hsl(25,30%,30%)] hover:bg-[hsl(25,30%,38%)] transition-colors">
                <Icon name="MessageCircle" size={18} />
              </a>
              <a href="#" className="p-2 rounded-lg bg-[hsl(25,30%,30%)] hover:bg-[hsl(25,30%,38%)] transition-colors">
                <Icon name="Share2" size={18} />
              </a>
            </div>
          </div>

          {/* Покупателям */}
          <div>
            <h4 className="font-display text-lg font-semibold text-[hsl(42,60%,88%)] mb-4">
              Покупателям
            </h4>
            <ul className="space-y-2 text-sm">
              {['Каталог товаров', 'Регионы России', 'Как сделать заказ', 'Доставка и оплата', 'Возврат'].map(
                (item) => (
                  <li key={item}>
                    <a href="#" className="text-[hsl(42,25%,65%)] hover:text-[hsl(42,60%,90%)] transition-colors">
                      {item}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Продавцам */}
          <div>
            <h4 className="font-display text-lg font-semibold text-[hsl(42,60%,88%)] mb-4">
              Продавцам
            </h4>
            <ul className="space-y-2 text-sm">
              {['Стать продавцом', 'Правила площадки', 'Комиссии', 'Помощь продавцам', 'FAQ'].map(
                (item) => (
                  <li key={item}>
                    <Link to="/sellers" className="text-[hsl(42,25%,65%)] hover:text-[hsl(42,60%,90%)] transition-colors">
                      {item}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Контакты */}
          <div>
            <h4 className="font-display text-lg font-semibold text-[hsl(42,60%,88%)] mb-4">
              Контакты
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 text-[hsl(42,25%,65%)]">
                <Icon name="Phone" size={15} />
                8 800 555 00 00
              </li>
              <li className="flex items-center gap-2 text-[hsl(42,25%,65%)]">
                <Icon name="Mail" size={15} />
                info@lphrynok.ru
              </li>
              <li className="flex items-center gap-2 text-[hsl(42,25%,65%)]">
                <Icon name="Clock" size={15} />
                Пн–Пт: 9:00–20:00
              </li>
            </ul>
            <div className="mt-4 p-3 rounded-xl bg-[hsl(38,70%,48%,0.2)] border border-[hsl(38,50%,45%,0.3)]">
              <p className="text-xs text-[hsl(38,70%,75%)]">
                🌱 Поддерживаем малых фермеров России
              </p>
            </div>
          </div>
        </div>

        <hr className="border-[hsl(25,25%,32%)] my-8" />

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-[hsl(42,20%,55%)]">
          <span>© 2024 ЛПХ Маркет. Все права защищены.</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-[hsl(42,50%,80%)] transition-colors">Политика конфиденциальности</a>
            <a href="#" className="hover:text-[hsl(42,50%,80%)] transition-colors">Оферта</a>
            <a href="#" className="hover:text-[hsl(42,50%,80%)] transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
