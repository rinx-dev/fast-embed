export type EmbedStatus = "idle" | "hinted" | "activated" | "iframe-mounted";

export interface ThumbnailResult {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
}

export interface IframeAttributes {
  src: string;
  title: string;
  loading?: "lazy" | "eager";
  allow?: string;
  referrerPolicy?: string;
  frameBorder?: string;
  sandbox?: string;
  allowFullScreen?: boolean;
}

export interface EmbedProviderMatch {
  provider: string;
  videoId: string;
  url?: string;
  canonicalUrl?: string;
}

export interface EmbedState {
  status: EmbedStatus;
  activated: boolean;
  hinted: boolean;
  iframeMounted: boolean;
}

export interface EmbedOptions {
  provider?: string | EmbedProvider;
  url?: string;
  videoId?: string;
  title: string;
  thumbnail?: string | ThumbnailResult;
  autoplayOnClick?: boolean;
  preconnect?: boolean | "hover" | "viewport" | "mount";
  params?: Record<string, string | number | boolean | undefined>;
  iframeAttributes?: Partial<IframeAttributes>;
}

export interface EmbedProviderInput {
  url?: string;
  videoId?: string;
}

export interface EmbedProvider {
  name: string;
  match: (input: EmbedProviderInput) => EmbedProviderMatch | null;
  getEmbedUrl: (match: EmbedProviderMatch, options: EmbedOptions) => string;
  getThumbnail: (match: EmbedProviderMatch, options: EmbedOptions) => ThumbnailResult | null;
  getPreconnectUrls: (match: EmbedProviderMatch) => string[];
  getNoScriptIframeAttrs: (match: EmbedProviderMatch, options: EmbedOptions) => IframeAttributes;
}

export interface EmbedController {
  activate: () => IframeAttributes;
  destroy: () => void;
  getIframeAttributes: () => IframeAttributes;
  getMatch: () => EmbedProviderMatch;
  getNoScriptIframeAttributes: () => IframeAttributes;
  getPreconnectUrls: () => string[];
  getState: () => EmbedState;
  hint: () => string[];
  markIframeMounted: () => void;
  resolveThumbnail: () => ThumbnailResult | null;
  subscribe: (listener: (state: EmbedState) => void) => () => void;
}

