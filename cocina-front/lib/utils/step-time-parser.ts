/**
 * Extracts duration in seconds from recipe step text.
 * Supports Spanish, English, and French time expressions.
 */

const TIME_PATTERNS = [
  // Spanish
  /(\d+)\s*(?:a\s*\d+\s*)?(?:minutos?|mins?)\b/i,
  /(\d+)\s*(?:a\s*\d+\s*)?(?:horas?|hrs?)\b/i,
  /(\d+)\s*(?:a\s*\d+\s*)?(?:segundos?|segs?)\b/i,
  // English
  /(\d+)\s*(?:to\s*\d+\s*)?(?:minutes?|mins?)\b/i,
  /(\d+)\s*(?:to\s*\d+\s*)?(?:hours?|hrs?)\b/i,
  /(\d+)\s*(?:to\s*\d+\s*)?(?:seconds?|secs?)\b/i,
  // French
  /(\d+)\s*(?:à\s*\d+\s*)?(?:minutes?|mins?)\b/i,
  /(\d+)\s*(?:à\s*\d+\s*)?(?:heures?|hrs?)\b/i,
  /(\d+)\s*(?:à\s*\d+\s*)?(?:secondes?|secs?)\b/i,
];

const HOUR_KEYWORDS = /horas?|hrs?|hours?|heures?/i;
const SECOND_KEYWORDS = /segundos?|segs?|seconds?|secs?|secondes?/i;

export function parseStepDuration(text: string): number | null {
  for (const pattern of TIME_PATTERNS) {
    const match = text.match(pattern);
    if (match) {
      const value = Number(match[1]);
      const unitPart = match[0];

      if (HOUR_KEYWORDS.test(unitPart)) return value * 3600;
      if (SECOND_KEYWORDS.test(unitPart)) return value;
      // Default: minutes
      return value * 60;
    }
  }
  return null;
}
