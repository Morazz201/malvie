export async function resolve(specifier, context, nextResolve) {
  if (specifier === 'next/server') {
    return nextResolve(new URL('./node_modules/next/server.js', import.meta.url).href, context);
  }
  if (specifier === '@/lib/prisma') {
    return nextResolve(new URL('./lib/prisma.js', import.meta.url).href, context);
  }
  return nextResolve(specifier, context);
}
