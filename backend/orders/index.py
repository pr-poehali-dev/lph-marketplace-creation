"""
Заказы: создание заказа из корзины, список заказов пользователя, детали заказа.
"""
import json
import os
import psycopg2

SCHEMA = os.environ.get('MAIN_DB_SCHEMA', 't_p5459529_lph_marketplace_crea')
CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Session-Id',
}

STATUS_RU = {
    'pending': 'Ожидает подтверждения',
    'confirmed': 'Подтверждён',
    'shipping': 'В пути',
    'delivered': 'Доставлен',
    'cancelled': 'Отменён',
}


def get_conn():
    return psycopg2.connect(os.environ['DATABASE_URL'])


def get_user_by_session(conn, session_id: str):
    with conn.cursor() as cur:
        cur.execute(
            f"SELECT u.id, u.name, u.email FROM {SCHEMA}.sessions s "
            f"JOIN {SCHEMA}.users u ON s.user_id = u.id "
            f"WHERE s.id = %s AND s.expires_at > NOW()",
            (session_id,)
        )
        row = cur.fetchone()
        return {'id': row[0], 'name': row[1], 'email': row[2]} if row else None


def handler(event: dict, context) -> dict:
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    method = event.get('httpMethod', 'GET')
    headers = event.get('headers') or {}
    session_id = headers.get('X-Session-Id') or headers.get('x-session-id')
    params = event.get('queryStringParameters') or {}

    conn = get_conn()
    try:
        if not session_id:
            return {'statusCode': 401, 'headers': CORS, 'body': json.dumps({'error': 'Не авторизован'})}

        user = get_user_by_session(conn, session_id)
        if not user:
            return {'statusCode': 401, 'headers': CORS, 'body': json.dumps({'error': 'Сессия истекла'})}

        # GET — список заказов пользователя
        if method == 'GET':
            order_id = params.get('id')
            with conn.cursor() as cur:
                if order_id:
                    cur.execute(
                        f"SELECT o.id, o.status, o.total, o.delivery_cost, o.delivery_address, "
                        f"o.delivery_method, o.payment_method, o.created_at "
                        f"FROM {SCHEMA}.orders o WHERE o.id = %s AND o.user_id = %s",
                        (order_id, user['id'])
                    )
                    row = cur.fetchone()
                    if not row:
                        return {'statusCode': 404, 'headers': CORS, 'body': json.dumps({'error': 'Заказ не найден'})}
                    cur.execute(
                        f"SELECT oi.product_name, oi.price, oi.qty, p.emoji "
                        f"FROM {SCHEMA}.order_items oi "
                        f"LEFT JOIN {SCHEMA}.products p ON oi.product_id = p.id "
                        f"WHERE oi.order_id = %s",
                        (row[0],)
                    )
                    items = [{'name': r[0], 'price': float(r[1]), 'qty': r[2], 'emoji': r[3] or '🌾'} for r in cur.fetchall()]
                    order = {
                        'id': row[0], 'status': row[1], 'status_ru': STATUS_RU.get(row[1], row[1]),
                        'total': float(row[2]), 'delivery_cost': float(row[3]),
                        'delivery_address': row[4], 'delivery_method': row[5],
                        'payment_method': row[6], 'created_at': str(row[7]), 'items': items
                    }
                    return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'order': order})}
                else:
                    cur.execute(
                        f"SELECT o.id, o.status, o.total, o.delivery_cost, o.created_at "
                        f"FROM {SCHEMA}.orders o WHERE o.user_id = %s ORDER BY o.created_at DESC",
                        (user['id'],)
                    )
                    rows = cur.fetchall()
                    orders = []
                    for row in rows:
                        cur.execute(
                            f"SELECT product_name FROM {SCHEMA}.order_items WHERE order_id = %s",
                            (row[0],)
                        )
                        item_names = [r[0] for r in cur.fetchall()]
                        orders.append({
                            'id': row[0], 'status': row[1], 'status_ru': STATUS_RU.get(row[1], row[1]),
                            'total': float(row[2]), 'delivery_cost': float(row[3]),
                            'created_at': str(row[4]), 'item_names': item_names
                        })
                    return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'orders': orders})}

        # POST — создать заказ
        if method == 'POST':
            body = json.loads(event.get('body') or '{}')
            delivery_address = body.get('delivery_address', '')
            delivery_method = body.get('delivery_method', 'courier')
            payment_method = body.get('payment_method', 'card')

            with conn.cursor() as cur:
                # Получить корзину
                cur.execute(
                    f"SELECT ci.product_id, ci.qty, p.name, p.price "
                    f"FROM {SCHEMA}.cart_items ci "
                    f"JOIN {SCHEMA}.products p ON ci.product_id = p.id "
                    f"WHERE ci.user_id = %s",
                    (user['id'],)
                )
                cart = cur.fetchall()
                if not cart:
                    return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'Корзина пуста'})}

                total = sum(float(row[3]) * row[1] for row in cart)
                delivery_cost = 0 if total >= 3000 else 290

                cur.execute(
                    f"INSERT INTO {SCHEMA}.orders (user_id, total, delivery_cost, delivery_address, delivery_method, payment_method) "
                    f"VALUES (%s, %s, %s, %s, %s, %s) RETURNING id",
                    (user['id'], total, delivery_cost, delivery_address, delivery_method, payment_method)
                )
                order_id = cur.fetchone()[0]

                for row in cart:
                    cur.execute(
                        f"INSERT INTO {SCHEMA}.order_items (order_id, product_id, product_name, price, qty) VALUES (%s, %s, %s, %s, %s)",
                        (order_id, row[0], row[2], float(row[3]), row[1])
                    )

                # Очистить корзину
                cur.execute(f"DELETE FROM {SCHEMA}.cart_items WHERE user_id = %s", (user['id'],))
                conn.commit()

            return {'statusCode': 200, 'headers': CORS,
                    'body': json.dumps({'order_id': order_id, 'total': total, 'delivery_cost': delivery_cost, 'ok': True})}

        return {'statusCode': 405, 'headers': CORS, 'body': json.dumps({'error': 'Метод не поддерживается'})}

    finally:
        conn.close()
