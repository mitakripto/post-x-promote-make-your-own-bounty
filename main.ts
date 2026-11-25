// Entry for post-x-promote-make-your-own-bounty-01 (Node 22, standard
// library only). The entry itself is the X post: a quote of make.fun's
// make-your-own-bounty post, with a photo of its own attached, make.fun and
// the @makefunai tag plus the entrant's play code in its text. All this
// program does is hand the post's address to the gate: it reads POST.json
// from the repository root and writes the same bytes to /output/POST.json.
//
// Local run:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

const source = join(BOT_DIR, 'POST.json');
const target = join(OUTPUT_DIR, 'POST.json');

mkdirSync(OUTPUT_DIR, { recursive: true });

let bytes;
try {
  bytes = readFileSync(source);
} catch (err) {
  console.error(`could not read POST.json from ${source}: ${(err as Error).message}`);
  process.exit(1);
}

const post = JSON.parse(bytes.toString('utf-8'));
if (typeof post.url !== 'string') {
  console.error('POST.json does not name a post address');
  process.exit(1);
}
// The gate reads the address as https://x.com/<handle>/status/<id> (or the
// same on twitter.com), id digits only, so refuse anything shaped otherwise
// instead of handing a bad address to /output.
const POST_ADDRESS = /^https:\/\/(x\.com|twitter\.com)\/[A-Za-z0-9_]+\/status\/[0-9]+$/;
if (!POST_ADDRESS.test(post.url)) {
  console.error(`POST.json does not name an X post address: ${post.url}`);
  process.exit(1);
}

writeFileSync(target, bytes);
console.log(`handed in ${post.url}`);
