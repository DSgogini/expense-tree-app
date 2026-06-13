# Expense Tree App

This repository is a React + TypeScript + Vite expense tracker with Firebase Authentication, Firestore persistence, and Tailwind CSS styling.

## Project overview

- Vite frontend with React + TypeScript
- Firebase Authentication via Google sign-in
- Firestore persistence for expenses, categories, and user profiles
- Environment-specific Firebase config via Vite env files
- Firebase Hosting deployment configured for a single-page app

## Prerequisites

- Node.js 20+ installed
- npm installed
- Firebase CLI installed globally or available via `npx`:
  - `npm install -g firebase-tools`

## Install dependencies

```bash
npm install
```

## Environment configuration

Copy the example env file and fill in your Firebase values:

```bash
cp .env.example .env.development
cp .env.example .env.production
```

Then update values in:

- `.env.development` for local development
- `.env.production` for production builds

### Required env variables

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_DATABASE_URL`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_MEASUREMENT_ID`

The app loads these values from `src/firebase.ts` using `import.meta.env`.

## Local development

Start the Vite dev server:

```bash
npm run dev
```

This uses the development environment file and hot module replacement.

## Build

Build the production app into `dist`:

```bash
npm run build
```

The build command runs:

- `tsc -b`
- `vite build`

## Preview production build

Use the Vite preview server to verify the production build locally:

```bash
npm run preview
```

## Firebase Hosting

This app includes Firebase Hosting configuration and deploy scripts.

### Config files

- `firebase.json` — hosting setup for `dist` and SPA rewrites
- `.firebaserc` — Firebase project aliases

### Deploy commands

Deploy to the default Firebase project:

```bash
npm run deploy
```

Deploy explicitly to production:

```bash
npm run deploy:prod
```

Deploy explicitly to development:

```bash
npm run deploy:dev
```

### Manual Firebase CLI deploy

If you prefer the CLI directly:

```bash
firebase deploy --only hosting
```

or

```bash
firebase deploy --only hosting --project expense-tree-prod
```

## Firebase project setup

1. Create Firebase projects for development and production.
2. Enable Firestore and Firebase Authentication (Google provider).
3. Add web apps and copy the Firebase config values into `.env.development` and `.env.production`.
4. Configure Firestore rules to require authenticated access.

### Recommended Firestore rules

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /expenses/{expenseId} {
      allow read, write: if request.auth != null && request.auth.uid == request.resource.data.createdBy;
    }

    match /categories/{categoryId} {
      allow read: if request.auth != null;
      allow create, update, delete: if request.auth != null && request.auth.uid == request.resource.data.createdBy;
    }

    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Project scripts

- `npm run dev` — run development server
- `npm run build` — build production files
- `npm run preview` — preview production build locally
- `npm run lint` — run ESLint
- `npm run deploy` — deploy hosting to default Firebase project
- `npm run deploy:prod` — deploy hosting to production project
- `npm run deploy:dev` — deploy hosting to development project

## Notes

- Keep `.env.development` and `.env.production` out of version control.
- Use `.env.example` as the source of truth for required env keys.
- If you change Firebase project IDs, update `.firebaserc` accordingly.

## Useful file references

- `src/firebase.ts` — Firebase initialization
- `src/application/auth/useAuthApplication.ts` — auth state management
- `src/application/expense/useExpenseApplication.ts` — expense/category save logic
- `src/application/user/useUserApplication.ts` — user profile sync and lookup
- `firebase.json` — hosting config
- `.firebaserc` — Firebase project aliases
