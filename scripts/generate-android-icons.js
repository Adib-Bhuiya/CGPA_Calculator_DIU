/**
 * Generates modern graduation-cap launcher icons and adaptive icon resources
 * for the Android Capacitor application "CGPA Calculator DIU".
 */
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const ROOT_DIR = process.cwd();
const RES_DIR = path.join(ROOT_DIR, 'android/app/src/main/res');
const ASSETS_DIR = path.join(ROOT_DIR, 'assets');

if (!fs.existsSync(ASSETS_DIR)) {
  fs.mkdirSync(ASSETS_DIR, { recursive: true });
}

// 1. Vector definition for the clean, modern graduation cap (108dp viewport standard)
// Safe zone is 72dp circle centered at (54, 54).
// All cap paths are kept inside [20..88] on x and [28..80] on y.
const GRADUATION_CAP_SVG_CONTENT = `
  <!-- Drop shadow for 3D depth and modern aesthetic -->
  <defs>
    <filter id="capShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="2.2" stdDeviation="2.2" flood-color="#0f172a" flood-opacity="0.32" />
    </filter>
    <linearGradient id="boardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" />
      <stop offset="50%" stop-color="#F8FAFC" />
      <stop offset="100%" stop-color="#EEF2F6" />
    </linearGradient>
    <linearGradient id="boardRimGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#CBD5E1" />
      <stop offset="100%" stop-color="#94A3B8" />
    </linearGradient>
    <linearGradient id="skullGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#E2E8F0" />
      <stop offset="100%" stop-color="#CBD5E1" />
    </linearGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FDE047" />
      <stop offset="40%" stop-color="#FBBF24" />
      <stop offset="100%" stop-color="#D97706" />
    </linearGradient>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#4F46E5" />
      <stop offset="50%" stop-color="#4338CA" />
      <stop offset="100%" stop-color="#312E81" />
    </linearGradient>
    <radialGradient id="bgGlow" cx="50%" cy="45%" r="50%">
      <stop offset="0%" stop-color="#818CF8" stop-opacity="0.28" />
      <stop offset="100%" stop-color="#4F46E5" stop-opacity="0" />
    </radialGradient>
  </defs>

  <g filter="url(#capShadow)">
    <!-- Skull Cap (base underneath mortarboard) -->
    <path d="M 37 52.5 C 37 65 44.5 74 54 74 C 63.5 74 71 65 71 52.5 C 66 56 60.5 58 54 58 C 47.5 58 42 56 37 52.5 Z" fill="url(#skullGrad)" />
    <!-- Skull Cap rim highlight line -->
    <path d="M 38 60 C 42.5 68.5 48 72 54 72 C 60 72 65.5 68.5 70 60 C 69 66 62.5 74 54 74 C 45.5 74 39 66 38 60 Z" fill="#94A3B8" opacity="0.65" />

    <!-- Mortarboard 3D Rim / Thickness Edge -->
    <path d="M 22 46.5 L 54 60.5 L 86 46.5 L 86 49.5 L 54 63.5 L 22 49.5 Z" fill="url(#boardRimGrad)" />

    <!-- Mortarboard Diamond Top -->
    <path d="M 54 32.5 L 86 46.5 L 54 60.5 L 22 46.5 Z" fill="url(#boardGrad)" stroke="#FFFFFF" stroke-width="0.75" stroke-linejoin="round" />

    <!-- Center Button (Gold) -->
    <circle cx="54" cy="46.5" r="2.8" fill="url(#goldGrad)" stroke="#B45309" stroke-width="0.4" />

    <!-- Tassel Ribbon Cord hanging to right -->
    <path d="M 54 46.5 C 67 47 79 50 84 55.5 C 86.5 58.5 86.5 63 85.5 67.5" fill="none" stroke="url(#goldGrad)" stroke-width="2.2" stroke-linecap="round" />

    <!-- Tassel Ring / Knot -->
    <ellipse cx="85.5" cy="68" rx="2.5" ry="1.9" fill="#F59E0B" stroke="#B45309" stroke-width="0.3" />

    <!-- Tassel Hanging Brush -->
    <path d="M 83.2 69 L 87.8 69 L 89.5 78.5 C 89.5 78.5 86 80 81.5 78.5 Z" fill="url(#goldGrad)" />
    <!-- Tassel brush texture lines -->
    <line x1="84.5" y1="71" x2="83.8" y2="78" stroke="#D97706" stroke-width="0.4" />
    <line x1="86.5" y1="71" x2="87.2" y2="78" stroke="#FDE047" stroke-width="0.4" />
  </g>
`;

