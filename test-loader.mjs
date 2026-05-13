import { pathToFileURL } from 'node:url';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

export async function resolve(specifier, context, nextResolve) {
  if (specifier === 'next/server' || specifier === 'next/server.js') {
    // We bypass Next.js internal resolution and force mock logic instead
    return {
      format: 'module',
      shortCircuit: true,
      url: pathToFileURL(path.resolve('app/api/products/__next_server_mock__.js')).href
    };
  }
  if (specifier.startsWith('@/')) {
    const resolvedPath = path.resolve(process.cwd(), specifier.slice(2));
    const url = pathToFileURL(resolvedPath).href;
    try {
      return await nextResolve(url, context);
    } catch (err) {
      if (err.code === 'ERR_MODULE_NOT_FOUND') {
         return await nextResolve(url + '.js', context);
      }
      throw err;
    }
  }
  return nextResolve(specifier, context);
}

export async function load(url, context, nextLoad) {
  if (url === pathToFileURL(path.resolve('app/api/products/__next_server_mock__.js')).href) {
    return {
      format: 'module',
      shortCircuit: true,
      source: `
        export class NextResponse {
          static json(body, init) {
            return {
              body,
              status: init?.status || 200,
              json: async () => body
            };
          }
        }
      `
    };
  }
  return nextLoad(url, context);
}
