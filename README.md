# Mentor Poster Studio — Hacktoberfest 2026

A Vite + React app for mentors to personalize the supplied square poster artwork. The original artwork is used as the fixed base image so its color palette, event graphics, sponsor logos, event title, and event information stay in place. The app replaces only the portrait and the three profile-card fields (name, role/title, company) and exports a 1254 × 1254 PNG locally in the browser.

## Run locally

1. Extract the ZIP and open this folder in VS Code.
2. Open **Terminal → New Terminal**.
3. Run:

   ```bash
   npm install
   npm run dev
   ```

4. Open the local URL Vite prints (usually `http://localhost:5173`).

## Build and deploy to Vercel

```bash
npm run build
```

Import the GitHub repository into Vercel. Framework preset: **Vite**; Build command: `npm run build`; Output directory: `dist`. The included `vercel.json` handles SPA routing.

## Notes

- Photo selection and PNG export happen in the browser; uploaded photos are not sent to a server.
- `public/base-poster.png` is the fixed artwork used as the background. Keep its filename unchanged unless you also update `src/main.jsx`.
- Editable fields are intentionally limited to the profile card so event artwork and schedule remain faithful to the supplied reference.


### Portrait overlap fix
The uploaded portrait overlay starts higher so it fully covers the template model's hair. This prevents the original portrait from showing behind the mentor's uploaded photo. The profile card and all event artwork remain in the base artwork.


### Version 4 — blank default portrait
On initial load, the original template person's portrait is covered with a plain sage-green placeholder. Once a mentor uploads a photo, it appears in that same frame. The event artwork, logos, typography, background and profile card remain in place.
