# Digital Warranty Tracker

This is a full-stack web application which allows users to register, manage owned products, upload warranty documents, track warranty expiration dates, record maintenance history, and receive reminders.

## Core Frontend Service

- **React**
- **TypeScript**
- **Vite**

## Core Backend Service

- **NodeJs**
- **TypeScript**

## Framework

- **NestJs**

## Database

- **Supabase PostgreSQL**

## Authentication

- **Supabase Auth**

## Storage

- **Supabase Storage**

## Host

- **Vercel**
- **Render**

## Services

- **Supabase**
- **Resend**
- **Swagger**

## Main Features

- User registration, login, logout, and password reset.
- Product creation, editing, deletion, search, filter, sort, and pagination.
- Automatic warranty end-date and warranty status calculation.
- Dashboard with product, value, category, and warranty analytics.
- Receipt, warranty certificate, and manual upload.
- Maintenance history with service provider, cost, date, and description.
- In-app notifications for warranty and maintenance reminders.
- Email reminders using Resend.
- Notification settings and profile settings.
- CSV product export.
- Swagger API documentation.

## Project Structure

- **`backend/`**: Contains NestJs backend application.
- **`backend/src/analytics/`**: Handles dashboard analytics endpoints.
- **`backend/src/auth/`**: Contains Supabase authentication guard and current user decorator.
- **`backend/src/common/`**: Contains shared backend warranty calculation logic.
- **`backend/src/export/`**: Handles CSV export functionality.
- **`backend/src/notifications/`**: Handles in-app notifications, scheduled checks, cleanup, and email reminders.
- **`backend/src/supabase/`**: Contains Supabase service configuration for backend access.
- **`src/app/`**: Contains frontend application setup, routes, layouts, and shared app components.
- **`src/features/auth/`**: Handles login, registration, forgot password, reset password, and authentication context.
- **`src/features/dashboard/`**: Handles dashboard page, statistics, charts, and expiring soon table.
- **`src/features/notifications/`**: Handles notification list and read/unread behavior.
- **`src/features/products/`**: Handles product pages, forms, documents, warranty details, and maintenance history.
- **`src/features/settings/`**: Handles profile, password, security, and notification settings.
- **`src/shared/`**: Contains shared API client, hooks, utilities, constants, and reusable types.
- **`supabase/`**: Contains SQL schema and database migration files.
- **`public/`**: Contains public static assets such as SEO files and social preview image.
- **`main.tsx`**: Frontend entry point.

## Getting Started

1. **Clone the Repository:**

    ```bash
    git clone https://github.com/NikaPanchulidze/Digital-warranty-tracker.git
    ```

2. **Navigate to the Project Directory:**

    ```bash
    cd Digital-warranty-tracker
    ```

3. **Install frontend dependencies:**

    ```bash
    npm install
    ```

4. **Install backend dependencies:**

    ```bash
    cd backend
    npm install
    cd ..
    ```

5. **Create `.env.local` file in the project root:**

    ```env
    VITE_SUPABASE_URL=https://your-project.supabase.co
    VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
    VITE_API_URL=http://localhost:4000
    ```

6. **Create `backend/.env` file:**

    ```env
    PORT=4000
    FRONTEND_URL=http://localhost:5173
    SUPABASE_URL=https://your-project.supabase.co
    SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
    RESEND_API_KEY=your-resend-api-key
    EMAIL_FROM="Warranty Tracker <notifications@yourdomain.com>"
    ```

7. **Set up Supabase database:**

    Open Supabase SQL Editor and run:

    ```text
    supabase/schema.sql
    ```

8. **Start backend:**

    ```bash
    npm --prefix backend run start:dev
    ```

9. **Start frontend:**

    ```bash
    npm run dev
    ```

## URL

`https://www.warrantytracker.website/`

## Backend URL

`https://digital-warranty-backend.onrender.com/`

## Documentation

**Open Swagger API Documentation:**

`https://digital-warranty-backend.onrender.com/docs`

## Usage

After running the application, register a new account or log in with an existing account. Then add products, upload documents, check warranty status on the dashboard, add maintenance records, and review generated notifications.

## Demo Flow

1. Register or log in.
2. Add a product with warranty information.
3. Open the dashboard and check warranty analytics.
4. Upload a receipt or warranty document.
5. Add a maintenance record.
6. Create or update a product near expiration and check notifications.
7. Mark notifications as read.
8. Export products as CSV.
9. Open Swagger documentation.

## Build Checks

```bash
npm run build
npm --prefix backend run build
```

## Deployment

### Frontend on Vercel

```text
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

### Backend on Render

```text
Runtime: Node
Root Directory: backend
Build Command: npm install && npm run build
Start Command: npm run start
```

## Attention

Make sure all production environment variables are configured on Vercel, Render, and Supabase before deployment. Supabase redirect URLs must include the production domain and reset password route.
