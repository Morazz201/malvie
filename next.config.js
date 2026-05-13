const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure the tracing root to avoid multiple lockfile warnings
  outputFileTracingRoot: path.join(__dirname),
  
  // Allow cross-origin requests from specific origins during development
  allowedDevOrigins: [
    '192.168.8.103',           // Your local network device
    '*.my-custom-domain.dev',  // Wildcard for subdomains (dev only)
    'your-tunnel-url.ngrok.io', // Example ngrok tunnel
  ],
};

module.exports = nextConfig;

