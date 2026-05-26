export const dynamic = "force-dynamic";

import { Navbar } from "@/components/Navbar";
import { SearchBarJeep } from "@/components/SearchBarJeep";
import { PromoBanner } from "@/components/PromoBanner";
import { JeepCard, JeepProps } from "@/components/JeepCard";
import { GridSkeleton } from "@/components/CardSkeleton";
import { Suspense } from "react";
import Image from "next/image";
import { getJeeps } from "@/app/admin/actions/jeep";
import { getTranslations } from "next-intl/server";

export default async function JeepListingPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; date?: string }>;
}) {
  const t = await getTranslations("Jeep");
  const { q, date } = await searchParams;
  const jeepsResponse = await getJeeps({ q, date });

  const jeeps = jeepsResponse.map((v) => ({
    id: v.id,
    slug: v.slug,
    nama: v.nama,
    harga: v.harga,
    maksOrang: v.maksOrang || 0,
    durasi: v.durasi || "",
    destinasiCount: v.destinasiCount || 0,
    fotoUtama: v.fotoUtama || "",
  }));

  return (
    <main className="min-h-screen bg-background pb-20">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[50vh] w-full bg-slate-900">
        <Image
          src="/asset/jeep-hero.jpg"
          alt="Jeep Hero"
          fill
          priority
          className="object-cover"
        />

        <div className="absolute inset-0 bg-black/30" />

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-3xl font-black tracking-tight text-white md:text-5xl lg:text-6xl drop-shadow-lg max-w-4xl">
            {t("hero_title")}
          </h1>
          <p className="mt-4 text-sm font-medium text-white/90 md:text-lg lg:text-xl drop-shadow-md">
            {t("hero_subtitle")}
          </p>
        </div>

        {/* Floating Search Bar */}
        <SearchBarJeep />
      </section>

      {/* Main Content */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-[200px] sm:mt-[220px] md:mt-32">
        <PromoBanner text={t("promo_banner")} />

        <div id="jeep-list-section" className="mt-12 scroll-mt-24">
          <h2 className="text-2xl font-bold text-foreground mb-6">
            {t("favorite_jeeps")}
          </h2>
          <Suspense fallback={<GridSkeleton />}>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {jeeps.map((jeep) => (
                <JeepCard key={jeep.id} {...jeep} />
              ))}
            </div>
          </Suspense>
        </div>
      </section>
    </main>
  );
}
