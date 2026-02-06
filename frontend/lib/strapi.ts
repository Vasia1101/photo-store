const API = process.env.NEXT_PUBLIC_STRAPI_API!;
const TOKEN = process.env.STRAPI_TOKEN!;

export async function strapiFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Strapi error ${res.status}`);
  }

  return res.json() as Promise<T>;
}
