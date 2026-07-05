import { normalizeSearchText } from "./normalize";
import type { Hymn, SearchHighlightPart, SearchLyricSnippet, SearchMode, SearchResult } from "./types";

export function searchHymns(hymns: Hymn[], rawQuery: string, mode: SearchMode = "todo") {
  const query = normalizeSearchText(rawQuery);
  const queryTerms = query.split(" ").filter(Boolean);

  if (!query) {
    return [];
  }

  return hymns
    .map<SearchResult | null>((hymn) => {
      const normalizedTitle = normalizeSearchText(hymn.title);
      const normalizedNumber = String(hymn.number);
      const titleMatched = matchesTextQuery(normalizedTitle, query, queryTerms);
      const numberMatched = matchesQuery(normalizedNumber, query, queryTerms);
      const lyricSnippet = createLyricSnippet(hymn, query, queryTerms);
      const lyricsMatched = lyricSnippet !== null;
      const hasAnyMatch = titleMatched || numberMatched || lyricsMatched;

      if (!hasAnyMatch) {
        return null;
      }

      if (mode === "titulos" && !titleMatched) {
        return null;
      }

      if (mode === "numeros" && !numberMatched) {
        return null;
      }

      if (mode === "letras" && !lyricsMatched) {
        return null;
      }

      const shouldShowLyricSnippet = mode === "todo" || mode === "letras";
      const visibleLyricSnippet = shouldShowLyricSnippet ? lyricSnippet : null;

      return {
        hymn,
        titleMatched,
        numberMatched,
        lyricExcerpt: visibleLyricSnippet ? createLyricExcerpt(hymn.plainText, rawQuery) : "",
        lyricSnippet: visibleLyricSnippet
      };
    })
    .filter((result): result is SearchResult => Boolean(result))
    .sort((a, b) => {
      const scoreA = Number(a.numberMatched) * 3 + Number(a.titleMatched) * 2 + Number(Boolean(a.lyricExcerpt));
      const scoreB = Number(b.numberMatched) * 3 + Number(b.titleMatched) * 2 + Number(Boolean(b.lyricExcerpt));
      return scoreB - scoreA || a.hymn.number - b.hymn.number || a.hymn.title.localeCompare(b.hymn.title, "es");
    });
}

function createLyricSnippet(hymn: Hymn, query: string, queryTerms: string[]): SearchLyricSnippet | null {
  for (const section of hymn.sections) {
    const matchingLineIndex = section.lines.findIndex((line) =>
      matchesTextQuery(normalizeSearchText(line), query, queryTerms)
    );

    if (matchingLineIndex === -1) {
      continue;
    }

    const start = Math.max(0, matchingLineIndex - 1);
    const end = Math.min(section.lines.length, matchingLineIndex + 2);
    const rawLines = section.lines.slice(start, end);

    return {
      sectionLabel: section.label,
      lines: rawLines.map((line) => highlightLine(line, queryTerms))
    };
  }

  return null;
}

function createLyricExcerpt(text: string, rawQuery: string) {
  const lines = text
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);
  const normalizedQuery = normalizeSearchText(rawQuery);
  const queryTerms = normalizedQuery.split(" ").filter(Boolean);
  const match =
    lines.find((line) => matchesTextQuery(normalizeSearchText(line), normalizedQuery, queryTerms)) ?? lines[0] ?? "";

  return match.length > 140 ? `${match.slice(0, 137).trim()}...` : match;
}

function highlightLine(line: string, queryTerms: string[]): SearchHighlightPart[] {
  if (queryTerms.length === 0) {
    return [{ text: line, highlighted: false }];
  }

  const characters = Array.from(line);
  const normalizedCharacters = characters.map((character) => normalizeSearchCharacter(character));
  const normalizedToOriginal = normalizedCharacters.reduce<number[]>((indexes, normalizedCharacter, originalIndex) => {
    for (let index = 0; index < normalizedCharacter.length; index += 1) {
      indexes.push(originalIndex);
    }

    return indexes;
  }, []);
  const normalizedLine = normalizedCharacters.join("");
  const normalizedTokens = getNormalizedTokens(normalizedLine);
  const highlighted = new Array(characters.length).fill(false) as boolean[];

  for (const term of queryTerms) {
    const matchingTokens = normalizedTokens.filter((token) => token.value === term);

    for (const token of matchingTokens) {
      const start = normalizedToOriginal[token.start];
      const end = normalizedToOriginal[token.end - 1];
      if (start !== undefined && end !== undefined) {
        for (let index = start; index <= end; index += 1) {
          highlighted[index] = true;
        }
      }
    }
  }

  return characters.reduce<SearchHighlightPart[]>((parts, character, index) => {
    const highlightedState = highlighted[index];
    const lastPart = parts.at(-1);

    if (lastPart && lastPart.highlighted === highlightedState) {
      lastPart.text += character;
      return parts;
    }

    parts.push({ text: character, highlighted: highlightedState });
    return parts;
  }, []);
}

function matchesQuery(value: string, query: string, queryTerms: string[]) {
  return value.includes(query) || queryTerms.every((term) => value.includes(term));
}

function matchesTextQuery(value: string, query: string, queryTerms: string[]) {
  const paddedValue = ` ${value} `;
  const hasExactPhrase = paddedValue.includes(` ${query} `);

  if (hasExactPhrase) {
    return true;
  }

  const valueTokens = new Set(getNormalizedTokens(value).map((token) => token.value));
  return queryTerms.every((term) => valueTokens.has(term));
}

function normalizeSearchCharacter(character: string) {
  const normalized = character
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();

  return /[\p{L}\p{N}]/u.test(normalized) ? normalized : " ";
}

function getNormalizedTokens(value: string) {
  return Array.from(value.matchAll(/\S+/g)).map((match) => ({
    value: match[0],
    start: match.index,
    end: match.index + match[0].length
  }));
}
