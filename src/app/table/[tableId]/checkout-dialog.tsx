"use client";

import { useEffect, useRef, useState } from "react";
import {
  FiArrowLeft,
  FiCheck,
  FiCheckCircle,
  FiClock,
  FiCreditCard,
  FiMinus,
  FiPlus,
  FiX,
} from "react-icons/fi";
import type { CartItem, OrderType } from "@/types";
import { formatRupiah } from "./menu-data";

type CheckoutStep = "summary" | "payment" | "success";

type CheckoutDialogProps = {
  isOpen: boolean;
  tableNumber: string;
  orderType: OrderType;
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  onClose: (paymentCompleted: boolean) => void;
  onChangeQuantity: (productId: string, amount: number) => void;
  onChangeNotes: (productId: string, notes: string) => void;
};

const PAYMENT_SECONDS = 5 * 60;

function formatCountdown(seconds: number) {
  const minutes = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const remainingSeconds = (seconds % 60).toString().padStart(2, "0");

  return `${minutes}:${remainingSeconds}`;
}

function SimulatedQrCode() {
  const modules: { row: number; column: number }[] = [];
  const finders = [
    { row: 0, column: 0 },
    { row: 0, column: 14 },
    { row: 14, column: 0 },
  ];

  for (let row = 0; row < 21; row += 1) {
    for (let column = 0; column < 21; column += 1) {
      const finder = finders.find(
        (position) =>
          row >= position.row &&
          row < position.row + 7 &&
          column >= position.column &&
          column < position.column + 7,
      );

      if (finder) {
        const localRow = row - finder.row;
        const localColumn = column - finder.column;
        const isDarkFinderModule =
          localRow === 0 ||
          localRow === 6 ||
          localColumn === 0 ||
          localColumn === 6 ||
          (localRow >= 2 && localRow <= 4 && localColumn >= 2 && localColumn <= 4);

        if (isDarkFinderModule) modules.push({ row, column });
        continue;
      }

      if ((row * 7 + column * 11 + row * column) % 5 < 2) {
        modules.push({ row, column });
      }
    }
  }

  return (
    <svg
      viewBox="0 0 29 29"
      role="img"
      aria-label="Kode QRIS simulasi, bukan kode pembayaran aktif"
      className="size-44 rounded-md bg-white p-2"
    >
      <rect width="29" height="29" fill="white" />
      {modules.map(({ row, column }) => (
        <rect
          key={`${row}-${column}`}
          x={column + 4}
          y={row + 4}
          width="1"
          height="1"
          fill="#0f172a"
        />
      ))}
    </svg>
  );
}

