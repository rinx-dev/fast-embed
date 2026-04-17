import type { IframeAttributes } from "@fast-embed/core";

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

export function buildNoScriptMarkup(attributes: IframeAttributes): string {
  const entries = Object.entries(attributes)
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => {
      if (typeof value === "boolean") {
        return value ? key : "";
      }

      return `${key}="${escapeHtml(String(value))}"`;
    })
    .filter(Boolean)
    .join(" ");

  return `<iframe ${entries}></iframe>`;
}
