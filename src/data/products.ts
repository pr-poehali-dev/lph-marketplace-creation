export interface Product {
  id: number;
  name: string;
  price: number;
  unit: string;
  category: string;
  region: string;
  seller: string;
  rating: number;
  reviews: number;
  badge?: string;
  emoji: string;
  description: string;
}

export const PRODUCTS: Product[] = [
  { id: 1, name: 'Мёд цветочный', price: 480, unit: 'кг', category: 'Мёд', region: 'Башкортостан', seller: 'Пасека Ивановых', rating: 4.9, reviews: 142, badge: 'Хит', emoji: '🍯', description: 'Натуральный цветочный мёд с собственной пасеки' },
  { id: 2, name: 'Яйца домашние', price: 120, unit: '10 шт', category: 'Птица и яйца', region: 'Краснодарский край', seller: 'Хозяйство Петровых', rating: 4.8, reviews: 89, emoji: '🥚', description: 'Яйца от кур свободного выгула, кормленных зерном' },
  { id: 3, name: 'Картофель синеглазка', price: 45, unit: 'кг', category: 'Овощи', region: 'Брянская область', seller: 'Фермер Сидоров', rating: 4.7, reviews: 203, badge: 'Новый урожай', emoji: '🥔', description: 'Сортовой картофель, без нитратов' },
  { id: 4, name: 'Молоко козье', price: 150, unit: 'л', category: 'Молочные', region: 'Алтайский край', seller: 'Козья ферма Алтай', rating: 5.0, reviews: 67, badge: 'Эко', emoji: '🥛', description: 'Свежее козье молоко, ежедневная доставка' },
  { id: 5, name: 'Сало домашнее', price: 350, unit: 'кг', category: 'Мясо', region: 'Белгородская область', seller: 'Хозяйство Кузнецовых', rating: 4.8, reviews: 55, emoji: '🥩', description: 'Сало с прослойкой, домашний посол' },
  { id: 6, name: 'Варенье из черники', price: 290, unit: '500 г', category: 'Заготовки', region: 'Карелия', seller: 'Лесные дары', rating: 4.9, reviews: 112, emoji: '🫙', description: 'Черника собранная в карельском лесу' },
  { id: 7, name: 'Огурцы малосольные', price: 180, unit: 'кг', category: 'Заготовки', region: 'Воронежская область', seller: 'Бабуля Зина', rating: 4.9, reviews: 78, badge: 'Хит', emoji: '🥒', description: 'По бабушкиному рецепту, дубовый бочонок' },
  { id: 8, name: 'Творог домашний', price: 280, unit: 'кг', category: 'Молочные', region: 'Тверская область', seller: 'Молочная ферма Зайцевых', rating: 4.7, reviews: 134, emoji: '🧀', description: 'Жирный зернистый творог из цельного молока' },
  { id: 9, name: 'Грибы сушёные', price: 650, unit: '200 г', category: 'Лесные продукты', region: 'Вологодская область', seller: 'Лесник Михаил', rating: 4.8, reviews: 44, emoji: '🍄', description: 'Белые грибы, сушёные естественным способом' },
  { id: 10, name: 'Смородина чёрная', price: 200, unit: 'кг', category: 'Ягоды и фрукты', region: 'Самарская область', seller: 'Сад Виноградовых', rating: 4.6, reviews: 91, emoji: '🫐', description: 'Крупная смородина, сорт Титания' },
  { id: 11, name: 'Сыр домашний', price: 680, unit: 'кг', category: 'Молочные', region: 'Ленинградская область', seller: 'Сыроварня Ладога', rating: 4.9, reviews: 156, badge: 'Эко', emoji: '🧀', description: 'Выдержанный сыр по швейцарской технологии' },
  { id: 12, name: 'Томаты грунтовые', price: 85, unit: 'кг', category: 'Овощи', region: 'Астраханская область', seller: 'Огород у реки', rating: 4.7, reviews: 67, badge: 'Новый урожай', emoji: '🍅', description: 'Сладкие грунтовые томаты, без тепличного' },
];

export const CATEGORIES = [
  { name: 'Мёд', emoji: '🍯', count: 48 },
  { name: 'Молочные', emoji: '🥛', count: 124 },
  { name: 'Овощи', emoji: '🥕', count: 312 },
  { name: 'Ягоды и фрукты', emoji: '🍓', count: 186 },
  { name: 'Мясо', emoji: '🥩', count: 95 },
  { name: 'Птица и яйца', emoji: '🥚', count: 73 },
  { name: 'Заготовки', emoji: '🫙', count: 247 },
  { name: 'Лесные продукты', emoji: '🍄', count: 61 },
];

export const REGIONS = [
  { name: 'Краснодарский край', products: 412, color: 'hsl(28,55%,35%)' },
  { name: 'Алтайский край', products: 287, color: 'hsl(115,28%,32%)' },
  { name: 'Башкортостан', products: 356, color: 'hsl(38,88%,52%)' },
  { name: 'Брянская область', products: 178, color: 'hsl(88,28%,38%)' },
  { name: 'Воронежская область', products: 231, color: 'hsl(28,55%,35%)' },
  { name: 'Карелия', products: 143, color: 'hsl(195,35%,38%)' },
  { name: 'Белгородская область', products: 198, color: 'hsl(115,28%,32%)' },
  { name: 'Тверская область', products: 162, color: 'hsl(88,28%,38%)' },
  { name: 'Вологодская область', products: 119, color: 'hsl(195,35%,38%)' },
  { name: 'Самарская область', products: 204, color: 'hsl(38,88%,52%)' },
  { name: 'Ленинградская область', products: 285, color: 'hsl(28,55%,35%)' },
  { name: 'Астраханская область', products: 97, color: 'hsl(88,28%,38%)' },
];
