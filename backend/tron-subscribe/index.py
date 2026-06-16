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
    """Подписка на рассылку TRON. Сохраняет email в БД и уведомляет владельца лейбла."""
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    body = json.loads(event.get('body') or '{}')
    email = body.get('email', '').strip().lower()

    if not email or '@' not in email:
        return {'statusCode': 400, 'headers': {**CORS, 'Content-Type': 'application/json'},
                'body': json.dumps({'error': 'Укажите корректный email'})}

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()
    try:
        cur.execute(
            f'SELECT id FROM "{SCHEMA}".subscribers WHERE email = %s',
            (email,)
        )
        if cur.fetchone():
            return {'statusCode': 200, 'headers': {**CORS, 'Content-Type': 'application/json'},
                    'body': json.dumps({'ok': True, 'already': True})}

        cur.execute(
            f'INSERT INTO "{SCHEMA}".subscribers (email) VALUES (%s)',
            (email,)
        )
        conn.commit()
    finally:
        cur.close()
        conn.close()

    send_email(
        '📬 TRON: Новый подписчик',
        f'Новый подписчик на рассылку TRON!\n\nEmail: {email}'
    )

    return {'statusCode': 200, 'headers': {**CORS, 'Content-Type': 'application/json'},
            'body': json.dumps({'ok': True})}
