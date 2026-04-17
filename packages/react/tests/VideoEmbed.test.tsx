import { fireEvent, render, screen } from "@testing-library/react";
import { act } from "react";
import ReactDOMServer from "react-dom/server";
import { hydrateRoot } from "react-dom/client";
import { describe, expect, it } from "vitest";

import { VideoEmbed, VideoEmbedPrimitive } from "../src";

describe("VideoEmbed React APIs", () => {
  it("renders safely during SSR", () => {
    const html = ReactDOMServer.renderToString(
      <VideoEmbedPrimitive provider="youtube" title="Demo video" videoId="dQw4w9WgXcQ" />
    );

    expect(html).toContain('aria-label="Play video: Demo video"');
    expect(html).toContain("<noscript>");
    expect(html).toContain('data-slot="button"');
  });

  it("keeps the placeholder stable through hydration", async () => {
    const container = document.createElement("div");
    container.innerHTML = ReactDOMServer.renderToString(
      <VideoEmbedPrimitive provider="youtube" title="Hydrated video" videoId="dQw4w9WgXcQ" />
    );

    await act(async () => {
      hydrateRoot(container, <VideoEmbedPrimitive provider="youtube" title="Hydrated video" videoId="dQw4w9WgXcQ" />);
    });

    expect(container.querySelector("button")).not.toBeNull();
    expect(container.querySelector("iframe")).toBeNull();
  });

  it("swaps the placeholder for an iframe on click", () => {
    render(<VideoEmbedPrimitive provider="youtube" title="Clickable video" videoId="dQw4w9WgXcQ" />);

    fireEvent.click(screen.getByRole("button", { name: "Play video: Clickable video" }));

    const iframe = screen.getByTitle("Clickable video");
    expect(iframe).not.toBeNull();
    expect(iframe.getAttribute("src")).toContain("autoplay=1");
  });

  it("supports keyboard activation", () => {
    render(<VideoEmbedPrimitive provider="youtube" title="Keyboard video" videoId="dQw4w9WgXcQ" />);

    fireEvent.keyDown(screen.getByRole("button", { name: "Play video: Keyboard video" }), { key: "Enter" });

    expect(screen.getByTitle("Keyboard video")).not.toBeNull();
  });

  it("keeps accessibility labels on the styled component", () => {
    render(<VideoEmbed provider="youtube" title="Styled video" videoId="dQw4w9WgXcQ" />);

    expect(screen.getByRole("button", { name: "Play video: Styled video" })).not.toBeNull();
  });
});
