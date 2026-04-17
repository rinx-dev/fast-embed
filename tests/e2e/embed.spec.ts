import { expect, test } from "@playwright/test";

test("loads the iframe only after click", async ({ page }) => {
  await page.goto("/");

  const demo = page.getByTestId("demo-hover");

  await expect(demo.locator("iframe")).toHaveCount(0);
  await demo.getByRole("button", { name: "Play video: Hover preconnect demo" }).click();
  await expect(demo.locator("iframe")).toHaveCount(1);
  await expect(demo.locator("iframe")).toHaveAttribute("src", /youtube\.com\/embed\/dQw4w9WgXcQ/);
});

test("renders a noscript fallback and only preconnects when configured", async ({ page }) => {
  await page.goto("/");

  const noPreconnect = page.getByTestId("demo-no-preconnect");
  await noPreconnect.getByRole("button", { name: "Play video: Headless no-preconnect demo" }).hover();

  await expect(
    page.locator('head link[rel="preconnect"][href="https://www.youtube.com"]')
  ).toHaveCount(0);
  await expect(noPreconnect.locator("noscript")).toHaveCount(1);

  const hoverDemo = page.getByTestId("demo-hover");
  await hoverDemo.getByRole("button", { name: "Play video: Hover preconnect demo" }).hover();

  await expect(
    page.locator('head link[rel="preconnect"][href="https://www.youtube.com"]')
  ).toHaveCount(1);
});