export default function CheckoutDialog({
  isOpen,
  tableNumber,
  orderType,
  items,
  subtotal,
  tax,
  total,
  onClose,
  onChangeQuantity,
  onChangeNotes,
}: CheckoutDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [step, setStep] = useState<CheckoutStep>("summary");
  const [remainingSeconds, setRemainingSeconds] = useState(PAYMENT_SECONDS);
  const [orderReference, setOrderReference] = useState("");

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) dialog.showModal();
    if (!isOpen && dialog.open) dialog.close();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || step !== "payment" || remainingSeconds === 0) return;

    const timer = window.setTimeout(() => {
      setRemainingSeconds((seconds) => Math.max(seconds - 1, 0));
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [isOpen, remainingSeconds, step]);

  if (!isOpen) return null;

  const closeDialog = () => dialogRef.current?.close();
  const beginPayment = () => {
    setRemainingSeconds(PAYMENT_SECONDS);
    setStep("payment");
  };
  const completePayment = () => {
    setOrderReference(
      `XYZ-${tableNumber}-${Date.now().toString().slice(-6)}`,
    );
    setStep("success");
  };
  const handleClose = () => onClose(step === "success");

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="checkout-title"
      onClose={handleClose}
      className="fixed inset-x-0 bottom-0 m-0 h-[min(94dvh,860px)] w-full max-w-none overflow-hidden rounded-t-xl bg-brand-bg p-0 text-brand-secondary shadow-2xl backdrop:bg-brand-secondary/60 md:inset-0 md:m-auto md:h-[min(90dvh,820px)] md:max-w-xl md:rounded-xl"
    >
      <div className="flex h-full flex-col">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4 sm:px-7">
          <div className="flex items-center gap-3">
            {step === "payment" && (
              <button
                type="button"
                onClick={() => setStep("summary")}
                aria-label="Kembali ke ringkasan pesanan"
                className="grid size-9 place-items-center rounded-md text-slate-500 transition-colors hover:bg-slate-100 hover:text-brand-secondary focus-visible:outline-2 focus-visible:outline-brand-primary"
              >
                <FiArrowLeft aria-hidden="true" size={18} />
              </button>
            )}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-primary">
                {step === "summary"
                  ? "Periksa kembali"
                  : step === "payment"
                    ? "Pembayaran aman"
                    : "Pesanan diterima"}
              </p>
              <h2 id="checkout-title" className="mt-0.5 text-lg font-semibold">
                {step === "summary"
                  ? "Ringkasan Pesanan"
                  : step === "payment"
                    ? "Bayar dengan QRIS"
                    : "Terima kasih!"}
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={closeDialog}
            aria-label="Tutup ringkasan pesanan"
            className="grid size-10 place-items-center rounded-md text-slate-500 transition-colors hover:bg-slate-100 hover:text-brand-secondary focus-visible:outline-2 focus-visible:outline-brand-primary"
          >
            <FiX aria-hidden="true" size={20} />
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-7 sm:py-6">
          {step === "summary" && (
            <>
              <div className="mb-5 flex flex-wrap gap-2">
                <span className="rounded-sm bg-blue-50 px-3 py-1.5 text-xs font-semibold text-brand-primary">
                  Meja #{tableNumber}
                </span>
                <span className="rounded-sm bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
                  {orderType === "DINE_IN" ? "Makan di tempat" : "Bawa pulang"}
                </span>
              </div>

              {items.length === 0 ? (
                <div className="rounded-md border border-dashed border-slate-300 px-5 py-10 text-center">
                  <p className="text-sm font-semibold">Keranjang masih kosong</p>
                  <p className="mt-1 text-xs text-slate-500">
                    Tambahkan menu terlebih dahulu untuk melanjutkan.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-slate-200">
                  {items.map((item) => (
                    <div key={item.menuItem.id} className="py-4 first:pt-0">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="text-sm font-semibold text-brand-secondary">
                            {item.menuItem.name}
                          </h3>
                          <p className="mt-1 text-xs text-slate-500">
                            {formatRupiah(item.menuItem.price)} / item
                          </p>
                        </div>
                        <div className="flex h-9 shrink-0 items-center gap-2 rounded-md border border-slate-200 bg-white px-1">
                          <button
                            type="button"
                            onClick={() => onChangeQuantity(item.menuItem.id, -1)}
                            aria-label={`Kurangi ${item.menuItem.name}`}
                            className="grid size-7 place-items-center rounded text-slate-600 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-brand-primary"
                          >
                            <FiMinus aria-hidden="true" size={13} />
                          </button>
                          <span className="min-w-4 text-center text-xs font-semibold tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => onChangeQuantity(item.menuItem.id, 1)}
                            aria-label={`Tambah ${item.menuItem.name}`}
                            className="grid size-7 place-items-center rounded text-slate-600 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-brand-primary"
                          >
                            <FiPlus aria-hidden="true" size={13} />
                          </button>
                        </div>
                      </div>
                      <label className="mt-3 block">
                        <span className="sr-only">Catatan untuk {item.menuItem.name}</span>
                        <input
                          type="text"
                          value={item.notes ?? ""}
                          onChange={(event) =>
                            onChangeNotes(item.menuItem.id, event.target.value)
                          }
                          placeholder="Tambah catatan, misalnya: tanpa gula"
                          className="min-h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-xs text-brand-secondary outline-none transition placeholder:text-slate-400 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15"
                        />
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {step === "payment" && (
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-800">
                <FiClock aria-hidden="true" size={14} />
                Berlaku selama {formatCountdown(remainingSeconds)}
              </div>
              <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
                <SimulatedQrCode />
              </div>
              <p className="mt-3 rounded-sm bg-slate-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">
                QRIS simulasi · bukan kode pembayaran aktif
              </p>
              <p className="mt-5 text-xs font-medium text-slate-500">Total pembayaran</p>
              <p className="mt-1 text-2xl font-bold tabular-nums text-brand-secondary">
                {formatRupiah(total)}
              </p>

              <ol className="mt-6 grid w-full gap-3 text-left sm:grid-cols-3">
                {[
                  "Buka aplikasi mobile banking atau dompet digital.",
                  "Pilih menu pindai QRIS dan arahkan kamera ke kode.",
                  "Periksa jumlah pembayaran, lalu konfirmasi transaksi.",
                ].map((instruction, index) => (
                  <li
                    key={instruction}
                    className="flex gap-2.5 rounded-md bg-white p-3 text-xs leading-5 text-slate-600"
                  >
                    <span className="grid size-5 shrink-0 place-items-center rounded-full bg-blue-50 text-[10px] font-bold text-brand-primary">
                      {index + 1}
                    </span>
                    {instruction}
                  </li>
                ))}
              </ol>
            </div>
          )}

          {step === "success" && (
            <div className="flex min-h-full flex-col items-center justify-center py-8 text-center">
              <span className="grid size-16 place-items-center rounded-full bg-emerald-50 text-brand-emerald">
                <FiCheckCircle aria-hidden="true" size={34} />
              </span>
              <p className="mt-6 text-xs font-bold uppercase tracking-[0.16em] text-brand-emerald">
                Pembayaran berhasil
              </p>
              <h3 className="mt-2 text-2xl font-semibold text-brand-secondary">
                Pesanan sedang disiapkan
              </h3>
              <p className="mt-3 max-w-sm text-sm leading-6 text-slate-500">
                Pesanan Anda sudah diteruskan langsung ke layar Bar. Silakan
                bersantai, kami akan segera menyiapkannya.
              </p>
              <div className="mt-7 w-full max-w-sm rounded-md border border-emerald-100 bg-emerald-50/70 p-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-800">
                  Nomor referensi pesanan
                </p>
                <p className="mt-1.5 font-mono text-lg font-bold tracking-wide text-brand-secondary">
                  {orderReference}
                </p>
                <div className="mt-3 flex items-center justify-center gap-1.5 text-xs font-medium text-emerald-800">
                  <FiCheck aria-hidden="true" size={14} />
                  Pembayaran QRIS terkonfirmasi
                </div>
              </div>
            </div>
          )}
        </div>

        {step !== "success" && (
          <footer className="border-t border-slate-200 bg-white px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 sm:px-7">
            {step === "summary" && (
              <>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-slate-500">
                    <span>Subtotal</span>
                    <span className="tabular-nums">{formatRupiah(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Pajak & layanan (11%)</span>
                    <span className="tabular-nums">{formatRupiah(tax)}</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-100 pt-2 text-sm font-bold text-brand-secondary">
                    <span>Total pembayaran</span>
                    <span className="tabular-nums">{formatRupiah(total)}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={beginPayment}
                  disabled={items.length === 0}
                  className="mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-brand-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-brand-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  Lanjut ke Pembayaran <FiCreditCard aria-hidden="true" size={17} />
                </button>
              </>
            )}
            {step === "payment" && (
              <button
                type="button"
                onClick={
                  remainingSeconds > 0
                    ? completePayment
                    : () => setRemainingSeconds(PAYMENT_SECONDS)
                }
                className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-brand-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-brand-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
              >
                {remainingSeconds > 0
                  ? "Simulasi Bayar QRIS"
                  : "Buat Ulang Kode QRIS"}
                <FiArrowLeft
                  aria-hidden="true"
                  className="rotate-180"
                  size={16}
                />
              </button>
            )}
          </footer>
        )}

        {step === "success" && (
          <footer className="border-t border-slate-200 bg-white px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 sm:px-7">
            <button
              type="button"
              onClick={closeDialog}
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-brand-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-brand-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
            >
              Kembali ke Menu <FiArrowLeft aria-hidden="true" className="rotate-180" size={16} />
            </button>
          </footer>
        )}
      </div>
    </dialog>
  );
}