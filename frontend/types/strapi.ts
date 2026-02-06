export type Category = {
  id: number;
  documentId: string;
  title: string;
  slug: string | null;
  order: number;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
};

export type Photo = {
  id: number;
  documentId: string;
  title: string;
  slug: string | null;
  isForSale: boolean;
  priceCents: number;
  currency: "USD" | "EUR";
  width: number | null;
  height: number | null;
  watermark: boolean;
  previewImage?: {
    id: number;
    url: string;
    width: number;
    height: number;
    formats?: Record<string, { url: string }>;
  };
};
