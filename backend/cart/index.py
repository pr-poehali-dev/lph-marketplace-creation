"""
Корзина: получить, добавить, изменить количество, удалить товар.
"""
import json
import os
import psycopg2

SCHEMA = os.environ.get('MAIN_DB_SCHEMA', 't_p5459529_lph_marketplace_crea')
CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Session-Id',
}


def get_conn():
    return psycopg2.connect(os.environ['DATABASE_URL'])


def get_user_by_session(conn, session_id: str):
    with conn.cursor() as cur:
        cur.execute(
            f"SELECT u.id FROM {SCHEMA}.sessions s "
            f"JOIN {SCHEMA}.users u ON s.user_id = u.id "
            f"WHERE s.id = %s AND s.expires_at > NOW()",
            (session_id,)
        )
        row = cur.fetchone()
        return row[0] if row else None


def get_cart(conn, user_id: int):
    with conn.cursor() as cur:
        cur.execute(
            f"SELECT ci.id, ci.product_id, ci.qty, p.name, p.price, p.unit, p.emoji, p.region, "
            f"s.farm_name "
            f"FROM {SCHEMA}.cart_items ci "
            f"JOIN {SCHEMA}.products p ON ci.product_id = p.id "
            f"JOIN {SCHEMA}.sellers s ON p.seller_id = s.id "
            f"WHERE ci.user_id = %s",
            (user_id,)
        )
        rows = cur.fetchall()
    items = []
    for row in rows:
        items.append({
            'cart_item_id': row[0],
            'product_id': row[1],
            'qty': row[2],
            'name': row[3],
            'price': float(row[4]),
            'unit': row[5],
            'emoji': row[6],
            'region': row[7],
            'seller': row[8],
        })
    return items


def handler(event: dict, context) -> dict:
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    method = event.get('httpMethod', 'GET')
    headers = event.get('headers') or {}
    session_id = headers.get('X-Session-Id') or headers.get('x-session-id')

    conn = get_conn()
    try:
        if not session_id:
            return {'statusCode': 401, 'headers': CORS, 'body': json.dumps({'error': 'Не авторизован'})}

        user_id = get_user_by_session(conn, session_id)
        if not user_id:
            return {'statusCode': 401, 'headers': CORS, 'body': json.dumps({'error': 'Сессия истекла'})}

        # GET — получить корзину
        if method == 'GET':
            items = get_cart(conn, user_id)
            total = sum(i['price'] * i['qty'] for i in items)
            return {'statusCode': 200, 'headers': CORS,
                    'body': json.dumps({'items': items, 'total': round(total, 2)})}

        body = json.loads(event.get('body') or '{}')

        # POST — добавить / изменить количество
        if method == 'POST':
            product_id = body.get('product_id')
            qty = int(body.get('qty', 1))
            if not product_id:
                return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'product_id обязателен'})}
            with conn.cursor() as cur:
                cur.execute(
                    f"INSERT INTO {SCHEMA}.cart_items (user_id, product_id, qty) VALUES (%s, %s, %s) "
                    f"ON CONFLICT (user_id, product_id) DO UPDATE SET qty = {SCHEMA}.cart_items.qty + EXCLUDED.qty",
                    (user_id, product_id, qty)
                )
                conn.commit()
            items = get_cart(conn, user_id)
            return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'items': items, 'ok': True})}

        # PUT — установить точное количество
        if method == 'PUT':
            product_id = body.get('product_id')
            qty = int(body.get('qty', 1))
            with conn.cursor() as cur:
                if qty <= 0:
                    cur.execute(
                        f"DELETE FROM {SCHEMA}.cart_items WHERE user_id = %s AND product_id = %s",
                        (user_id, product_id)
                    )
                else:
                    cur.execute(
                        f"UPDATE {SCHEMA}.cart_items SET qty = %s WHERE user_id = %s AND product_id = %s",
                        (qty, user_id, product_id)
                    )
                conn.commit()
            items = get_cart(conn, user_id)
            return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'items': items, 'ok': True})}

        # DELETE — очистить корзину
        if method == 'DELETE':
            product_id = body.get('product_id')
            with conn.cursor() as cur:
                if product_id:
                    cur.execute(
                        f"DELETE FROM {SCHEMA}.cart_items WHERE user_id = %s AND product_id = %s",
                        (user_id, product_id)
                    )
                else:
                    cur.execute(f"DELETE FROM {SCHEMA}.cart_items WHERE user_id = %s", (user_id,))
                conn.commit()
            return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'ok': True})}

        return {'statusCode': 405, 'headers': CORS, 'body': json.dumps({'error': 'Метод не поддерживается'})}

    finally:
        conn.close()
