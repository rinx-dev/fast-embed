import { buildIframeAttributes, dedupeStrings } from "../utils";
import type { EmbedOptions, EmbedProvider, EmbedProviderInput, EmbedProviderMatch } from "../types";

const YOUTUBE_PATTERNS = [
  /(?:youtube\.com\/watch\?v=)([\w-]{6,})/i,
  /(?:youtube\.com\/embed\/)([\w-]{6,})/i,
  /(?:youtu\.be\/)([\w-]{6,})/i,
  /(?:youtube\.com\/shorts\/)([\w-]{6,})/i
];

function normalizeMatch(videoId: string, url?: string): EmbedProviderMatch {
  return {
    provider: "youtube",
    videoId,
    url,
    canonicalUrl: `https://www.youtube.com/watch?v=${videoId}`
  };
}

function resolveMatch(input: EmbedProviderInput): EmbedProviderMatch | null {
  if (input.videoId) {
    return normalizeMatch(input.videoId, `https://www.youtube.com/watch?v=${input.videoId}`);
  }

  if (!input.url) {
    return null;
  }

  for (const pattern of YOUTUBE_PATTERNS) {
    const match = input.url.match(pattern);

    if (match?.[1]) {
      return normalizeMatch(match[1], input.url);
    }
  }

  try {
    const parsed = new URL(input.url);
    const searchId = parsed.searchParams.get("v");

    if (searchId) {
      return normalizeMatch(searchId, input.url);
    }
  } catch {
    return null;
  }

  return null;
}

function buildEmbedUrl(match: EmbedProviderMatch, options: EmbedOptions): string {
  const params = new URLSearchParams();

  params.set("playsinline", "1");

  if (options.autoplayOnClick) {
    params.set("autoplay", "1");
  }

  for (const [key, value] of Object.entries(options.params ?? {})) {
    if (value !== undefined) {
      params.set(key, String(value));
    }
  }

  return `https://www.youtube.com/embed/${match.videoId}?${params.toString()}`;
}

export const youtubeProvider: EmbedProvider = {
  name: "youtube",
  match(input) {
    return resolveMatch(input);
  },
  getEmbedUrl(match, options) {
    return buildEmbedUrl(match, options);
  },
  getThumbnail(match) {
    return {
      src: `https://i.ytimg.com/vi/${match.videoId}/hqdefault.jpg`,
      alt: ""
    };
  },
  getPreconnectUrls() {
    return dedupeStrings(["https://www.youtube.com", "https://i.ytimg.com"]);
  },
  getNoScriptIframeAttrs(match, options) {
    return buildIframeAttributes(
      buildEmbedUrl(match, { ...options, autoplayOnClick: false }),
      options.title,
      options
    );
  }
};
