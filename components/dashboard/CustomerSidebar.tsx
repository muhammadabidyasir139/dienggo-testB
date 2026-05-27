"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ShoppingBag, Newspaper, User, LogOut, Home } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";

export function CustomerSidebar() {
    const pathname = usePathname();
    const { data: session } = useSession();

    const menuItems = [
        { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { href: "/dashboard/pesanan", label: "Pesanan Saya", icon: ShoppingBag },
        { href: "/dashboard/pengajuan", label: "Pengajuan Saya", icon: Home },
        { href: "/dashboard/berita", label: "Berita", icon: Newspaper },
        { href: "/dashboard/profil", label: "Profil Saya", icon: User },
    ];

    return (
        <aside className="w-64 min-h-screen bg-primary-light border-r border-blue-100 flex flex-col fixed left-0 top-0">
            {/* Logo */}
            <div className="p-6 border-b border-blue-100">
                <Link href="/">
                    <Image
                        src="/asset/Logo-removebg-preview.png"
                        alt="Dienggo Logo"
                        width={120}
                        height={40}
                        className="h-10 w-auto object-contain"
                    />
                </Link>
            </div>

            {/* Profile Info */}
            <div className="p-6 flex items-center gap-3 border-b border-blue-100">
                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                    {session?.user?.name?.[0]?.toUpperCase() || "U"}
                </div>
                <div className="flex-1 overflow-hidden">
                    <p className="text-sm font-bold text-foreground truncate">{session?.user?.name || "User"}</p>
                    <p className="text-xs text-neutral-500 truncate">{session?.user?.email}</p>
                </div>
            </div>

            {/* Menu */}
            <nav className="flex-1 p-4 space-y-1">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${isActive
                                    ? "bg-blue-100 text-primary font-bold shadow-sm"
                                    : "text-neutral-600 hover:bg-white/50"
                                }`}
                        >
                            <Icon size={18} />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            {/* Logout */}
            <div className="p-4 border-t border-blue-100">
                <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                    <LogOut size={18} />
                    Keluar
                </button>
            </div>
        </aside>
    );
}
