import fs from 'node:fs';
import path from 'node:path';

export function resolve(specifier, context, nextResolve) {
  if (specifier === 'next/server') {
    return nextResolve(new URL('file://' + path.join(process.cwd(), 'node_modules/next/server.js')).href, context);
  }
  if (specifier.startsWith('@/')) {
    let newSpecifier = new URL(specifier.replace(/^@\//, './'), new URL('file://' + process.cwd() + '/')).href;

    // Check if we need to append .js
    if (!newSpecifier.endsWith('.js') && !newSpecifier.endsWith('.json')) {
      const p = new URL(newSpecifier).pathname;
      if (fs.existsSync(p + '.js')) {
        newSpecifier += '.js';
      }
    }
    return nextResolve(newSpecifier, context);
  }
  return nextResolve(specifier, context);
}
