export function normalizeSearchText(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function slugify(value: string) {
  return normalizeSearchText(value).replace(/\s+/g, "-");
}

export function titleCaseFromUpper(value: string) {
  return value
    .toLocaleLowerCase("es-MX")
    .replace(/(^|[\s"¡¿([{])(\p{L})/gu, (match, prefix: string, letter: string) => {
      return `${prefix}${letter.toLocaleUpperCase("es-MX")}`;
    });
}
