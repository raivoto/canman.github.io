import { Product } from '../types';

// Helper function to create clean inline SVG Data URLs for reliable rendering without external image dependencies
const createSvgImage = (bg: string, iconType: string, label: string, accentColor = '#0e4da4') => {
  let graphicSvg = '';

  switch (iconType) {
    case 'desktop':
      graphicSvg = `
        <rect x="130" y="50" width="140" height="200" rx="12" fill="#1e293b" stroke="#334155" stroke-width="4"/>
        <circle cx="200" cy="90" r="24" fill="none" stroke="${accentColor}" stroke-width="6"/>
        <circle cx="200" cy="150" r="24" fill="none" stroke="${accentColor}" stroke-width="6"/>
        <rect x="180" y="210" width="40" height="8" rx="4" fill="#38bdf8"/>
        <path d="M190 70 L210 110 M210 70 L190 110" stroke="${accentColor}" stroke-width="3"/>
      `;
      break;
    case 'notebook':
      graphicSvg = `
        <rect x="70" y="60" width="260" height="150" rx="10" fill="#0f172a" stroke="#334155" stroke-width="4"/>
        <rect x="80" y="70" width="240" height="130" rx="6" fill="#1e293b"/>
        <rect x="100" y="90" width="200" height="90" rx="4" fill="${accentColor}" opacity="0.8"/>
        <path d="M40 215 L360 215 L340 230 L60 230 Z" fill="#94a3b8" stroke="#64748b" stroke-width="2"/>
        <rect x="170" y="218" width="60" height="4" rx="2" fill="#cbd5e1"/>
      `;
      break;
    case 'apple':
      graphicSvg = `
        <rect x="70" y="55" width="260" height="155" rx="12" fill="#e2e8f0" stroke="#cbd5e1" stroke-width="3"/>
        <rect x="78" y="63" width="244" height="139" rx="8" fill="#0f172a"/>
        <path d="M200 110 C195 110 190 115 190 125 C190 135 195 140 200 140 C210 115 205 110 200 110 Z" fill="#ffffff" opacity="0.9"/>
        <path d="M30 215 L370 215 L350 228 L50 228 Z" fill="#cbd5e1" stroke="#94a3b8" stroke-width="2"/>
        <rect x="175" y="217" width="50" height="4" rx="2" fill="#64748b"/>
      `;
      break;
    case 'monitor':
      graphicSvg = `
        <rect x="50" y="40" width="300" height="170" rx="8" fill="#0f172a" stroke="#334155" stroke-width="4"/>
        <rect x="60" y="50" width="280" height="150" rx="4" fill="#1e293b"/>
        <rect x="75" y="65" width="250" height="120" fill="${accentColor}" opacity="0.75"/>
        <rect x="180" y="210" width="40" height="35" fill="#64748b"/>
        <path d="M140 245 L260 245 L240 255 L160 255 Z" fill="#475569"/>
      `;
      break;
    case 'printer':
      graphicSvg = `
        <rect x="90" y="100" width="220" height="110" rx="10" fill="#f8fafc" stroke="#cbd5e1" stroke-width="4"/>
        <rect x="120" y="40" width="160" height="70" rx="4" fill="#e2e8f0" stroke="#94a3b8" stroke-width="2"/>
        <rect x="110" y="170" width="180" height="60" rx="4" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>
        <circle cx="280" cy="130" r="8" fill="#22c55e"/>
        <rect x="240" y="130" width="20" height="4" rx="2" fill="#94a3b8"/>
      `;
      break;
    case 'component':
      graphicSvg = `
        <rect x="110" y="60" width="180" height="180" rx="16" fill="#0f172a" stroke="#334155" stroke-width="4"/>
        <rect x="135" y="85" width="130" height="130" rx="8" fill="${accentColor}"/>
        <text x="200" y="160" text-anchor="middle" fill="#ffffff" font-family="sans-serif" font-weight="bold" font-size="28">${label}</text>
        <circle cx="120" cy="70" r="4" fill="#fbbf24"/>
        <circle cx="280" cy="70" r="4" fill="#fbbf24"/>
        <circle cx="120" cy="230" r="4" fill="#fbbf24"/>
        <circle cx="280" cy="230" r="4" fill="#fbbf24"/>
      `;
      break;
    case 'peripheral':
    default:
      graphicSvg = `
        <rect x="140" y="70" width="120" height="160" rx="50" fill="#1e293b" stroke="#475569" stroke-width="4"/>
        <line x1="200" y1="70" x2="200" y2="130" stroke="#64748b" stroke-width="3"/>
        <rect x="194" y="90" width="12" height="24" rx="6" fill="${accentColor}"/>
      `;
      break;
  }

  const svgRaw = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300">
    <rect width="400" height="300" fill="${bg}"/>
    ${graphicSvg}
    <text x="200" y="278" text-anchor="middle" fill="#64748b" font-family="sans-serif" font-weight="600" font-size="13">${label}</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svgRaw)}`;
};

export const PRODUCTS: Product[] = [
  // 1. Desktop PCs
  {
    id: 'pc-01',
    title: 'Canman Office Pro Tower',
    categoryL1: 'Arvutid',
    categoryL2: 'Desktop PC',
    categoryL3: 'Office',
    price: 349,
    oldPrice: 399,
    condition: 'Uus',
    stock: 'Laos',
    stockCount: 5,
    brand: 'Canman',
    shortSpec: 'i5-10400 16GB 512GB NVMe W11P',
    description: 'Fast and quiet office desktop computer with Intel Core i5 processor, 16GB RAM and speedy NVMe SSD storage. Pre-installed Windows 11 Pro.',
    imageUrl: createSvgImage('#f1f5f9', 'desktop', 'Canman Office Pro'),
    specs: {
      cpu: 'Intel Core i5-10400 (up to 4.3 GHz)',
      ram: '16GB DDR4 3200MHz',
      storage: '512GB M.2 NVMe SSD',
      gpu: 'Intel UHD Graphics 630',
      os: 'Windows 11 Pro Estonian / English',
      warranty: '24 kuud',
    },
    isPopular: true,
  },
  {
    id: 'pc-02',
    title: 'Canman Gamer GTX Edition',
    categoryL1: 'Arvutid',
    categoryL2: 'Desktop PC',
    categoryL3: 'Gaming',
    price: 799,
    oldPrice: 890,
    condition: 'Uus',
    stock: 'Laos',
    stockCount: 3,
    brand: 'Canman',
    shortSpec: 'Ryzen 5 5600 16GB 1TB RTX4060 W11',
    description: 'Powerful gaming desktop for 1080p and 1440p gaming. Features AMD Ryzen 5 5600 and NVIDIA GeForce RTX 4060 8GB.',
    imageUrl: createSvgImage('#0f172a', 'desktop', 'Canman Gaming RTX', '#2563eb'),
    specs: {
      cpu: 'AMD Ryzen 5 5600 (6-core, up to 4.4 GHz)',
      ram: '16GB DDR4 3600MHz Kingston Fury',
      storage: '1TB M.2 PCIe 4.0 NVMe SSD',
      gpu: 'NVIDIA GeForce RTX 4060 8GB',
      os: 'Windows 11 Home',
      warranty: '24 kuud',
    },
    isPopular: true,
  },
  {
    id: 'pc-03',
    title: 'DELL OptiPlex 7020 SFF (Kasutatud)',
    categoryL1: 'Arvutid kasutatud',
    categoryL2: 'Desktop used',
    price: 145,
    oldPrice: 180,
    condition: 'Kasutatud',
    grade: 'A',
    stock: 'Laos',
    stockCount: 8,
    brand: 'DELL',
    shortSpec: 'i5-4590 8GB 500GB HDD W10P',
    description: 'Reliable business desktop DELL OptiPlex 7020 SFF. Thoroughly cleaned, tested, Grade A condition with Windows 10 Pro license.',
    imageUrl: createSvgImage('#f8fafc', 'desktop', 'DELL OptiPlex 7020 SFF', '#d97706'),
    specs: {
      cpu: 'Intel Core i5-4590 3.30GHz',
      ram: '8GB DDR3 1600MHz',
      storage: '500GB SATA HDD 7200 RPM',
      gpu: 'Intel HD Graphics 4600',
      os: 'Windows 10 Pro',
      warranty: '12 kuud',
    },
    isPopular: true,
  },
  {
    id: 'pc-04',
    title: 'Lenovo ThinkCentre M720q Tiny (Kasutatud)',
    categoryL1: 'Arvutid kasutatud',
    categoryL2: 'Desktop used',
    price: 220,
    oldPrice: 260,
    condition: 'Kasutatud',
    grade: 'A',
    stock: 'Viimased eksemplarid',
    stockCount: 2,
    brand: 'Lenovo',
    shortSpec: 'i5-8400T 8GB 256GB SSD W10P',
    description: 'Ultra-compact mini PC for office or home. Mountable behind monitor. Fast NVMe SSD.',
    imageUrl: createSvgImage('#f1f5f9', 'desktop', 'Lenovo ThinkCentre Tiny', '#d97706'),
    specs: {
      cpu: 'Intel Core i5-8400T 6-Core',
      ram: '8GB DDR4',
      storage: '256GB NVMe SSD',
      gpu: 'Intel UHD 630',
      os: 'Windows 10 Pro (Win 11 ready)',
      warranty: '12 kuud',
    },
  },
  {
    id: 'pc-05',
    title: 'HP Z4 G4 Workstation (Kasutatud)',
    categoryL1: 'Arvutid kasutatud',
    categoryL2: 'Workstations used',
    price: 680,
    oldPrice: 850,
    condition: 'Kasutatud',
    grade: 'A',
    stock: 'Laos',
    stockCount: 3,
    brand: 'HP',
    shortSpec: 'Xeon W-2133 32GB 512GB Quadro P2000',
    description: 'Professional workstation for CAD, 3D rendering and video editing. ECC memory support and Quadro graphics.',
    imageUrl: createSvgImage('#f8fafc', 'desktop', 'HP Z4 G4 Workstation', '#d97706'),
    specs: {
      cpu: 'Intel Xeon W-2133 (6C 12T 3.60GHz)',
      ram: '32GB DDR4 ECC Registered',
      storage: '512GB NVMe SSD + 1TB HDD',
      gpu: 'NVIDIA Quadro P2000 5GB',
      os: 'Windows 11 Pro Workstation',
      warranty: '12 kuud',
    },
  },

  // 2. Notebooks
  {
    id: 'nb-01',
    title: 'Lenovo ThinkPad T14 Gen 2 (Kasutatud)',
    categoryL1: 'Arvutid kasutatud',
    categoryL2: 'Notebooks used',
    price: 490,
    oldPrice: 580,
    condition: 'Kasutatud',
    grade: 'A',
    stock: 'Laos',
    stockCount: 4,
    brand: 'Lenovo',
    shortSpec: 'i5-1135G7 16GB 512GB FHD W11P',
    description: 'Top-tier business laptop with magnesium chassis, backlit keyboard, FHD IPS display and high battery life.',
    imageUrl: createSvgImage('#f1f5f9', 'notebook', 'Lenovo ThinkPad T14', '#d97706'),
    specs: {
      cpu: 'Intel Core i5-1135G7',
      ram: '16GB DDR4',
      storage: '512GB NVMe SSD',
      screen: '14" FHD IPS Matte (1920x1080)',
      os: 'Windows 11 Pro',
      warranty: '12 kuud',
    },
    isPopular: true,
  },
  {
    id: 'nb-02',
    title: 'DELL Latitude 5420 Business (Kasutatud)',
    categoryL1: 'Arvutid kasutatud',
    categoryL2: 'Notebooks used',
    price: 420,
    oldPrice: 470,
    condition: 'Kasutatud',
    grade: 'A',
    stock: 'Laos',
    stockCount: 6,
    brand: 'DELL',
    shortSpec: 'i5-1145G7 16GB 256GB FHD W10P',
    description: 'Durable 14-inch enterprise laptop with Thunderbolt 4, smartcard reader and long battery backup.',
    imageUrl: createSvgImage('#f8fafc', 'notebook', 'DELL Latitude 5420', '#d97706'),
    specs: {
      cpu: 'Intel Core i5-1145G7',
      ram: '16GB DDR4',
      storage: '256GB M.2 SSD',
      screen: '14.0" Full HD IPS Display',
      os: 'Windows 10 Pro / Win 11 Pro',
      warranty: '12 kuud',
    },
  },
  {
    id: 'nb-03',
    title: 'HP EliteBook 840 G6 (Kasutatud)',
    categoryL1: 'Arvutid kasutatud',
    categoryL2: 'Notebooks used',
    price: 310,
    oldPrice: 360,
    condition: 'Kasutatud',
    grade: 'A',
    stock: 'Viimased eksemplarid',
    stockCount: 2,
    brand: 'HP',
    shortSpec: 'i5-8265U 8GB 256GB FHD W10P',
    description: 'Sleek aluminum ultra-portable business notebook with Bang & Olufsen audio.',
    imageUrl: createSvgImage('#f1f5f9', 'notebook', 'HP EliteBook 840', '#d97706'),
    specs: {
      cpu: 'Intel Core i5-8265U Quad-Core',
      ram: '8GB DDR4 (Expandable)',
      storage: '256GB NVMe SSD',
      screen: '14" FHD IPS Anti-glare',
      os: 'Windows 10 Pro',
      warranty: '12 kuud',
    },
  },
  {
    id: 'nb-04',
    title: 'Lenovo V15 Gen 4 AMD (Uus)',
    categoryL1: 'Arvutid',
    categoryL2: 'Notebooks',
    categoryL3: 'Lenovo',
    price: 469,
    oldPrice: 520,
    condition: 'Uus',
    stock: 'Laos',
    stockCount: 7,
    brand: 'Lenovo',
    shortSpec: 'Ryzen 5 7520U 16GB 512GB W11',
    description: 'Brand new Lenovo 15.6" laptop for work and university. AMD Ryzen 5 processor and modern full keyboard.',
    imageUrl: createSvgImage('#f8fafc', 'notebook', 'Lenovo V15 Gen 4'),
    specs: {
      cpu: 'AMD Ryzen 5 7520U',
      ram: '16GB LPDDR5',
      storage: '512GB SSD M.2 PCIe',
      screen: '15.6" FHD (1920x1080) TN 250nits',
      os: 'Windows 11 Home',
      warranty: '24 kuud',
    },
  },
  {
    id: 'nb-05',
    title: 'HP Pavilion 15 Gaming (Uus)',
    categoryL1: 'Arvutid',
    categoryL2: 'Notebooks',
    categoryL3: 'HP',
    price: 749,
    oldPrice: 830,
    condition: 'Uus',
    stock: 'Laos',
    stockCount: 3,
    brand: 'HP',
    shortSpec: 'i5-12450H 16GB 512GB RTX3050',
    description: 'Great entry gaming laptop with 144Hz IPS display and NVIDIA RTX 3050 graphics.',
    imageUrl: createSvgImage('#0f172a', 'notebook', 'HP Pavilion Gaming', '#2563eb'),
    specs: {
      cpu: 'Intel Core i5-12450H (8 Cores)',
      ram: '16GB DDR4 3200MHz',
      storage: '512GB NVMe M.2 SSD',
      gpu: 'NVIDIA GeForce RTX 3050 4GB',
      screen: '15.6" FHD 144Hz IPS',
      os: 'Windows 11 Home',
      warranty: '24 kuud',
    },
  },

  // 3. Apple arvutid
  {
    id: 'mac-01',
    title: 'Apple MacBook Air 13 M1 8GB 256GB Space Gray (Uus)',
    categoryL1: 'Apple arvutid',
    categoryL2: 'MacBook Air',
    price: 889,
    oldPrice: 949,
    condition: 'Uus',
    stock: 'Laos',
    stockCount: 4,
    brand: 'Apple',
    shortSpec: 'Apple M1 8-Core 8GB 256GB Retina',
    description: 'Iconic silent fanless laptop with groundbreaking Apple M1 chip. Battery life up to 18 hours.',
    imageUrl: createSvgImage('#f8fafc', 'apple', 'MacBook Air M1'),
    specs: {
      cpu: 'Apple M1 chip (8-core CPU, 7-core GPU)',
      ram: '8GB Unified Memory',
      storage: '256GB SSD',
      screen: '13.3" Retina Display True Tone',
      os: 'macOS Sequoia / Sonoma',
      warranty: '12 kuud',
    },
    isPopular: true,
  },
  {
    id: 'mac-02',
    title: 'Apple MacBook Air 13 i5 8GB 128GB (Kasutatud)',
    categoryL1: 'Apple arvutid',
    categoryL2: 'MacBook Air',
    price: 360,
    oldPrice: 420,
    condition: 'Kasutatud',
    grade: 'A',
    stock: 'Viimased eksemplarid',
    stockCount: 2,
    brand: 'Apple',
    shortSpec: 'Intel i5 8GB 128GB SSD macOS',
    description: 'Lightweight MacBook Air for students and browser tasks. Aluminum chassis, battery status good.',
    imageUrl: createSvgImage('#f1f5f9', 'apple', 'MacBook Air 13', '#d97706'),
    specs: {
      cpu: 'Intel Core i5 1.8GHz Dual-Core',
      ram: '8GB 1600MHz LPDDR3',
      storage: '128GB PCIe SSD',
      screen: '13.3" LED Widescreen',
      os: 'macOS Monterey',
      warranty: '12 kuud',
    },
  },
  {
    id: 'mac-03',
    title: 'Apple Mac Mini M1 8GB 256GB (Kasutatud)',
    categoryL1: 'Apple arvutid',
    categoryL2: 'Mac Mini',
    price: 450,
    oldPrice: 520,
    condition: 'Kasutatud',
    grade: 'A',
    stock: 'Laos',
    stockCount: 3,
    brand: 'Apple',
    shortSpec: 'Apple M1 8-Core 8GB 256GB SSD',
    description: 'Compact desktop Mac with high single-core performance and low power consumption.',
    imageUrl: createSvgImage('#f8fafc', 'desktop', 'Apple Mac Mini M1', '#d97706'),
    specs: {
      cpu: 'Apple M1 8-core CPU',
      ram: '8GB Unified RAM',
      storage: '256GB NVMe SSD',
      gpu: '8-core GPU',
      os: 'macOS',
      warranty: '12 kuud',
    },
  },
  {
    id: 'mac-04',
    title: 'Apple iMac 21.5" Full HD Slim (Kasutatud)',
    categoryL1: 'Apple arvutid',
    categoryL2: 'iMac',
    price: 390,
    oldPrice: 460,
    condition: 'Kasutatud',
    grade: 'A',
    stock: 'Viimased eksemplarid',
    stockCount: 1,
    brand: 'Apple',
    shortSpec: 'i5 2.8GHz 8GB 1TB HDD macOS',
    description: 'Elegant All-in-One computer for home display or reception desks. Clean condition with wireless mouse/kbd.',
    imageUrl: createSvgImage('#f1f5f9', 'monitor', 'Apple iMac 21.5"', '#d97706'),
    specs: {
      cpu: 'Intel Quad-Core i5 2.8GHz',
      ram: '8GB DDR3',
      storage: '1TB SATA Drive',
      screen: '21.5" Full HD IPS Display',
      os: 'macOS High Sierra / Catalina',
      warranty: '12 kuud',
    },
  },

  // 4. Monitorid
  {
    id: 'mon-01',
    title: 'Dell SE2422H 23.8" Full HD (Uus)',
    categoryL1: 'Monitorid',
    categoryL2: '24 inch',
    price: 115,
    oldPrice: 135,
    condition: 'Uus',
    stock: 'Laos',
    stockCount: 10,
    brand: 'DELL',
    shortSpec: '23.8" FHD 75Hz HDMI VGA VA',
    description: 'Clean frameless monitor with anti-glare screen and HDMI input. Ideal for dual monitor setups.',
    imageUrl: createSvgImage('#f8fafc', 'monitor', 'DELL 23.8" Full HD'),
    specs: {
      screen: '23.8" (60.5 cm) Full HD (1920x1080)',
      refreshRate: '75Hz',
      panel: 'VA Anti-Glare',
      inputs: 'HDMI 1.4, VGA',
      warranty: '36 kuud',
    },
    isPopular: true,
  },
  {
    id: 'mon-02',
    title: 'Samsung Odyssey G5 27" QHD 165Hz (Uus)',
    categoryL1: 'Monitorid',
    categoryL2: '27 inch+',
    price: 249,
    oldPrice: 289,
    condition: 'Uus',
    stock: 'Laos',
    stockCount: 4,
    brand: 'Samsung',
    shortSpec: '27" 2560x1440 165Hz 1ms Curved',
    description: 'Curved gaming monitor with 1000R curvature, Quad HD resolution and fast 1ms response time.',
    imageUrl: createSvgImage('#0f172a', 'monitor', 'Samsung Odyssey 27"', '#2563eb'),
    specs: {
      screen: '27" Curved WQHD (2560x1440)',
      refreshRate: '165Hz',
      responseTime: '1ms (MPRT)',
      panel: 'VA Curved 1000R',
      warranty: '24 kuud',
    },
  },
  {
    id: 'mon-03',
    title: 'LG 27UP650-W 27" 4K UHD IPS (Uus)',
    categoryL1: 'Monitorid',
    categoryL2: '4K Monitors',
    price: 329,
    oldPrice: 375,
    condition: 'Uus',
    stock: 'Viimased eksemplarid',
    stockCount: 2,
    brand: 'LG',
    shortSpec: '27" 4K UHD 3840x2160 IPS HDR400',
    description: 'Sharp 4K monitor with VESA DisplayHDR 400 and 99% sRGB color gamut for designers.',
    imageUrl: createSvgImage('#f1f5f9', 'monitor', 'LG 27" 4K UHD IPS'),
    specs: {
      screen: '27" 4K UHD (3840x2160)',
      panel: 'IPS 99% sRGB',
      brightness: '400 nits HDR400',
      inputs: '2x HDMI, DisplayPort, Height Adjustable Stand',
      warranty: '24 kuud',
    },
  },
  {
    id: 'mon-04',
    title: 'HP ProDisplay P221 21.5" (Kasutatud)',
    categoryL1: 'Monitorid',
    categoryL2: 'Monitors used',
    price: 45,
    oldPrice: 65,
    condition: 'Kasutatud',
    grade: 'A',
    stock: 'Laos',
    stockCount: 12,
    brand: 'HP',
    shortSpec: '21.5" FHD 1920x1080 DVI VGA',
    description: 'Budget office monitor with crisp Full HD resolution. Cables included.',
    imageUrl: createSvgImage('#f8fafc', 'monitor', 'HP ProDisplay 21.5"', '#d97706'),
    specs: {
      screen: '21.5" Full HD LED (1920x1080)',
      inputs: 'DVI-D, VGA',
      warranty: '6 kuud',
    },
  },

  // 5. Printerid
  {
    id: 'pr-01',
    title: 'Brother HL-L2350DW Laser Printer (Uus)',
    categoryL1: 'Printerid',
    categoryL2: 'Laser printers',
    price: 139,
    oldPrice: 159,
    condition: 'Uus',
    stock: 'Laos',
    stockCount: 5,
    brand: 'Brother',
    shortSpec: 'Mono Laser Wi-Fi Duplex 30ppm',
    description: 'Compact monochrome wireless laser printer with automatic duplex double-sided printing.',
    imageUrl: createSvgImage('#f8fafc', 'printer', 'Brother Mono Laser'),
    specs: {
      type: 'Monochrome Laser Printer',
      speed: 'Up to 30 ppm',
      features: 'Wi-Fi, USB 2.0, Automatic Duplex',
      paperTray: '250 sheets',
      warranty: '24 kuud',
    },
  },
  {
    id: 'pr-02',
    title: 'HP LaserJet Pro MFP M428fdw (Kasutatud)',
    categoryL1: 'Printerid',
    categoryL2: 'Printers used',
    price: 260,
    oldPrice: 320,
    condition: 'Kasutatud',
    grade: 'A',
    stock: 'Viimased eksemplarid',
    stockCount: 2,
    brand: 'HP',
    shortSpec: 'Laser MFP Print Scan Copy Fax Wi-Fi',
    description: 'Heavy duty office multifunction laser printer with low page counter and fresh toner.',
    imageUrl: createSvgImage('#f1f5f9', 'printer', 'HP LaserJet MFP', '#d97706'),
    specs: {
      type: 'All-in-One Laser MFP',
      speed: 'Up to 38 ppm',
      features: 'Touchscreen, ADF Scanner, Network, Wi-Fi',
      warranty: '12 kuud',
    },
  },

  // 6. Arvutiosad - Protsessorid
  {
    id: 'cpu-01',
    title: 'AMD Ryzen 5 5600 Box (Uus)',
    categoryL1: 'Arvutiosad',
    categoryL2: 'Protsessorid',
    categoryL3: 'AMD',
    price: 125,
    oldPrice: 145,
    condition: 'Uus',
    stock: 'Laos',
    stockCount: 8,
    brand: 'AMD',
    shortSpec: '6 Cores / 12 Threads 3.5GHz AM4 Box',
    description: 'Popular AM4 CPU with 6 cores, 12 threads and included Wraith Stealth cooler.',
    imageUrl: createSvgImage('#f8fafc', 'component', 'AMD RYZEN 5'),
    specs: {
      socket: 'AM4',
      cores: '6 Cores, 12 Threads',
      clock: '3.5 GHz Base / 4.4 GHz Boost',
      cache: '35MB Total Cache',
      warranty: '36 kuud',
    },
    isPopular: true,
  },
  {
    id: 'cpu-02',
    title: 'Intel Core i5-12400F LGA1700 (Uus)',
    categoryL1: 'Arvutiosad',
    categoryL2: 'Protsessorid',
    categoryL3: 'Intel',
    price: 139,
    oldPrice: 155,
    condition: 'Uus',
    stock: 'Laos',
    stockCount: 6,
    brand: 'Intel',
    shortSpec: '6 Cores / 12 Threads up to 4.4GHz',
    description: 'High efficiency Intel 12th gen CPU for gaming builds. Requires dedicated graphics card.',
    imageUrl: createSvgImage('#f1f5f9', 'component', 'INTEL CORE i5'),
    specs: {
      socket: 'LGA1700',
      cores: '6 Performance Cores',
      clock: '2.5 GHz Base / 4.4 GHz Boost',
      warranty: '36 kuud',
    },
  },

  // 7. Arvutiosad - RAM & Storage
  {
    id: 'ram-01',
    title: 'Kingston Fury Beast 16GB (2x8GB) DDR4 3200MHz (Uus)',
    categoryL1: 'Arvutiosad',
    categoryL2: 'Mälu Desktop',
    categoryL3: 'DDR4',
    price: 42,
    oldPrice: 49,
    condition: 'Uus',
    stock: 'Laos',
    stockCount: 15,
    brand: 'Kingston',
    shortSpec: '16GB (2x8GB) DDR4 CL16 Black',
    description: 'High performance dual-channel DDR4 memory with sleek black aluminum heat spreader.',
    imageUrl: createSvgImage('#f8fafc', 'component', '16GB DDR4 RAM'),
    specs: {
      capacity: '16GB (2x8GB)',
      type: 'DDR4 SDRAM',
      speed: '3200MHz CL16',
      warranty: 'Eluaegne (Lifetime)',
    },
  },
  {
    id: 'ram-02',
    title: 'Corsair Vengeance DDR5 32GB (2x16GB) 6000MHz (Uus)',
    categoryL1: 'Arvutiosad',
    categoryL2: 'Mälu Desktop',
    categoryL3: 'DDR5',
    price: 119,
    oldPrice: 135,
    condition: 'Uus',
    stock: 'Laos',
    stockCount: 5,
    brand: 'Corsair',
    shortSpec: '32GB (2x16GB) DDR5 6000MHz CL36',
    description: 'Extreme speed DDR5 RAM optimized for Intel XMP 3.0 and AMD EXPO profiles.',
    imageUrl: createSvgImage('#0f172a', 'component', '32GB DDR5 RAM', '#2563eb'),
    specs: {
      capacity: '32GB (2x16GB)',
      type: 'DDR5',
      speed: '6000MHz',
      warranty: 'Eluaegne',
    },
  },
  {
    id: 'ssd-01',
    title: 'Samsung 980 1TB M.2 NVMe SSD (Uus)',
    categoryL1: 'Arvutiosad',
    categoryL2: 'SSD',
    categoryL3: 'NVMe',
    price: 79,
    oldPrice: 89,
    condition: 'Uus',
    stock: 'Laos',
    stockCount: 12,
    brand: 'Samsung',
    shortSpec: '1TB M.2 PCIe 3.0 Up to 3500MB/s',
    description: 'Reliable high-speed PCIe NVMe SSD drive from Samsung.',
    imageUrl: createSvgImage('#f8fafc', 'component', '1TB NVMe SSD'),
    specs: {
      capacity: '1TB',
      interface: 'PCIe 3.0 x4, NVMe 1.4',
      readSpeed: 'Up to 3,500 MB/s',
      writeSpeed: 'Up to 3,000 MB/s',
      warranty: '60 kuud (5 aastat)',
    },
  },

  // 8. Lisaseadmed
  {
    id: 'acc-01',
    title: 'Logitech MX Master 3S Wireless Mouse (Uus)',
    categoryL1: 'Lisaseadmed',
    categoryL2: 'Mice',
    price: 99,
    oldPrice: 119,
    condition: 'Uus',
    stock: 'Laos',
    stockCount: 6,
    brand: 'Logitech',
    shortSpec: '8K DPI Quiet Clicks Bluetooth + Bolt',
    description: 'Ergonomic flagship wireless mouse with MagSpeed electromagnetic scroll wheel and quiet switches.',
    imageUrl: createSvgImage('#f8fafc', 'peripheral', 'MX Master 3S'),
    specs: {
      sensor: '8000 DPI Darkfield',
      connectivity: 'Bluetooth Low Energy / Logi Bolt',
      battery: 'Rechargeable USB-C (up to 70 days)',
      warranty: '24 kuud',
    },
    isPopular: true,
  },
  {
    id: 'acc-02',
    title: 'Logitech MK270 Wireless Keyboard & Mouse Combo (Uus)',
    categoryL1: 'Lisaseadmed',
    categoryL2: 'Keyboards',
    price: 32,
    oldPrice: 38,
    condition: 'Uus',
    stock: 'Laos',
    stockCount: 14,
    brand: 'Logitech',
    shortSpec: 'Wireless 2.4GHz Estonian layout',
    description: 'Reliable wireless desktop set with Estonian key labels and long battery lifespan.',
    imageUrl: createSvgImage('#f1f5f9', 'peripheral', 'MK270 Combo'),
    specs: {
      layout: 'Estonian (EST)',
      connection: '2.4GHz USB Dongle',
      warranty: '24 kuud',
    },
  },
  {
    id: 'acc-03',
    title: 'SteelSeries Arctis Nova 1 Gaming Headset (Uus)',
    categoryL1: 'Lisaseadmed',
    categoryL2: 'Headsets',
    price: 59,
    oldPrice: 69,
    condition: 'Uus',
    stock: 'Laos',
    stockCount: 5,
    brand: 'SteelSeries',
    shortSpec: 'High Fidelity Drivers ClearCast Mic 3.5mm',
    description: 'Lightweight multi-platform headset with retractable noise-cancelling microphone.',
    imageUrl: createSvgImage('#0f172a', 'peripheral', 'Arctis Headset', '#2563eb'),
    specs: {
      audio: '40mm Neodymium Drivers',
      mic: 'ClearCast Gen 2 Retractable',
      connector: '3.5mm Jack (PC / PS5 / Xbox / Switch)',
      warranty: '24 kuud',
    },
  },
  {
    id: 'acc-04',
    title: 'Logitech C920 HD Pro Webcam 1080p (Uus)',
    categoryL1: 'Lisaseadmed',
    categoryL2: 'Webcams',
    price: 75,
    oldPrice: 89,
    condition: 'Uus',
    stock: 'Laos',
    stockCount: 7,
    brand: 'Logitech',
    shortSpec: 'Full HD 1080p 30fps Dual Stereo Mic',
    description: 'Industry standard webcam for Teams, Zoom and video calls with autofocus glass lens.',
    imageUrl: createSvgImage('#f8fafc', 'peripheral', 'Logitech 1080p Webcam'),
    specs: {
      resolution: '1080p / 30fps',
      mic: 'Dual omni-directional stereo',
      warranty: '24 kuud',
    },
  },
  {
    id: 'pwr-01',
    title: 'Eaton 5E 850i USB DIN UPS (Uus)',
    categoryL1: 'Toiteseadmed',
    categoryL2: 'UPS',
    price: 95,
    oldPrice: 110,
    condition: 'Uus',
    stock: 'Laos',
    stockCount: 4,
    brand: 'Eaton',
    shortSpec: '850VA / 480W Line-Interactive USB',
    description: 'Compact line-interactive battery backup power supply protecting PCs against power outages and surges.',
    imageUrl: createSvgImage('#f1f5f9', 'desktop', 'Eaton 850i UPS'),
    specs: {
      rating: '850 VA / 480 W',
      outlets: 'DIN Schuko sockets',
      communication: 'USB port',
      warranty: '24 kuud',
    },
  },
];