// Full square/squircle icon SVG (108 x 108 viewbox)
const svgSquare = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 108 108" width="1024" height="1024">
  <rect x="0" y="0" width="108" height="108" rx="24" fill="url(#bgGrad)" />
  <rect x="0" y="0" width="108" height="108" rx="24" fill="url(#bgGlow)" />
  ${GRADUATION_CAP_SVG_CONTENT}
</svg>`;

// Round icon SVG
const svgRound = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 108 108" width="1024" height="1024">
  <circle cx="54" cy="54" r="54" fill="url(#bgGrad)" />
  <circle cx="54" cy="54" r="54" fill="url(#bgGlow)" />
  ${GRADUATION_CAP_SVG_CONTENT}
</svg>`;

// Transparent foreground-only SVG for Android Adaptive Icon
const svgForeground = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 108 108" width="1024" height="1024">
  ${GRADUATION_CAP_SVG_CONTENT}
</svg>`;

// Background SVG for Adaptive Icon
const svgBackground = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 108 108" width="1024" height="1024">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#4F46E5" />
      <stop offset="50%" stop-color="#4338CA" />
      <stop offset="100%" stop-color="#312E81" />
    </linearGradient>
  </defs>
  <rect width="108" height="108" fill="url(#bgGrad)" />
</svg>`;

// Write master SVG assets
const svgSquarePath = path.join(ASSETS_DIR, 'icon-square.svg');
const svgRoundPath = path.join(ASSETS_DIR, 'icon-round.svg');
const svgForegroundPath = path.join(ASSETS_DIR, 'icon-foreground.svg');
const svgBackgroundPath = path.join(ASSETS_DIR, 'icon-background.svg');

fs.writeFileSync(svgSquarePath, svgSquare, 'utf8');
fs.writeFileSync(svgRoundPath, svgRound, 'utf8');
fs.writeFileSync(svgForegroundPath, svgForeground, 'utf8');
fs.writeFileSync(svgBackgroundPath, svgBackground, 'utf8');

console.log('Master SVGs created in assets/');

// Render master 1024x1024 PNGs
execSync(`rsvg-convert -w 1024 -h 1024 "${svgSquarePath}" -o "${path.join(ASSETS_DIR, 'icon.png')}"`);
execSync(`rsvg-convert -w 1024 -h 1024 "${svgRoundPath}" -o "${path.join(ASSETS_DIR, 'icon-round.png')}"`);
execSync(`rsvg-convert -w 1024 -h 1024 "${svgForegroundPath}" -o "${path.join(ASSETS_DIR, 'icon-foreground.png')}"`);
execSync(`rsvg-convert -w 1024 -h 1024 "${svgForegroundPath}" -o "${path.join(ASSETS_DIR, 'icon-only.png')}"`);
execSync(`rsvg-convert -w 1024 -h 1024 "${svgBackgroundPath}" -o "${path.join(ASSETS_DIR, 'icon-background.png')}"`);
console.log('Master 1024x1024 PNGs generated in assets/');

// Density configurations for Android launcher mipmaps
const DENSITIES = [
  { folder: 'mipmap-mdpi', iconSize: 48, fgSize: 108 },
  { folder: 'mipmap-hdpi', iconSize: 72, fgSize: 162 },
  { folder: 'mipmap-xhdpi', iconSize: 96, fgSize: 216 },
  { folder: 'mipmap-xxhdpi', iconSize: 144, fgSize: 324 },
  { folder: 'mipmap-xxxhdpi', iconSize: 192, fgSize: 432 },
];

