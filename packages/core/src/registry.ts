import type { EmbedProvider } from "./types";
import { youtubeProvider } from "./providers/youtube";

const providers = new Map<string, EmbedProvider>();

providers.set(youtubeProvider.name, youtubeProvider);

export function registerProvider(provider: EmbedProvider): EmbedProvider {
  providers.set(provider.name, provider);
  return provider;
}

export function getProvider(name: string): EmbedProvider | undefined {
  return providers.get(name);
}

export function listProviders(): EmbedProvider[] {
  return Array.from(providers.values());
}

