# Rachel Mishra — Portfolio

A single-page portfolio site: About, Achievements, Education, Contact.
Plain HTML/CSS/JS — no build step, no dependencies to install.

## Files
- `index.html` — page structure and content
- `style.css` — all styling
- `script.js` — nav menu, contact form, small interactions

## Running it in Antigravity
1. Unzip/open this `portfolio` folder as a project in Antigravity.
2. Open `index.html`.
3. Use Antigravity's built-in preview / "Open with Live Server" (or right-click
   `index.html` → **Open in Browser** / **Preview**) to view it live.
   - If there's no built-in preview button, you can also just double-click
     `index.html` in your file explorer to open it directly in a browser —
     it will work the same way, since there's no server required.
4. Edit the marked `<!-- EDIT ME -->` spots in `index.html` with your real
   achievements, earlier schooling, and social links, then save — the
   preview will refresh automatically.

## Things you'll probably want to personalize
- **Achievements section**: replace the 4 placeholder cards with your real
  awards, projects, and recognitions.
- **Education**: add your school before SID (board, year).
- **Socials**: swap the `#` links for your real Behance/LinkedIn/Instagram.
- **Contact form**: it currently opens the visitor's email app with a
  pre-filled message to you (works with zero setup). If you'd rather have
  messages land straight in your inbox, sign up free at formspree.io and
  point the form at your endpoint — instructions are in `script.js`.

## Deploying it for free (optional)
Once you're happy with it, you can put it online for free with:
- **GitHub Pages** — push this folder to a repo, enable Pages in settings.
- **Netlify / Vercel** — drag-and-drop the folder onto their dashboard.
