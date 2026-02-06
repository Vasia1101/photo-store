import { strapiFetch } from "@/lib/strapi";
import type { Photo } from "@/types/strapi";

type PageProps = { params: Promise<{ slug: string }> };

export default async function PhotoPage({ params }: PageProps) {
  const { slug } = await params;

  const res = await strapiFetch<{ data: Photo[] }>(
    `/photos?filters[slug][$eq]=${encodeURIComponent(slug)}&populate=previewImage`
  );

  const photo = res.data[0];

  if (!photo) {
    return (
      <main style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
        <h1>Not found</h1>
      </main>
    );
  }

  const imgUrl = photo.previewImage?.url
    ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${photo.previewImage.url}`
    : null;

  return (
    <main style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
      <a href="/" style={{ display: "inline-block", marginBottom: 16 }}>
        ← Back
      </a>

      <h1 style={{ fontSize: 28, fontWeight: 700 }}>{photo.title}</h1>

      {imgUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imgUrl}
          alt={photo.title}
          style={{
            width: "100%",
            marginTop: 16,
            borderRadius: 16,
            border: "1px solid #eee",
          }}
        />
      )}

      <div style={{ marginTop: 16 }}>
        {photo.isForSale ? (
          <div style={{ fontSize: 18 }}>
            Price: {(photo.priceCents / 100).toFixed(2)} {photo.currency}
          </div>
        ) : (
          <div style={{ opacity: 0.7 }}>Portfolio only</div>
        )}
      </div>

      {photo.isForSale && (
        <form action="/api/order" method="POST" style={{ marginTop: 16 }}>
          <input type="hidden" name="email" value="buyer@test.com" />
          <input type="hidden" name="photoId" value={String(photo.id)} />

          <button
            type="submit"
            style={{
              marginTop: 8,
              padding: "10px 14px",
              borderRadius: 12,
              border: "1px solid #ddd",
              cursor: "pointer",
            }}
          >
            Buy
          </button>
        </form>
      )}
    </main>
  );
}
