import { useState } from 'react';
import Icon from '@/components/ui/icon';
import type { Product } from '@/data/products';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    setAdded(true);
    onAddToCart?.(product);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="group bg-card rounded-2xl border border-border overflow-hidden card-hover cursor-pointer">
      {/* Image area */}
      <div className="relative h-44 bg-gradient-to-br from-[hsl(42,50%,92%)] to-[hsl(88,20%,88%)] flex items-center justify-center">
        <span className="text-7xl drop-shadow-sm group-hover:scale-110 transition-transform duration-300">
          {product.emoji}
        </span>
        {product.badge && (
          <span className="absolute top-3 left-3 bg-accent text-accent-foreground text-xs font-bold font-body px-2.5 py-1 rounded-full">
            {product.badge}
          </span>
        )}
        <button
          className="absolute top-3 right-3 p-1.5 rounded-full bg-white/80 hover:bg-white transition-colors opacity-0 group-hover:opacity-100"
          title="В избранное"
        >
          <Icon name="Heart" size={15} className="text-muted-foreground" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-display text-lg font-semibold text-foreground leading-tight">
            {product.name}
          </h3>
        </div>

        <p className="text-xs text-muted-foreground font-body mb-2 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center gap-1 mb-3">
          <span className="badge-region">{product.region}</span>
        </div>

        <div className="flex items-center gap-1 mb-3">
          <Icon name="Star" size={13} className="text-accent fill-accent" />
          <span className="text-sm font-semibold text-foreground">{product.rating}</span>
          <span className="text-xs text-muted-foreground">({product.reviews})</span>
          <span className="text-xs text-muted-foreground ml-1">· {product.seller}</span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="font-display text-2xl font-bold text-primary">
              {product.price} ₽
            </span>
            <span className="text-xs text-muted-foreground ml-1">/ {product.unit}</span>
          </div>
          <button
            onClick={handleAdd}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold font-body transition-all duration-200 ${
              added
                ? 'bg-[hsl(115,28%,32%)] text-white'
                : 'bg-primary text-primary-foreground hover:bg-[hsl(25,55%,28%)]'
            }`}
          >
            <Icon name={added ? 'Check' : 'Plus'} size={15} />
            {added ? 'Добавлено' : 'В корзину'}
          </button>
        </div>
      </div>
    </div>
  );
}
