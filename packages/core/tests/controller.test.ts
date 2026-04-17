import { describe, expect, it } from "vitest";

import { createEmbedController, registerProvider } from "../src";
import type { EmbedProvider } from "../src";

describe("createEmbedController", () => {
  it("matches the youtube provider from a URL", () => {
    const controller = createEmbedController({
      title: "Demo",
      url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    });

    expect(controller.getMatch()).toMatchObject({
      provider: "youtube",
      videoId: "dQw4w9WgXcQ"
    });
  });

  it("accepts direct video ids", () => {
    const controller = createEmbedController({
      provider: "youtube",
      title: "Demo",
      videoId: "dQw4w9WgXcQ"
    });

    expect(controller.getIframeAttributes().src).toContain("/embed/dQw4w9WgXcQ");
  });

  it("prefers an explicit thumbnail override", () => {
    const controller = createEmbedController({
      provider: "youtube",
      title: "Demo",
      videoId: "dQw4w9WgXcQ",
      thumbnail: "https://cdn.example.com/thumb.jpg"
    });

    expect(controller.resolveThumbnail()).toEqual({
      src: "https://cdn.example.com/thumb.jpg"
    });
  });

  it("dedupes preconnect URLs", () => {
    const duplicateProvider: EmbedProvider = {
      name: "duplicate-video",
      match(input) {
        if (!input.videoId) {
          return null;
        }

        return {
          provider: "duplicate-video",
          videoId: input.videoId
        };
      },
      getEmbedUrl(match) {
        return `https://video.example.com/embed/${match.videoId}`;
      },
      getNoScriptIframeAttrs(match, options) {
        return {
          src: `https://video.example.com/embed/${match.videoId}`,
          title: options.title
        };
      },
      getPreconnectUrls() {
        return ["https://video.example.com", "https://video.example.com"];
      },
      getThumbnail(match) {
        return {
          src: `https://cdn.example.com/${match.videoId}.jpg`
        };
      }
    };

    registerProvider(duplicateProvider);

    const controller = createEmbedController({
      provider: "duplicate-video",
      title: "Demo",
      videoId: "abc123"
    });

    expect(controller.getPreconnectUrls()).toEqual(["https://video.example.com"]);
  });

  it("moves through the embed state machine", () => {
    const controller = createEmbedController({
      provider: "youtube",
      title: "Demo",
      videoId: "dQw4w9WgXcQ"
    });

    expect(controller.getState().status).toBe("idle");

    controller.hint();
    expect(controller.getState().status).toBe("hinted");

    controller.activate();
    expect(controller.getState().status).toBe("activated");

    controller.markIframeMounted();
    expect(controller.getState()).toEqual({
      status: "iframe-mounted",
      activated: true,
      hinted: true,
      iframeMounted: true
    });
  });

  it("generates a no-script iframe fallback", () => {
    const controller = createEmbedController({
      provider: "youtube",
      title: "Demo",
      videoId: "dQw4w9WgXcQ"
    });

    expect(controller.getNoScriptIframeAttributes()).toMatchObject({
      src: "https://www.youtube.com/embed/dQw4w9WgXcQ?playsinline=1",
      title: "Demo",
      allowFullScreen: true
    });
  });
});
