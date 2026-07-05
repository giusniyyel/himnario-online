import generatedHymns from "./generated-hymns.json";
import type { Hymn, HymnCollection } from "./types";

export const hymns = generatedHymns as Hymn[];

export const collections: Record<
  HymnCollection,
  { id: HymnCollection; label: string; description: string }
> = {
  normal: {
    id: "normal",
    label: "Himnos Normales",
    description: "Colección completa para la adoración."
  },
  special: {
    id: "special",
    label: "Himnos Especiales",
    description: "Selección para ocasiones especiales."
  }
};

export function getHymnsByCollection(collection: HymnCollection) {
  return hymns.filter((hymn) => hymn.collection === collection);
}

export function getHymn(collection: string, slug: string) {
  return hymns.find((hymn) => hymn.collection === collection && hymn.slug === slug);
}

export function getHymnById(id: string) {
  return hymns.find((hymn) => hymn.id === id);
}

export function isHymnCollection(value: string): value is HymnCollection {
  return value === "normal" || value === "special";
}
