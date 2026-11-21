// Admin texts (descriptions) may contain HTML from the old editor; the site shows them as plain text.
export function plainText(html?: string | null): string | undefined {
  if (!html) return undefined
  const text = new DOMParser().parseFromString(html, 'text/html').body.textContent ?? ''
  const squished = text.replace(/\s+/g, ' ').trim()
  return squished || undefined
}
