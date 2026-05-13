# Features Domain

Core business logic for the feedback / feature request workflow.

## Lifecycle

```
OPEN → PLANNED → IN_PROGRESS → COMPLETED
                              → REJECTED
```

Status is managed manually (no automatic transitions). Only authorized team members update status.

## Submitting a feature request

Route: `POST /api/features`  
Component: `src/components/feedback/FeedbackForm.tsx`

Required fields:
- `title` — plain text, used for duplicate detection
- `description` — rich HTML from Tiptap editor
- `applicationId` — which product this belongs to

Optional:
- Attachments uploaded via `POST /api/upload` before form submission

The form validates with **Zod** before sending.

## Duplicate detection

Component: `src/components/feedback/DuplicateDetector.tsx`

As the user types a title, the component queries existing features in real-time and surfaces similar ones. This runs client-side with a debounce to reduce API calls. If the user proceeds anyway, the duplicate is still submitted — detection is advisory only.

## Voting

Route: `POST /api/features/[id]/votes`  
Component: `src/components/ui/VoteButton.tsx`

- One vote per user per feature (enforced by DB unique constraint).
- `Feature.voteCount` is a denormalized counter incremented/decremented on each vote toggle.
- Features in `/explore` are sorted by `voteCount DESC` by default.

## Comments

Route: `POST /api/features/[id]/comments`  
Component: part of `src/components/explore/FeatureDetail.tsx`

Plain-text comments. No threading. Ordered by `createdAt ASC`.

## Explore & filtering

Page: `src/app/explore/page.tsx`  
Client: `src/components/explore/ExploreClient.tsx`

Supports filtering by:
- Application
- Status
- Sort order (votes, date)

## Rich text editor

Component: `src/components/feedback/RichTextEditor.tsx`

Built on **Tiptap 2** with `starter-kit` and `placeholder` extension. Outputs HTML stored in `Feature.description`.

## File attachments

Component: `src/components/feedback/FileUpload.tsx`

Uses **react-dropzone 14**. Files are uploaded to S3 via presigned URLs before the feature is saved. See [`storage.md`](./storage.md).
