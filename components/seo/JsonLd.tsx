/** Renders one or more schema.org objects as a JSON-LD script tag (server component). */
export function JsonLd({ data }: { data: Record<string, unknown> | (Record<string, unknown> | null)[] }) {
  const items = (Array.isArray(data) ? data : [data]).filter(Boolean);
  if (!items.length) return null;
  return (
    <script
      type="application/ld+json"
      // "<" is escaped so data can never close the script tag.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(items.length === 1 ? items[0] : items).replace(/</g, "\\u003c") }}
    />
  );
}
