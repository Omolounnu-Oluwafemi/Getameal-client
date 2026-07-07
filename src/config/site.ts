import { env } from '@/lib/env';

export const siteConfig = {
  name: env.NEXT_PUBLIC_APP_NAME,
  description: 'Find your next meal, fast.',
  url: env.NEXT_PUBLIC_APP_URL,
  links: {
    github: 'https://github.com/your-org/getameal-client',
  },
} as const;
