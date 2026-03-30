## Picxy – Image & Video Transformation Platform

Picxy is a full‑stack media platform built with **React + Vite** on the frontend and **Express + MongoDB** on the backend.  
It integrates with **ImageKit** to provide AI‑powered image transformation, cropping, resizing, and enhancement via CDN URLs instead of re‑uploading transformed assets.

The project is structured as a small monorepo:

- **backend**: Express API, authentication, media management, ImageKit integration
- **frontend**: React single‑page application (SPA) for login, dashboard, editing, and public gallery

---

## Introduction

Picxy allows users to:

- **Authenticate securely** with JWTs stored in HTTP‑only cookies.
- **Upload images and videos** which are stored in ImageKit and tracked in MongoDB.
- **Apply AI transformations** (background removal, generative fill, upscaling, etc.) via ImageKit transformation strings.
- **Crop, resize, and enhance media** using URL‑driven parameters (no re‑encoding on the server).
- **Manage a personal media library** through a dashboard with visibility controls and metadata.
- **Explore a public gallery** of media marked as public by users.

Transformations are applied by generating **ImageKit URLs with transformation parameters** using the ImageKit Node SDK; the backend returns these URLs to the frontend and optionally persists them as derived media.

---

## Installation Instructions

### Prerequisites

- **Node.js** (LTS recommended)
- **npm** (comes with Node)
- **MongoDB** instance (local or hosted, e.g. Atlas)
- **ImageKit account** with a configured URL endpoint

### 1. Clone the repository

```bash
git clone <this-repo-url>
cd "Imagekit(React)"
```

### 2. Install backend dependencies (root)

From the project root:

```bash
npm install
```

The root `package.json` acts as the backend manifest and also exposes convenience scripts for the frontend.

### 3. Install frontend dependencies

```bash
cd frontend
npm install
cd ..
```

### 4. Configure environment variables

Create `backend/.env`:

```bash
PORT=8000
MONGO_URI=mongodb://localhost:27017/picxy
JWT_SECRET=replace-with-strong-secret
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
PUBLIC_URL_ENDPOINT=https://ik.imagekit.io/yourname
URL_ENDPOINT=https://ik.imagekit.io/yourname
NODE_ENV=development
```

Create `frontend/.env`:

```bash
VITE_BACKEND_URL=http://localhost:8000/
```

### 5. Run the development servers

From the **project root** (runs the backend and lets you start frontend separately when needed):

```bash
# Backend (Express + MongoDB)
npm run server
```

From the **frontend** directory:

```bash
cd frontend
npm run dev   # Vite dev server at http://localhost:5173
```

For production builds:

```bash
cd frontend
npm run build
npm run preview
```

> **Note**: No automated test suite is configured. `npm test` will exit with an error.

---

## Usage Guidelines

### Application layout

- **Backend (`backend/`)**
  - Entry point: `server.js` → loads `.env`, connects MongoDB, mounts Express app from `app.js`.
  - All routes are prefixed with `/api`.
  - CORS allows `http://localhost:5173` (dev) and `https://picxy.netlify.app` (prod).
  - Rate limiters protect auth and transformation endpoints.

- **Frontend (`frontend/`)**
  - SPA built with **React + Vite**.
  - Central router defined in `App.jsx` with the following main routes:
    - `/`, `/login` → login page
    - `/signup` → signup
    - `/forgot-password` → reset‑password flow
    - `/app` → public gallery (Hero page)
    - `/user` → user dashboard
    - `/edit`, `/edit/:url` → editor page

### Authentication and session handling

- Users sign up and log in via `/api/auth/*` endpoints.
- On successful login/signup, the backend issues a **JWT** stored in an **HTTP‑only cookie**.
- A `protectRoute` middleware validates the cookie, looks up the user, and attaches `req.user` to the request.
- Protected routes (dashboard, image, video operations) require a valid cookie and will return `401` if absent/invalid.

### Media upload and transformations

- Uploads are handled via **multer**:
  - In development, files are temporarily stored under `backend/public/temp/`.
  - In production (`NODE_ENV=production`), multer uses the OS temp directory.
- Once uploaded, media is immediately pushed to **ImageKit** using the Node SDK.
- After upload, the local temporary file is removed.
- Transformations do **not** create new files on the server; instead, the backend builds **ImageKit transformation URLs** and returns them.

### State management (frontend)

Frontend state uses **Zustand** stores (`frontend/src/zustand/`):

- `user.store.js` (persisted via `localStorage`): logged‑in user object.
- `image.store.js`: uploaded images, active image, and per‑image transformation history.
- `editpage.store.js`: editor UI state (active panel such as `"ai"`, crop coordinates).
- `heroFilter.store.js`: filter for the public gallery (e.g. `"all"`).

---

## API Reference

This section documents the main route groups and notable transformation keys. Route signatures may omit some fields for brevity; consult the actual controllers for full details.

### Authentication (`/api/auth/`)

- **POST** `/api/auth/signup`
  - **Body**: `username`, `email`, `password`
  - **Response**: user object + JWT cookie

- **POST** `/api/auth/login`
  - **Body**: `email`, `password`
  - **Response**: user object + JWT cookie

- **POST** `/api/auth/logout`
  - Clears auth cookie.

- **POST** `/api/auth/reset-password`
  - Initiates password reset flow using username/email.
  - The frontend uses a dedicated reset page which consumes the backend response to finalize the update.

