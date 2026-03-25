import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = process.cwd();
const ICON_SVG_PATH = path.join(ROOT, 'public', 'icon-512x512.svg');
const OUT_ICON_PNG = path.join(ROOT, 'public', 'play-icon-512.png');
const OUT_FEATURE_PNG = path.join(ROOT, 'public', 'feature-graphic-1024x500.png');

function toBase64(s) {
  return Buffer.from(s, 'utf8').toString('base64');
}

async function main() {
  const iconSvg = await fs.readFile(ICON_SVG_PATH, 'utf8');

  // 1) Play icon 512x512 PNG
  await sharp(Buffer.from(iconSvg))
    .resize(512, 512, { fit: 'cover' })
    .png({ compressionLevel: 9 })
    .toFile(OUT_ICON_PNG);

  // 2) Feature graphic 1024x500 PNG (no text to avoid font issues)
  const bgSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="1024" height="500" viewBox="0 0 1024 500">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#e0f2fe"/>
        <stop offset="0.45" stop-color="#fef3c7"/>
        <stop offset="1" stop-color="#ddd6fe"/>
      </linearGradient>
      <radialGradient id="spot" cx="30%" cy="40%" r="70%">
        <stop offset="0" stop-color="#ffffff" stop-opacity="0.85"/>
        <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
      </radialGradient>
      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="18" stdDeviation="18" flood-color="#0b5bd3" flood-opacity="0.22"/>
      </filter>
    </defs>

    <rect width="1024" height="500" rx="36" fill="url(#g)"/>
    <rect width="1024" height="500" rx="36" fill="url(#spot)"/>

    <!-- subtle dots -->
    <g opacity="0.18" fill="#0ea5e9">
      ${Array.from({ length: 90 })
        .map((_, i) => {
          const x = 60 + (i % 15) * 62;
          const y = 46 + Math.floor(i / 15) * 70;
          return `<circle cx="${x}" cy="${y}" r="3"/>`;
        })
        .join('')}
    </g>

    <!-- big icon -->
    <g filter="url(#shadow)">
      <rect x="312" y="38" width="400" height="400" rx="88" fill="#ffffff" opacity="0.32"/>
      <image x="312" y="38" width="400" height="400" href="data:image/svg+xml;base64,${toBase64(iconSvg)}"/>
    </g>

    <!-- bottom bar (leave room for store UI cropping) -->
    <rect x="0" y="430" width="1024" height="70" fill="#ffffff" opacity="0.22"/>
  </svg>
  `.trim();

  await sharp(Buffer.from(bgSvg))
    .resize(1024, 500, { fit: 'cover' })
    .png({ compressionLevel: 9 })
    .toFile(OUT_FEATURE_PNG);

  // eslint-disable-next-line no-console
  console.log('Generated:', OUT_ICON_PNG, OUT_FEATURE_PNG);
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});

