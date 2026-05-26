"use client";

import { useState, useRef } from "react";
import { Navbar } from "@/components/Navbar";
import {
  Home,
  MapPin,
  Wifi,
  Tv,
  ChefHat,
  Waves,
  Wind,
  Briefcase,
  Car,
  Coffee,
  Flame,
  Dumbbell,
  Palmtree,
  Camera,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  Trash2,
  Plus,
  Mountain,
  Zap,
  Map as MapIcon,
  ArrowRight,
  ArrowLeft,
  Check,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { submitHostRegistration } from "@/app/admin/actions/host-registration";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const steps = [
  { id: 1, name: "Properti", icon: Home },
  { id: 2, name: "Lokasi", icon: MapPin },
  { id: 3, name: "Fasilitas", icon: Wifi },
  { id: 4, name: "Foto", icon: Camera },
  { id: 5, name: "Harga", icon: Zap },
  { id: 6, name: "Selesai", icon: CheckCircle2 },
];

const categories = [
  {
    id: "villa",
    name: "Villa",
    icon: Home,
    description: "Rumah pribadi yang luas",
  },
  {
    id: "cabin",
    name: "Cabin",
    icon: Mountain,
    description: "Hunian kayu yang hangat",
  },
  {
    id: "jeep",
    name: "Jeep",
    icon: MapIcon,
    description: "Kendaraan petualangan",
  },
];

const facilityOptions = [
  { id: "wifi", name: "Wifi", icon: Wifi },
  { id: "tv", name: "TV", icon: Tv },
  { id: "dapur", name: "Dapur", icon: ChefHat },
  { id: "mesin_cuci", name: "Mesin Cuci", icon: Waves },
  { id: "parkir_gratis", name: "Parkir gratis di properti", icon: Car },
  { id: "parkir_berbayar", name: "Parkir berbayar di properti", icon: Car },
  { id: "ac", name: "AC", icon: Wind },
  { id: "area_kerja", name: "Area kerja khusus", icon: Briefcase },
  { id: "kolam_renang", name: "Kolam renang", icon: Waves },
  { id: "bak_mandi_panas", name: "Bak mandi air panas", icon: Flame },
  { id: "patio", name: "Patio", icon: Palmtree },
  { id: "bbq", name: "Pemanggang BBQ", icon: ChefHat },
  { id: "area_makan_luar", name: "Area makan luar ruang", icon: Coffee },
  { id: "perapian", name: "Perapian", icon: Flame },
  { id: "meja_biliar", name: "Meja biliar", icon: Zap },
  { id: "perapian_dalam", name: "Perapian dalam ruang", icon: Flame },
  { id: "piano", name: "Piano", icon: Zap },
  { id: "peralatan_olahraga", name: "Peralatan olahraga", icon: Dumbbell },
  { id: "akses_danau", name: "Akses ke danau", icon: Waves },
  { id: "akses_pantai", name: "Akses ke pantai", icon: Palmtree },
  { id: "akses_ski", name: "Akses ski masuk/keluar", icon: Mountain },
  { id: "pancuran_luar", name: "Pancuran luar ruang", icon: Waves },
];

const safetyOptions = [
  { id: "alarm_asap", name: "Alarm asap", icon: ShieldAlert },
  { id: "p3k", name: "Kotak P3K", icon: ShieldAlert },
  { id: "pemadam_api", name: "Pemadam api", icon: ShieldAlert },
  { id: "alarm_karbon", name: "Alarm karbon monoksida", icon: ShieldAlert },
];

export default function HostRegistrationPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [validationError, setValidationError] = useState("");

  const [formData, setFormData] = useState({
    category: "",
    nama: "",
    unit: "",
    lantai: "",
    alamatJalan: "",
    distrik: "",
    kota: "",
    provinsi: "",
    kodePos: "",
    whatsappOwner: "",
    koordinat: "",
    fasilitas: [] as string[],
    itemKeselamatan: [] as string[],
    fotos: [] as string[],
    deskripsi: "",
    hargaDasar: 0,
    hargaAkhirPekan: 0,
    hargaLiburan: 0,
  });

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 6));
  const prevStep = () => {
    setValidationError("");
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleNextStep = () => {
    setValidationError("");

    if (currentStep === 1) {
      if (!formData.category) {
        setValidationError("Silakan pilih kategori properti Anda.");
        return;
      }
    } else if (currentStep === 2) {
      if (
        !formData.nama.trim() ||
        !formData.alamatJalan.trim() ||
        !formData.kota.trim() ||
        !formData.provinsi.trim() ||
        !formData.kodePos.trim() ||
        !formData.whatsappOwner.trim()
      ) {
        setValidationError("Harap lengkapi semua field wajib (*) pada form lokasi.");
        return;
      }
    } else if (currentStep === 4) {
      if (formData.fotos.length < 5) {
        setValidationError("Harap unggah minimal 5 foto properti Anda.");
        return;
      }
      if (!formData.deskripsi.trim()) {
        setValidationError("Deskripsi properti wajib diisi.");
        return;
      }
    }

    nextStep();
  };

  const handleCategorySelect = (id: string) => {
    setFormData({ ...formData, category: id });
  };

  const handleFacilityToggle = (id: string) => {
    const current = [...formData.fasilitas];
    if (current.includes(id)) {
      setFormData({ ...formData, fasilitas: current.filter((f) => f !== id) });
    } else {
      setFormData({ ...formData, fasilitas: [...current, id] });
    }
  };

  const handleSafetyToggle = (id: string) => {
    const current = [...formData.itemKeselamatan];
    if (current.includes(id)) {
      setFormData({
        ...formData,
        itemKeselamatan: current.filter((f) => f !== id),
      });
    } else {
      setFormData({ ...formData, itemKeselamatan: [...current, id] });
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddPhoto = () => {
    fileInputRef.current?.click();
  };

  const compressImage = (base64: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;
          const MAX_SIZE = 1000;
          if (width > height) {
            if (width > MAX_SIZE) {
              height *= MAX_SIZE / width;
              width = MAX_SIZE;
            }
          } else {
            if (height > MAX_SIZE) {
              width *= MAX_SIZE / height;
              height = MAX_SIZE;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, width, height);
          const compressedBase64 = canvas.toDataURL("image/jpeg", 0.6);
          resolve(compressedBase64);
        } catch (err) {
          reject(err);
        }
      };
      img.onerror = (err) => reject(err);
      img.src = base64;
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newPhotos: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      const promise = new Promise<string>((resolve) => {
        reader.onload = (event) => resolve(event.target?.result as string);
      });
      reader.readAsDataURL(file);
      const base64 = await promise;
      
      try {
        const compressed = await compressImage(base64);
        newPhotos.push(compressed);
      } catch (err) {
        console.error("Compression error:", err);
        newPhotos.push(base64); // fallback to original if compression fails
      }
    }
    setFormData((prev) => ({ ...prev, fotos: [...prev.fotos, ...newPhotos] }));
    e.target.value = "";
  };

  const handleRemovePhoto = (index: number) => {
    setFormData({
      ...formData,
      fotos: formData.fotos.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async () => {
    setValidationError("");
    if (formData.hargaDasar <= 0) {
      setValidationError("Harga dasar wajib diisi dan harus lebih dari 0.");
      return;
    }

    if (!session?.user) {
      alert("Silakan login terlebih dahulu.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        userId: (session.user as any).id || session.user.email,
      };
      
      const sizeMB = (JSON.stringify(payload).length / 1024 / 1024).toFixed(2);
      console.log(`Submitting payload size: ${sizeMB} MB`);
      
      const res = await submitHostRegistration(payload);
      if (res.success) {
        setCurrentStep(6);
      } else {
        alert("Gagal mendaftar: " + res.error);
      }
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan sistem.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 pt-20 pb-12">
      <Navbar />

      <div className="mx-auto max-w-4xl px-4">
        {/* Stepper */}
        <div className="mb-12 flex items-center justify-between">
          {steps.map((step) => {
            const Icon = step.icon;
            const isActive = currentStep >= step.id;
            return (
              <div
                key={step.id}
                className="flex flex-col items-center gap-2 flex-1 relative"
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center z-10 transition-colors ${
                    isActive
                      ? "bg-primary text-white"
                      : "bg-white text-slate-400 border border-slate-200"
                  }`}
                >
                  {currentStep > step.id ? (
                    <Check size={20} />
                  ) : (
                    <Icon size={20} />
                  )}
                </div>
                <span
                  className={`text-xs font-bold ${isActive ? "text-primary" : "text-slate-400"}`}
                >
                  {step.name}
                </span>
                {step.id < 6 && (
                  <div
                    className={`absolute top-5 left-[60%] w-[80%] h-0.5 -z-0 ${
                      currentStep > step.id ? "bg-primary" : "bg-slate-200"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>

        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 min-h-[500px] flex flex-col">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1"
            >
              {currentStep === 1 && (
                <div className="space-y-8">
                  <div className="text-center">
                    <h2 className="text-3xl font-black text-slate-900">
                      Apa kategori tempat Anda?
                    </h2>
                    <p className="text-slate-500 mt-2">
                      Pilih salah satu kategori yang paling menggambarkan
                      properti Anda.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {categories.map((cat) => {
                      const Icon = cat.icon;
                      return (
                        <button
                          key={cat.id}
                          onClick={() => handleCategorySelect(cat.id)}
                          className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-4 text-center group cursor-pointer ${
                            formData.category === cat.id
                              ? "border-primary bg-primary/5 text-primary"
                              : "border-slate-100 hover:border-slate-200 text-slate-600"
                          }`}
                        >
                          <div
                            className={`p-4 rounded-xl transition-colors ${
                              formData.category === cat.id
                                ? "bg-primary text-white"
                                : "bg-slate-50 text-slate-400 group-hover:bg-slate-100"
                            }`}
                          >
                            <Icon size={32} />
                          </div>
                          <div>
                            <p className="font-bold text-lg">{cat.name}</p>
                            <p className="text-xs opacity-70 mt-1">
                              {cat.description}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="text-center">
                    <h2 className="text-3xl font-black text-slate-900">
                      Di mana lokasi Anda?
                    </h2>
                    <p className="text-slate-500 mt-2">
                      Bantu tamu menemukan Anda dengan alamat yang akurat.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">
                        Nama Villa / Cabin <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary outline-none cursor-text text-slate-900"
                        placeholder="Nama properti Anda"
                        value={formData.nama}
                        onChange={(e) =>
                          setFormData({ ...formData, nama: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">
                        Unit / Lantai (Opsional)
                      </label>
                      <input
                        type="text"
                        className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary outline-none cursor-text text-slate-900"
                        placeholder="Unit 5, Lantai 2, dll"
                        value={formData.unit}
                        onChange={(e) =>
                          setFormData({ ...formData, unit: e.target.value })
                        }
                      />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-sm font-bold text-slate-700">
                        Alamat Jalan <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary outline-none cursor-text text-slate-900"
                        placeholder="Jl. Raya Dieng No. 123"
                        value={formData.alamatJalan}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            alamatJalan: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">
                        Kota / Kabupaten <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary outline-none cursor-text text-slate-900"
                        placeholder="Wonosobo"
                        value={formData.kota}
                        onChange={(e) =>
                          setFormData({ ...formData, kota: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">
                        Provinsi <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary outline-none cursor-text text-slate-900"
                        placeholder="Jawa Tengah"
                        value={formData.provinsi}
                        onChange={(e) =>
                          setFormData({ ...formData, provinsi: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">
                        Kode Pos <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary outline-none cursor-text text-slate-900"
                        placeholder="56354"
                        value={formData.kodePos}
                        onChange={(e) =>
                          setFormData({ ...formData, kodePos: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">
                        WhatsApp Owner <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary outline-none cursor-text text-slate-900"
                        placeholder="628123456789"
                        value={formData.whatsappOwner}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            whatsappOwner: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-bold text-slate-700">
                        URL Koordinat Maps (Opsional)
                      </label>
                      <input
                        type="text"
                        className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary outline-none cursor-text text-slate-900"
                        placeholder="https://maps.google.com/..."
                        value={formData.koordinat}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            koordinat: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-8">
                  <div className="text-center">
                    <h2 className="text-3xl font-black text-slate-900">
                      Fasilitas apa saja yang tersedia?
                    </h2>
                    <p className="text-slate-500 mt-2">
                      Pilih fasilitas yang bisa dinikmati oleh tamu Anda.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {facilityOptions.map((fac) => {
                      const Icon = fac.icon;
                      const isSelected = formData.fasilitas.includes(fac.id);
                      return (
                        <button
                          key={fac.id}
                          onClick={() => handleFacilityToggle(fac.id)}
                          className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 text-center group cursor-pointer ${
                            isSelected
                              ? "border-primary bg-primary/5 text-primary"
                              : "border-slate-100 hover:border-slate-200 text-slate-600"
                          }`}
                        >
                          <Icon
                            size={24}
                            className={
                              isSelected ? "text-primary" : "text-slate-400"
                            }
                          />
                          <span className="text-xs font-bold leading-tight">
                            {fac.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="pt-6 border-t border-slate-100">
                    <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <ShieldAlert size={20} className="text-amber-500" />
                      Item Keselamatan
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {safetyOptions.map((safe) => {
                        const Icon = safe.icon;
                        const isSelected = formData.itemKeselamatan.includes(
                          safe.id,
                        );
                        return (
                          <button
                            key={safe.id}
                            onClick={() => handleSafetyToggle(safe.id)}
                            className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 text-center group cursor-pointer ${
                              isSelected
                                ? "border-amber-500 bg-amber-50 text-amber-700"
                                : "border-slate-100 hover:border-slate-200 text-slate-600"
                            }`}
                          >
                            <Icon
                              size={24}
                              className={
                                isSelected ? "text-amber-500" : "text-slate-400"
                              }
                            />
                            <span className="text-xs font-bold leading-tight">
                              {safe.name}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="text-center">
                    <h2 className="text-3xl font-black text-slate-900">
                      Tambahkan foto properti Anda
                    </h2>
                    <p className="text-red-500 mt-2">
                      Minimal 5 foto untuk memberikan gambaran lengkap kepada
                      tamu.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      multiple
                      accept="image/*"
                      className="hidden"
                    />
                    {formData.fotos.map((url, i) => (
                      <div
                        key={i}
                        className="relative aspect-video rounded-2xl overflow-hidden border border-slate-200 group"
                      >
                        <img
                          src={url}
                          alt={`Foto ${i + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemovePhoto(i)}
                          className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg cursor-pointer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={handleAddPhoto}
                      className="aspect-video rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 text-slate-400 hover:border-primary hover:text-primary transition-all hover:bg-primary/5 cursor-pointer"
                    >
                      <Plus size={32} />
                      <span className="text-sm font-bold">Tambah Foto</span>
                    </button>
                  </div>

                  <div className="pt-6">
                    <label className="text-sm font-bold text-slate-700 mb-2 block">
                      Deskripsi Properti <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      className="w-full p-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-primary outline-none min-h-[150px] cursor-text text-slate-900"
                      placeholder="Ceritakan apa yang membuat tempat Anda spesial..."
                      value={formData.deskripsi}
                      onChange={(e) =>
                        setFormData({ ...formData, deskripsi: e.target.value })
                      }
                    />
                  </div>
                </div>
              )}

              {currentStep === 5 && (
                <div className="space-y-8">
                  <div className="text-center">
                    <h2 className="text-3xl font-black text-slate-900">
                      Tentukan harga terbaik
                    </h2>
                    <p className="text-slate-500 mt-2">
                      Anda bisa mengatur harga berbeda untuk hari tertentu.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-6 rounded-3xl border border-slate-100 bg-slate-50 space-y-4">
                      <div className="flex items-center gap-3 text-slate-900 font-bold">
                        <Zap size={20} className="text-primary" />
                        Harga Dasar <span className="text-red-500">*</span>
                      </div>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">
                          Rp
                        </span>
                        <input
                          type="number"
                          className="w-full p-4 pl-12 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-primary outline-none font-bold cursor-text text-slate-900"
                          placeholder="0"
                          value={formData.hargaDasar || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              hargaDasar: parseInt(e.target.value) || 0,
                            })
                          }
                        />
                      </div>
                      <p className="text-xs text-slate-400 italic">
                        Harga standar per malam.
                      </p>
                    </div>
                    <div className="p-6 rounded-3xl border border-slate-100 bg-slate-50 space-y-4">
                      <div className="flex items-center gap-3 text-slate-900 font-bold">
                        <Palmtree size={20} className="text-emerald-500" />
                        Harga Akhir Pekan
                      </div>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">
                          Rp
                        </span>
                        <input
                          type="number"
                          className="w-full p-4 pl-12 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none font-bold cursor-text text-slate-900"
                          placeholder="0"
                          value={formData.hargaAkhirPekan || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              hargaAkhirPekan: parseInt(e.target.value) || 0,
                            })
                          }
                        />
                      </div>
                      <p className="text-xs text-slate-400 italic">
                        Harga untuk Sabtu & Minggu.
                      </p>
                    </div>
                    <div className="p-6 rounded-3xl border border-slate-100 bg-slate-50 space-y-4">
                      <div className="flex items-center gap-3 text-slate-900 font-bold">
                        <Mountain size={20} className="text-rose-500" />
                        Harga Liburan
                      </div>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">
                          Rp
                        </span>
                        <input
                          type="number"
                          className="w-full p-4 pl-12 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-rose-500 outline-none font-bold cursor-text text-slate-900"
                          placeholder="0"
                          value={formData.hargaLiburan || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              hargaLiburan: parseInt(e.target.value) || 0,
                            })
                          }
                        />
                      </div>
                      <p className="text-xs text-slate-400 italic">
                        Harga untuk hari libur nasional.
                      </p>
                    </div>
                  </div>

                  <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10 flex items-start gap-4">
                    <AlertTriangle className="text-primary shrink-0" />
                    <p className="text-sm text-primary/80 leading-relaxed">
                      <b>Tips:</b> Villa dengan harga kompetitif memiliki
                      peluang 40% lebih tinggi untuk mendapatkan pesanan pertama
                      dalam 30 hari pertama.
                    </p>
                  </div>
                </div>
              )}

              {currentStep === 6 && (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                  <div className="w-24 h-24 rounded-full bg-green-100 text-green-500 flex items-center justify-center shadow-lg shadow-green-100">
                    <CheckCircle2 size={48} />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-3xl font-black text-slate-900">
                      Pendaftaran Berhasil!
                    </h2>
                    <p className="text-slate-500 max-w-md mx-auto">
                      Terima kasih telah mendaftarkan properti Anda. Tim admin
                      kami akan meninjau pendaftaran Anda dalam waktu 1x24 jam.
                    </p>
                  </div>
                  <div className="flex flex-col gap-3 w-full max-w-xs">
                    <button
                      onClick={() => router.push("/")}
                      className="w-full py-4 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all cursor-pointer"
                    >
                      Kembali ke Beranda
                    </button>
                    <p className="text-xs text-slate-400">
                      Status pendaftaran dapat dipantau melalui profil Anda.
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Footer Actions */}
          {currentStep < 6 && (
            <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col gap-4">
              {validationError && (
                <div className="bg-red-50 text-red-500 p-4 rounded-2xl flex items-center gap-3 text-sm font-bold border border-red-100">
                  <AlertTriangle size={20} />
                  {validationError}
                </div>
              )}
              <div className="flex items-center justify-between">
                <button
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className={`flex items-center gap-2 font-bold px-6 py-3 rounded-2xl transition-all cursor-pointer ${
                    currentStep === 1
                      ? "opacity-0 pointer-events-none"
                      : "text-slate-500 hover:bg-slate-50"
                  }`}
                >
                  <ArrowLeft size={20} />
                  Kembali
                </button>

                {currentStep === 5 ? (
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="flex items-center gap-2 bg-primary text-white font-bold px-10 py-4 rounded-2xl shadow-lg shadow-primary/20 hover:scale-[1.05] transition-all disabled:opacity-50 disabled:hover:scale-100 cursor-pointer"
                  >
                    {isSubmitting ? "Mengirim..." : "Kirim Pendaftaran"}
                    {!isSubmitting && <CheckCircle2 size={20} />}
                  </button>
                ) : (
                  <button
                    onClick={handleNextStep}
                    className="flex items-center gap-2 bg-slate-900 text-white font-bold px-8 py-4 rounded-2xl shadow-lg hover:scale-[1.05] transition-all cursor-pointer"
                  >
                    Lanjutkan
                    <ArrowRight size={20} />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
