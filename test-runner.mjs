import { register } from 'node:module';
import fs from 'node:fs';

// If type module is not present in package.json, we have to use .mjs or let the loader know
// Registering a hook to intercept module resolution
// Also ensures we set default process environment variables needed.
process.env.RESEND_API_KEY = 're_123456789';
process.env.ADMIN_EMAIL = 'admin@example.com';
process.env.NEXTAUTH_URL = 'http://localhost:3000';

register('./mock-loader.mjs', import.meta.url);
