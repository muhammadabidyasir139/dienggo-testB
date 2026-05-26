"use client";

import { useState, useRef, useEffect } from "react";
import { format, isAfter, isBefore, startOfDay } from "date-fns";
import { Calendar as CalendarIcon, Search } from "lucide-react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { useTranslations } from "next-intl";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export function SearchBar({ className }: { className?: string }) {
  const tHero = useTranslations("Hero");
  const tCommon = useTranslations("Common");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [showCheckIn, setShowCheckIn] = useState(false);
  const [showCheckOut, setShowCheckOut] = useState(false);
  const [checkIn, setCheckIn] = useState<Date | undefined>(
    searchParams.get("checkIn")
      ? new Date(searchParams.get("checkIn")!)
      : undefined,
  );
  const [checkOut, setCheckOut] = useState<Date | undefined>(
    searchParams.get("checkOut")
      ? new Date(searchParams.get("checkOut")!)
      : undefined,
  );

  const [isSearching, setIsSearching] = useState(false);
  const [searchTriggered, setSearchTriggered] = useState(false);
  const startTimeRef = useRef<number>(0);

  const checkInRef = useRef<HTMLDivElement>(null);
  const checkOutRef = useRef<HTMLDivElement>(null);

  const scrollToResults = () => {
    const id = pathname.includes("cabin") ? "cabin-list-section" : "villa-list-section";
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleSearch = () => {
    if (!checkIn || !checkOut) {
      alert(tCommon("select_date_range"));
      return;
    }

    const formattedCheckIn = format(checkIn, "yyyy-MM-dd");
    const formattedCheckOut = format(checkOut, "yyyy-MM-dd");

    setIsSearching(true);
    startTimeRef.current = Date.now();

    const params = new URLSearchParams(searchParams.toString());
    params.set("checkIn", formattedCheckIn);
    params.set("checkOut", formattedCheckOut);

    const checkInParam = searchParams.get("checkIn");
    const checkOutParam = searchParams.get("checkOut");
    const isSame = checkInParam === formattedCheckIn && checkOutParam === formattedCheckOut;

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

    const checkInParam = searchParams.get("checkIn");
    const checkOutParam = searchParams.get("checkOut");

    const targetCheckIn = checkIn ? format(checkIn, "yyyy-MM-dd") : null;
    const targetCheckOut = checkOut ? format(checkOut, "yyyy-MM-dd") : null;

    if (checkInParam === targetCheckIn && checkOutParam === targetCheckOut) {
      const elapsed = Date.now() - startTimeRef.current;
      const remaining = Math.max(0, 1200 - elapsed);

      const timer = setTimeout(() => {
        setIsSearching(false);
        setSearchTriggered(false);
        scrollToResults();
      }, remaining);

      return () => clearTimeout(timer);
    }
  }, [searchParams, searchTriggered, checkIn, checkOut, pathname]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        checkInRef.current &&
        !checkInRef.current.contains(event.target as Node)
      ) {
        setShowCheckIn(false);
      }
      if (
        checkOutRef.current &&
        !checkOutRef.current.contains(event.target as Node)
      ) {
        setShowCheckOut(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCheckInSelect = (date: Date | undefined) => {
    if (!date) return;
    setCheckIn(date);
    setShowCheckIn(false);
    // Validation: If check-in is after check-out, reset check-out
    if (checkOut && isAfter(startOfDay(date), startOfDay(checkOut))) {
      setCheckOut(undefined);
      setShowCheckOut(true); // Automatically open checkout picker
    } else if (!checkOut) {
      setShowCheckOut(true); // Automatically open checkout picker if not set
    }
  };

  const handleCheckOutSelect = (date: Date | undefined) => {
    if (!date) return;
    // Validation: Check-out cannot be before check-in
    if (checkIn && isBefore(startOfDay(date), startOfDay(checkIn))) {
      alert("Tanggal check-out tidak boleh sebelum tanggal check-in");
      return;
    }
    setCheckOut(date);
    setShowCheckOut(false);
  };

  return (
    <>
      <div
        className={`absolute z-[100] left-1/2 bottom-0 w-[90%] max-w-4xl -translate-x-1/2 translate-y-1/2 rounded-2xl bg-white p-2 text-neutral-900 shadow-2xl md:p-4 ${className || ""}`}
      >
        <div className="grid grid-cols-1 gap-2 md:grid-cols-3 lg:gap-4">
          {/* Check In */}
          <div
            ref={checkInRef}
            onClick={() => {
              setShowCheckIn(!showCheckIn);
              setShowCheckOut(false);
            }}
            className={`relative flex flex-col justify-center rounded-xl border border-transparent p-3 transition-all duration-300 cursor-pointer hover:bg-sky-50 :bg-sky-900/20 ${showCheckIn ? "bg-sky-50 " : ""}`}
          >
            <span className="text-xs font-bold text-neutral-500">
              {tCommon("check_in")}
            </span>
            <div className="flex items-center gap-2 text-sm font-semibold truncate mt-1">
              <CalendarIcon size={16} className="text-primary " />
              {checkIn ? format(checkIn, "d MMM yyyy") : tCommon("select_date")}
            </div>
            {showCheckIn && (
              <div
                className="absolute top-[110%] left-0 z-50 rounded-xl bg-white p-4 shadow-xl text-neutral-800 border"
                onClick={(e) => e.stopPropagation()}
              >
                <DayPicker
                  mode="single"
                  selected={checkIn}
                  onSelect={handleCheckInSelect}
                  disabled={{ before: startOfDay(new Date()) }}
                />
              </div>
            )}
          </div>

          {/* Check Out */}
          <div
            ref={checkOutRef}
            onClick={() => {
              setShowCheckOut(!showCheckOut);
              setShowCheckIn(false);
            }}
            className={`relative flex flex-col justify-center rounded-xl border border-transparent p-3 transition-all duration-300 cursor-pointer hover:bg-sky-50 :bg-sky-900/20 ${showCheckOut ? "bg-sky-50 " : ""}`}
          >
            <span className="text-xs font-bold text-neutral-500">
              {tCommon("check_out")}
            </span>
            <div className="flex items-center gap-2 text-sm font-semibold truncate mt-1">
              <CalendarIcon size={16} className="text-primary " />
              {checkOut ? format(checkOut, "d MMM yyyy") : tCommon("select_date")}
            </div>
            {showCheckOut && (
              <div
                className="absolute top-[110%] left-0 z-50 rounded-xl bg-white p-4 shadow-xl text-neutral-800 border"
                onClick={(e) => e.stopPropagation()}
              >
                <DayPicker
                  mode="single"
                  selected={checkOut}
                  onSelect={handleCheckOutSelect}
                  disabled={
                    checkIn
                      ? { before: startOfDay(checkIn) }
                      : { before: startOfDay(new Date()) }
                  }
                />
              </div>
            )}
          </div>

          {/* Button */}
          <div className="flex items-center">
            <button
              onClick={handleSearch}
              className="flex h-full w-full items-center justify-center gap-2 rounded-xl bg-[#1a90ec] px-6 py-4 font-bold text-white transition-transform hover:scale-[1.02] cursor-pointer"
            >
              <Search size={20} />
              {tHero("search_button")}{" "}
              {pathname.includes("cabin") ? "Cabin" : "Villa"}
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
                  {pathname.includes("cabin") ? (
                    <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                      <path d="M9 22V12h6v10" />
                    </svg>
                  ) : (
                    <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                      <polyline points="9 22 9 12 15 12 15 22" />
                    </svg>
                  )}
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
                {pathname.includes("cabin")
                  ? "Mencari Cabin Terbaik..."
                  : "Mencari Villa Terbaik..."}
              </h3>
              <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
                Memeriksa ketersediaan tanggal{" "}
                <span className="font-semibold text-neutral-700 dark:text-neutral-300">
                  {checkIn ? format(checkIn, "d MMM") : ""} - {checkOut ? format(checkOut, "d MMM") : ""}
                </span>
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
