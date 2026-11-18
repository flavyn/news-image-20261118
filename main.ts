// make.fun — news-image-20261118
// Writes one image that sums up the world news of Wednesday 18 November 2026 to /output/entry.png.
//
// Contract (kit RULES.txt, "The task"):
//   - output: exactly one file, /output/entry.png, a whole PNG or JPEG of at most 1 MiB
//     and at most 1024x1024 pixels;
//   - Node 22, standard library only, no network, 1 CPU, 512 MB, 60 s per run;
//   - the program runs twice and both runs must write the same bytes.
//
// The image itself is rendered at build time and committed beside this file, so the
// graded run is a byte-for-byte copy: same input, same output, every time.
import { copyFileSync, mkdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const source = new URL('./entry.png', import.meta.url);

// Fail loudly here rather than let the gate refuse a truncated or oversized image.
const bytes = readFileSync(source);
const PNG = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const JPEG = Buffer.from([0xff, 0xd8, 0xff]);
const isPng = bytes.subarray(0, 8).equals(PNG);
const isJpeg = bytes.subarray(0, 3).equals(JPEG);
if (!isPng && !isJpeg) throw new Error('entry.png is neither a PNG nor a JPEG');
if (bytes.length > 1_048_576) throw new Error(`entry.png is ${bytes.length} bytes, over the 1 MiB cap`);

// A PNG carries its size in the IHDR chunk: width at byte 16, height at byte 20, both BE u32.
if (isPng) {
  const width = bytes.readUInt32BE(16);
  const height = bytes.readUInt32BE(20);
  if (width > 1024 || height > 1024) throw new Error(`entry.png is ${width}x${height}, over the 1024x1024 cap`);
}

mkdirSync(outputDir, { recursive: true });
copyFileSync(source, join(outputDir, 'entry.png'));
statSync(join(outputDir, 'entry.png'));
