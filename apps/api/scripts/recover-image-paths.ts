/**
 * recover-image-paths.ts
 *
 * Recovers image paths lost by the rename migration (DROP + ADD).
 * Scans S3 under users/ and games/ prefixes, extracts the userId/gameId
 * from the path, and updates the DB records accordingly.
 *
 * Path conventions (set by _tmp_reorganize.ts):
 *   users/{userId}/{uuid}.ext               → User.imagePath
 *   games/{gameId}/thumbnail-{uuid}.ext     → Game.thumbnailImagePath
 *   games/{gameId}/background-{uuid}.ext    → Game.backgroundImagePath
 *
 * Run from repo root:
 *   cd apps/api && node --import tsx/esm scripts/recover-image-paths.ts
 * Or:
 *   cd apps/api && node -e "require('tsx/cjs')" scripts/recover-image-paths.ts
 */

import {
  S3Client,
  ListObjectsV2Command,
  type ListObjectsV2CommandOutput,
} from '@aws-sdk/client-s3';
import { prisma } from '@bellona/db';

const bucket = process.env.AWS_S3_BUCKET!;
const region = process.env.AWS_S3_REGION ?? 'us-east-1';
const accessKeyId = process.env.AWS_ACCESS_KEY_ID!;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY!;

if (!bucket || !accessKeyId || !secretAccessKey) {
  console.error(
    'Missing required env vars: AWS_S3_BUCKET, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY',
  );
  process.exit(1);
}

const s3 = new S3Client({
  region,
  credentials: { accessKeyId, secretAccessKey },
  requestChecksumCalculation: 'WHEN_REQUIRED',
  responseChecksumValidation: 'WHEN_REQUIRED',
});

/** Lists ALL objects under a given S3 prefix (handles pagination). */
async function listAllObjects(prefix: string): Promise<string[]> {
  const keys: string[] = [];
  let continuationToken: string | undefined;

  do {
    const res: ListObjectsV2CommandOutput = await s3.send(
      new ListObjectsV2Command({
        Bucket: bucket,
        Prefix: prefix,
        ContinuationToken: continuationToken,
      }),
    );
    for (const obj of res.Contents ?? []) {
      if (obj.Key) keys.push(obj.Key);
    }
    continuationToken = res.IsTruncated ? res.NextContinuationToken : undefined;
  } while (continuationToken);

  return keys;
}

async function recoverUsers(dryRun: boolean) {
  console.log('\n── Users ────────────────────────────────────────────');
  const keys = await listAllObjects('users/');
  console.log(`  Found ${keys.length} object(s) under users/`);

  // Group by userId. Path: users/{userId}/{uuid}.ext
  const byUser = new Map<string, string[]>();
  for (const key of keys) {
    const parts = key.split('/');
    if (parts.length !== 3) continue;
    const userId = parts[1];
    if (!userId) continue;
    const list = byUser.get(userId) ?? [];
    list.push(key);
    byUser.set(userId, list);
  }

  let updated = 0;
  for (const [userId, userKeys] of byUser) {
    const path = userKeys[userKeys.length - 1];
    console.log(`  user ${userId} → ${path}`);
    if (!dryRun) {
      await prisma.user.updateMany({
        where: { id: userId },
        data: { imagePath: path },
      });
    }
    updated++;
  }
  console.log(
    `  ${dryRun ? '[dry-run] would update' : 'Updated'} ${updated} user(s)`,
  );
}

async function recoverGames(dryRun: boolean) {
  console.log('\n── Games ────────────────────────────────────────────');
  const keys = await listAllObjects('games/');
  console.log(`  Found ${keys.length} object(s) under games/`);

  // Path: games/{gameId}/thumbnail-{uuid}.ext  OR  games/{gameId}/background-{uuid}.ext
  const thumbnails = new Map<string, string>();
  const backgrounds = new Map<string, string>();

  for (const key of keys) {
    const parts = key.split('/');
    if (parts.length !== 3) continue;
    const gameId = parts[1];
    const filename = parts[2];
    if (!gameId || !filename) continue;

    if (filename.startsWith('thumbnail-')) {
      thumbnails.set(gameId, key);
    } else if (filename.startsWith('background-')) {
      backgrounds.set(gameId, key);
    }
  }

  const gameIds = new Set([...thumbnails.keys(), ...backgrounds.keys()]);
  let updated = 0;
  for (const gameId of gameIds) {
    const thumbnail = thumbnails.get(gameId) ?? null;
    const background = backgrounds.get(gameId) ?? null;
    console.log(
      `  game ${gameId} → thumbnail=${thumbnail ?? '(none)'}, background=${background ?? '(none)'}`,
    );
    if (!dryRun) {
      await prisma.game.updateMany({
        where: { id: gameId },
        data: {
          ...(thumbnail !== undefined ? { thumbnailImagePath: thumbnail } : {}),
          ...(background !== undefined
            ? { backgroundImagePath: background }
            : {}),
        },
      });
    }
    updated++;
  }
  console.log(
    `  ${dryRun ? '[dry-run] would update' : 'Updated'} ${updated} game(s)`,
  );
}

async function main() {
  const dryRun = process.argv.includes('--dry-run');
  console.log(`\n🔍 Recovering image paths from S3 [bucket: ${bucket}]`);
  console.log(
    `   Mode: ${dryRun ? 'DRY RUN (no DB writes)' : 'LIVE (will write to DB)'}`,
  );

  await recoverUsers(dryRun);
  await recoverGames(dryRun);

  console.log('\n✅ Done.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
