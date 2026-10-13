import { Suspense } from "react";
import OrderingExperience from "./ordering-experience";

type TablePageProps = {
  params: Promise<{ tableId: string }>;
};

async function TableMenu({ params }: TablePageProps) {
  const { tableId } = await params;

  return <OrderingExperience tableId={tableId} />;
}

export default function TablePage({ params }: TablePageProps) {
  return (
    <Suspense
      fallback={
        <main className="grid min-h-dvh place-items-center bg-brand-bg px-6 text-center text-brand-secondary">
          <p className="text-sm font-medium">Menyiapkan menu untuk meja Anda...</p>
        </main>
      }
    >
      <TableMenu params={params} />
    </Suspense>
  );
}