import { z } from 'zod';

/**
 * Centralized environment variable validation.
 *
 * Import `env` anywhere you need a variable instead of touching
 * `process.env` directly. This guarantees:
 *  - Missing/invalid vars fail fast at startup, not deep in a request.
 *  - Full type safety + autocomplete for every env var in the app.
 *  - A single source of truth for what configuration the app needs.
 *
 * NOTE: Only variables prefixed with NEXT_PUBLIC_ are available in the
 * browser. Everything else is server-only by Next.js convention.
 */
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  // Server-only
  API_BASE_URL: z.string().url().default('https://getcooks.onrender.com'),
  // DATABASE_URL: z.string().url(),

  // Public (exposed to the browser bundle)
  NEXT_PUBLIC_APP_URL: z.string().url().default('http://localhost:3000'),
  NEXT_PUBLIC_APP_NAME: z.string().default('GetaMeal'),
});

const parsed = envSchema.safeParse({
  NODE_ENV: process.env.NODE_ENV,
  API_BASE_URL: process.env.API_BASE_URL,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
});

if (!parsed.success) {
  console.error('❌ Invalid environment variables:', parsed.error.flatten().fieldErrors);
  throw new Error('Invalid environment variables. Check the log above for details.');
}

export const env = parsed.data;
