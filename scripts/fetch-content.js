// Runs as `npm run prebuild` — fetches gallery data from Strapi and writes
// public/images/{gallery-slug}/ (downloaded files) and src/data/galleries.json.
// Targets Strapi v5 API (flat response structure, no .attributes wrapper).

const fs = require('fs');
const path = require('path');
const { pipeline } = require('stream/promises');

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const PUBLIC_DIR = path.join(__dirname, '..', 'public', 'images');
const DATA_DIR = path.join(__dirname, '..', 'src', 'data');
const OUT_FILE = path.join(DATA_DIR, 'galleries.json');

async function downloadFile(url, dest) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download failed (${res.status}): ${url}`);
  const fileStream = fs.createWriteStream(dest);
  await pipeline(res.body, fileStream);
}

async function main() {
  const apiUrl = `${STRAPI_URL}/api/galleries?populate=images&sort=displayOrder:asc`;
  console.log(`Fetching galleries from ${apiUrl}`);

  const res = await fetch(apiUrl);
  if (!res.ok) throw new Error(`Strapi API error: ${res.status} ${res.statusText}`);

  const { data } = await res.json();

  if (!data || data.length === 0) {
    console.warn('No galleries returned from Strapi. Writing empty galleries.json.');
    fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(OUT_FILE, '[]');
    return;
  }

  const galleries = [];

  for (const gallery of data) {
    const { name, slug, description, columns, images } = gallery;
    const galleryDir = path.join(PUBLIC_DIR, slug);
    fs.mkdirSync(galleryDir, { recursive: true });

    const galleryImages = [];

    for (const img of images ?? []) {
      const { url, width, height, name: imgName, alternativeText } = img;
      const filename = path.basename(imgName || url);
      const destPath = path.join(galleryDir, filename);
      const publicSrc = `/images/${slug}/${filename}`;

      if (!fs.existsSync(destPath)) {
        const fullUrl = url.startsWith('http') ? url : `${STRAPI_URL}${url}`;
        console.log(`  Downloading ${filename}`);
        await downloadFile(fullUrl, destPath);
      }

      galleryImages.push({
        src: publicSrc,
        width: width || 1,
        height: height || 1,
        alt: alternativeText || '',
      });
    }

    galleries.push({
      name,
      slug,
      description: description || '',
      columns: columns || 2,
      images: galleryImages,
    });

    console.log(`  ${name}: ${galleryImages.length} image(s)`);
  }

  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(OUT_FILE, JSON.stringify(galleries, null, 2));
  console.log(`Wrote ${galleries.length} galleries to src/data/galleries.json`);
}

main().catch(err => {
  console.error('fetch-content failed:', err.message);
  process.exit(1);
});