for (const d of DENSITIES) {
  const targetDir = path.join(RES_DIR, d.folder);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  // 1. Standard ic_launcher.png (legacy square/squircle)
  const launcherPath = path.join(targetDir, 'ic_launcher.png');
  execSync(`rsvg-convert -w ${d.iconSize} -h ${d.iconSize} "${svgSquarePath}" -o "${launcherPath}"`);

  // 2. Round ic_launcher_round.png
  const roundPath = path.join(targetDir, 'ic_launcher_round.png');
  execSync(`rsvg-convert -w ${d.iconSize} -h ${d.iconSize} "${svgRoundPath}" -o "${roundPath}"`);

  // 3. Adaptive foreground ic_launcher_foreground.png
  const fgPath = path.join(targetDir, 'ic_launcher_foreground.png');
  execSync(`rsvg-convert -w ${d.fgSize} -h ${d.fgSize} "${svgForegroundPath}" -o "${fgPath}"`);

  console.log(`Generated ${d.folder}: launcher (${d.iconSize}x${d.iconSize}), round (${d.iconSize}x${d.iconSize}), foreground (${d.fgSize}x${d.fgSize})`);
}

// Update Android Adaptive Icon background color: Indigo 700 (#4338CA)
const bgColorXml = `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="ic_launcher_background">#4338CA</color>
</resources>
`;
fs.writeFileSync(path.join(RES_DIR, 'values/ic_launcher_background.xml'), bgColorXml, 'utf8');

// Update drawable/ic_launcher_background.xml
const bgDrawableXml = `<?xml version="1.0" encoding="utf-8"?>
<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="108dp"
    android:height="108dp"
    android:viewportWidth="108"
    android:viewportHeight="108">
    <path
        android:fillColor="#4338CA"
        android:pathData="M0,0h108v108h-108z" />
</vector>
`;
fs.writeFileSync(path.join(RES_DIR, 'drawable/ic_launcher_background.xml'), bgDrawableXml, 'utf8');

// Update drawable-v24/ic_launcher_foreground.xml with Vector Drawable of graduation cap
const fgVectorDrawableXml = `<?xml version="1.0" encoding="utf-8"?>
<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="108dp"
    android:height="108dp"
    android:viewportWidth="108"
    android:viewportHeight="108">
    <!-- Skull Cap base underneath mortarboard -->
    <path
        android:fillColor="#CBD5E1"
        android:pathData="M 37,52.5 C 37,65 44.5,74 54,74 C 63.5,74 71,65 71,52.5 C 66,56 60.5,58 54,58 C 47.5,58 42,56 37,52.5 Z" />
    <path
        android:fillColor="#94A3B8"
        android:pathData="M 38,60 C 42.5,68.5 48,72 54,72 C 60,72 65.5,68.5 70,60 C 69,66 62.5,74 54,74 C 45.5,74 39,66 38,60 Z" />

    <!-- Mortarboard 3D Rim / Thickness Edge -->
    <path
        android:fillColor="#94A3B8"
        android:pathData="M 22,46.5 L 54,60.5 L 86,46.5 L 86,49.5 L 54,63.5 L 22,49.5 Z" />

    <!-- Mortarboard Diamond Top -->
    <path
        android:fillColor="#FFFFFF"
        android:strokeColor="#EEF2F6"
        android:strokeWidth="0.75"
        android:pathData="M 54,32.5 L 86,46.5 L 54,60.5 L 22,46.5 Z" />

    <!-- Center Button (Gold) -->
    <path
        android:fillColor="#FBBF24"
        android:pathData="M 54,43.7 A 2.8,2.8 0 1,0 54,49.3 A 2.8,2.8 0 1,0 54,43.7 Z" />

    <!-- Tassel Ribbon Cord hanging to right -->
    <path
        android:strokeColor="#FBBF24"
        android:strokeWidth="2.2"
        android:strokeLineCap="round"
        android:fillColor="#00000000"
        android:pathData="M 54,46.5 C 67,47 79,50 84,55.5 C 86.5,58.5 86.5,63 85.5,67.5" />

    <!-- Tassel Ring / Knot -->
    <path
        android:fillColor="#F59E0B"
        android:pathData="M 85.5,66.1 A 2.5,1.9 0 1,0 85.5,69.9 A 2.5,1.9 0 1,0 85.5,66.1 Z" />

    <!-- Tassel Hanging Brush -->
    <path
        android:fillColor="#FBBF24"
        android:pathData="M 83.2,69 L 87.8,69 L 89.5,78.5 C 89.5,78.5 86,80 81.5,78.5 Z" />
</vector>
`;
fs.writeFileSync(path.join(RES_DIR, 'drawable-v24/ic_launcher_foreground.xml'), fgVectorDrawableXml, 'utf8');

console.log('All Android launcher icons and adaptive icon resources successfully updated!');
