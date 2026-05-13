# Authentication

DropIt uses **NextAuth 4** with the **Azure AD** provider, restricting access to corporate accounts only.

## Flow

1. User visits the app unauthenticated.
2. Redirected to `/auth/signin` or clicks "Iniciar sesión con Microsoft".
3. Azure AD OAuth 2.0 consent screen.
4. On success, NextAuth creates/updates `User` and `Account` records via `@auth/prisma-adapter`.
5. A `Session` row is written to the database; a session cookie is set.

## Configuration

File: `src/lib/auth.ts`

- **Adapter:** `@auth/prisma-adapter` (database sessions)
- **Provider:** `AzureADProvider` — reads `AZURE_AD_CLIENT_ID`, `AZURE_AD_CLIENT_SECRET`, `AZURE_AD_TENANT_ID`
- **Callbacks:** `session` callback extends the session with `user.id` for server-side use

## Required environment variables

```env
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=<random 32-char string>

AZURE_AD_CLIENT_ID=
AZURE_AD_CLIENT_SECRET=
AZURE_AD_TENANT_ID=
```

## Azure AD app registration

1. Register an app in Azure Portal → **App registrations**.
2. Set the redirect URI to `{NEXTAUTH_URL}/api/auth/callback/azure-ad`.
3. Under **Certificates & secrets**, create a client secret.
4. Copy the **Application (client) ID**, **Directory (tenant) ID**, and the secret value into `.env`.

## Protecting routes

Use `getServerSession(authOptions)` in Server Components and API routes:

```ts
const session = await getServerSession(authOptions);
if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
```

## Session shape

```ts
session.user.id     // database User.id
session.user.name
session.user.email
session.user.image
```
