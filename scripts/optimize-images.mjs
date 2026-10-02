// Converts Higgsfield masters in /assets-src into web-ready WebP sizes.
// Plates -> /public/space/{name}.{2k,1k}.webp, objects -> /public/objects/{name}.webp (alpha kept)
import sharp from "sharp";
import { readdir, mkdir } from "node:fs/promises";
import path from "node:path";

const SRC = "assets-src";
const files = (await readdir(SRC)).filter((f) => f.endsWith(".png"));

await mkdir("public/space", { recursive: true });
await mkdir("public/objects", { recursive: true });

for (const file of files) {
  const name = path.basename(file, ".png");
  const input = path.join(SRC, file);

  if (name.startsWith("obj-")) {
    await sharp(input)
      .resize({ width: 1100, withoutEnlargement: true })
      .webp({ quality: 86, alphaQuality: 90 })
      .toFile(`public/objects/${name.replace("obj-", "")}.webp`);
  } else {
    const sizes = { "4k": 3840, "2k": 2560, "1k": 1280 };
    for (const [label, width] of Object.entries(sizes)) {
      await sharp(input)
        .resize({ width, withoutEnlargement: true })
        .webp({ quality: 84 })
        .toFile(`public/space/${name}.${label}.webp`);
    }
  }
  console.log("ok", name);
}
