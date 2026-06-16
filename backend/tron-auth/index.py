import json
import os
import hashlib
import smtplib
from email.mime.text import MIMEText
from email.header import Header
import psycopg2

SCHEMA = 't_p31668433_tron_music_label_sit'
TO_EMAIL = 'victiusi111@gmail.com'
FROM_EMAIL = 'victiusi111@gmail.com'

CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
}

def send_email(subject: str, body: str):
    password = os.environ.get('GMAIL_APP_PASSWORD', '')
    if not password:
        return
    msg = MIMEText(body, 'plain', 'utf-8')
    msg['Subject'] = Header(subject, 'utf-8')
    msg['From'] = FROM_EMAIL
    msg['To'] = TO_EMAIL
    with smtplib.SMTP_SSL('smtp.gmail.com', 465) as s:
        s.login(FROM_EMAIL, password)
        s.sendmail(FROM_EMAIL, [TO_EMAIL], msg.as_string())

def hash_password(pwd: str) -> str:
    return hashlib.sha256(pwd.encode()).hexdigest()

def get_conn():
    return psycopg2.connect(os.environ['DATABASE_URL'])

def handler(event: dict, context) -> dict:
    """Регистрация и вход артистов на сайте TRON. Сохраняет в БД и отправляет уведомление на почту."""
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    body = json.loads(event.get('body') or '{}')
    action = body.get('action')

    conn = get_conn()
    cur = conn.cursor()

    try:
        if action == 'register':
            email = body.get('email', '').strip().lower()
            password = body.get('password', '')
            first_name = body.get('first_name', '').strip()
            last_name = body.get('last_name', '').strip()
            middle_name = body.get('middle_name', '').strip()
            artist_name = body.get('artist_name', '').strip()
            genre = body.get('genre', '').strip()

            cur.execute(
                f'SELECT id FROM "{SCHEMA}".users WHERE email = %s',
                (email,)
            )
            if cur.fetchone():
                return {'statusCode': 409, 'headers': {**CORS, 'Content-Type': 'application/json'},
                        'body': json.dumps({'error': 'Email уже зарегистрирован'})}

            cur.execute(
                f'''INSERT INTO "{SCHEMA}".users (email, password_hash, first_name, last_name, middle_name)
                    VALUES (%s, %s, %s, %s, %s) RETURNING id''',
                (email, hash_password(password), first_name, last_name, middle_name)
            )
            user_id = cur.fetchone()[0]

            if artist_name:
                cur.execute(
                    f'''INSERT INTO "{SCHEMA}".artists (user_id, artist_name, genre, is_approved)
                        VALUES (%s, %s, %s, false)''',
                    (user_id, artist_name, genre)
                )

            conn.commit()

            send_email(
                '🎵 TRON: Новая регистрация',
                f'Новый артист зарегистрировался на сайте TRON!\n\n'
                f'Имя: {last_name} {first_name} {middle_name}\n'
                f'Псевдоним: {artist_name}\n'
                f'Жанр: {genre}\n'
                f'Email: {email}\n\n'
                f'Для публикации в разделе "Артисты" — одобрите заявку в панели.'
            )

            return {'statusCode': 200, 'headers': {**CORS, 'Content-Type': 'application/json'},
                    'body': json.dumps({'ok': True, 'user_id': user_id})}

        elif action == 'login':
            email = body.get('email', '').strip().lower()
            password = body.get('password', '')

            cur.execute(
                f'SELECT id, first_name, last_name FROM "{SCHEMA}".users WHERE email = %s AND password_hash = %s',
                (email, hash_password(password))
            )
            row = cur.fetchone()
            if not row:
                return {'statusCode': 401, 'headers': {**CORS, 'Content-Type': 'application/json'},
                        'body': json.dumps({'error': 'Неверный email или пароль'})}

            return {'statusCode': 200, 'headers': {**CORS, 'Content-Type': 'application/json'},
                    'body': json.dumps({'ok': True, 'user_id': row[0], 'first_name': row[1], 'last_name': row[2]})}

        else:
            return {'statusCode': 400, 'headers': {**CORS, 'Content-Type': 'application/json'},
                    'body': json.dumps({'error': 'Unknown action'})}
    finally:
        cur.close()
        conn.close()
