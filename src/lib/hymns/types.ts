export type HymnCollection = "normal" | "special";

export type HymnSectionKind = "verse" | "chorus" | "other";

export type HymnSection = {
  kind: HymnSectionKind;
  label: string;
  order: number;
  lines: string[];
};

export type Hymn = {
  id: string;
  collection: HymnCollection;
  number: number;
  suffix: string;
  slug: string;
  title: string;
  displayTitle: string;
  presentation: string;
  key: string;
  sections: HymnSection[];
  plainText: string;
};

export type SearchMode = "todo" | "titulos" | "numeros" | "letras";

export type SearchResult = {
  hymn: Hymn;
  titleMatched: boolean;
  numberMatched: boolean;
  lyricExcerpt: string;
  lyricSnippet: SearchLyricSnippet | null;
};

export type SearchHighlightPart = {
  text: string;
  highlighted: boolean;
};

export type SearchLyricSnippet = {
  sectionLabel: string;
  lines: SearchHighlightPart[][];
};
