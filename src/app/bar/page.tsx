"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import {
  FiActivity,
  FiCheck,
  FiCheckCircle,
  FiClock,
  FiCoffee,
  FiPrinter,
  FiShoppingBag,
  FiTruck,
  FiZap,
} from "react-icons/fi";
import type { CartItem, Order, OrderStatus } from "@/types";
import { menuItems } from "../table/[tableId]/menu-data";

type StatusFilter = "ALL" | OrderStatus;
type ReceiptWidth = "58mm" | "80mm";

const statusStyles: Record<
  OrderStatus,
  { label: string; color: string; icon: typeof FiClock }
> = {
  PENDING: {
    label: "Dalam antrean",
    color: "border-brand-amber bg-amber-50 text-amber-800",
    icon: FiClock,
  },
  PROCESSING: {
    label: "Sedang diproses",
    color: "border-brand-primary bg-blue-50 text-brand-primary",
    icon: FiActivity,
  },
  COMPLETED: {
    label: "Selesai",
    color: "border-brand-emerald bg-emerald-50 text-emerald-800",
    icon: FiCheckCircle,
  },
  CANCELLED: {
    label: "Dibatalkan",
    color: "border-slate-300 bg-slate-100 text-slate-500",
    icon: FiCheck,
  },
};

const filterOptions: { value: StatusFilter; label: string }[] = [
  { value: "ALL", label: "Semua" },
  { value: "PENDING", label: "Antrean" },
  { value: "PROCESSING", label: "Diproses" },
  { value: "COMPLETED", label: "Selesai" },
];

const sampleNotes = [
  "Gula sedikit, es terpisah",
  "Susu oat, tanpa pemanis",
  "Ekstra satu shot espresso",
  "Sambal dipisah",
  "Tanpa es",
  "Tolong sajikan hangat",
  "",
  "Potong dua, ya",
];

function createSampleOrders(): Order[] {
  return Array.from({ length: 16 }, (_, index) => {
    const firstProduct = menuItems[(index * 3) % menuItems.length];
    const secondProduct = menuItems[(index * 3 + 4) % menuItems.length];
    const isTakeAway = index % 4 === 3;
    const status: OrderStatus =
      index % 6 === 5
        ? "COMPLETED"
        : index % 3 === 1
          ? "PROCESSING"
          : "PENDING";
    const createdAt = new Date(
      Date.UTC(2026, 9, 15, 1, 45, 12 + index * 43),
    ).toISOString();

    const items: CartItem[] = [
      {
        menuItem: firstProduct,
        quantity: (index % 2) + 1,
        notes: sampleNotes[index % sampleNotes.length] || undefined,
      },
      {
        menuItem: secondProduct,
        quantity: 1,
        notes: index % 3 === 0 ? "" : undefined,
      },
    ];

    return {
      id: `BAR-${String(index + 1).padStart(3, "0")}`,
      tableNumber: isTakeAway ? null : (index % 12) + 1,
      orderType: isTakeAway ? "TAKE_AWAY" : "DINE_IN",
      items,
      totalPrice: items.reduce(
        (total, item) => total + item.menuItem.price * item.quantity,
        0,
      ),
      paymentMethod: index % 2 === 0 ? "QRIS" : "CASH",
      isPaid: true,
      status,
      createdAt,
      updatedAt: createdAt,
    };
  });
}

function formatWib(value: string | Date) {
  return `${new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Jakarta",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).format(new Date(value))} WIB`;
}

function getQueueNumber(orderId: string) {
  return Number(orderId.match(/\d+$/)?.[0] ?? 0);
}

function StatusBadge({ status }: { status: OrderStatus }) {
  const statusStyle = statusStyles[status];
  const Icon = statusStyle.icon;

  return (
    <span
      className={`inline-flex min-h-7 items-center gap-1.5 rounded-sm border-l-2 px-2 text-[10px] font-bold uppercase tracking-[0.08em] ${statusStyle.color}`}
    >
      <Icon aria-hidden="true" size={12} />
      {statusStyle.label}
    </span>
  );
}

