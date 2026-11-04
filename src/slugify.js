const MAX_LENGTH = 80;
const LETTERS = { ß: 'ss', æ: 'ae', œ: 'oe', ø: 'o', ł: 'l', đ: 'd' };

/** Turn a title into a URL slug: lowercase ASCII letters and digits joined by single hyphens, at most 80 characters, cut at a hyphen. */
export function slugify(title) {
  const slug = String(title)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[ßæœøłđ]/g, (letter) => LETTERS[letter])
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  if (slug.length <= MAX_LENGTH) return slug;
  const cut = slug.lastIndexOf('-', MAX_LENGTH);
  return cut === -1 ? slug.slice(0, MAX_LENGTH) : slug.slice(0, cut);
}
