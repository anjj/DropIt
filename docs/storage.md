# File Storage

DropIt stores file attachments in **AWS S3** using presigned URLs for direct browser-to-S3 uploads.

## Upload flow

```
Browser → POST /api/upload → S3 presigned URL (PUT)
       ← { url, key, name, size, mimeType }
Browser → PUT <presigned-url> (direct upload, bypasses the app server)
Browser → include attachment metadata in POST /api/features
App     → write Attachment record to DB
```

The presigned URL expires after a short TTL set in `src/lib/s3.ts`.

## Configuration

File: `src/lib/s3.ts`

Uses `@aws-sdk/client-s3` and `@aws-sdk/s3-request-presigner`.

Required environment variables:

```env
AWS_REGION=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_S3_BUCKET=
```

## S3 bucket requirements

- Enable **CORS** to allow `PUT` requests from the app's origin:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["PUT"],
    "AllowedOrigins": ["https://your-domain.com"],
    "ExposeHeaders": []
  }
]
```

- Objects can be private (accessed via presigned GET URLs) or public (direct URL in `Attachment.url`).

## Database record

Each uploaded file creates an `Attachment` row linked to a `Feature`:

| Field    | Value                           |
|----------|---------------------------------|
| url      | Presigned GET URL or public URL |
| key      | S3 object key                   |
| name     | Original filename               |
| size     | Bytes                           |
| mimeType | MIME type from the browser      |

## Deletion

Attachments are cascade-deleted at the DB level when a `Feature` is deleted, but the corresponding S3 object must be deleted separately (not currently automated).
