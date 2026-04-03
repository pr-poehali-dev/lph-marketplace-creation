CREATE TABLE t_p5459529_lph_marketplace_crea.users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  address TEXT,
  role VARCHAR(20) DEFAULT 'buyer',
  region VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE t_p5459529_lph_marketplace_crea.sellers (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES t_p5459529_lph_marketplace_crea.users(id),
  farm_name VARCHAR(255) NOT NULL,
  description TEXT,
  region VARCHAR(255) NOT NULL,
  specialties TEXT,
  rating NUMERIC(3,2) DEFAULT 0,
  reviews_count INTEGER DEFAULT 0,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE t_p5459529_lph_marketplace_crea.products (
  id SERIAL PRIMARY KEY,
  seller_id INTEGER REFERENCES t_p5459529_lph_marketplace_crea.sellers(id),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL,
  unit VARCHAR(50) NOT NULL,
  category VARCHAR(100) NOT NULL,
  region VARCHAR(255) NOT NULL,
  emoji VARCHAR(10) DEFAULT '🌾',
  badge VARCHAR(50),
  stock INTEGER DEFAULT 0,
  rating NUMERIC(3,2) DEFAULT 0,
  reviews_count INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE t_p5459529_lph_marketplace_crea.cart_items (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES t_p5459529_lph_marketplace_crea.users(id),
  product_id INTEGER REFERENCES t_p5459529_lph_marketplace_crea.products(id),
  qty INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE (user_id, product_id)
);

CREATE TABLE t_p5459529_lph_marketplace_crea.orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES t_p5459529_lph_marketplace_crea.users(id),
  status VARCHAR(50) DEFAULT 'pending',
  delivery_address TEXT,
  delivery_method VARCHAR(50) DEFAULT 'courier',
  payment_method VARCHAR(50) DEFAULT 'card',
  total NUMERIC(10,2) NOT NULL,
  delivery_cost NUMERIC(10,2) DEFAULT 290,
  comment TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE t_p5459529_lph_marketplace_crea.order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES t_p5459529_lph_marketplace_crea.orders(id),
  product_id INTEGER REFERENCES t_p5459529_lph_marketplace_crea.products(id),
  product_name VARCHAR(255) NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  qty INTEGER NOT NULL
);

CREATE TABLE t_p5459529_lph_marketplace_crea.sessions (
  id VARCHAR(64) PRIMARY KEY,
  user_id INTEGER REFERENCES t_p5459529_lph_marketplace_crea.users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP DEFAULT (NOW() + INTERVAL '30 days')
);

CREATE TABLE t_p5459529_lph_marketplace_crea.favorites (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES t_p5459529_lph_marketplace_crea.users(id),
  product_id INTEGER REFERENCES t_p5459529_lph_marketplace_crea.products(id),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE (user_id, product_id)
);
