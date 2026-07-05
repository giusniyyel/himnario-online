import { searchHymns } from "./search";
import type { Hymn } from "./types";

const hymns: Hymn[] = [
  {
    id: "normal:1-mas-alla-del-sol",
    collection: "normal",
    number: 1,
    suffix: "",
    slug: "1-mas-alla-del-sol",
    title: "MÁS ALLÁ DEL SOL",
    displayTitle: "Más Allá Del Sol",
    presentation: "V1 C",
    key: "",
    sections: [{ kind: "verse", label: "Estrofa 1", order: 1, lines: ["tengo mi mansión"] }],
    plainText: "tengo mi mansión"
  },
  {
    id: "special:15-cristo-mi-rey",
    collection: "special",
    number: 15,
    suffix: "",
    slug: "15-cristo-mi-rey",
    title: "CRISTO MI REY",
    displayTitle: "Cristo Mi Rey",
    presentation: "V1",
    key: "",
    sections: [{ kind: "verse", label: "Estrofa 1", order: 1, lines: ["Cristo vive"] }],
    plainText: "Cristo vive"
  },
  {
    id: "normal:21-bellas-palabras",
    collection: "normal",
    number: 21,
    suffix: "",
    slug: "21-bellas-palabras",
    title: "BELLAS PALABRAS DE VIDA",
    displayTitle: "Bellas Palabras De Vida",
    presentation: "V1",
    key: "",
    sections: [{ kind: "verse", label: "Estrofa 1", order: 1, lines: ["Oh, cántamelas otra vez. Habla Jesús, Señor."] }],
    plainText: "Oh, cántamelas otra vez. Habla Jesús, Señor."
  },
  {
    id: "normal:95-cuando-andemos-con-dios",
    collection: "normal",
    number: 95,
    suffix: "",
    slug: "95-cuando-andemos-con-dios",
    title: "CUANDO ANDEMOS CON DIOS",
    displayTitle: "Cuando Andemos Con Dios",
    presentation: "V1",
    key: "",
    sections: [
      {
        kind: "verse",
        label: "Estrofa 1",
        order: 1,
        lines: ["Nuestra senda Florida será:", "Si acatamos su ley, Él será nuestro Rey,", "Y con Él reinaremos allá."]
      }
    ],
    plainText: "Nuestra senda Florida será:\nSi acatamos su ley, Él será nuestro Rey,\nY con Él reinaremos allá."
  },
  {
    id: "normal:96-el-es-el-rey",
    collection: "normal",
    number: 96,
    suffix: "",
    slug: "96-el-es-el-rey",
    title: "EL ES EL REY",
    displayTitle: "El Es El Rey",
    presentation: "V1",
    key: "",
    sections: [
      {
        kind: "verse",
        label: "Estrofa 1",
        order: 1,
        lines: ["Él es el Rey de mi vida.", "Entonces Jesús nos guía."]
      }
    ],
    plainText: "Él es el Rey de mi vida.\nEntonces Jesús nos guía."
  }
];

describe("searchHymns", () => {
  it("matches title text without accents", () => {
    expect(searchHymns(hymns, "mas alla", "titulos")[0]?.hymn.id).toBe("normal:1-mas-alla-del-sol");
  });

  it("does not show lyric snippets in title mode", () => {
    const results = searchHymns(hymns, "rey", "titulos");

    expect(results.map((result) => result.hymn.id)).toEqual([
      "special:15-cristo-mi-rey",
      "normal:96-el-es-el-rey"
    ]);
    expect(results.every((result) => result.titleMatched)).toBe(true);
    expect(results.every((result) => result.lyricSnippet === null)).toBe(true);
  });

  it("matches numbers", () => {
    expect(searchHymns(hymns, "15", "numeros")[0]?.hymn.id).toBe("special:15-cristo-mi-rey");
  });

  it("matches lyric text without accents", () => {
    const result = searchHymns(hymns, "mansion", "letras")[0];

    expect(result?.lyricExcerpt).toBe("tengo mi mansión");
    expect(result?.lyricSnippet).toMatchObject({
      sectionLabel: "Estrofa 1",
      lines: [[{ text: "tengo mi ", highlighted: false }, { text: "mansión", highlighted: true }]]
    });
  });

  it("matches Spanish diacritics when the query omits them", () => {
    const results = searchHymns(hymns, "cantamelas jesus senor", "letras");

    expect(results[0]?.hymn.id).toBe("normal:21-bellas-palabras");
    expect(results[0]?.lyricSnippet?.lines[0]).toEqual([
      { text: "Oh, ", highlighted: false },
      { text: "cántamelas", highlighted: true },
      { text: " otra vez. Habla ", highlighted: false },
      { text: "Jesús", highlighted: true },
      { text: ", ", highlighted: false },
      { text: "Señor", highlighted: true },
      { text: ".", highlighted: false }
    ]);
  });

  it("does not match short words inside larger words", () => {
    const results = searchHymns(hymns, "el es el rey", "letras");

    expect(results.map((result) => result.hymn.id)).toContain("normal:96-el-es-el-rey");
    expect(results.map((result) => result.hymn.id)).not.toContain("normal:95-cuando-andemos-con-dios");
  });

  it("only returns lyric-mode results that can show a lyric snippet", () => {
    const results = searchHymns(hymns, "cristo rey", "letras");

    expect(results.map((result) => result.hymn.id)).not.toContain("special:15-cristo-mi-rey");
    expect(results.every((result) => result.lyricSnippet !== null)).toBe(true);
  });

  it("highlights only complete matching words", () => {
    const result = searchHymns(hymns, "el es el rey", "letras").find(
      (searchResult) => searchResult.hymn.id === "normal:96-el-es-el-rey"
    );

    expect(result?.lyricSnippet?.lines[0]).toEqual([
      { text: "Él", highlighted: true },
      { text: " ", highlighted: false },
      { text: "es", highlighted: true },
      { text: " ", highlighted: false },
      { text: "el", highlighted: true },
      { text: " ", highlighted: false },
      { text: "Rey", highlighted: true },
      { text: " de mi vida.", highlighted: false }
    ]);
    expect(result?.lyricSnippet?.lines[1]).toEqual([{ text: "Entonces Jesús nos guía.", highlighted: false }]);
  });
});
