"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, ChevronDown, Menu, X } from "lucide-react";
import type { NavItem, SiteConfig } from "@/lib/types";
import { cn } from "@/lib/utils";
import { BrandLockup } from "./BrandLockup";

const isActive = (item: NavItem, path: string) =>
  [item.href, ...(item.children?.map((c) => c.href) ?? [])].some((h) => {
    const base = h.split("#")[0];
    return base !== "/" && (path === base || path.startsWith(base + "/"));
  });

function Dropdown({ item, active }: { item: NavItem; active: boolean }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLLIElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <li
      ref={ref}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onBlur={(e) => {
        if (!ref.current?.contains(e.relatedTarget as Node)) setOpen(false);
      }}
    >
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "relative flex items-center gap-1 whitespace-nowrap px-3 py-2 text-[0.9rem] transition-colors duration-300",
          active || open ? "text-ink" : "text-muted hover:text-ink",
        )}
      >
        {item.label}
        <ChevronDown
          aria-hidden
          className={cn("size-3.5 transition-transform duration-300", open && "rotate-180")}
        />
        <span
          aria-hidden
          className={cn(
            "absolute inset-x-3 -bottom-px h-px origin-left bg-blue transition-transform duration-500 ease-[var(--ease-precise)]",
            active ? "scale-x-100" : "scale-x-0",
          )}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 top-full pt-3"
          >
            <ul className="w-72 border border-line bg-white p-2 shadow-[0_12px_32px_-12px_rgb(15_23_42/0.18)]">
              {item.children?.map((c) => (
                <li key={c.href}>
                  <Link
                    href={c.href}
                    onClick={() => setOpen(false)}
                    className="group block px-3 py-2.5 transition-colors hover:bg-paper"
                  >
                    <span className="block text-[0.92rem] text-ink group-hover:text-blue">
                      {c.label}
                    </span>
                    {c.description && (
                      <span className="mt-0.5 block text-xs text-muted">{c.description}</span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}

const noopSubscribe = () => () => {};

export function SiteHeader({ site }: { site: SiteConfig }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [menuTop, setMenuTop] = useState(72);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const headerRef = useRef<HTMLElement>(null);

  // Portal target (document.body) only exists on the client; false during SSR/hydration.
  const mounted = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const close = () => setOpen(false);
  const toggle = () => {
    // The menu is portalled to <body> (a backdrop-filter on the header would otherwise
    // become the containing block for position:fixed and collapse the panel), so it is
    // positioned from the header's real bottom edge, which moves with the announcement bar.
    if (!open && headerRef.current)
      setMenuTop(Math.round(headerRef.current.getBoundingClientRect().bottom));
    setOpen((o) => !o);
  };

  return (
    <header
      ref={headerRef}
      className={cn(
        "sticky top-0 z-50 transition-[background-color,border-color] duration-500",
        scrolled || open
          ? "border-b border-line bg-white/90 backdrop-blur-md"
          : "border-b border-transparent",
      )}
    >
      <div className="container-x flex h-[72px] items-center justify-between gap-6">
        <BrandLockup site={site} compact />

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {site.nav.map((item) => {
              const active = isActive(item, pathname);
              return item.children ? (
                <Dropdown key={`${item.label}-${pathname}`} item={item} active={active} />
              ) : (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative whitespace-nowrap px-3 py-2 text-[0.9rem] transition-colors duration-300",
                      active ? "text-ink" : "text-muted hover:text-ink",
                    )}
                  >
                    {item.label}
                    <span
                      aria-hidden
                      className={cn(
                        "absolute inset-x-3 -bottom-px h-px origin-left bg-blue transition-transform duration-500 ease-[var(--ease-precise)]",
                        active ? "scale-x-100" : "scale-x-0",
                      )}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/contact"
            className="hidden h-10 items-center rounded-sm bg-ink px-4 text-[0.88rem] font-medium text-white transition-colors duration-300 hover:bg-blue sm:inline-flex"
          >
            Contact
          </Link>
          <button
            ref={toggleRef}
            type="button"
            onClick={toggle}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="inline-flex size-10 items-center justify-center rounded-sm border border-line text-ink lg:hidden"
          >
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            {open ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
          </button>
        </div>
      </div>

      {mounted &&
        createPortal(
          // Always mounted; visibility is pure CSS so a closed menu can never linger as an
          // invisible layer that blocks taps, and `invisible` removes it from focus order.
          <div
            id="mobile-menu"
            style={{ top: menuTop }}
            className={cn(
              "fixed inset-x-0 bottom-0 z-40 overflow-y-auto border-t border-line bg-white duration-300 lg:hidden",
              // Opening: visible immediately, opacity fades in. Closing: fade, then hide.
              open
                ? "visible opacity-100 transition-opacity"
                : "pointer-events-none invisible opacity-0 transition-[opacity,visibility]",
            )}
          >
            <nav aria-label="Mobile" className="container-x flex min-h-full flex-col pb-10 pt-2">
              <ul>
                {site.nav.map((item) => (
                  <li key={item.label} className="border-b border-line py-4">
                    <Link
                      href={item.href}
                      onClick={close}
                      className={cn(
                        "text-2xl tracking-[-0.02em]",
                        isActive(item, pathname) ? "text-blue" : "text-ink",
                      )}
                    >
                      {item.label}
                    </Link>
                    {item.children && (
                      <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-1">
                        {item.children.map((c) => (
                          <li key={c.href}>
                            <Link
                              href={c.href}
                              onClick={close}
                              className="text-[0.95rem] text-muted hover:text-ink"
                            >
                              {c.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-10">
                <Link
                  href="/contact"
                  onClick={close}
                  className="flex h-12 items-center justify-center rounded-sm bg-ink text-white"
                >
                  Contact the Center
                </Link>
                <a
                  href={`mailto:${site.email}`}
                  className="mt-4 flex items-center justify-center gap-1 text-sm text-muted"
                >
                  {site.email} <ArrowUpRight className="size-3.5" aria-hidden />
                </a>
              </div>
            </nav>
          </div>,
          document.body,
        )}
    </header>
  );
}
