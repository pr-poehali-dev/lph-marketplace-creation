"""
Товары: список с фильтрами, отдельный товар, создание/редактирование (для продавцов).
"""
import json
import os
import psycopg2

SCHEMA = os.environ.get('MAIN_DB_SCHEMA', 't_p5459529_lph_marketplace_crea')
CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Session-Id',
}


def get_conn():
    return psycopg2.connect(os.environ['DATABASE_URL'])


def get_user_by_session(conn, session_id: str):
    with conn.cursor() as cur:
        cur.execute(
            f"SELECT u.id, u.role FROM {SCHEMA}.sessions s "
            f"JOIN {SCHEMA}.users u ON s.user_id = u.id "
            f"WHERE s.id = %s AND s.expires_at > NOW()",
            (session_id,)
        )
        row = cur.fetchone()
        return {'id': row[0], 'role': row[1]} if row else None


def handler(event: dict, context) -> dict:
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    method = event.get('httpMethod', 'GET')
    params = event.get('queryStringParameters') or {}
    headers = event.get('headers') or {}
    session_id = headers.get('X-Session-Id') or headers.get('x-session-id')

    conn = get_conn()
    try:
        if method == 'GET':
            category = params.get('category')
            region = params.get('region')
            search = params.get('search')
            sort = params.get('sort', 'popular')
            limit = min(int(params.get('limit', 50)), 100)
            offset = int(params.get('offset', 0))
            product_id = params.get('id')

            with conn.cursor() as cur:
                # Один товар
                if product_id:
                    cur.execute(
                        f"SELECT p.id, p.name, p.description, p.price, p.unit, p.category, "
                        f"p.region, p.emoji, p.badge, p.stock, p.rating, p.reviews_count, "
                        f"s.farm_name, s.id as seller_id "
                        f"FROM {SCHEMA}.products p "
                        f"JOIN {SCHEMA}.sellers s ON p.seller_id = s.id "
                        f"WHERE p.id = %s AND p.active = TRUE",
                        (product_id,)
                    )
                    row = cur.fetchone()
                    if not row:
                        return {'statusCode': 404, 'headers': CORS, 'body': json.dumps({'error': 'Товар не найден'})}
                    keys = ['id','name','description','price','unit','category','region','emoji','badge','stock','rating','reviews_count','seller','seller_id']
                    product = dict(zip(keys, row))
                    product['price'] = float(product['price'])
                    product['rating'] = float(product['rating'])
                    return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'product': product})}

                # Список товаров
                where = ["p.active = TRUE"]
                args = []
                if category:
                    where.append("p.category = %s")
                    args.append(category)
                if region:
                    where.append("p.region = %s")
                    args.append(region)
                if search:
                    where.append("p.name ILIKE %s")
                    args.append(f'%{search}%')

                order = "p.reviews_count DESC"
                if sort == 'price_asc':
                    order = "p.price ASC"
                elif sort == 'price_desc':
                    order = "p.price DESC"
                elif sort == 'rating':
                    order = "p.rating DESC"

                where_clause = " AND ".join(where)
                cur.execute(
                    f"SELECT p.id, p.name, p.description, p.price, p.unit, p.category, "
                    f"p.region, p.emoji, p.badge, p.stock, p.rating, p.reviews_count, s.farm_name "
                    f"FROM {SCHEMA}.products p "
                    f"JOIN {SCHEMA}.sellers s ON p.seller_id = s.id "
                    f"WHERE {where_clause} ORDER BY {order} LIMIT %s OFFSET %s",
                    args + [limit, offset]
                )
                rows = cur.fetchall()
                keys = ['id','name','description','price','unit','category','region','emoji','badge','stock','rating','reviews_count','seller']
                products = []
                for row in rows:
                    p = dict(zip(keys, row))
                    p['price'] = float(p['price'])
                    p['rating'] = float(p['rating'])
                    products.append(p)

                cur.execute(
                    f"SELECT COUNT(*) FROM {SCHEMA}.products p WHERE {where_clause}",
                    args
                )
                total = cur.fetchone()[0]

            return {'statusCode': 200, 'headers': CORS,
                    'body': json.dumps({'products': products, 'total': total})}

        # POST — создание товара продавцом
        if method == 'POST':
            if not session_id:
                return {'statusCode': 401, 'headers': CORS, 'body': json.dumps({'error': 'Не авторизован'})}
            user = get_user_by_session(conn, session_id)
            if not user or user['role'] != 'seller':
                return {'statusCode': 403, 'headers': CORS, 'body': json.dumps({'error': 'Только для продавцов'})}

            body = json.loads(event.get('body') or '{}')
            with conn.cursor() as cur:
                cur.execute(f"SELECT id FROM {SCHEMA}.sellers WHERE user_id = %s", (user['id'],))
                seller = cur.fetchone()
                if not seller:
                    return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'Профиль продавца не найден'})}
                cur.execute(
                    f"INSERT INTO {SCHEMA}.products (seller_id, name, description, price, unit, category, region, emoji, badge, stock) "
                    f"VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s) RETURNING id",
                    (seller[0], body.get('name'), body.get('description'), body.get('price'),
                     body.get('unit'), body.get('category'), body.get('region'),
                     body.get('emoji', '🌾'), body.get('badge'), body.get('stock', 0))
                )
                product_id = cur.fetchone()[0]
                conn.commit()
            return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'id': product_id, 'ok': True})}

        return {'statusCode': 405, 'headers': CORS, 'body': json.dumps({'error': 'Метод не поддерживается'})}

    finally:
        conn.close()
