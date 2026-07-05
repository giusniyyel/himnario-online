import { expect, test } from "@playwright/test";

test("opens the library and searches hymns", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("link", { name: /Himnos Normales/ })).toBeVisible();

  await page.getByRole("searchbox", { name: "Buscar himnos" }).fill("mas alla");
  await page.keyboard.press("Enter");

  await expect(page.getByRole("link", { name: /Más Allá Del Sol/i })).toBeVisible();
});

test("clears the library search without navigating away", async ({ page }) => {
  await page.goto("/");
  const search = page.getByRole("searchbox", { name: "Buscar himnos" });

  await search.fill("555555");
  await page.getByRole("button", { name: "Limpiar búsqueda" }).click();

  await expect(page).toHaveURL("/");
  await expect(search).toHaveValue("");
});

test("lyric search shows highlighted matching snippet", async ({ page }) => {
  await page.goto("/buscar?q=mansion&modo=letras");

  await expect(page.getByText(/Estrofa 1|Coro/).first()).toBeVisible();
  await expect(page.locator("mark", { hasText: /mansión/i }).first()).toBeVisible();
});

test("lyric search only shows results with lyric snippets", async ({ page }) => {
  await page.goto("/buscar?q=el+es+el+rey&modo=letras");

  await expect(page.getByText("Tengo un amigo fiel")).toHaveCount(0);
  const resultCards = page.locator("a.group");
  const cardCount = await resultCards.count();
  await expect(page.locator("a.group").filter({ has: page.locator("mark") })).toHaveCount(cardCount);
});

test("opens a hymn and persists favorite locally", async ({ page }) => {
  await page.goto("/himno/normal/1-mas-alla-del-sol");
  await expect(page.getByRole("heading", { name: /Más Allá Del Sol/i })).toBeVisible();

  const favoriteButton = page.getByRole("button", { name: /Favorito/ });
  await favoriteButton.click();
  await expect(favoriteButton).toHaveAttribute("aria-pressed", "true");
  await page.goto("/favoritos");

  await expect(page.getByRole("link", { name: /Más Allá Del Sol/i })).toBeVisible();
});

test("reader back link returns to favorites when opened from favorites", async ({ page }) => {
  await page.goto("/himno/normal/1-mas-alla-del-sol");

  const favoriteButton = page.getByRole("button", { name: /Favorito/ });
  await favoriteButton.click();
  await expect(favoriteButton).toHaveAttribute("aria-pressed", "true");

  await page.goto("/favoritos");
  await page.getByRole("link", { name: /Más Allá Del Sol/i }).click();

  await expect(page).toHaveURL(/from=favorites/);
  await expect(page.getByRole("link", { name: "Volver a Favoritos" })).toHaveAttribute("href", "/favoritos");
});

test("reader return goes back to the same search results position", async ({ page }) => {
  await page.goto("/buscar?q=rey&modo=letras");
  const result = page.locator("a.group").nth(3);
  await result.scrollIntoViewIfNeeded();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(40);

  await result.click();
  await expect(page.getByRole("link", { name: "Volver a Buscar" })).toHaveAttribute("href", "/buscar?q=rey&modo=letras");

  await page.getByRole("link", { name: "Volver a Buscar" }).click();

  await expect(page).toHaveURL(/\/buscar\?q=rey&modo=letras/);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(40);
});

test("reader return restores the paginated catalog page and scroll", async ({ page }) => {
  await page.goto("/coleccion/normal?pagina=2");
  const result = page.locator("a.group").nth(12);
  await result.scrollIntoViewIfNeeded();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(100);

  await result.click();
  await expect(page.getByRole("link", { name: "Volver a Himnos Normales" })).toHaveAttribute(
    "href",
    "/coleccion/normal?pagina=2"
  );

  await page.getByRole("link", { name: "Volver a Himnos Normales" }).click();

  await expect(page).toHaveURL(/\/coleccion\/normal\?pagina=2/);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(100);
});

test("direct hymn pages fall back to the hymn collection", async ({ page }) => {
  await page.goto("/himno/normal/1-mas-alla-del-sol");

  await expect(page.getByRole("link", { name: "Volver a Himnos Normales" })).toHaveAttribute("href", "/coleccion/normal");
});

test("reading settings persist across hymns and text size can reset", async ({ page }) => {
  await page.goto("/configuracion");
  await page.getByRole("button", { name: "Aumentar texto" }).click();
  await page.getByRole("button", { name: "Aumentar texto" }).click();
  await page.getByRole("button", { name: "Izquierda" }).click();
  await page.getByRole("button", { name: "Oscuro" }).click();
  await expect(page.getByRole("button", { name: "Aumentar texto" })).toHaveCSS("color", "rgb(235, 241, 255)");
  await expect(page.getByRole("button", { name: "Restablecer tamaño de texto" })).toHaveCSS("color", "rgb(235, 241, 255)");
  await expect(page.getByRole("button", { name: "Izquierda" })).toHaveCSS("color", "rgb(0, 27, 60)");

  await page.goto("/himno/normal/2-no-quiero-estar-ligado");

  await expect
    .poll(async () =>
      page.evaluate(() => ({
        readerScale: document.documentElement.style.getPropertyValue("--reader-scale"),
        readerAlign: document.documentElement.style.getPropertyValue("--reader-align"),
        theme: document.documentElement.dataset.theme,
        stored: window.localStorage.getItem("himnario:v1:settings")
      }))
    )
    .toMatchObject({
      readerScale: "1.1",
      readerAlign: "left",
      theme: "dark",
      stored: JSON.stringify({ textScale: 1.1, theme: "dark", lyricAlign: "left" })
    });

  await page.goto("/configuracion");
  await page.getByRole("button", { name: "Restablecer tamaño de texto" }).click();

  await expect
    .poll(async () =>
      page.evaluate(() => ({
        readerScale: document.documentElement.style.getPropertyValue("--reader-scale"),
        stored: window.localStorage.getItem("himnario:v1:settings")
      }))
    )
    .toMatchObject({
      readerScale: "1",
      stored: JSON.stringify({ textScale: 1, theme: "dark", lyricAlign: "left" })
    });
});

test("configuration can be set before opening a hymn", async ({ page }) => {
  await page.goto("/configuracion");
  await expect(page.getByRole("heading", { name: "Configuración" })).toBeVisible();

  await page.getByRole("button", { name: "Aumentar texto" }).click();
  await page.getByRole("button", { name: "Izquierda" }).click();
  await page.getByRole("button", { name: "Oscuro" }).click();

  await page.goto("/himno/normal/1-mas-alla-del-sol");

  await expect
    .poll(async () =>
      page.evaluate(() => ({
        readerScale: document.documentElement.style.getPropertyValue("--reader-scale"),
        readerAlign: document.documentElement.style.getPropertyValue("--reader-align"),
        theme: document.documentElement.dataset.theme,
        stored: window.localStorage.getItem("himnario:v1:settings")
      }))
    )
    .toMatchObject({
      readerScale: "1.05",
      readerAlign: "left",
      theme: "dark",
      stored: JSON.stringify({ textScale: 1.05, theme: "dark", lyricAlign: "left" })
    });
});
