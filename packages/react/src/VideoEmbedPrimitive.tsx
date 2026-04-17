import { forwardRef } from "react";

import { buildNoScriptMarkup } from "./noscript";
import type { RenderContext, VideoEmbedProps } from "./types";
import { useVideoEmbed } from "./useVideoEmbed";

function DefaultThumbnail({ thumbnail }: RenderContext) {
  if (!thumbnail) {
    return <span data-slot="thumbnail-fallback">Load video</span>;
  }

  return <img alt={thumbnail.alt ?? ""} data-slot="thumbnail" height={thumbnail.height} src={thumbnail.src} width={thumbnail.width} />;
}

function DefaultPlayButton() {
  return (
    <span aria-hidden="true" data-slot="play-button">
      Play
    </span>
  );
}

export const VideoEmbedPrimitive = forwardRef<HTMLDivElement, VideoEmbedProps>(function VideoEmbedPrimitive(props, forwardedRef) {
  const {
    aspectRatio,
    autoplayOnClick,
    className,
    iframeProps,
    params,
    preconnect,
    provider,
    renderPlayButton,
    renderThumbnail,
    style,
    thumbnail,
    title,
    url,
    videoId,
    ...divProps
  } = props;
  const embed = useVideoEmbed({
    aspectRatio,
    autoplayOnClick,
    iframeProps,
    params,
    preconnect,
    provider,
    renderPlayButton,
    renderThumbnail,
    thumbnail,
    title,
    url,
    videoId
  });
  const context: RenderContext = {
    activated: embed.state.activated,
    state: embed.state,
    thumbnail: embed.thumbnail,
    title
  };

  return (
    <div
      {...divProps}
      className={className}
      data-provider={embed.match.provider}
      data-state={embed.state.status}
      ref={(node) => {
        embed.rootRef.current = node;

        if (typeof forwardedRef === "function") {
          forwardedRef(node);
        } else if (forwardedRef) {
          forwardedRef.current = node;
        }
      }}
      style={{ aspectRatio: embed.aspectRatio, ...style }}
    >
      {embed.iframeAttributes ? (
        <iframe data-slot="iframe" {...embed.iframeAttributes} {...embed.frameProps} />
      ) : (
        <button data-slot="button" {...embed.buttonProps}>
          {renderThumbnail ? renderThumbnail(context) : <DefaultThumbnail {...context} />}
          {renderPlayButton ? renderPlayButton(context) : <DefaultPlayButton />}
        </button>
      )}
      <noscript dangerouslySetInnerHTML={{ __html: buildNoScriptMarkup(embed.noScriptIframeAttributes) }} />
    </div>
  );
});
