import {
  FiCoffee,
  FiGift,
  FiMinus,
  FiPackage,
  FiPlus,
  FiShoppingBag,
  FiSun,
} from "react-icons/fi";
import type { IconType } from "react-icons";
import type { MenuItem } from "@/types";
import { formatRupiah } from "./menu-data";

const categoryArtwork: Record<
  string,
  { icon: IconType; label: string; classes: string }
> = {
  coffee: {
    icon: FiCoffee,
    label: "Racikan kopi",
    classes: "bg-amber-50 text-amber-800",
  },
  "non-coffee": {
    icon: FiSun,
    label: "Minuman segar",
    classes: "bg-lime-50 text-lime-800",
  },
  food: {
    icon: FiShoppingBag,
    label: "Dibuat segar",
    classes: "bg-orange-50 text-orange-800",
  },
  snacks: {
    icon: FiPackage,
    label: "Teman santai",
    classes: "bg-sky-50 text-sky-800",
  },
  dessert: {
    icon: FiGift,
    label: "Manis penutup",
    classes: "bg-rose-50 text-rose-800",
  },
};

type ProductCardProps = {
  product: MenuItem;
  quantity: number;
  onAdd: (product: MenuItem) => void;
  onChangeQuantity: (productId: string, amount: number) => void;
};

export default function ProductCard({
  product,
  quantity,
  onAdd,
  onChangeQuantity,
}: ProductCardProps) {
  const artwork = categoryArtwork[product.category] ?? categoryArtwork.coffee;
  const ArtworkIcon = artwork.icon;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-lg border border-slate-200 bg-white transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_12px_28px_-20px_rgba(15,23,42,0.32)]">
      <div
        className={`relative grid h-36 place-items-center overflow-hidden sm:h-40 ${artwork.classes}`}
      >
        <div
          aria-hidden="true"
          className="absolute -right-5 -top-10 size-36 rounded-full border border-current/10"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-16 -left-4 size-32 rounded-full border border-current/10"
        />
        <ArtworkIcon
          aria-hidden="true"
          className="relative transition-transform duration-300 group-hover:scale-110"
          size={44}
          strokeWidth={1.25}
        />
        <span className="absolute bottom-3 left-3 text-[10px] font-semibold uppercase tracking-[0.14em] opacity-70">
          {artwork.label}
        </span>
        {product.isPopular && (
          <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-sm bg-white/90 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-brand-secondary shadow-sm">
            Favorit
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <h2 className="text-base font-semibold leading-6 text-brand-secondary">
          {product.name}
        </h2>
        <p className="mt-1.5 min-h-10 text-xs leading-5 text-slate-500">
          {product.description}
        </p>
        <div className="mt-auto flex items-center justify-between gap-3 pt-4">
          <p className="text-sm font-bold text-brand-secondary">
            {formatRupiah(product.price)}
          </p>
          {quantity === 0 ? (
            <button
              type="button"
              onClick={() => onAdd(product)}
              disabled={!product.isAvailable}
              aria-label={`Tambah ${product.name} ke keranjang`}
              className="inline-flex h-10 items-center gap-1.5 rounded-md bg-brand-primary px-3 text-xs font-semibold text-white transition-colors hover:bg-brand-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              Tambah <FiPlus aria-hidden="true" size={14} />
            </button>
          ) : (
            <div
              className="flex h-10 items-center gap-3 rounded-md border border-slate-200 bg-brand-bg px-1"
              aria-label={`Jumlah ${product.name}: ${quantity}`}
            >
              <button
                type="button"
                onClick={() => onChangeQuantity(product.id, -1)}
                aria-label={`Kurangi ${product.name}`}
                className="grid size-8 place-items-center rounded text-brand-secondary transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-brand-primary"
              >
                <FiMinus aria-hidden="true" size={14} />
              </button>
              <span className="min-w-4 text-center text-sm font-semibold tabular-nums text-brand-secondary">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => onChangeQuantity(product.id, 1)}
                aria-label={`Tambah ${product.name}`}
                className="grid size-8 place-items-center rounded text-brand-secondary transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-brand-primary"
              >
                <FiPlus aria-hidden="true" size={14} />
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}