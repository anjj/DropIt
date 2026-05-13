# Data Model

DropIt uses **PostgreSQL 16** via **Prisma 5** ORM.

## Entity overview

```
User
 ├── Feature (author)
 ├── Vote
 └── Comment

Application
 └── Feature
      ├── Vote
      ├── Comment
      └── Attachment
```

## Models

### User
Populated on first OAuth sign-in. Owns features, votes, and comments.

| Field         | Type      | Notes                    |
|---------------|-----------|--------------------------|
| id            | cuid      | Primary key              |
| name          | String?   |                          |
| email         | String?   | Unique                   |
| emailVerified | DateTime? | Set by NextAuth          |
| image         | String?   | Avatar URL from Azure AD |
| createdAt     | DateTime  |                          |

---

### Application
Represents a product or service that feedback is submitted against.

| Field     | Type     | Notes       |
|-----------|----------|-------------|
| id        | cuid     | Primary key |
| name      | String   | Unique      |
| slug      | String   | Unique, URL-safe identifier |
| createdAt | DateTime |             |

---

### Feature
A feedback item / feature request.

| Field         | Type          | Notes                                  |
|---------------|---------------|----------------------------------------|
| id            | cuid          | Primary key                            |
| title         | String        |                                        |
| description   | String (Text) | Rich-text HTML from Tiptap             |
| applicationId | String        | FK → Application                       |
| authorId      | String        | FK → User                              |
| voteCount     | Int           | Denormalized counter, default 0        |
| status        | FeatureStatus | Default OPEN                           |
| createdAt     | DateTime      |                                        |
| updatedAt     | DateTime      |                                        |

#### FeatureStatus enum

| Value       | Meaning                           |
|-------------|-----------------------------------|
| OPEN        | Submitted, awaiting triage        |
| PLANNED     | Accepted, on the roadmap          |
| IN_PROGRESS | Actively being developed          |
| COMPLETED   | Shipped                           |
| REJECTED    | Will not be implemented           |

---

### Vote
One vote per user per feature (enforced by unique constraint).

| Field     | Type     | Notes          |
|-----------|----------|----------------|
| id        | cuid     | Primary key    |
| featureId | String   | FK → Feature   |
| userId    | String   | FK → User      |
| createdAt | DateTime |                |

Unique constraint: `(featureId, userId)`.

---

### Comment
Discussion thread on a feature.

| Field     | Type          | Notes        |
|-----------|---------------|--------------|
| id        | cuid          | Primary key  |
| content   | String (Text) |              |
| featureId | String        | FK → Feature |
| authorId  | String        | FK → User    |
| createdAt | DateTime      |              |

---

### Attachment
Files uploaded to S3 and linked to a feature.

| Field     | Type     | Notes                          |
|-----------|----------|--------------------------------|
| id        | cuid     | Primary key                    |
| url       | String   | Presigned or public S3 URL     |
| key       | String   | S3 object key                  |
| name      | String   | Original filename              |
| size      | Int      | Bytes                          |
| mimeType  | String   |                                |
| featureId | String   | FK → Feature                   |
| createdAt | DateTime |                                |

---

## Indexes

- `Feature.applicationId` — filter features by application
- `Feature.voteCount DESC` — sort by popularity

## Migrations

Managed by Prisma Migrate. Migration files live in `prisma/migrations/`.

```bash
npm run db:migrate   # apply pending migrations (dev)
npm run db:push      # sync schema without migration (prototyping)
```
