# Canman E-Commerce Web Application (canman.github.io)

Full-featured e-commerce platform for **Canman OÜ** - Tallinn computer shop selling new and used computers, notebooks, parts, peripherals, and providing professional IT repair services.

---

## 🌟 Key Features

- **Clean Aesthetic**: Modeled after `canman.ee` reference layout with crisp white background, signature blue `#0e4da4`, left 280px collapsible category sidebar, and 4-column product grid.
- **3-Level Collapsible Estonian Categories**:
  - `Arvutid` (Desktop PC, Notebooks, All-in-One)
  - `Arvutid kasutatud` (Desktop used, Notebooks used, Workstations used)
  - `Apple arvutid` (iMac, MacBook Air, MacBook Pro, Mac Mini)
  - `Lisaseadmed` (Keyboards, Mice, Headsets, Webcams, Speakers, USB sticks)
  - `Monitorid` (19-22", 24", 27"+, 4K, Used)
  - `Printerid` (Laser, Inkjet, MFP, Used)
  - `Arvutiosad` (Protsessorid, Mälu, Videokaardid, SSD, HDD, Emaplaadid, Korpused, Jahutid)
  - `Toiteseadmed` (UPS, Toiteplokid, Sülearvuti akud, Patareid)
- **40 Realistic Mock Products**: Pre-populated catalog with specs (e.g., `i5-4590 8GB 500GB W10P`), condition tags (`Uus` vs `Kasutatud`), stock levels, and Tallinn computer shop pricing (€40 to €900).
- **Search & Filters**: Real-time keyword search, price range filter slider (€40 - €900), brand selector, condition toggle, and sorting options.
- **Shopping Cart & Checkout**:
  - `localStorage` cart persistence.
  - **Payment Options**: `[ ] Arve (Invoice)` (Generates printable proforma invoice PDF) and `[ ] Sularahas (Cash)` (Store pickup).
  - **Delivery Options**: `[ ] Paki saatmine (Omniva/DPD €4.90)` and `[ ] Kätte saamine Lille 14, Tallinn 10614 (Free)`.
- **Top Bar & Footer Contact Info**: `IT abi, väljakutsed, remont teenused Tallinnas | Tel. 372 5652062 | Lille 14 Tallinn 10614 | canman.systems@gmail.com`.

---

## 🚀 GitHub Pages Deployment Instructions

### Method 1: Automatic Deployment via GitHub Actions (Recommended)

1. **Create GitHub Repository**:
   Create a repository on GitHub named `canman.github.io` (or push to an existing repository).

2. **Push Code to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit for Canman E-Commerce"
   git branch -M main
   git remote add origin https://github.com/canman/canman.github.io.git
   git push -u origin main
   ```

3. **Enable GitHub Pages**:
   - Go to your repository on GitHub: **Settings** -> **Pages**.
   - Under **Build and deployment** -> **Source**, select **GitHub Actions**.
   - The included workflow file `.github/workflows/deploy.yml` will automatically build and publish your static website every time you push to `main`!

---

### Method 2: Manual Static Export Build

You can also generate the static output locally and deploy manually:

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Build static export**:
   ```bash
   npm run build
   ```
   This will generate a static site in the `./out` directory.

3. **Deploy `./out` folder**:
   Upload the contents of the `./out` directory to your web server or GitHub Pages `gh-pages` branch.

---

## 🛠 Local Development

To run the application locally on your machine:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 📍 Store Information

- **Company**: Canman OÜ
- **Address**: Lille 14, Tallinn 10614, Estonia
- **Phone**: +372 5652062
- **Email**: canman.systems@gmail.com
- **Services**: Computer sales, repairs, OS installation, hardware upgrades, and technician visits in Tallinn.
"fix $(Get-Date)" 
