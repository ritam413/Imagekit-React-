# AGENTS.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

**Picxy** — A full-stack image/video media platform built with React + Express. Core feature is AI-powered image transformation via the [ImageKit](https://imagekit.io) CDN. Users can upload media, apply transformations (AI, crop, effects), and manage their library from a dashboard.

## Commands

All scripts are run from the **project root** unless noted otherwise.

### Backend

```bash
# Development (nodemon + dotenv auto-loaded)
npm run server

# Production
npm start
```

### Frontend

Run from the `frontend/` directory:

```bash
npm run dev        # Vite dev server at http://localhost:5173
npm run build      # Production build
npm run lint       # ESLint
npm run preview    # Preview production build
```

Or from the root:

```bash
npm run dev        # Runs `cd frontend && npm run dev`
```

### No test suite is configured — `npm test` exits with an error.

## Environment Variables

### `backend/.env`

| Variable | Purpose |
|---|---|
| `PORT` | Express server port (e.g. `8000`) |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret for signing/verifying JWTs |
| `IMAGEKIT_PUBLIC_KEY` | ImageKit public API key |
| `IMAGEKIT_PRIVATE_KEY` | ImageKit private API key (used for signed URLs and SDK auth) |
| `PUBLIC_URL_ENDPOINT` | ImageKit delivery URL endpoint (e.g. `https://ik.imagekit.io/yourname`) |
| `URL_ENDPOINT` | Same as above; used directly in `buildSrc()` calls in `image.controller.js` |
| `NODE_ENV` | Set to `production` to switch multer temp dir to `os.tmpdir()` |

### `frontend/.env`

| Variable | Purpose |
|---|---|
| `VITE_BACKEND_URL` | Backend base URL. Defaults to `http://localhost:8000/` in dev |

## Architecture

### Monorepo Layout

```
root/
  package.json      ← convenience scripts only; backend deps also listed here
  backend/          ← Express API
  frontend/         ← React + Vite SPA
```

The root `package.json` is the backend manifest (name: `"backend"`) but also contains frontend dev scripts for convenience.

### Backend (`backend/`)

Entry: `server.js` → loads dotenv → connects MongoDB → starts Express (`app.js`).

**Route structure** (all prefixed with `/api`):

| Prefix | Router file | What it handles |
|---|---|---|
| `/api/auth/` | `routes/userAuth.routes.js` | login, signup, logout, reset-password |
| `/api/image/` | `routes/imageEditRoute.js` | upload, AI transform, crop/resize, effects, CRUD |
| `/api/dashboard/` | `routes/dashboard.Route.js` | per-user media listing, bulk upload, visibility toggle |
| `/api/video/` | `routes/videoEditRoute .js` | video transformations, CRUD (note: filename has a trailing space) |

**Auth flow**: JWT is set as an HTTP-only cookie on login/signup. `protectRoute` middleware verifies the cookie token, looks up the user in MongoDB, and attaches `req.user` to the request.

**ImageKit transformation pattern**: Transformations are **not re-uploads** — they are URL-parameter strings built server-side using `client.helper.buildSrc()` from `@imagekit/nodejs`. The resulting URL is returned to the frontend and optionally saved in `Image.transformedImages[]`.

**Signed URLs**: `utils/urlSigned.js` generates time-limited (10-minute) signed URLs using HMAC-SHA1 with the private key. All `GET /api/image/Images` and `GET /api/image/Image` responses return signed URLs instead of raw ImageKit URLs.

**File uploads**: Multer stores files temporarily in `backend/public/temp/` (dev) or `os.tmpdir()` (prod). After uploading to ImageKit via the SDK, the local temp file is deleted with `fs.unlinkSync()`.

**CORS**: Only `http://localhost:5173` (dev) and `https://picxy.netlify.app` (prod) are allowed.

**Rate limiters** (`middleware/rateLimiter.js`):
- `authlimiter`: 5 req / 15 min — applied to auth routes
- `apilimiter`: 10 req / 15 min — applied to AI transformation routes

### Frontend (`frontend/src/`)

**Routing** (`App.jsx`):

| Path | Page |
|---|---|
| `/`, `/login` | `LoginPage` |
| `/signup` | `SignUpPage` |
| `/forgot-password` | `ForgotPasswordPage` |
| `/app` | `HeroPage` (public gallery) |
| `/user` | `UserDashboard` |
| `/edit`, `/edit/:url` | `EditPage` |

`EditPage` redirects to `/login` if `useUserStore` has no user. The `:url` param carries a URL-encoded image URL that seeds the active image.

**State management** (Zustand, `src/zustand/`):

| Store | Persisted | Purpose |
|---|---|---|
| `user.store.js` | ✅ (`localStorage`) | Logged-in user object |
| `image.store.js` | ❌ | Uploaded images list, active image, per-image transformation history |
| `editpage.store.js` | ❌ | Edit page UI state: active panel (`"ai"` default), crop coords |
| `heroFilter.store.js` | ❌ | Active filter on the public gallery (`"all"` default) |

**API client** (`utils/axiosInstance.js`): Axios instance with `baseURL` pointing to backend, `withCredentials: true` (sends cookies), and a global response interceptor that warns on 401/500.

**Edit page layout** (`Pages/EditPage.jsx`):
`LeftToolbar` → panel switcher → `RightPanel` renders one of: `AITools`, `CropTools`, `EnhancementTools`.  
`Canvas` (fabric.js) renders the active image.  
`BottomGallery` shows uploaded images; `TransformationThumbnails` shows the transformation history for the active image.

**Fabric.js canvas** helpers live in `utils/fabricjsBackend.js` and `filters/`.

### Key Data Models

**`Image`** (`models/image.model.js`): `user` ref, `originalUrl`, `transformedImages[]` (url + metadata), `isPublic` (default `false`), `tags`, `categories`.

**`User`** (`models/user.model.js`): `username`, `email`, `password` (bcrypt hashed).

**`Dashboard`** (`models/dashboard.model.js`): `user` ref, `media[]`, counters, `recentUploads[]`, `favoriteMedia[]`. (Note: `mongoose` import is missing from this file — it needs to be added before use.)

### ImageKit AI Transformation Keys

These string values are passed as the `aiTransformation` field to `POST /api/image/AItransformtaion`:

```
BackgroundRemove   → e-removedotbg
ChangeBackground   → e-changebg
EditImage          → e-edit
GenerativeFill     → bg-genfill
DropShadow         → e-dropshadow
Retouch            → e-retouch
Upscale            → e-upscale
GenerateImageViaText → text-prompt
GenerateVariations → e-variation
ObjectAwareCropping → e-objectcrop
FaceCrop           → e-facecrop
SmartCrop          → e-smartcrop
```
