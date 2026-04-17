import { createEmbedController, type EmbedState, type IframeAttributes } from "@fast-embed/core";
import { useEffect, useMemo, useRef, useState, type ComponentPropsWithoutRef, type KeyboardEvent } from "react";

import type { VideoEmbedProps } from "./types";

const preconnectedUrls = new Set<string>();

function appendPreconnectLinks(urls: string[]) {
  if (typeof document === "undefined") {
    return;
  }

  for (const url of urls) {
    if (preconnectedUrls.has(url)) {
      continue;
    }

    const link = document.createElement("link");
    link.rel = "preconnect";
    link.href = url;
    link.crossOrigin = "";
    document.head.append(link);
    preconnectedUrls.add(url);
  }
}

export function useVideoEmbed(props: VideoEmbedProps) {
  const {
    aspectRatio = "16 / 9",
    autoplayOnClick = true,
    iframeProps,
    params,
    preconnect = "hover",
    provider,
    thumbnail,
    title,
    url,
    videoId
  } = props;
  const rootRef = useRef<HTMLDivElement | null>(null);

  const controller = useMemo(
    () =>
      createEmbedController({
        autoplayOnClick,
        params,
        preconnect,
        provider,
        thumbnail,
        title,
        url,
        videoId
      }),
    [autoplayOnClick, params, preconnect, provider, thumbnail, title, url, videoId]
  );

  const [state, setState] = useState<EmbedState>(() => controller.getState());

  useEffect(() => {
    setState(controller.getState());
    return controller.subscribe(setState);
  }, [controller]);

  function hint() {
    if (!preconnect) {
      return [];
    }

    const urls = controller.hint();
    appendPreconnectLinks(urls);
    return urls;
  }

  function activate() {
    hint();
    return controller.activate();
  }

  useEffect(() => {
    if (preconnect !== "mount") {
      return;
    }

    hint();
  }, [controller, preconnect]);

  useEffect(() => {
    if (preconnect !== "viewport" || typeof IntersectionObserver === "undefined" || !rootRef.current) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          hint();
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(rootRef.current);
    return () => observer.disconnect();
  }, [controller, preconnect]);

  const iframeAttributes = state.activated
    ? ({
        ...controller.getIframeAttributes(),
        ...iframeProps
      } as ComponentIframeAttributes)
    : null;

  return {
    activate,
    aspectRatio,
    iframeAttributes,
    noScriptIframeAttributes: controller.getNoScriptIframeAttributes(),
    rootRef,
    state,
    thumbnail: controller.resolveThumbnail(),
    title,
    match: controller.getMatch(),
    buttonProps: {
      "aria-label": `Play video: ${title}`,
      onClick: () => {
        activate();
      },
      onFocus: () => {
        if (preconnect === "hover") {
          hint();
        }
      },
      onKeyDown: (event: KeyboardEvent<HTMLButtonElement>) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          activate();
        }
      },
      onMouseEnter: () => {
        if (preconnect === "hover") {
          hint();
        }
      },
      type: "button" as const
    },
    frameProps: {
      onLoad: () => {
        controller.markIframeMounted();
      }
    }
  };
}

type ComponentIframeAttributes = IframeAttributes & ComponentPropsWithoutRef<"iframe">;