All auth endpoints are protected by a rate limiter (`authlimiter`: 5 req / 15 min per IP).

### Image operations (`/api/image/`)

Core responsibilities:

- Upload original images to ImageKit.
- Return signed URLs and store metadata in MongoDB.
- Apply AI, resize/crop, and enhancement transformations by generating ImageKit URLs.

#### AI transformations (`/api/image/AItransformtaion`)

The backend maintains a mapping of **AI transformation keys** sent from the client:

```text
BackgroundRemove        → e-removedotbg
ChangeBackground        → e-changebg
EditImage               → e-edit
GenerativeFill          → bg-genfill
DropShadow              → e-dropshadow
Retouch                 → e-retouch
Upscale                 → e-upscale
GenerateImageViaText    → text-prompt
GenerateVariations      → e-variation
ObjectAwareCropping     → e-objectcrop
FaceCrop                → e-facecrop
SmartCrop               → e-smartcrop
```

The endpoint accepts the original image reference plus the desired `aiTransformation` key, and returns a transformed ImageKit URL. These routes are subject to an API rate limiter (`apilimiter`: 10 req / 15 min).

#### Resize & crop transformations (`/api/image/resize_crop`)

Typical transformation parameters (mapped to ImageKit query parameters):

```text
width                         → w
height                        → h
aspectRatio                   → ar
crop strategy                 → c / cm
padResizeCropStrategy         → cm-pad_resize
forcedCropStrategy            → c-force
maxSizeCroppingStrategy       → c-at_max
maxSizeEnlargeCroppingStrategy→ c-at_max_enlarge
minSizeCroppingStrategy       → c-at_least
maintainRatioCropStrategy     → c-maintain_ratio
extractCropStrategy           → cm-extract
padExtractCropStrategy        → cm-pad_extract
focus                         → fo
autoSmartCropping             → fo-auto
faceCropping                  → fo-face
objectAwareCropping           → fo-object_name
zoom                          → z
dpr                           → dpr
```

The backend translates these options to the ImageKit transformation array when calling `helper.buildSrc()` and returns the resulting URL.

#### Effects & enhancements (`/api/image/effect_enhancements`)

Supported enhancements include:

```text
Contrast stretch  → e-contrast
Sharpen           → e-sharpen
Unsharp mask      → e-usm
Shadow            → e-shadow
Gradient          → e-gradient
Grayscale         → e-grayscale
Blur              → bl
Trim edges        → t
Border            → b
Rotate            → rt
Flip              → fl
Radius            → r
Background        → bg
Opacity           → o
```

Clients send the desired set of enhancements and associated scalar values (e.g. radius, opacity). The backend constructs the ImageKit transformation string and returns the final URL.

#### Image retrieval

- **GET** `/api/image/Images`
  - Returns a list of images for the authenticated user (or public gallery), including **signed URLs** that expire after a short period (default 10 minutes).

- **GET** `/api/image/Image/:id`
  - Returns a single image with its transformation history and a signed URL.

- **PATCH/DELETE** routes
  - Allow editing image metadata and deleting media records where implemented.

### Dashboard (`/api/dashboard/`)

Dashboard routes provide:

- Paginated, per‑user media listings.
- Aggregated counters (e.g. total images, recent uploads).
- Bulk visibility updates and favorites management where applicable.

The underlying `Dashboard` model stores a `user` reference, `media[]`, counters, and favorites. Ensure `mongoose` is imported in this model when you modify it.

### Video operations (`/api/video/`)

Video routes mirror the image routes conceptually:

- Upload and store video references with ImageKit.
- Generate transformation URLs for basic operations (e.g., resize, format, thumbnail).
- CRUD operations for video metadata.

Check `routes/videoEditRoute .js` (note the space in the filename) for exact endpoints.

---

## Contribution Guidelines

### Development workflow

- **Branching**: Create feature branches from `main`/`develop` using descriptive names (e.g. `feat/vignette`, `fix/auth-timeout`).
- **Commits**: Write concise, imperative commit messages (e.g. `add vignette filter`, `fix ImageKit URL signing`).
- **Code style**:
  - Use the configured ESLint rules in the frontend (`npm run lint`).
  - Prefer consistent, modern JavaScript/React patterns (hooks, functional components).

### Adding backend features

- Place new routes under the appropriate router (`routes/*.routes.js`).
- Keep controllers focused; offload shared logic to `utils/` where appropriate.
- Ensure new protected routes use the `protectRoute` middleware.
- When integrating with ImageKit:
  - Use the existing client configuration and `helper.buildSrc()` helpers.
  - Prefer transformation URLs over creating new physical assets whenever possible.

### Adding frontend features

- Keep page‑level components under `frontend/src/Pages/`.
- Extract reusable UI into `frontend/src/components/`.
- Put cross‑page state into the appropriate Zustand store or create a new one under `frontend/src/zustand/`.
- Interact with the backend through the shared Axios instance in `frontend/src/utils/axiosInstance.js` to ensure consistent base URL and credentials.

### Reporting issues and requesting changes

- When filing issues, include:
  - **Environment** (OS, Node version, browser).
  - **Steps to reproduce**.
  - **Expected vs. actual behavior**.
  - Relevant logs or network traces if available.

Pull requests should:

- Be scoped to a single logical change.
- Include a clear description of the motivation and approach.
- Update or extend this documentation if the external behavior changes.

---

## License

If a license file is not yet present, consider adding one (e.g. MIT) and documenting its terms here.