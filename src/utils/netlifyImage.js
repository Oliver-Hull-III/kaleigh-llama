export function netlifyImageUrl(src, { w, h, q = 75, fit } = {}) {
    const path = src.startsWith('/') ? src : `/${src}`;
    const params = new URLSearchParams({ url: path, q: String(q) });
    if (w) params.set('w', String(w));
    if (h) params.set('h', String(h));
    if (fit) params.set('fit', fit);
    return `/.netlify/images?${params.toString()}`;
}