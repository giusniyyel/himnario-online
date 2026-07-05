import { access, mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const sourceRoot = path.join(root, "docs", "himnario");
const outputPath = path.join(root, "src", "lib", "hymns", "generated-hymns.json");
const publicPath = path.join(root, "public", "hymns.json");
const precachePath = path.join(root, "public", "precache-urls.json");
const hymnsPerPage = 24;

async function sourceExists() {
  try {
    await access(sourceRoot);
    return true;
  } catch {
    return false;
  }
}

const collectionSources = [
  { collection: "normal", dir: "Himnario Rayo de Esperanza" },
  { collection: "special", dir: "Himnos Especiales Rayos de Esperanza" }
];

function readTag(xml, tag) {
  const match = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"));
  return decodeXml(match?.[1]?.trim() ?? "");
}

function decodeXml(value) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");
}

function normalizeSearchText(value) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function slugify(value) {
  return normalizeSearchText(value).replace(/\s+/g, "-");
}

function titleCaseFromUpper(value) {
  return value
    .toLocaleLowerCase("es-MX")
    .replace(/(^|[\s"¡¿([{])(\p{L})/gu, (_match, prefix, letter) => `${prefix}${letter.toLocaleUpperCase("es-MX")}`);
}

function parseTitle(rawTitle) {
  const normalized = rawTitle.replace(/\s+/g, " ").trim();
  const match = normalized.match(/^(\d+)([A-Za-zªº]*)\s*(?:ESP\s*[-–]\s*)?(.+)$/u);

  if (!match) {
    return {
      number: 0,
      suffix: "",
      title: normalized,
      displayTitle: titleCaseFromUpper(normalized)
    };
  }

  const [, number, suffix = "", title] = match;

  return {
    number: Number(number),
    suffix,
    title: title.trim(),
    displayTitle: titleCaseFromUpper(title.trim())
  };
}

function parseSections(rawLyrics) {
  const chunks = rawLyrics
    .replace(/\r\n/g, "\n")
    .split(/(?=\[[^\]]+\])/g)
    .map((chunk) => chunk.trim())
    .filter(Boolean);

  return chunks.map((chunk, index) => {
    const tagMatch = chunk.match(/^\[([^\]]+)\]\s*([^\n]*)\n?/);
    const tag = tagMatch?.[1]?.trim() ?? `O${index + 1}`;
    const rawLabel = tagMatch?.[2]?.trim().replace(/:+$/, "") ?? "";
    const body = chunk.slice(tagMatch?.[0]?.length ?? 0);
    const kind = tag.toUpperCase().startsWith("C")
      ? "chorus"
      : tag.toUpperCase().startsWith("V")
        ? "verse"
        : "other";
    const fallbackLabel =
      kind === "chorus" ? "Coro" : kind === "verse" ? `Estrofa ${tag.replace(/\D/g, "") || index + 1}` : tag;
    const label = rawLabel && !/^\d+$/.test(rawLabel) ? rawLabel : fallbackLabel;
    const lines = body
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    return {
      kind,
      label,
      order: index + 1,
      lines
    };
  });
}

async function readCollection({ collection, dir }) {
  const dirPath = path.join(sourceRoot, dir);
  const names = await readdir(dirPath);
  const hymns = [];

  for (const name of names) {
    if (name.startsWith(".")) {
      continue;
    }

    const filePath = path.join(dirPath, name);
    const xml = await readFile(filePath, "utf8");
    const rawTitle = readTag(xml, "title") || name;
    const parsedTitle = parseTitle(rawTitle);
    const sections = parseSections(readTag(xml, "lyrics"));
    const suffix = parsedTitle.suffix;
    const numberLabel = `${parsedTitle.number}${suffix}`;
    const slug = slugify(`${numberLabel} ${parsedTitle.title}`);
    const id = `${collection}:${slug}`;
    const plainText = sections.map((section) => section.lines.join("\n")).join("\n\n");

    hymns.push({
      id,
      collection,
      number: parsedTitle.number,
      suffix,
      slug,
      title: parsedTitle.title,
      displayTitle: parsedTitle.displayTitle,
      presentation: readTag(xml, "presentation"),
      key: readTag(xml, "key"),
      sections,
      plainText
    });
  }

  return hymns.sort((a, b) => a.number - b.number || a.suffix.localeCompare(b.suffix, "es") || a.title.localeCompare(b.title, "es"));
}

function buildPrecacheUrls(hymns) {
  const urls = new Set(["/", "/buscar", "/favoritos", "/configuracion", "/hymns.json", "/icon.svg", "/offline.html"]);

  for (const hymn of hymns) {
    urls.add(`/himno/${hymn.collection}/${hymn.slug}`);
  }

  for (const collection of ["normal", "special"]) {
    const count = hymns.filter((hymn) => hymn.collection === collection).length;
    const totalPages = Math.max(1, Math.ceil(count / hymnsPerPage));

    for (let page = 1; page <= totalPages; page += 1) {
      urls.add(page <= 1 ? `/coleccion/${collection}` : `/coleccion/${collection}?pagina=${page}`);
    }
  }

  return [...urls];
}

async function writePrecacheUrls(hymns) {
  await writeFile(precachePath, `${JSON.stringify(buildPrecacheUrls(hymns), null, 2)}\n`);
}

async function loadExistingHymns() {
  const raw = await readFile(outputPath, "utf8");
  return JSON.parse(raw);
}

if (!(await sourceExists())) {
  const existing = await loadExistingHymns();
  await writePrecacheUrls(existing);
  console.log(`Skipping hymn generation: docs/himnario not found, using committed JSON (${existing.length} hymns).`);
  console.log(`Updated precache URLs (${buildPrecacheUrls(existing).length} routes).`);
  process.exit(0);
}

const generated = (await Promise.all(collectionSources.map(readCollection))).flat();

await mkdir(path.dirname(outputPath), { recursive: true });
await mkdir(path.dirname(publicPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(generated, null, 2)}\n`);
await writeFile(publicPath, `${JSON.stringify({ generatedAt: new Date().toISOString(), hymns: generated }, null, 2)}\n`);
await writePrecacheUrls(generated);

console.log(`Generated ${generated.length} hymns.`);
console.log(`Updated precache URLs (${buildPrecacheUrls(generated).length} routes).`);
