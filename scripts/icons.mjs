// Regenerates public/favicon.ico and public/apple-touch-icon.png. Run: node scripts/icons.mjs
import sharp from "sharp";
import { writeFileSync } from "node:fs";

// Tab icon (A2): bold M with a pink core. Fixed light-mode colors for raster formats.
const tab = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <path d="M6 25 L6 8 L16 18 L26 8 L26 25" fill="none" stroke="#1c1c1e" stroke-width="3.2" stroke-linejoin="round" stroke-linecap="round"/>
  <circle cx="16" cy="18" r="3.8" fill="#b8336a"/></svg>`;

// Home-screen icon (A3): node M knocked out of a dark tile. iOS rounds the corners itself.
const tile = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" fill="#1c1c1e"/>
  <path d="M8.5 23.5 L8.5 9.5 L16 17 L23.5 9.5 L23.5 23.5" fill="none" stroke="#fbfbfa" stroke-opacity="0.7" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"/>
  ${[[8.5, 23.5], [8.5, 9.5], [23.5, 9.5], [23.5, 23.5]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.3" fill="#fbfbfa"/>`).join("")}
  <circle cx="16" cy="17" r="3" fill="#f07fae"/></svg>`;

const png = (svg, size) => sharp(Buffer.from(svg), { density: 72 * (size / 32) * 4 }).resize(size, size).png().toBuffer();

// ICO container with PNG-encoded entries (supported by every current browser).
function ico(images) {
  const header = Buffer.alloc(6 + 16 * images.length);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);
  let offset = header.length;
  images.forEach(({ size, data }, i) => {
    const e = 6 + 16 * i;
    header.writeUInt8(size % 256, e);
    header.writeUInt8(size % 256, e + 1);
    header.writeUInt16LE(1, e + 4);
    header.writeUInt16LE(32, e + 6);
    header.writeUInt32LE(data.length, e + 8);
    header.writeUInt32LE(offset, e + 12);
    offset += data.length;
  });
  return Buffer.concat([header, ...images.map((im) => im.data)]);
}

const sizes = [16, 32, 48];
writeFileSync("public/favicon.ico", ico(await Promise.all(sizes.map(async (size) => ({ size, data: await png(tab, size) })))));
writeFileSync("public/apple-touch-icon.png", await png(tile, 180));
console.log("icons written");
