type PageProps = {
  searchParams: Promise<{ orderId?: string }>;
};

export default async function SuccessPage({ searchParams }: PageProps) {
  const { orderId } = await searchParams;

  return (
    <main style={{ padding: 24, maxWidth: 800, margin: "0 auto" }}>
      <h1>Order created ✅</h1>
      <p>orderId: {orderId ?? "-"}</p>
      <a href="/">Go home</a>
    </main>
  );
}
