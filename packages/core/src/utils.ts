import type { EmbedOptions, IframeAttributes, ThumbnailResult } from "./types";

export const DEFAULT_IFRAME_ALLOW =
  "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";

export function normalizeThumbnail(thumbnail?: string | ThumbnailResult | null): ThumbnailResult | null {
  if (!thumbnail) {
    return null;
  }

  if (typeof thumbnail === "string") {
    return { src: thumbnail };
  }

  return thumbnail;
}

export function dedupeStrings(values: string[]): string[] {
  return Array.from(new Set(values.filter(Boolean)));
}

export function mergeIframeAttributes(base: IframeAttributes, override?: Partial<IframeAttributes>): IframeAttributes {
  return {
    ...base,
    ...override
  };
}

export function buildIframeAttributes(
  src: string,
  title: string,
  options: EmbedOptions,
  override?: Partial<IframeAttributes>
): IframeAttributes {
  return mergeIframeAttributes(
    {
      src,
      title,
      allow: DEFAULT_IFRAME_ALLOW,
      allowFullScreen: true,
      frameBorder: "0",
      loading: "lazy",
      referrerPolicy: "strict-origin-when-cross-origin"
    },
    { ...options.iframeAttributes, ...override }
  );
}

