import type { CSSProperties, ComponentPropsWithoutRef, ReactNode } from "react";

import type { EmbedOptions, EmbedState, IframeAttributes, ThumbnailResult } from "@fast-embed/core";

export interface RenderContext {
  activated: boolean;
  state: EmbedState;
  thumbnail: ThumbnailResult | null;
  title: string;
}

export interface VideoEmbedProps
  extends Omit<EmbedOptions, "iframeAttributes">,
    Omit<ComponentPropsWithoutRef<"div">, "children" | "title"> {
  aspectRatio?: string;
  iframeProps?: Omit<ComponentPropsWithoutRef<"iframe">, keyof IframeAttributes | "srcDoc">;
  renderPlayButton?: (context: RenderContext) => ReactNode;
  renderThumbnail?: (context: RenderContext) => ReactNode;
  style?: CSSProperties;
}
