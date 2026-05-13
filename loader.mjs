import { pathToFileURL } from 'node:url';
import { resolve as pathResolve } from 'node:path';
import fs from 'node:fs';

export async function resolve(specifier, context, nextResolve) {
  if (specifier === 'next/server') {
     return nextResolve(pathToFileURL(pathResolve(process.cwd(), 'node_modules/next/server.js')).href, context);
  }

  if (specifier.startsWith('@/')) {
    const resolvedPath = pathResolve(process.cwd(), specifier.slice(2));
    let finalPath = resolvedPath;
    if (!fs.existsSync(resolvedPath)) {
      if (fs.existsSync(resolvedPath + '.js')) {
        finalPath = resolvedPath + '.js';
      }
    }
    const newSpecifier = pathToFileURL(finalPath).href;
    return nextResolve(newSpecifier, context);
  }
  return nextResolve(specifier, context);
}

export async function load(url, context, nextLoad) {
  // If the URL is for our source JS files (e.g., in app/ or lib/), force it to be evaluated as a module.
  if (url.endsWith('.js') && (url.includes('/app/') || url.includes('/lib/'))) {
    return nextLoad(url, { ...context, format: 'module' });
  }
  return nextLoad(url, context);
}
