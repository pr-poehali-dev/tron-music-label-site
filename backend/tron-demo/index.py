import json
import os
import smtplib
from email.mime.text import MIMEText
from email.header import Header
import psycopg2

SCHEMA = 't_p31668433_tron_music_label_sit'
TO_EMAIL = 'victiusi111@gmail.com'
FROM_EMAIL = 'victiusi111@gmail.com'

CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
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

def handler(event: dict, context) -> dict:
    """Приём демо-заявок от артистов на сайте TRON. Сохраняет в БД и присылает уведомление на почту."""
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    body = json.loads(event.get('body') or '{}')

    first_name = body.get('first_name', '').strip()
    last_name = body.get('last_name', '').strip()
    middle_name = body.get('middle_name', '').strip()
    artist_name = body.get('artist_name', '').strip()
    email = body.get('email', '').strip().lower()
    genre = body.get('genre', '').strip()
    links = body.get('links', '').strip()
    message = body.get('message', '').strip()

    if not first_name or not last_name or not email:
        return {'statusCode': 400, 'headers': {**CORS, 'Content-Type': 'application/json'},
                'body': json.dumps({'error': 'Заполните обязательные поля'})}

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()
    try:
        cur.execute(
            f'''INSERT INTO "{SCHEMA}".demo_requests
                (first_name, last_name, middle_name, artist_name, email, genre, links, message)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s) RETURNING id''',
            (first_name, last_name, middle_name, artist_name, email, genre, links, message)
        )
        req_id = cur.fetchone()[0]
        conn.commit()
    finally:
        cur.close()
        conn.close()

    send_email(
        f'🎧 TRON: Новое демо #{req_id}',
        f'Новая заявка на демо!\n\n'
        f'ФИО: {last_name} {first_name} {middle_name}\n'
        f'Артист / группа: {artist_name or "—"}\n'
        f'Email: {email}\n'
        f'Жанр: {genre or "—"}\n'
        f'Ссылки: {links or "—"}\n\n'
        f'Сообщение модератору:\n{message or "—"}'
    )

    return {'statusCode': 200, 'headers': {**CORS, 'Content-Type': 'application/json'},
            'body': json.dumps({'ok': True, 'id': req_id})}
