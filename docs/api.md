# API Reference

All routes are under `/api`. Authentication is required unless noted. Unauthorized requests return `401`.

## Authentication

`GET/POST /api/auth/[...nextauth]`

Handled entirely by NextAuth. See [`auth.md`](./auth.md).

---

## Features

### List features

`GET /api/features`

Query parameters:

| Param         | Type   | Description                            |
|---------------|--------|----------------------------------------|
| applicationId | string | Filter by application                  |
| status        | string | Filter by `FeatureStatus` enum value   |
| q             | string | Search title (duplicate detection)     |

Response: array of `Feature` objects with author, vote count, and comment count.

---

### Create feature

`POST /api/features`

Body:

```json
{
  "title": "string",
  "description": "html string",
  "applicationId": "cuid",
  "attachments": [
    { "url": "", "key": "", "name": "", "size": 0, "mimeType": "" }
  ]
}
```

Response: created `Feature` object (`201`).

---

### Get feature

`GET /api/features/[id]`

Response: `Feature` with votes, comments, attachments, and author.

---

## Votes

### Toggle vote

`POST /api/features/[id]/votes`

Creates a vote if none exists; deletes it if the user already voted (toggle). Updates `Feature.voteCount` accordingly.

Response:

```json
{ "voted": true, "voteCount": 42 }
```

---

## Comments

### List comments

`GET /api/features/[id]/comments`

Response: array of comments with author, ordered by `createdAt ASC`.

---

### Add comment

`POST /api/features/[id]/comments`

Body:

```json
{ "content": "string" }
```

Response: created `Comment` object (`201`).

---

## Uploads

### Request presigned upload URL

`POST /api/upload`

Body:

```json
{
  "name": "screenshot.png",
  "type": "image/png",
  "size": 204800
}
```

Response:

```json
{
  "presignedUrl": "https://s3.amazonaws.com/...",
  "key": "uploads/uuid-filename.png",
  "url": "https://s3.amazonaws.com/bucket/uploads/uuid-filename.png"
}
```

The client performs a `PUT` directly to `presignedUrl` with the file binary. See [`storage.md`](./storage.md).
