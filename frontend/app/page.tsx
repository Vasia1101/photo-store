import { strapiFetch } from "@/lib/strapi";
import type { Category, Photo } from "@/types/strapi";

export default async function Home() {
  const categories = await strapiFetch<{ data: Category[] }>(
    "/categories?sort=order:asc"
  );

  const photos = await strapiFetch<{ data: Photo[] }>(
    "/photos?sort=createdAt:desc&pagination[pageSize]=12&populate=previewImage"
  );

  return (
    <main style={{ padding: 24, maxWidth: 1100, margin: "0 auto" }}>
      <h1>Photo Store</h1>

      <section>
        <h2>Categories</h2>
        <div style={{ display: "flex", gap: 8 }}>
          {categories.data.map((c) => (
            <span key={c.id}>{c.title}</span>
          ))}
        </div>
      </section>

      <section style={{ marginTop: 32 }}>
        <h2>Latest photos</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
            gap: 12,
          }}
        >
          {photos.data.map((p) => (
            <div key={p.id}>
              {p.previewImage?.url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={`${process.env.NEXT_PUBLIC_STRAPI_URL}${p.previewImage.url}`}
                  alt={p.title}
                  style={{ width: "100%", objectFit: "cover" }}
                />
              )}
              <a href={`/photo/${p.slug ?? ""}`} style={{ fontWeight: 600 }}>
                {p.title}
              </a>
              {p.isForSale && (
                <div>
                  {(p.priceCents / 100).toFixed(2)} {p.currency}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
