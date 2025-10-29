# SL Photography

An interactive photography portfolio with a JSON-backed gallery, an authenticated admin dashboard, and an Express backend.

## Features

- **Persistent photo catalog** stored in [`data/photos.json`](data/photos.json) with filename, title, description, and `displayOrder` metadata.
- **Express backend** (`server/index.js`) with authenticated CRUD endpoints and drag-and-drop reordering support.
- **Admin dashboard** (`admin/index.html`) for uploading, editing, deleting, and reordering photos using the backend API.
- **Dynamic public gallery** that fetches data from the backend (`assets/js/gallery.js`) and renders the grid in the stored order.

## Getting started

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment variables**
   - Copy `.env.example` to `.env`.
   - Replace the default `ADMIN_USERNAME` and `ADMIN_PASSWORD` values with secure credentials before exposing the app publicly.
   - Optionally adjust `PORT` (defaults to `4000`).

3. **Start the backend**
   ```bash
   npm start
   ```

   The server will:
   - Serve the public site and admin dashboard.
   - Expose the REST API under `/api`.
   - Save all photo changes back to `data/photos.json`.

4. **Open the site**
   - Public gallery: `http://localhost:4000/`
   - Admin dashboard: `http://localhost:4000/admin/`

## API overview

All endpoints (except `GET /api/photos`) require a Bearer token obtained via `POST /api/login` with the admin credentials.

| Method | Path | Description |
| ------ | ---- | ----------- |
| `POST` | `/api/login` | Authenticate with `username` and `password`, receive a token. |
| `GET` | `/api/photos` | Public list of photos ordered by `displayOrder`. |
| `POST` | `/api/photos` | Create a new photo (multipart form, supports file upload or existing filename). |
| `PATCH` | `/api/photos/:id` | Update metadata or replace the image for a photo. |
| `DELETE` | `/api/photos/:id` | Remove a photo entry. |
| `POST` | `/api/photos/reorder` | Reorder photos by passing an ordered array of photo IDs. |

## Security notes

- Do **not** commit your `.env` file with production credentials.
- Always change the default credentials shipped with this repository before deploying.
- Consider serving the admin dashboard over HTTPS and placing the backend behind a reverse proxy with additional rate limiting for production deployments.

## Data backups

The gallery data lives entirely in [`data/photos.json`](data/photos.json). Back up this file regularly to preserve photo metadata and ordering.
