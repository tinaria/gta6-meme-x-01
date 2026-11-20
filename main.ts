// gta6-meme-x-01 entry (Node 22, standard library only).
//
// The entry is the X post itself: the house reads the post from X (its first
// picture and its text) and hands that to the judge. All this program does
// is carry POST.json, which names the post, from the repository root into
// /output/POST.json, where the gate reads it.
//
// Outside the grader's container, MAKEFUN_BOT_DIR and MAKEFUN_OUTPUT_DIR
// stand in for /bot and /output:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const botDir = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

const source = join(botDir, 'POST.json');
const target = join(outputDir, 'POST.json');

let post: Buffer;
try {
  post = readFileSync(source);
} catch (err) {
  console.error(`could not read ${source}: ${(err as Error).message}`);
  process.exit(1);
}

// Fail loudly on a malformed pointer instead of copying garbage to /output:
// POST.json must be a JSON object whose "url" names the X post.
let parsed: unknown;
try {
  parsed = JSON.parse(post.toString('utf8'));
} catch (err) {
  console.error(`POST.json is not valid JSON: ${(err as Error).message}`);
  process.exit(1);
}
if (
  typeof parsed !== 'object' ||
  parsed === null ||
  typeof (parsed as { url?: unknown }).url !== 'string'
) {
  console.error('POST.json must be an object with a string "url" field');
  process.exit(1);
}

mkdirSync(outputDir, { recursive: true });
writeFileSync(target, post);
