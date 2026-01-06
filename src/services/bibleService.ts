
import { BibleApiResponse, ReadingQuery } from '../types';

/**
 * Fetches Bible text for a specific reference.
 */
export async function fetchBibleText(reference: string, translation: string = 'almeida'): Promise<BibleApiResponse> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

  try {
    const response = await fetch(`https://bible-api.com/${reference}?translation=${translation}`, {
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Failed to fetch Bible text: ${response.status}`);
    }
    return response.json();
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new Error('Tempo de requisição excedido (Timeout).');
    }
    throw err;
  }
}

/**
 * Parses a reading plan string like "Gn 1-3; Jó 1" into an array of sigla + chapter.
 */
export function parseReadingPlan(planString: string): ReadingQuery[] {
  if (!planString) return [];
  let queries: ReadingQuery[] = [];
  let parts = planString.split(';');
  parts.forEach(part => {
    let p = part.trim();
    if (!p) return;

    // Pattern to match: BookSigla Range (e.g., "Gn 1-3" or "Jó 1")
    const match = p.match(/^([1-3]?[A-Za-zÀ-ÿ\s]+)\s+(\d+.*)$/);
    if (!match) return;

    const sigla = match[1].trim();
    let rangeStr = match[2].replace(/[–—]/g, '-'); // Replace en-dash and em-dash with hyphen

    if (rangeStr.includes('-')) {
      const rangeParts = rangeStr.split('-');
      const start = parseInt(rangeParts[0]);
      const end = parseInt(rangeParts[1]);
      for (let c = start; c <= end; c++) {
        queries.push({ sigla, cap: c });
      }
    } else if (rangeStr.includes(',')) {
      const chapters = rangeStr.split(',');
      chapters.forEach(c => {
        queries.push({ sigla, cap: parseInt(c.trim()) });
      });
    } else {
      queries.push({ sigla, cap: parseInt(rangeStr) });
    }
  });
  return queries;
}
