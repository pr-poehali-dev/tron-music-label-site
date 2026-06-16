import json
import os
import smtplib
from email.mime.text import MIMEText
from email.header import Header

TO_EMAIL = 'victiusi111@gmail.com'

TYPE_LABELS = {
    'subscribe': 'Новая подписка на рассылку',
    'demo': 'Новая заявка: отправка демо',
    'register': 'Новая регистрация',
    'login': 'Попытка входа',
    'contact': 'Сообщение из формы контактов',
}


def handler(event: dict, context) -> dict:
    '''Принимает заявки с сайта TRON (подписка, демо, регистрация, вход) и отправляет их на почту лейбла.'''
    method = event.get('httpMethod', 'GET')
    cors = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '86400',
    }

    if method == 'OPTIONS':
        return {'statusCode': 200, 'headers': cors, 'body': ''}

    if method != 'POST':
        return {'statusCode': 405, 'headers': {**cors, 'Content-Type': 'application/json'},
                'body': json.dumps({'error': 'Method not allowed'})}

    body = json.loads(event.get('body') or '{}')
    form_type = body.get('type', 'contact')
    subject = TYPE_LABELS.get(form_type, 'Заявка с сайта TRON')

    fields = []
    for key in ['name', 'email', 'phone', 'genre', 'links', 'message', 'password']:
        val = body.get(key)
        if val:
            if key == 'password':
                val = '••••••••'
            fields.append(f'{key}: {val}')
    text_body = f'{subject}\n\n' + '\n'.join(fields) if fields else subject

    app_password = os.environ.get('GMAIL_APP_PASSWORD')
    if not app_password:
        return {'statusCode': 200, 'headers': {**cors, 'Content-Type': 'application/json'},
                'body': json.dumps({'ok': True, 'note': 'saved_without_email'})}

    msg = MIMEText(text_body, 'plain', 'utf-8')
    msg['Subject'] = Header(subject, 'utf-8')
    msg['From'] = TO_EMAIL
    msg['To'] = TO_EMAIL

    with smtplib.SMTP_SSL('smtp.gmail.com', 465) as server:
        server.login(TO_EMAIL, app_password)
        server.sendmail(TO_EMAIL, [TO_EMAIL], msg.as_string())

    return {'statusCode': 200, 'headers': {**cors, 'Content-Type': 'application/json'},
            'body': json.dumps({'ok': True})}
