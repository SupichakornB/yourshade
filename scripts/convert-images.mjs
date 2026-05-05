// scripts/convert-images.mjs
import sharp from "sharp";
import { glob } from "glob";

const files = await glob("{src/assets,public/products}/**/*.{png,jpg,jpeg}");

for (const file of files) {
  const out = file.replace(/\.(png|jpg|jpeg)$/, ".webp");
  await sharp(file).webp({ quality: 80 }).toFile(out);
  console.log(`✅ ${file} → ${out}`);
}