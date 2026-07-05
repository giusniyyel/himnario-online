import {
  addRecent,
  readUserSettings,
  toggleFavorite,
  writeReadingSettings
} from "./user-preferences";

describe("local user preferences", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("returns defaults when storage is empty", () => {
    expect(readUserSettings()).toMatchObject({
      favoriteIds: [],
      recentIds: [],
      textScale: 1,
      theme: "light",
      lyricAlign: "center"
    });
  });

  it("toggles favorites", () => {
    expect(toggleFavorite("normal:1")).toEqual(["normal:1"]);
    expect(toggleFavorite("normal:1")).toEqual([]);
  });

  it("keeps recents unique and newest first", () => {
    addRecent("normal:1");
    addRecent("normal:2");
    addRecent("normal:1");

    expect(readUserSettings().recentIds).toEqual(["normal:1", "normal:2"]);
  });

  it("keeps at most eight recents", () => {
    Array.from({ length: 10 }, (_, index) => `normal:${index + 1}`).forEach(addRecent);

    expect(readUserSettings().recentIds).toEqual([
      "normal:10",
      "normal:9",
      "normal:8",
      "normal:7",
      "normal:6",
      "normal:5",
      "normal:4",
      "normal:3"
    ]);
  });

  it("clamps reading settings", () => {
    writeReadingSettings({ textScale: 3, theme: "dark", lyricAlign: "left" });

    expect(readUserSettings()).toMatchObject({
      textScale: 1.35,
      theme: "dark",
      lyricAlign: "left"
    });
  });
});
