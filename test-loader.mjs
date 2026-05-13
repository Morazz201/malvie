export async function resolve(specifier, context, nextResolve) {
  if (specifier === 'next/server') {
    return nextResolve('next/server.js', context);
  }
  if (specifier === '@/lib/prisma') {
    const newSpecifier = new URL('./lib/prisma.js', import.meta.url).href;
    return nextResolve(newSpecifier, context);
  }
  return nextResolve(specifier, context);
}
