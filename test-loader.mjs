import { pathToFileURL } from 'node:url';
import path from 'node:path';

// ESM loader hook to mock next/server and path aliases without side effects
export async function resolve(specifier, context, nextResolve) {
  if (specifier === 'next/server') {
    return {
      format: 'module',
      shortCircuit: true,
      url: 'mock:next/server'
    };
  }

  if (specifier.startsWith('@/lib/prisma')) {
     const libUrl = pathToFileURL(path.join(process.cwd(), 'lib/prisma.js'));
     return {
       format: 'module',
       shortCircuit: true,
       url: libUrl.href
     }
  }

  return nextResolve(specifier, context);
}

export async function load(url, context, nextLoad) {
  if (url === 'mock:next/server') {
    return {
      format: 'module',
      shortCircuit: true,
      source: `
        export const NextResponse = {
          json: (data, init) => ({ data, init: init || { status: 200 } })
        };
        export const NextRequest = class {};
      `
    };
  }

  return nextLoad(url, context);
}
