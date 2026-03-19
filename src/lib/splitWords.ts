/**
 * Splits a string into an array of individual words.
 * Components render each word as a <span> element for GSAP to animate.
 * A non-breaking space is appended to each word to preserve spacing.
 */
export function splitWords(text: string): string[] {
  return text.trim().split(/\s+/).filter(Boolean)
}
