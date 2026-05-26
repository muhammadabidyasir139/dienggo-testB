"use client";

import { useState, useRef, useEffect } from "react";
import { format, startOfDay } from "date-fns";
import { CalendarIcon, MapPin, Search } from "lucide-react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { useTranslations } from "next-intl";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export function SearchBarJeep({ className }: { className?: string }) {
  const tHero = useTranslations("Hero");
  const tCommon = useTranslations("Common");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [showDate, setShowDate] = useState(false);
  const [date, setDate] = useState<Date | undefined>(
    searchParams.get("date") ? new Date(searchParams.get("date")!) : undefined,
  );
  const [destination, setDestination] = useState(searchParams.get("q") || "");
  const dateRef = useRef<HTMLDivElement>(null);

  const [isSearching, setIsSearching] = useState(false);
  const [searchTriggered, setSearchTriggered] = useState(false);
  const startTimeRef = useRef<number>(0);

  const scrollToResults = () => {
    const element = document.getElementById("jeep-list-section");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleSearch = () => {
    setIsSearching(true);
    startTimeRef.current = Date.now();

    const formattedDate = date ? format(date, "yyyy-MM-dd") : "";

    const params = new URLSearchParams(searchParams.toString());
    if (destination) {
      params.set("q", destination);
    } else {
      params.delete("q");
    }

    if (date) {
      params.set("date", formattedDate);
    } else {
      params.delete("date");
    }

    const qParam = searchParams.get("q") || "";
    const dateParam = searchParams.get("date") || "";
    const isSame = qParam === destination && dateParam === formattedDate;

    router.push(`${pathname}?${params.toString()}`);

    if (isSame) {
      setTimeout(() => {
        setIsSearching(false);
        scrollToResults();
      }, 1200);
    } else {
      setSearchTriggered(true);
    }
  };

  useEffect(() => {
    if (!searchTriggered) return;

    const qParam = searchParams.get("q") || "";
    const dateParam = searchParams.get("date") || "";

    const targetDate = date ? format(date, "yyyy-MM-dd") : "";

    if (qParam === destination && dateParam === targetDate) {
      const elapsed = Date.now() - startTimeRef.current;
      const remaining = Math.max(0, 1200 - elapsed);

      const timer = setTimeout(() => {
        setIsSearching(false);
        setSearchTriggered(false);
        scrollToResults();
      }, remaining);

      return () => clearTimeout(timer);
    }
  }, [searchParams, searchTriggered, destination, date]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dateRef.current && !dateRef.current.contains(event.target as Node)) {
        setShowDate(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <div
        className={`absolute z-[100] left-1/2 w-[90%] max-w-4xl -translate-x-1/2 rounded-2xl bg-white p-2 text-foreground shadow-2xl md:p-4 ${className || "-bottom-8 md:-bottom-10"}`}
      >
        <div className="grid grid-cols-1 gap-2 md:grid-cols-3 lg:gap-4">
          {/* Destination */}
          <div className="relative flex flex-col justify-center rounded-xl border border-transparent p-3 transition-colors hover:bg-neutral-50">
            <span className="text-xs font-bold text-neutral-500">
              {tCommon("destination")}
            </span>
            <div className="flex items-center gap-2 mt-1 border-b border-neutral-200 pb-1">
              <MapPin size={16} className="text-primary" />
              <input
                type="text"
                placeholder={
                  tCommon("destination_placeholder") || "Cth: Kawah Sikidang"
                }
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full bg-transparent text-sm font-semibold focus:outline-none placeholder-neutral-400"
              />
            </div>
          </div>

          {/* Date */}
          <div
            ref={dateRef}
            onClick={() => setShowDate(!showDate)}
            className={`relative flex flex-col justify-center rounded-xl border border-transparent p-3 transition-all duration-300 cursor-pointer hover:bg-sky-50 :bg-sky-900/20 ${showDate ? "bg-sky-50 " : ""}`}
          >
            <span className="text-xs font-bold text-neutral-500 text-left">
              {tCommon("date")}
            </span>
            <div className="flex items-center gap-2 text-sm font-semibold truncate mt-1">
              <CalendarIcon size={16} className="text-primary" />
              {date ? format(date, "d MMM yyyy") : tCommon("select_date")}
            </div>
            {showDate && (
              <div
                className="absolute top-[110%] left-0 z-50 rounded-xl bg-white p-4 shadow-xl border text-neutral-800"
                onClick={(e) => e.stopPropagation()}
              >
                <DayPicker
                  mode="single"
                  selected={date}
                  onSelect={(d) => {
                    setDate(d);
                    setShowDate(false);
                  }}
                  disabled={{ before: startOfDay(new Date()) }}
                />
              </div>
            )}
          </div>

          {/* Button */}
          <div className="flex items-center">
            <button
              onClick={handleSearch}
              className="flex h-full w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-4 font-bold text-white transition-transform hover:scale-[1.02] cursor-pointer"
            >
              <Search size={20} />
              {tHero("search_button")} Jeep
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isSearching && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-900/60 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 20 }}
              className="flex flex-col items-center justify-center p-8 rounded-3xl bg-white/95 dark:bg-neutral-900/95 shadow-2xl border border-neutral-200/50 dark:border-neutral-800/50 max-w-sm w-[90%] text-center"
            >
              {/* Animated Loader Circle */}
              <div className="relative w-24 h-24 flex items-center justify-center">
                {/* Inner pulsating logo/icon */}
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.8, 1, 0.8],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute z-10 flex items-center justify-center w-16 h-16 rounded-2xl bg-sky-50 dark:bg-sky-950 text-[#1a90ec] shadow-inner"
                >
                  <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <path d="M21 9H3" />
                    <path d="M21 15H3" />
                    <path d="M12 3v18" />
                  </svg>
                </motion.div>

                {/* Orbiting loading rings */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  className="w-24 h-24 rounded-full border-4 border-transparent border-t-[#1a90ec] border-r-[#1a90ec]/30"
                />
              </div>

              {/* Text */}
              <h3 className="mt-6 text-xl font-bold text-neutral-800 dark:text-neutral-100">
                Mencari Paket Jeep Terbaik...
              </h3>
              <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
                {date ? (
                  <>
                    Memeriksa ketersediaan tanggal{" "}
                    <span className="font-semibold text-neutral-700 dark:text-neutral-300">
                      {format(date, "d MMM yyyy")}
                    </span>
                  </>
                ) : (
                  "Mencari paket tersedia..."
                )}
              </p>

              {/* Shimmer progress bar */}
              <div className="mt-6 w-full h-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden relative">
                <motion.div
                  initial={{ left: "-100%" }}
                  animate={{ left: "100%" }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-0 bottom-0 w-1/3 bg-gradient-to-r from-transparent via-[#1a90ec] to-transparent"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
