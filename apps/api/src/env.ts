import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  DATABASE_URL: z.string().url(),
  CORS_ORIGIN: z.string().default('http://localhost:3000'),
  JWT_SECRET: z.string().min(32),
  DISCORD_CLIENT_ID: z.string().min(1),
  DISCORD_CLIENT_SECRET: z.string().min(1),
  DISCORD_CALLBACK_URL: z.string().optional(),
  PORT: z.coerce.number().default(4000),
  AWS_ACCESS_KEY_ID: z.string().min(1),
  AWS_SECRET_ACCESS_KEY: z.string().min(1),
  AWS_S3_BUCKET: z.string().min(1),
  AWS_S3_REGION: z.string().default('us-east-1'),
  AWS_S3_CDN_URL: z.string().url(),
});

export const parseEnv = (config: Record<string, string | undefined>) => {
  return envSchema.parse(config);
};

export type Env = z.infer<typeof envSchema>;
