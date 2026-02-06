import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const contentType = req.headers.get("content-type") || "";

  let email: string | null = null;
  let photoId: number | null = null;

  // Підтримка form submit (з нашого <form>)
  if (contentType.includes("application/x-www-form-urlencoded")) {
    const body = await req.text();
    const params = new URLSearchParams(body);
    email = params.get("email");
    photoId = Number(params.get("photoId"));
  } else {
    // або JSON (на майбутнє)
    const json = await req.json().catch(() => null);
    email = json?.email ?? null;
    photoId = json?.photoId ?? null;
  }

  if (!email || !photoId || Number.isNaN(photoId)) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const API = process.env.NEXT_PUBLIC_STRAPI_API!;
  const TOKEN = process.env.STRAPI_TOKEN!;

  // 1) Беремо фото з Strapi, щоб не довіряти клієнту по ціні/валюті
  const photoRes = await fetch(
    `${API}/photos?filters[id][$eq]=${photoId}`,
    { headers: { Authorization: `Bearer ${TOKEN}` }, cache: "no-store" }
  );

  if (!photoRes.ok) {
    const t = await photoRes.text();
    return NextResponse.json({ error: `Strapi photo fetch failed: ${t}` }, { status: 500 });
  }

  const photoJson = (await photoRes.json()) as any;
  const photo = photoJson?.data?.[0];

  if (!photo) {
    return NextResponse.json({ error: "Photo not found" }, { status: 404 });
  }

  if (!photo.isForSale) {
    return NextResponse.json({ error: "Photo is not for sale" }, { status: 400 });
  }

  // 2) Створюємо Order
  const orderNumber = `PH-${Date.now()}`;

  const orderPayload = {
    data: {
      orderNumber,
      email,
      orderStatus: "created",
      provider: "stripe",
      providerPaymentId: null,
      amountCents: photo.priceCents,
      currency: photo.currency,
      items: {
        photos: [
          {
            id: photo.id,
            title: photo.title,
            priceCents: photo.priceCents,
            currency: photo.currency,
          },
        ],
      },
    },
  };

  const orderRes = await fetch(`${API}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${TOKEN}`,
    },
    body: JSON.stringify(orderPayload),
  });

  if (!orderRes.ok) {
    const t = await orderRes.text();
    return NextResponse.json({ error: `Strapi order create failed: ${t}` }, { status: 500 });
  }

  const created = await orderRes.json();

  // Поки що просто редірект на success з orderId
  const orderId = created?.data?.id ?? created?.id;
  return NextResponse.redirect(new URL(`/success?orderId=${orderId}`, req.url));
}
