import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  const isAdminApi = pathname.startsWith('/api/admin/') && !pathname.startsWith('/api/admin/login');
  const isUploadApi = pathname.startsWith('/api/upload');
  const isProductsApi = pathname.startsWith('/api/products') && ['POST', 'PUT', 'DELETE'].includes(request.method);

  if (isAdminApi || isUploadApi || isProductsApi) {
    const adminSession = request.cookies.get('admin_session')?.value;
    const adminSecret = process.env.ADMIN_SECRET;

    if (!adminSecret || adminSession !== adminSecret) {
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { 'content-type': 'application/json' } }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*'],
};
