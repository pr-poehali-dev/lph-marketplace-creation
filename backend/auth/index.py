"""
Аутентификация: регистрация, вход, выход, получение текущего пользователя.
"""
import json
import os
import hashlib
import secrets
import psycopg2

SCHEMA = os.environ.get('MAIN_DB_SCHEMA', 't_p5459529_lph_marketplace_crea')
CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Session-Id',
}


def get_conn():
    return psycopg2.connect(os.environ['DATABASE_URL'])


def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()


def get_user_by_session(conn, session_id: str):
    with conn.cursor() as cur:
        cur.execute(
            f"SELECT u.id, u.email, u.name, u.phone, u.address, u.role, u.region "
            f"FROM {SCHEMA}.sessions s JOIN {SCHEMA}.users u ON s.user_id = u.id "
            f"WHERE s.id = %s AND s.expires_at > NOW()",
            (session_id,)
        )
        row = cur.fetchone()
        if not row:
            return None
        return {'id': row[0], 'email': row[1], 'name': row[2], 'phone': row[3],
                'address': row[4], 'role': row[5], 'region': row[6]}


def handler(event: dict, context) -> dict:
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    method = event.get('httpMethod', 'GET')
    path = event.get('path', '/')
    headers = event.get('headers') or {}
    session_id = headers.get('X-Session-Id') or headers.get('x-session-id')

    conn = get_conn()

    try:
        # GET /auth/me — текущий пользователь
        if method == 'GET':
            if not session_id:
                return {'statusCode': 401, 'headers': CORS,
                        'body': json.dumps({'error': 'Не авторизован'})}
            user = get_user_by_session(conn, session_id)
            if not user:
                return {'statusCode': 401, 'headers': CORS,
                        'body': json.dumps({'error': 'Сессия истекла'})}
            return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'user': user})}

        body = json.loads(event.get('body') or '{}')
        action = body.get('action')

        # Регистрация
        if action == 'register':
            email = body.get('email', '').strip().lower()
            password = body.get('password', '')
            name = body.get('name', '').strip()
            if not email or not password or not name:
                return {'statusCode': 400, 'headers': CORS,
                        'body': json.dumps({'error': 'Заполните все поля'})}
            with conn.cursor() as cur:
                cur.execute(f"SELECT id FROM {SCHEMA}.users WHERE email = %s", (email,))
                if cur.fetchone():
                    return {'statusCode': 409, 'headers': CORS,
                            'body': json.dumps({'error': 'Email уже зарегистрирован'})}
                pw_hash = hash_password(password)
                cur.execute(
                    f"INSERT INTO {SCHEMA}.users (email, password_hash, name) VALUES (%s, %s, %s) RETURNING id",
                    (email, pw_hash, name)
                )
                user_id = cur.fetchone()[0]
                sid = secrets.token_hex(32)
                cur.execute(
                    f"INSERT INTO {SCHEMA}.sessions (id, user_id) VALUES (%s, %s)",
                    (sid, user_id)
                )
                conn.commit()
            return {'statusCode': 200, 'headers': CORS,
                    'body': json.dumps({'session_id': sid, 'user': {'id': user_id, 'email': email, 'name': name, 'role': 'buyer'}})}

        # Вход
        if action == 'login':
            email = body.get('email', '').strip().lower()
            password = body.get('password', '')
            with conn.cursor() as cur:
                cur.execute(
                    f"SELECT id, email, name, phone, address, role, region, password_hash FROM {SCHEMA}.users WHERE email = %s",
                    (email,)
                )
                row = cur.fetchone()
                if not row or row[7] != hash_password(password):
                    return {'statusCode': 401, 'headers': CORS,
                            'body': json.dumps({'error': 'Неверный email или пароль'})}
                sid = secrets.token_hex(32)
                cur.execute(
                    f"INSERT INTO {SCHEMA}.sessions (id, user_id) VALUES (%s, %s)",
                    (sid, row[0])
                )
                conn.commit()
            user = {'id': row[0], 'email': row[1], 'name': row[2], 'phone': row[3],
                    'address': row[4], 'role': row[5], 'region': row[6]}
            return {'statusCode': 200, 'headers': CORS,
                    'body': json.dumps({'session_id': sid, 'user': user})}

        # Выход
        if action == 'logout':
            if session_id:
                with conn.cursor() as cur:
                    cur.execute(f"UPDATE {SCHEMA}.sessions SET expires_at = NOW() WHERE id = %s", (session_id,))
                    conn.commit()
            return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'ok': True})}

        # Обновление профиля
        if action == 'update_profile':
            if not session_id:
                return {'statusCode': 401, 'headers': CORS, 'body': json.dumps({'error': 'Не авторизован'})}
            user = get_user_by_session(conn, session_id)
            if not user:
                return {'statusCode': 401, 'headers': CORS, 'body': json.dumps({'error': 'Сессия истекла'})}
            name = body.get('name', user['name'])
            phone = body.get('phone', user['phone'])
            address = body.get('address', user['address'])
            region = body.get('region', user['region'])
            with conn.cursor() as cur:
                cur.execute(
                    f"UPDATE {SCHEMA}.users SET name=%s, phone=%s, address=%s, region=%s WHERE id=%s",
                    (name, phone, address, region, user['id'])
                )
                conn.commit()
            return {'statusCode': 200, 'headers': CORS,
                    'body': json.dumps({'ok': True, 'user': {**user, 'name': name, 'phone': phone, 'address': address, 'region': region}})}

        return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'Неизвестное действие'})}

    finally:
        conn.close()
