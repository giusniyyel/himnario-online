import { expect, test } from "@playwright/test";

test("opens the library and searches hymns", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("link", { name: /Himnos Normales/ })).toBeVisible();

  const search = page.getByRole("searchbox", { name: "Buscar himnos" });
  await search.fill("mas alla");
  await expect(search).toHaveValue("mas alla");
  await search.press("Enter");

  await expect(page).toHaveURL(/\/buscar\?q=mas(\+|%20)alla/);
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

test("configuration shows info link rows", async ({ page }) => {
  await page.goto("/configuracion");

  await expect(page.getByRole("link", { name: "Acerca de" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Términos de uso" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Política de privacidad" })).toBeVisible();

  await page.getByRole("link", { name: "Acerca de" }).click();
  await expect(page).toHaveURL("/acerca");

  await page.goto("/configuracion");
  await page.getByRole("link", { name: "Política de privacidad" }).click();
  await expect(page.getByRole("heading", { name: "Política de privacidad" })).toBeVisible();

  await page.goto("/configuracion");
  await page.getByRole("link", { name: "Términos de uso" }).click();
  await expect(page.getByRole("heading", { name: "Términos de uso" })).toBeVisible();
});

test("about page shows project details", async ({ page }) => {
  await page.goto("/acerca");

  await expect(page.getByText("Cantad a Jehová cántico nuevo")).toBeVisible();
  await expect(page.getByText("— Salmo 149:1")).toBeVisible();
  await expect(page.getByRole("main").getByText("Iglesia de Dios en México", { exact: true })).toBeVisible();
  await expect(page.getByText("Versión 0.1.0")).toBeVisible();
  await expect(page.getByText("406 himnos")).toBeVisible();
  await expect(page.getByText("Diseñado por y para la iglesia.")).toBeVisible();
  await expect(page.getByRole("main").getByRole("link", { name: /Daniel Campos/ })).toHaveAttribute(
    "href",
    "https://www.giusniyyel.dev/"
  );
});
