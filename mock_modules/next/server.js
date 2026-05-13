export const NextResponse = {
  json: (body, options = {}) => ({
    body,
    status: options.status || 200,
    headers: options.headers || {},
  }),
};
