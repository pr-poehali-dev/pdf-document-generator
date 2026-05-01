import json
import os
import psycopg2
from datetime import datetime

CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
}

def get_conn():
    return psycopg2.connect(os.environ['DATABASE_URL'])


def handler(event: dict, context) -> dict:
    """Сохранение PDF в БД и получение списка файлов"""
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': {**CORS, 'Access-Control-Max-Age': '86400'}, 'body': ''}

    method = event.get('httpMethod', 'GET')

    if method == 'POST':
        raw_body = event.get('body') or '{}'
        body = json.loads(raw_body) if isinstance(raw_body, str) else raw_body
        pdf_b64 = body.get('pdf')
        name = body.get('name', 'document')
        if not pdf_b64:
            return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'pdf required'})}

        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            "INSERT INTO saved_files (name, pdf_data) VALUES (%s, %s) RETURNING id, created_at",
            (name + '.pdf', pdf_b64)
        )
        row = cur.fetchone()
        conn.commit()
        cur.close()
        conn.close()

        return {
            'statusCode': 200,
            'headers': CORS,
            'body': json.dumps({'id': row[0], 'name': name + '.pdf', 'created_at': row[1].isoformat()}),
        }

    if method == 'GET':
        file_id = (event.get('queryStringParameters') or {}).get('id')
        conn = get_conn()
        cur = conn.cursor()
        if file_id:
            cur.execute("SELECT id, name, pdf_data FROM saved_files WHERE id = %s", (int(file_id),))
            row = cur.fetchone()
            cur.close()
            conn.close()
            if not row:
                return {'statusCode': 404, 'headers': CORS, 'body': json.dumps({'error': 'not found'})}
            return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'id': row[0], 'name': row[1], 'pdf': row[2]})}
        cur.execute("SELECT id, name, created_at FROM saved_files ORDER BY created_at DESC LIMIT 100")
        rows = cur.fetchall()
        cur.close()
        conn.close()
        files = [{'id': r[0], 'name': r[1], 'created_at': r[2].isoformat()} for r in rows]
        return {
            'statusCode': 200,
            'headers': CORS,
            'body': json.dumps({'files': files}),
        }

    if method == 'DELETE':
        raw_body = event.get('body') or '{}'
        body = json.loads(raw_body) if isinstance(raw_body, str) else raw_body
        file_id = body.get('id')
        conn = get_conn()
        cur = conn.cursor()
        cur.execute("DELETE FROM saved_files WHERE id = %s", (file_id,))
        conn.commit()
        cur.close()
        conn.close()
        return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'ok': True})}

    return {'statusCode': 405, 'headers': CORS, 'body': json.dumps({'error': 'Method not allowed'})}