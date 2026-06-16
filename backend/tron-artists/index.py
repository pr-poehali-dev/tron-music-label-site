import json
import os
import psycopg2

SCHEMA = 't_p31668433_tron_music_label_sit'

CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
}

def handler(event: dict, context) -> dict:
    """Возвращает список одобренных артистов лейбла TRON для отображения на сайте."""
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()
    try:
        cur.execute(
            f'''SELECT a.id, a.artist_name, a.genre, a.bio, a.photo_url, a.social_links, a.created_at,
                       u.first_name, u.last_name
                FROM "{SCHEMA}".artists a
                JOIN "{SCHEMA}".users u ON u.id = a.user_id
                WHERE a.is_approved = true
                ORDER BY a.created_at DESC'''
        )
        rows = cur.fetchall()
        artists = [
            {
                'id': r[0],
                'artist_name': r[1],
                'genre': r[2],
                'bio': r[3],
                'photo_url': r[4],
                'social_links': r[5],
                'created_at': r[6].isoformat() if r[6] else None,
                'first_name': r[7],
                'last_name': r[8],
            }
            for r in rows
        ]
    finally:
        cur.close()
        conn.close()

    return {'statusCode': 200, 'headers': {**CORS, 'Content-Type': 'application/json'},
            'body': json.dumps({'artists': artists})}
