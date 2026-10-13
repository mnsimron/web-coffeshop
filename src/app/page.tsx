import Link from "next/link";
import {
  FiArrowDownRight,
  FiArrowRight,
  FiClock,
  FiCoffee,
  FiCreditCard,
  FiMapPin,
  FiMonitor,
  FiZap,
} from "react-icons/fi";
import type { IconType } from "react-icons";

const features: { icon: IconType; title: string; description: string }[] = [
  {
    icon: FiZap,
    title: "Order at your own pace",
    description:
      "Scan the code at your table, browse the menu, and send your order straight to our team.",
  },
  {
    icon: FiCreditCard,
    title: "Pay the easy way",
    description:
      "Settle up with QRIS in a few taps, or choose cash when you order.",
  },
  {
    icon: FiMonitor,
    title: "Know what’s brewing",
    description:
      "Your order heads directly to the bar, where our team keeps every cup moving.",
  },
];

const demoLinks: { icon: IconType; title: string; description: string; href: string }[] = [
  {
    icon: FiCoffee,
    title: "Customer menu",
    description: "Order from your table",
    href: "/table/05",
  },
  {
    icon: FiCreditCard,
    title: "Cashier POS",
    description: "Create and manage orders",
    href: "/kasir",
  },
  {
    icon: FiMonitor,
    title: "Bar display",
    description: "Follow the live order queue",
    href: "/bar",
  },
];

function BrandMark() {
  return (
    <Link href="/" className="group inline-flex items-center gap-3" aria-label="XYZ Coffee & Eatery home">
      <span className="grid size-10 place-items-center rounded-sm bg-brand-primary text-white transition-transform duration-300 group-hover:-rotate-6">
        <FiCoffee aria-hidden="true" size={20} />
      </span>
      <span className="flex flex-col leading-tight">
        <span className="text-sm font-bold tracking-[0.02em] text-brand-secondary">
          XYZ Coffee
        </span>
        <span className="mt-1 text-[10px] font-medium uppercase tracking-[0.18em] text-slate-500">
          & Eatery
        </span>
      </span>
    </Link>
  );
}

function Header() {
  return (
    <header className="relative z-10 border-b border-slate-200/80 bg-brand-bg">
      <div className="mx-auto flex min-h-[76px] max-w-7xl items-center justify-between gap-6 px-5 sm:px-8">
        <BrandMark />

        <nav aria-label="Main navigation" className="hidden items-center gap-8 md:flex">
          <a className="text-sm font-medium text-slate-600 transition-colors hover:text-brand-primary" href="#story">
            Our place
          </a>
          <a className="text-sm font-medium text-slate-600 transition-colors hover:text-brand-primary" href="#ordering">
            How it works
          </a>
          <a className="text-sm font-medium text-slate-600 transition-colors hover:text-brand-primary" href="#visit">
            Visit us
          </a>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/kasir"
            className="hidden rounded-sm px-3 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-white hover:text-brand-primary sm:inline-flex"
          >
            Kasir POS
          </Link>
          <Link
            href="/bar"
            className="hidden rounded-sm px-3 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-white hover:text-brand-primary sm:inline-flex"
          >
            Bar screen
          </Link>
          <Link
            href="/table/05"
            className="inline-flex min-h-10 items-center gap-2 rounded-sm bg-brand-primary px-4 text-sm font-semibold text-white transition-colors hover:bg-brand-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
          >
            Order now <FiArrowRight aria-hidden="true" size={15} />
          </Link>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section id="story" className="mx-auto grid max-w-7xl gap-10 px-5 pb-16 pt-12 sm:px-8 sm:pb-20 sm:pt-16 lg:grid-cols-[1fr_0.92fr] lg:items-center lg:gap-14 lg:pb-24 lg:pt-20">
      <div className="flex flex-col items-start lg:py-8">
        <p className="mb-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-brand-primary">
          <span className="h-px w-7 bg-brand-primary" />
          Coffee, comfort & good company
        </p>
        <h1 className="max-w-[620px] text-[46px] font-semibold leading-[1.05] tracking-[-0.035em] text-brand-secondary sm:text-[60px] lg:text-[68px]">
          Make room for
          <span className="block text-brand-primary">a better break.</span>
        </h1>
        <p className="mt-6 max-w-[480px] text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
          Thoughtfully brewed coffee, something lovely to eat, and a little more
          time to enjoy it. Your table is ready.
        </p>
        <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <Link
            href="/table/05"
            className="inline-flex min-h-12 items-center justify-center gap-3 rounded-sm bg-brand-primary px-6 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-brand-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
          >
            Order via QR Code <FiArrowRight aria-hidden="true" size={16} />
          </Link>
          <a
            href="#ordering"
            className="inline-flex min-h-12 items-center justify-center gap-3 rounded-sm border border-slate-300 bg-transparent px-6 text-sm font-semibold text-brand-secondary transition-colors hover:border-brand-primary hover:text-brand-primary"
          >
            Explore the experience <FiArrowDownRight aria-hidden="true" size={16} />
          </a>
        </div>
        <div className="mt-10 flex items-center gap-3 border-t border-slate-200 pt-5">
          <div className="flex -space-x-2" aria-hidden="true">
            <span className="size-8 rounded-full border-2 border-brand-bg bg-[#d5a486]" />
            <span className="size-8 rounded-full border-2 border-brand-bg bg-[#e7cdb4]" />
            <span className="size-8 rounded-full border-2 border-brand-bg bg-[#9b6e52]" />
          </div>
          <p className="text-xs leading-5 text-slate-500">
            <span className="font-semibold text-brand-secondary">Made for your everyday</span>
            <br />
            Fresh cups, warm welcomes.
          </p>
        </div>
      </div>

      <div className="relative min-h-[340px] overflow-hidden rounded-sm bg-slate-200 sm:min-h-[440px] lg:min-h-[540px]">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-[1.03]"
          role="img"
          aria-label="Freshly brewed coffee served in a bright, welcoming cafe"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1400&q=85')",
          }}
        />
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 bg-brand-secondary/80 p-5 text-white sm:p-6">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/70">
              Your neighborhood coffee stop
            </p>
            <p className="mt-1 text-lg font-semibold">Good things, made fresh.</p>
          </div>
          <FiCoffee aria-hidden="true" className="mb-1 shrink-0 text-white/80" size={22} />
        </div>
      </div>
    </section>
  );
}

