import { forwardRef } from "react";

import type { RenderContext, VideoEmbedProps } from "./types";
import { VideoEmbedPrimitive } from "./VideoEmbedPrimitive";

function joinClassNames(...values: Array<string | undefined>) {
  return values.filter(Boolean).join(" ");
}

function StyledThumbnail({ thumbnail, title }: RenderContext) {
  return (
    <span data-slot="thumbnail-shell">
      {thumbnail ? (
        <img alt={thumbnail.alt ?? ""} data-slot="thumbnail" height={thumbnail.height} src={thumbnail.src} width={thumbnail.width} />
      ) : (
        <span data-slot="thumbnail-fallback">{title}</span>
      )}
    </span>
  );
}

function StyledPlayButton() {
  return (
    <span aria-hidden="true" data-slot="play-button">
      <span data-slot="play-button-icon" />
      <span data-slot="play-button-label">Play</span>
    </span>
  );
}

export const VideoEmbed = forwardRef<HTMLDivElement, VideoEmbedProps>(function VideoEmbed(
  { className, renderPlayButton, renderThumbnail, ...props },
  forwardedRef
) {
  return (
    <VideoEmbedPrimitive
      {...props}
      className={joinClassNames("video-embed", className)}
      ref={forwardedRef}
      renderPlayButton={renderPlayButton ?? (() => <StyledPlayButton />)}
      renderThumbnail={renderThumbnail ?? ((context) => <StyledThumbnail {...context} />)}
    />
  );
});
