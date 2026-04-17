import { getProvider, listProviders } from "./registry";
import { buildIframeAttributes, dedupeStrings, normalizeThumbnail } from "./utils";
import type {
  EmbedController,
  EmbedOptions,
  EmbedProvider,
  EmbedProviderMatch,
  EmbedState,
  IframeAttributes,
  ThumbnailResult
} from "./types";

function resolveProvider(options: EmbedOptions): { provider: EmbedProvider; match: EmbedProviderMatch } {
  if (typeof options.provider === "object") {
    const match = options.provider.match({ url: options.url, videoId: options.videoId });

    if (!match) {
      throw new Error(`Provider "${options.provider.name}" could not resolve the supplied video input.`);
    }

    return { provider: options.provider, match };
  }

  if (typeof options.provider === "string") {
    const provider = getProvider(options.provider);

    if (!provider) {
      throw new Error(`Unknown provider "${options.provider}".`);
    }

    const match = provider.match({ url: options.url, videoId: options.videoId });

    if (!match) {
      throw new Error(`Provider "${provider.name}" could not resolve the supplied video input.`);
    }

    return { provider, match };
  }

  for (const provider of listProviders()) {
    const match = provider.match({ url: options.url, videoId: options.videoId });

    if (match) {
      return { provider, match };
    }
  }

  throw new Error("Unable to detect a provider from the supplied embed input.");
}

function createInitialState(): EmbedState {
  return {
    status: "idle",
    activated: false,
    hinted: false,
    iframeMounted: false
  };
}

export function createEmbedController(options: EmbedOptions): EmbedController {
  const { provider, match } = resolveProvider(options);
  const listeners = new Set<(state: EmbedState) => void>();
  let state = createInitialState();

  function notify() {
    for (const listener of listeners) {
      listener(state);
    }
  }

  function setState(next: EmbedState) {
    state = next;
    notify();
  }

  function getEmbedUrl(): string {
    return provider.getEmbedUrl(match, options);
  }

  function getIframeAttributes(): IframeAttributes {
    return buildIframeAttributes(getEmbedUrl(), options.title, options);
  }

  function getNoScriptIframeAttributes(): IframeAttributes {
    return provider.getNoScriptIframeAttrs(match, options);
  }

  function resolveThumbnail(): ThumbnailResult | null {
    const override = normalizeThumbnail(options.thumbnail);

    if (override) {
      return override;
    }

    return provider.getThumbnail(match, options);
  }

  function hint(): string[] {
    if (!state.hinted) {
      setState({
        ...state,
        hinted: true,
        status: state.activated ? state.status : "hinted"
      });
    }

    return dedupeStrings(provider.getPreconnectUrls(match));
  }

  function activate(): IframeAttributes {
    if (!state.hinted) {
      hint();
    }

    if (!state.activated) {
      setState({
        ...state,
        activated: true,
        status: "activated"
      });
    }

    return getIframeAttributes();
  }

  function markIframeMounted() {
    if (!state.iframeMounted) {
      setState({
        status: "iframe-mounted",
        activated: true,
        hinted: true,
        iframeMounted: true
      });
    }
  }

  return {
    activate,
    destroy() {
      listeners.clear();
    },
    getIframeAttributes,
    getMatch() {
      return match;
    },
    getNoScriptIframeAttributes,
    getPreconnectUrls() {
      return dedupeStrings(provider.getPreconnectUrls(match));
    },
    getState() {
      return state;
    },
    hint,
    markIframeMounted,
    resolveThumbnail,
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    }
  };
}