function OrderCard({
  order,
  onAdvance,
  onPrint,
}: {
  order: Order;
  onAdvance: (order: Order) => void;
  onPrint: (order: Order) => void;
}) {
  const queueNumber = String(getQueueNumber(order.id)).padStart(3, "0");
  const canAdvance = order.status === "PENDING" || order.status === "PROCESSING";

  return (
    <article className="flex min-h-[300px] flex-col rounded-lg border border-slate-200 border-t-4 bg-white shadow-sm transition-shadow hover:shadow-md" style={{ borderTopColor: order.status === "PENDING" ? "#f59e0b" : order.status === "PROCESSING" ? "#0055ff" : order.status === "COMPLETED" ? "#10b981" : "#cbd5e1" }}>
      <div className="border-b border-slate-100 px-4 pb-3 pt-3.5">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-mono text-2xl font-bold tabular-nums tracking-tight text-brand-secondary">
              #{queueNumber}
            </p>
            <p className="mt-1 inline-flex items-center gap-1.5 text-[11px] font-medium tabular-nums text-slate-500">
              <FiClock aria-hidden="true" size={12} />
              {formatWib(order.createdAt)}
            </p>
          </div>
          <span
            className={`inline-flex min-h-7 items-center gap-1 rounded-sm px-2 text-[10px] font-bold uppercase tracking-wide ${order.orderType === "DINE_IN" ? "bg-blue-50 text-brand-primary" : "bg-slate-100 text-slate-600"}`}
          >
            {order.orderType === "DINE_IN" ? (
              <FiCoffee aria-hidden="true" size={12} />
            ) : (
              <FiTruck aria-hidden="true" size={12} />
            )}
            {order.orderType === "DINE_IN" ? "Dine In" : "Take Away"}
          </span>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <span className="inline-flex min-h-7 items-center rounded-sm bg-brand-secondary px-2.5 text-xs font-bold text-white">
            {order.tableNumber === null
              ? "Take Away"
              : `Meja #${String(order.tableNumber).padStart(2, "0")}`}
          </span>
          <StatusBadge status={order.status} />
        </div>
      </div>

      <div className="flex-1 px-4 py-3.5">
        <ul className="space-y-3">
          {order.items.map((item, index) => (
            <li key={`${order.id}-${item.menuItem.id}-${index}`}>
              <p className="text-sm font-semibold leading-5 text-brand-secondary">
                <span className="mr-1 font-bold text-brand-primary">{item.quantity}x</span>
                {item.menuItem.name}
              </p>
              {item.notes && (
                <p className="mt-1.5 rounded-sm border-l-2 border-brand-amber bg-amber-50 px-2 py-1.5 text-[11px] leading-4 text-amber-900">
                  <span className="font-semibold">Catatan:</span> {item.notes}
                </p>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="border-t border-slate-100 p-3">
        <div className="flex gap-2">
          {canAdvance && (
            <button
              type="button"
              onClick={() => onAdvance(order)}
              className={`inline-flex min-h-10 flex-1 items-center justify-center gap-1.5 rounded-md px-3 text-xs font-bold text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 ${order.status === "PENDING" ? "bg-brand-primary hover:bg-brand-primary-hover focus-visible:outline-brand-primary" : "bg-brand-emerald hover:bg-emerald-700 focus-visible:outline-brand-emerald"}`}
            >
              {order.status === "PENDING" ? (
                <>
                  <FiActivity aria-hidden="true" size={14} /> Proses
                </>
              ) : (
                <>
                  <FiCheck aria-hidden="true" size={14} /> Selesai
                </>
              )}
            </button>
          )}
          {!canAdvance && (
            <span className="inline-flex min-h-10 flex-1 items-center justify-center gap-1.5 rounded-md bg-emerald-50 px-3 text-xs font-semibold text-emerald-800">
              <FiCheckCircle aria-hidden="true" size={14} /> Pesanan selesai
            </span>
          )}
          <button
            type="button"
            onClick={() => onPrint(order)}
            aria-label={`Cetak ulang tiket pesanan nomor ${queueNumber}`}
            title="Cetak ulang tiket"
            className="grid size-10 shrink-0 place-items-center rounded-md border border-slate-200 text-slate-600 transition-colors hover:border-brand-primary hover:bg-blue-50 hover:text-brand-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
          >
            <FiPrinter aria-hidden="true" size={16} />
          </button>
        </div>
      </div>
    </article>
  );
}

function ThermalTicket({ order }: { order: Order }) {
  const queueNumber = String(getQueueNumber(order.id)).padStart(3, "0");

  return (
    <section id="thermal-ticket" aria-label="Tiket pesanan untuk printer termal">
      <header className="ticket-center">
        <h1>XYZ COFFEE &amp; EATERY</h1>
        <p>BAR TICKET</p>
        <p className="ticket-rule">--------------------------------</p>
      </header>
      <div className="ticket-meta">
        <p>ANTREAN: #{queueNumber}</p>
        <p>
          {order.tableNumber === null
            ? "MEJA: TAKE AWAY"
            : `MEJA: #${String(order.tableNumber).padStart(2, "0")}`}
        </p>
        <p>JENIS: {order.orderType === "DINE_IN" ? "DINE IN" : "TAKE AWAY"}</p>
        <p>WAKTU: {formatWib(order.createdAt)}</p>
        <p className="ticket-rule">--------------------------------</p>
      </div>
      <ul className="ticket-items">
        {order.items.map((item, index) => (
          <li key={`${item.menuItem.id}-${index}`}>
            <p className="ticket-item-name">
              {item.quantity}x {item.menuItem.name}
            </p>
            {item.notes && <p className="ticket-note">Catatan: {item.notes}</p>}
          </li>
        ))}
      </ul>
      <footer className="ticket-center ticket-footer">
        <p className="ticket-rule">--------------------------------</p>
        <p>SEGERA DISIAPKAN</p>
        <p>XYZ Coffee &amp; Eatery</p>
      </footer>
    </section>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  tone,
}: {
  label: string;
  value: number;
  icon: typeof FiClock;
  tone: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3">
      <span className={`grid size-10 shrink-0 place-items-center rounded-md ${tone}`}>
        <Icon aria-hidden="true" size={18} />
      </span>
      <div>
        <p className="text-xl font-bold tabular-nums text-brand-secondary">{value}</p>
        <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-500">
          {label}
        </p>
      </div>
    </div>
  );
}

export default function BarPage() {
  const [orders, setOrders] = useState<Order[]>(createSampleOrders);
  const [activeFilter, setActiveFilter] = useState<StatusFilter>("ALL");
  const [autoPrint, setAutoPrint] = useState(false);
  const [receiptWidth, setReceiptWidth] = useState<ReceiptWidth>("58mm");
  const [clock, setClock] = useState("--:--:--");
  const [printJob, setPrintJob] = useState<{
    order: Order;
    width: ReceiptWidth;
    key: number;
  } | null>(null);
  const nextQueueNumber = useRef(17);

  useEffect(() => {
    const updateClock = () => setClock(formatWib(new Date()).replace(" WIB", ""));
    updateClock();
    const interval = window.setInterval(updateClock, 1000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!printJob) return;

    const handleAfterPrint = () => setPrintJob(null);
    const timer = window.setTimeout(() => window.print(), 250);
    window.addEventListener("afterprint", handleAfterPrint);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("afterprint", handleAfterPrint);
    };
  }, [printJob]);

  const pendingCount = orders.filter((order) => order.status === "PENDING").length;
  const processingCount = orders.filter(
    (order) => order.status === "PROCESSING",
  ).length;
  const completedCount = orders.filter(
    (order) => order.status === "COMPLETED",
  ).length;
  const visibleOrders = orders.filter(
    (order) => activeFilter === "ALL" || order.status === activeFilter,
  );

  const printOrder = (order: Order) => {
    setPrintJob({ order, width: receiptWidth, key: Date.now() });
  };

  const advanceOrder = (order: Order) => {
    const nextStatus: OrderStatus =
      order.status === "PENDING" ? "PROCESSING" : "COMPLETED";

    setOrders((currentOrders) =>
      currentOrders.map((currentOrder) =>
        currentOrder.id === order.id
          ? { ...currentOrder, status: nextStatus, updatedAt: new Date().toISOString() }
          : currentOrder,
      ),
    );
  };

  const addIncomingOrder = () => {
    const queueNumber = nextQueueNumber.current;
    nextQueueNumber.current += 1;
    const product = menuItems[(queueNumber - 1) % menuItems.length];
    const createdAt = new Date().toISOString();
    const isTakeAway = queueNumber % 4 === 0;
    const newOrder: Order = {
      id: `BAR-${String(queueNumber).padStart(3, "0")}`,
      tableNumber: isTakeAway ? null : ((queueNumber - 1) % 12) + 1,
      orderType: isTakeAway ? "TAKE_AWAY" : "DINE_IN",
      items: [
        {
          menuItem: product,
          quantity: (queueNumber % 2) + 1,
          notes: queueNumber % 2 === 0 ? "Gula sedikit" : undefined,
        },
      ],
      totalPrice: product.price * ((queueNumber % 2) + 1),
      paymentMethod: "QRIS",
      isPaid: true,
      status: "PENDING",
      createdAt,
      updatedAt: createdAt,
    };

    setOrders((currentOrders) => [...currentOrders, newOrder]);
    setActiveFilter("ALL");
    if (autoPrint && newOrder.isPaid) printOrder(newOrder);
  };

  return (
    <main className="min-h-dvh bg-brand-bg text-brand-secondary">
      <header className="sticky top-0 z-30 border-b border-slate-700 bg-brand-secondary text-white shadow-lg">
        <div className="mx-auto flex max-w-[1800px] flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="grid size-11 place-items-center rounded-md bg-brand-primary text-white">
                <FiCoffee aria-hidden="true" size={22} />
              </span>
              <div>
                <p className="text-xs font-medium text-slate-300">XYZ Coffee &amp; Eatery</p>
                <h1 className="mt-0.5 text-lg font-bold sm:text-xl">Layar Bar</h1>
              </div>
            </div>
            <div className="text-right lg:hidden">
              <p className="font-mono text-xl font-bold tabular-nums">{clock}</p>
              <p className="text-[10px] font-semibold tracking-wider text-slate-300">WIB</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 lg:justify-end">
            <div className="hidden items-center gap-2 rounded-md border border-white/15 bg-white/5 px-3 py-2 lg:flex">
              <FiClock aria-hidden="true" className="text-blue-300" size={16} />
              <span className="font-mono text-lg font-bold tabular-nums">{clock}</span>
              <span className="text-[10px] font-bold tracking-wider text-slate-300">WIB</span>
            </div>

            <label className="inline-flex min-h-10 cursor-pointer items-center gap-2.5 rounded-md border border-white/15 bg-white/5 px-3">
              <FiPrinter aria-hidden="true" className="text-blue-300" size={16} />
              <span className="text-xs font-semibold">Cetak otomatis</span>
              <input
                type="checkbox"
                role="switch"
                checked={autoPrint}
                onChange={(event) => setAutoPrint(event.target.checked)}
                aria-label="Aktifkan cetak otomatis untuk pesanan baru berbayar"
                className="peer sr-only"
              />
              <span
                aria-hidden="true"
                className={`relative h-5 w-9 rounded-full transition-colors ${autoPrint ? "bg-brand-emerald" : "bg-slate-600"} after:absolute after:left-0.5 after:top-0.5 after:size-4 after:rounded-full after:bg-white after:transition-transform ${autoPrint ? "after:translate-x-4" : ""}`}
              />
            </label>

            <button
              type="button"
              onClick={addIncomingOrder}
              className="inline-flex min-h-10 items-center gap-2 rounded-md bg-brand-primary px-3.5 text-xs font-bold text-white transition-colors hover:bg-brand-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:px-4"
            >
              <FiZap aria-hidden="true" size={15} />
              <span className="hidden sm:inline">Simulasikan pesanan</span>
              <span className="sm:hidden">Pesanan baru</span>
            </button>

            <div
              role="group"
              aria-label="Lebar kertas tiket"
              className="inline-flex min-h-10 items-center gap-1 rounded-md border border-white/15 bg-white/5 p-1"
            >
              {(["58mm", "80mm"] as const).map((width) => (
                <button
                  key={width}
                  type="button"
                  aria-pressed={receiptWidth === width}
                  onClick={() => setReceiptWidth(width)}
                  className={`min-h-8 rounded px-2 text-[10px] font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-white ${receiptWidth === width ? "bg-white text-brand-secondary" : "text-slate-300 hover:bg-white/10 hover:text-white"}`}
                >
                  {width}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-[1800px] px-4 pb-8 pt-5 sm:px-6 lg:px-8 lg:pt-7">
        <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard
            label="Total pesanan"
            value={orders.length}
            icon={FiShoppingBag}
            tone="bg-blue-50 text-brand-primary"
          />
          <StatCard
            label="Dalam antrean"
            value={pendingCount}
            icon={FiClock}
            tone="bg-amber-50 text-amber-700"
          />
          <StatCard
            label="Sedang diproses"
            value={processingCount}
            icon={FiActivity}
            tone="bg-blue-50 text-brand-primary"
          />
          <StatCard
            label="Selesai"
            value={completedCount}
            icon={FiCheckCircle}
            tone="bg-emerald-50 text-emerald-700"
          />
        </div>

        <div className="mb-4 flex flex-col gap-3 border-b border-slate-200 pb-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-bold text-brand-secondary sm:text-lg">
              Antrean pesanan
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Pesanan berbayar ditampilkan berdasarkan nomor antrean.
            </p>
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto" role="group" aria-label="Filter status pesanan">
            {filterOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                aria-pressed={activeFilter === option.value}
                onClick={() => setActiveFilter(option.value)}
                className={`min-h-9 shrink-0 rounded-md px-3 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary ${activeFilter === option.value ? "bg-brand-secondary text-white" : "bg-white text-slate-600 hover:bg-slate-100"}`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {visibleOrders.length > 0 ? (
          <div className="grid grid-cols-1 items-start gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
            {visibleOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onAdvance={advanceOrder}
                onPrint={printOrder}
              />
            ))}
          </div>
        ) : (
          <div className="grid min-h-64 place-items-center rounded-lg border border-dashed border-slate-300 bg-white text-center">
            <div>
              <FiCoffee aria-hidden="true" className="mx-auto text-slate-300" size={28} />
              <p className="mt-3 text-sm font-semibold text-brand-secondary">
                Belum ada pesanan di status ini
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Pesanan baru akan muncul di sini.
              </p>
            </div>
          </div>
        )}
      </section>

      {printJob && (
        <div
          key={printJob.key}
          className="print-source"
          style={{ "--receipt-width": printJob.width } as CSSProperties}
        >
          <ThermalTicket order={printJob.order} />
        </div>
      )}

      <style>{`
        /* Keep the receipt out of the screen layout while retaining print access. */
        .print-source { position: fixed; left: -10000px; top: 0; }
        #thermal-ticket { display: none; }

        @media print {
          @page { size: auto; margin: 0; }
          html, body { margin: 0 !important; padding: 0 !important; background: #fff !important; }
          body * { visibility: hidden !important; }
          /* Print only the selected thermal ticket. */
          .print-source { position: absolute; inset: 0 auto auto 0; }
          #thermal-ticket, #thermal-ticket * { visibility: visible !important; }
          #thermal-ticket {
            display: block !important;
            position: absolute;
            inset: 0 auto auto 0;
            width: var(--receipt-width, 58mm);
            box-sizing: border-box;
            padding: 4mm;
            color: #000;
            background: #fff;
            font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
            font-size: 10pt;
            line-height: 1.35;
          }
          .ticket-center { text-align: center; }
          .ticket-center h1 { margin: 0; font-size: 12pt; font-weight: 800; }
          .ticket-center p { margin: 1mm 0; font-weight: 700; }
          .ticket-rule { overflow: hidden; white-space: nowrap; }
          .ticket-meta p { margin: 1.2mm 0; font-weight: 600; }
          .ticket-items { margin: 0; padding: 0; list-style: none; }
          .ticket-items li { margin: 2mm 0; break-inside: avoid; }
          .ticket-item-name { margin: 0; font-weight: 800; }
          .ticket-note { margin: 1mm 0 0 4mm; font-size: 9pt; }
          .ticket-footer { margin-top: 3mm; }
        }
      `}</style>
    </main>
  );
}