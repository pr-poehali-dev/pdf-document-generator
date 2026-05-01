import json
import os
import base64
import boto3
from datetime import datetime

s3 = boto3.client(
    's3',
    endpoint_url='https://bucket.poehali.dev',
    aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
    aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY'],
)
BUCKET = 'files'
PREFIX = 'pdfs/'

CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
}


def handler(event: dict, context) -> dict:
    """Загрузка PDF в S3 и получение списка файлов"""
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': {**CORS, 'Access-Control-Max-Age': '86400'}, 'body': ''}

    method = event.get('httpMethod', 'GET')

    if method == 'POST':
        raw_body = event.get('body') or '{}'
        body = json.loads(raw_body) if isinstance(raw_body, str) else raw_body
        print(f"POST received, body keys: {list(body.keys()) if isinstance(body, dict) else 'not dict'}, pdf length: {len(body.get('pdf',''))}")
        pdf_b64 = body.get('pdf')
        name = body.get('name', 'document')
        if not pdf_b64:
            return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'pdf required'})}

        pdf_bytes = base64.b64decode(pdf_b64)
        timestamp = datetime.utcnow().strftime('%Y%m%d_%H%M%S')
        key = f"{PREFIX}{timestamp}_{name}.pdf"

        s3.put_object(Bucket=BUCKET, Key=key, Body=pdf_bytes, ContentType='application/pdf')
        print(f"Saved to S3: {key}, size: {len(pdf_bytes)} bytes")
        # Verify immediately
        check = s3.list_objects_v2(Bucket=BUCKET, Prefix=PREFIX)
        print(f"Verify after save: KeyCount={check.get('KeyCount')} keys={[o['Key'] for o in check.get('Contents', [])]}")

        access_key = os.environ['AWS_ACCESS_KEY_ID']
        url = f"https://cdn.poehali.dev/projects/{access_key}/bucket/{key}"

        return {
            'statusCode': 200,
            'headers': CORS,
            'body': json.dumps({'url': url, 'name': f"{name}.pdf", 'created_at': timestamp}),
        }

    if method == 'GET':
        response = s3.list_objects_v2(Bucket=BUCKET, Prefix=PREFIX)
        all_keys = [o['Key'] for o in response.get('Contents', [])]
        print(f"LIST S3 bucket={BUCKET} prefix={PREFIX} KeyCount={response.get('KeyCount')} IsTruncated={response.get('IsTruncated')} keys={all_keys}")
        files = []
        access_key = os.environ['AWS_ACCESS_KEY_ID']
        for obj in response.get('Contents', []):
            key = obj['Key']
            filename = key.replace(PREFIX, '')
            url = f"https://cdn.poehali.dev/projects/{access_key}/bucket/{key}"
            files.append({
                'name': filename,
                'url': url,
                'size': obj['Size'],
                'created_at': obj['LastModified'].isoformat(),
            })
        files.sort(key=lambda x: x['created_at'], reverse=True)
        return {
            'statusCode': 200,
            'headers': CORS,
            'body': json.dumps({'files': files}),
        }

    return {'statusCode': 405, 'headers': CORS, 'body': json.dumps({'error': 'Method not allowed'})}