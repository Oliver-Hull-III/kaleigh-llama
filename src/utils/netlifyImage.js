export function netlifyImageUrl(src, { w, q = 75, fit = 'cover' } = {}) {
    const path = src.startsWith('/') ? src : `/${src}`;
    const params = new URLSearchParams({ url: path, q: String(q) });
    if (w) params.set('w', String(w));
    if (fit) params.set('fit', fit);
    return `/.netlify/images?${params.toString()}`;
}