function OrderingFeatures() {
  return (
    <section id="ordering" className="border-y border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="mb-9 flex flex-col justify-between gap-4 sm:mb-12 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-primary">
              Easy from the first sip
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.025em] text-brand-secondary sm:text-4xl">
              Your table, your way.
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-6 text-slate-500">
            A smoother visit, from the first order to the last little treat.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <article
                key={feature.title}
                className="group min-h-[220px] rounded-sm border border-slate-200 bg-brand-bg p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand-primary/40 hover:bg-white hover:shadow-[0_12px_32px_-20px_rgba(15,23,42,0.35)] sm:p-7"
              >
                <div className="flex items-center justify-between">
                  <span className="grid size-11 place-items-center rounded-sm bg-blue-50 text-brand-primary transition-colors group-hover:bg-brand-primary group-hover:text-white">
                    <Icon aria-hidden="true" size={20} />
                  </span>
                  <span className="text-xs font-semibold tabular-nums text-slate-400">
                    0{index + 1}
                  </span>
                </div>
                <h3 className="mt-7 text-lg font-semibold text-brand-secondary">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {feature.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function DemoAccess() {
  return (
    <section className="bg-brand-secondary text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[0.75fr_1.25fr] lg:items-center">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-300">
            Take a closer look
          </p>
          <h2 className="mt-3 max-w-sm text-3xl font-semibold tracking-[-0.025em] sm:text-4xl">
            One cafe. Three ways in.
          </h2>
          <p className="mt-4 max-w-sm text-sm leading-6 text-slate-300">
            Step into the customer menu, cashier station, or live bar queue.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {demoLinks.map((demo) => {
            const Icon = demo.icon;
            return (
              <Link
                key={demo.href}
                href={demo.href}
                className="group flex min-h-[144px] flex-col justify-between rounded-sm border border-white/15 bg-white/[0.04] p-5 transition-colors hover:border-blue-300/60 hover:bg-white/[0.09] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-300"
              >
                <div className="flex items-start justify-between">
                  <Icon aria-hidden="true" className="text-blue-300" size={20} />
                  <FiArrowRight
                    aria-hidden="true"
                    className="text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-white"
                    size={16}
                  />
                </div>
                <div>
                  <h3 className="text-sm font-semibold">{demo.title}</h3>
                  <p className="mt-1 text-xs leading-5 text-slate-400">
                    {demo.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer id="visit" className="bg-brand-bg">
      <div className="mx-auto grid max-w-7xl gap-9 px-5 py-12 sm:px-8 md:grid-cols-[1.2fr_1fr_1fr] md:items-end">
        <div>
          <BrandMark />
          <p className="mt-4 max-w-xs text-sm leading-6 text-slate-500">
            A neighborhood place for good coffee, good food, and unhurried moments.
          </p>
        </div>
        <div className="flex items-start gap-3">
          <FiMapPin aria-hidden="true" className="mt-0.5 shrink-0 text-brand-primary" size={17} />
          <div>
            <p className="text-sm font-semibold text-brand-secondary">Find us</p>
            <p className="mt-1 text-sm leading-6 text-slate-500">Downtown, Your City</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <FiClock aria-hidden="true" className="mt-0.5 shrink-0 text-brand-primary" size={17} />
          <div>
            <p className="text-sm font-semibold text-brand-secondary">Opening hours</p>
            <p className="mt-1 text-sm leading-6 text-slate-500">Every day, 8:00 AM – 9:00 PM</p>
          </div>
        </div>
      </div>
      <div className="border-t border-slate-200">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-5 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>© 2026 XYZ Coffee & Eatery. All rights reserved.</p>
          <p>Made with care, served fresh.</p>
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-brand-bg text-brand-secondary">
      <Header />
      <Hero />
      <OrderingFeatures />
      <DemoAccess />
      <Footer />
    </main>
  );
}
