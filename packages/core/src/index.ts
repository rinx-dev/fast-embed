import { youtubeProvider } from "./providers/youtube";

export { createEmbedController } from "./controller";
export { registerProvider } from "./registry";
export * from "./types";

export const providers = {
  youtube: youtubeProvider
};

