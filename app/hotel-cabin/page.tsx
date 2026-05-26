export const dynamic = "force-dynamic";

import { Navbar } from "@/components/Navbar";
import { SearchBar } from "@/components/SearchBar";
import { PromoBanner } from "@/components/PromoBanner";
import { CabinCard, CabinProps } from "@/components/CabinCard";
import { GridSkeleton } from "@/components/CardSkeleton";
import { Suspense } from "react";
import Image from "next/image";
import { getCabins } from "@/app/admin/actions/cabin";
import { getFacilities } from "@/app/admin/actions/facility";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hotel Cabin Dieng | Menginap Eksklusif di Alam Dieng",
  description: "Nikmati pengalaman menginap unik di hotel cabin Dieng. Desain modern, view pegunungan, dan suasana sejuk yang menenangkan.",
  keywords: ["hotel cabin dieng", "cabin premium dieng", "glamping dieng", "penginapan unik dieng"],
};

export default async function CabinListingPage({
  searchParams,
}: {
  searchParams: Promise<{ checkIn?: string; checkOut?: string }>;
}) {
  const t = await getTranslations("Cabin");
  const { checkIn, checkOut } = await searchParams;

  const [cabinsResponse, facilitiesRaw] = await Promise.all([
    getCabins({ checkIn, checkOut }),
    getFacilities(),
  ]);

  // Create a facility map based on IDs
  const facilityMap = facilitiesRaw.reduce((acc: any, f: any) => {
    acc[f.id] = f.name;
    return acc;
  }, {});

  // Transform data to match CabinProps
  const cabins = cabinsResponse.map((v) => ({
    id: v.id,
    slug: v.slug,
    nama: v.nama,
    harga: v.harga,
    rating: Number(v.rating) || 0,
    ulasan: v.ulasan || 0,
    lokasi: v.lokasi || "",
    fasilitasUtama: Array.isArray(v.fasilitasUtama)
      ? (v.fasilitasUtama as any[])
          .filter((id) => id && typeof id === "string")
          .map((id) => facilityMap[id as string] || id)
      : [],
    fotoUtama: v.fotoUtama || "",
  }));

  return (
    <main className="min-h-screen bg-background pb-20">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[50vh] w-full bg-slate-900">
        <Image
          src="/asset/cabin-hero.jpg"
          alt="Cabin Hero"
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
        <SearchBar />
      </section>

      {/* Main Content */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-[200px] sm:mt-[220px] md:mt-32">
        <PromoBanner text={t("promo_banner")} />

        <div id="cabin-list-section" className="mt-12 scroll-mt-24">
          <h2 className="text-2xl font-bold text-foreground mb-6">
            {t("favorite_cabins")}
          </h2>
          <Suspense fallback={<GridSkeleton />}>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {cabins.map((cabin) => (
                <CabinCard key={cabin.id} {...cabin} />
              ))}
            </div>
          </Suspense>
        </div>
      </section>
    </main>
  );
}
