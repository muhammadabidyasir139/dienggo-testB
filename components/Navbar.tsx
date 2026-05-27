"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useState, useRef } from "react";
import { LangToggle } from "./LangToggle";
import { Menu, X, ShoppingBag } from "lucide-react";
import { useSession, signOut } from "next-auth/react";

export function Navbar() {
  const t = useTranslations("Navigation");
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinks = [
    { href: "/villa", label: t("villa") },
    // { href: "/hotel-cabin", label: t("hotel-cabin") },
    // { href: "/jeep", label: t("jeep") },
    { href: "/aktivitas", label: t("aktivitas") },
  ];

  const navBgClass = "bg-white/95 backdrop-blur-md shadow-sm border-b border-neutral-200";
  const textColorClass = "text-neutral-800";

  return (
    <header
      ref={headerRef}
      className={`fixed top-0 z-[120] w-full transition-all duration-300 ${navBgClass}`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/asset/Logo-removebg-preview.png"
            alt="Dienggo Logo"
            width={120}
            height={40}
            className="h-10 w-auto object-contain"
            priority
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:opacity-70 ${isActive
                    ? "text-primary font-bold"
                    : textColorClass
                  }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-4">
          <LangToggle />

          <Link
            href="/daftar-tuan-rumah"
            className="text-sm font-bold px-4 py-2 rounded-xl transition-all border border-primary text-primary hover:bg-primary hover:text-white"
          >
            {t("host_registration")}
          </Link>

          {session ? (
            <div className="flex items-center gap-3">
              <Link
                href={session.user.role === "admin" ? "/admin" : "/dashboard"}
                className="rounded-xl bg-primary px-5 py-2 text-sm font-bold text-white transition-all hover:bg-primary/95"
              >
                Dashboard
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/villa" })}
                className="text-sm font-bold px-4 py-2 rounded-xl transition-all border border-red-200 text-red-600 hover:bg-red-50 cursor-pointer"
              >
                Keluar
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white transition-transform hover:scale-105"
            >
              {t("login")}
            </Link>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className={`md:hidden p-2 ${textColorClass}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-16 left-0 w-full bg-white shadow-xl border-t border-neutral-100 p-4 md:hidden flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-3 text-base font-medium text-neutral-800 hover:bg-neutral-50 rounded-lg"
            >
              {link.label}
            </Link>
          ))}

          {session?.user && (
            <Link
              href="/dashboard/pesanan"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-3 text-base font-medium text-neutral-800 hover:bg-neutral-50 rounded-lg flex items-center gap-3"
            >
              <ShoppingBag size={18} className="text-primary" />
              Pesanan Saya
            </Link>
          )}

          <div className="flex items-center justify-end px-4 py-2 mt-4 border-t border-neutral-100">
            <LangToggle />
          </div>

          {session?.user ? (
            <div className="mx-4 flex flex-col gap-2">
              <Link
                href={session.user.role === "admin" ? "/admin" : "/dashboard"}
                onClick={() => setMobileMenuOpen(false)}
                className="text-center rounded-lg bg-primary py-3 font-semibold text-white mb-2"
              >
                Dashboard
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  signOut({ callbackUrl: "/villa" });
                }}
                className="text-center rounded-lg bg-red-50 py-3 font-semibold text-red-600 cursor-pointer"
              >
                Keluar
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="mx-4 mt-2 text-center rounded-lg bg-primary py-3 font-semibold text-white"
            >
              {t("login")}
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
