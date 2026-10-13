"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FiCoffee,
  FiGift,
  FiGrid,
  FiPackage,
  FiShoppingBag,
  FiShoppingCart,
  FiSun,
} from "react-icons/fi";
import type { IconType } from "react-icons";
import type { CartItem, Category, MenuItem, OrderType } from "@/types";
import CheckoutDialog from "./checkout-dialog";
import { formatRupiah, menuCategories, menuItems } from "./menu-data";
import ProductCard from "./product-card";

const TAX_RATE = 0.11;

const categoryIcons: Record<string, IconType> = {
  FiGrid,
  FiCoffee,
  FiSun,
  FiShoppingBag,
  FiPackage,
  FiGift,
};

function CategoryNavigation({
  categories,
  selectedCategory,
  onSelect,
}: {
  categories: Category[];
  selectedCategory: string;
  onSelect: (categoryId: string) => void;
}) {
  return (
    <nav
      aria-label="Kategori menu"
      className="border-t border-slate-100 bg-white"
    >
      <div className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-4 py-2.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:px-6">
        {categories.map((category) => {
          const Icon = categoryIcons[category.iconName] ?? FiGrid;
          const isSelected = selectedCategory === category.id;

          return (
            <button
              key={category.id}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onSelect(category.id)}
              className={`inline-flex min-h-10 shrink-0 items-center gap-2 rounded-md px-3.5 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary ${
                isSelected
                  ? "bg-brand-primary text-white"
                  : "bg-brand-bg text-slate-600 hover:bg-blue-50 hover:text-brand-primary"
              }`}
            >
              <Icon aria-hidden="true" size={15} />
              {category.name}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

function OrderTypeSelector({
  orderType,
  onChange,
}: {
  orderType: OrderType;
  onChange: (orderType: OrderType) => void;
}) {
  return (
    <div
      role="group"
      aria-label="Pilih jenis pesanan"
      className="grid grid-cols-2 rounded-md bg-slate-100 p-1 sm:w-[270px]"
    >
      {([
        ["DINE_IN", "Makan di tempat"],
        ["TAKE_AWAY", "Bawa pulang"],
      ] as const).map(([value, label]) => (
        <button
          key={value}
          type="button"
          aria-pressed={orderType === value}
          onClick={() => onChange(value)}
          className={`min-h-9 rounded px-3 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-brand-primary ${
            orderType === value
              ? "bg-white text-brand-primary shadow-sm"
              : "text-slate-500 hover:text-brand-secondary"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

export default function OrderingExperience({ tableId }: { tableId: string }) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [orderType, setOrderType] = useState<OrderType>("DINE_IN");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const visibleItems = menuItems.filter(
    (item) =>
      item.isAvailable &&
      (selectedCategory === "all" || item.category === selectedCategory),
  );
  const itemCount = cartItems.reduce((count, item) => count + item.quantity, 0);
  const subtotal = cartItems.reduce(
    (amount, item) => amount + item.menuItem.price * item.quantity,
    0,
  );
  const tax = Math.round(subtotal * TAX_RATE);
  const total = subtotal + tax;
  const tableNumber = tableId.padStart(2, "0");

  const addItem = (menuItem: MenuItem) => {
    setCartItems((items) => {
      const existingItem = items.find((item) => item.menuItem.id === menuItem.id);

      if (existingItem) {
        return items.map((item) =>
          item.menuItem.id === menuItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }

      return [...items, { menuItem, quantity: 1 }];
    });
  };

  const changeQuantity = (productId: string, amount: number) => {
    setCartItems((items) =>
      items
        .map((item) =>
          item.menuItem.id === productId
            ? { ...item, quantity: item.quantity + amount }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const changeNotes = (productId: string, notes: string) => {
    setCartItems((items) =>
      items.map((item) =>
        item.menuItem.id === productId ? { ...item, notes } : item,
      ),
    );
  };

  const closeCheckout = (paymentCompleted: boolean) => {
    setIsCheckoutOpen(false);
    if (paymentCompleted) setCartItems([]);
  };

  return (
    <main className="min-h-dvh bg-brand-bg pb-28 text-brand-secondary sm:pb-32">
      <div className="sticky top-0 z-30 shadow-[0_4px_16px_-16px_rgba(15,23,42,0.5)]">
        <header className="border-b border-slate-100 bg-white">
          <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div className="flex items-center justify-between gap-3">
              <Link href="/" className="flex min-w-0 items-center gap-2.5">
                <span className="grid size-10 shrink-0 place-items-center rounded-md bg-brand-primary text-white">
                  <FiCoffee aria-hidden="true" size={19} />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-bold text-brand-secondary">
                    XYZ Coffee & Eatery
                  </span>
                  <span className="mt-0.5 block text-[10px] font-medium uppercase tracking-[0.13em] text-slate-400">
                    Menu meja
                  </span>
                </span>
              </Link>
              <span className="inline-flex min-h-9 shrink-0 items-center rounded-md bg-blue-50 px-3 text-xs font-bold text-brand-primary sm:hidden">
                Meja #{tableNumber}
              </span>
            </div>

            <div className="flex items-center justify-between gap-3">
              <span className="hidden min-h-9 items-center rounded-md bg-blue-50 px-3 text-xs font-bold text-brand-primary sm:inline-flex">
                Meja #{tableNumber}
              </span>
              <OrderTypeSelector orderType={orderType} onChange={setOrderType} />
            </div>
          </div>
        </header>
        <CategoryNavigation
          categories={menuCategories}
          selectedCategory={selectedCategory}
          onSelect={setSelectedCategory}
        />
      </div>

      <section className="mx-auto max-w-6xl px-4 pb-8 pt-7 sm:px-6 sm:pb-12 sm:pt-10">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-primary">
              Dibuat dengan sepenuh hati
            </p>
            <h1 className="mt-1.5 text-2xl font-semibold tracking-tight text-brand-secondary sm:text-3xl">
              Pilih menu favoritmu
            </h1>
            <p className="mt-2 max-w-xl text-xs leading-5 text-slate-500 sm:text-sm">
              Semua pilihan dibuat segar setelah dipesan.
            </p>
          </div>
          <span className="hidden items-center gap-1.5 pb-1 text-xs font-medium text-slate-400 sm:inline-flex">
            <FiShoppingCart aria-hidden="true" size={15} />
            {itemCount} item di keranjang
          </span>
        </div>

        {visibleItems.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
            {visibleItems.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                quantity={
                  cartItems.find((item) => item.menuItem.id === product.id)
                    ?.quantity ?? 0
                }
                onAdd={addItem}
                onChangeQuantity={changeQuantity}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-slate-300 bg-white px-5 py-14 text-center">
            <p className="text-sm font-semibold">Menu belum tersedia</p>
            <p className="mt-1 text-xs text-slate-500">
              Silakan pilih kategori lainnya.
            </p>
          </div>
        )}
      </section>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_24px_-20px_rgba(15,23,42,0.35)] backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 sm:py-4">
          <div className="min-w-0">
            <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-slate-400">
              {itemCount === 1 ? "1 item dipilih" : `${itemCount} item dipilih`}
            </p>
            <p className="mt-0.5 truncate text-base font-bold tabular-nums text-brand-secondary sm:text-lg">
              {formatRupiah(subtotal)}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsCheckoutOpen(true)}
            disabled={itemCount === 0}
            className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-md bg-brand-primary px-4 text-xs font-semibold text-white transition-all hover:bg-brand-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary disabled:cursor-not-allowed disabled:bg-slate-300 sm:px-6 sm:text-sm"
          >
            Lihat Pesanan & Bayar
            <FiShoppingCart aria-hidden="true" size={16} />
          </button>
        </div>
      </div>

      <CheckoutDialog
        isOpen={isCheckoutOpen}
        tableNumber={tableNumber}
        orderType={orderType}
        items={cartItems}
        subtotal={subtotal}
        tax={tax}
        total={total}
        onClose={closeCheckout}
        onChangeQuantity={changeQuantity}
        onChangeNotes={changeNotes}
      />
    </main>
  );
}