import { VideoEmbed, VideoEmbedPrimitive } from "@fast-embed/react";

export default function App() {
  return (
    <main>
      <section>
        <h1>Fast video embeds</h1>
      </section>
      <section className="demo-grid">
        <article className="card">
          <div data-testid="demo-hover">
            <VideoEmbed
              aspectRatio="16 / 9"
              preconnect="hover"
              provider="youtube"
              title="Hover preconnect demo"
              videoId="dQw4w9WgXcQ"
            />
          </div>
          <h2>Hover-triggered preconnect</h2>
          <p>
            Move over the card, prime the connection, and only mount the real
            player after click.
          </p>
        </article>
        <article className="card">
          <div data-testid="demo-no-preconnect">
            <VideoEmbedPrimitive
              preconnect={false}
              provider="youtube"
              title="Headless no-preconnect demo"
              videoId="ysz5S6PUM-U"
            />
          </div>
          <h2>Headless primitive</h2>
          <p>
            This version keeps the same core behavior with no automatic
            preconnect and no bundled styling.
          </p>
        </article>
      </section>
    </main>
  );
}
