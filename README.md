# Digital Warranty & Product Ownership Tracker

Full-stack SaaS-style warranty tracker built from the Figma-exported React UI.

## Stack

- Frontend: React, TypeScript, Vite, Tailwind CSS, React Router, TanStack React Query, Axios, Recharts.
- Backend: NestJS, Swagger, Nest Schedule, Nodemailer.
- Platform: Supabase Auth, Supabase PostgreSQL, Supabase Storage.

## 1. Supabase Setup

1. Create a Supabase project.
2. Open the SQL editor and run [`supabase/schema.sql`](supabase/schema.sql).
3. Confirm the private storage bucket `product-documents` exists.
4. Copy your project URL, anon key, and service role key.

The schema enables row-level security so users can only access their own products, documents, maintenance records, notifications, and notification settings.

## 2. Frontend Setup

Create `.env.local` in the project root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_API_URL=http://localhost:4000
```

Install and run:

```bash
npm install
npm run dev
```

## 3. Backend Setup

Create `backend/.env`:

```env
PORT=4000
FRONTEND_URL=http://localhost:5173
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-smtp-user
SMTP_PASS=your-smtp-password
EMAIL_FROM="Warranty Tracker <noreply@example.com>"
```

SMTP values are optional for local development. If they are missing or still use placeholder values, in-app notifications still work and email sending is shown as not configured in Settings.

For Gmail, use an app password, not your normal Gmail password:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-gmail-address@gmail.com
SMTP_PASS=your-google-app-password
EMAIL_FROM="Warranty Tracker <your-gmail-address@gmail.com>"
```

After changing SMTP values, restart the backend. Email reminders are sent when warranty reminders are generated for products inside the configured thresholds.

Install and run:

```bash
cd backend
npm install
npm run start:dev
```

Swagger is available at:

```text
http://localhost:4000/docs
```

## Implemented Features

- Supabase registration, login, logout, and protected dashboard routes.
- Product create, edit, delete, list, search, filter, and sort.
- Automatic warranty end-date calculation.
- Warranty status and days-left display.
- Supabase Storage document upload, download, and delete.
- Maintenance record add/delete and total maintenance cost.
- Backend dashboard analytics endpoint.
- Backend in-app and email notification generation.
- Daily scheduled warranty check.
- Automatic warranty check after product create/update.
- Daily notification cleanup for old read/delivery records.
- Notification list, mark one read, mark all read.
- Notification settings persistence.
- Profile update, password change, and forgot-password reset flow.
- CSV export.
- Swagger API documentation.

## Demo Flow

1. Start backend and frontend.
2. Register or log in.
3. Add a product with a warranty.
4. Upload a receipt/manual.
5. Add a maintenance record.
6. Use search/filter/sort on Products.
7. Open Dashboard and show analytics.
8. Add an expiring product and show the generated in-app/email reminders.
9. Mark notifications read.
10. Export products as CSV.
11. Open Swagger at `/docs`.

## Deployment: Vercel + Render

### Frontend on Vercel

Use the project root as the Vercel project.

```text
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

Add these Vercel environment variables:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_API_URL=https://your-render-backend.onrender.com
```

`vercel.json` is included so React Router routes such as `/products` and `/reset-password` work after refresh.

### Backend on Render

Create a Render Web Service from the same repository. Use `backend` as the root directory.

```text
Runtime: Node
Build Command: npm install && npm run build
Start Command: npm run start
```

Add these Render environment variables:

```env
FRONTEND_URL=https://your-vercel-app.vercel.app
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-gmail-address@gmail.com
SMTP_PASS=your-google-app-password
EMAIL_FROM="Warranty Tracker <your-gmail-address@gmail.com>"
```

### Supabase Auth URLs

In Supabase Authentication -> URL Configuration, set:

```text
Site URL: https://your-vercel-app.vercel.app
Redirect URLs:
https://your-vercel-app.vercel.app
https://your-vercel-app.vercel.app/reset-password
```

## Build Checks

```bash
npm run build
npm --prefix backend run build
```
