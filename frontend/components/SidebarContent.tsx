"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { User, LogOut, X } from "lucide-react";

type NavItem = {
  name: string;
  href: string;
  icon?: any;
};

type SidebarContentProps = {
  navItems: NavItem[];
  pathname: string;
  profileHref: string;
  profileLabel: string;
  onLogout: () => void;
  layoutId: string;
  setIsOpen?: (value: boolean) => void;
};

export default function SidebarContent({
  navItems,
  pathname,
  profileHref,
  profileLabel,
  onLogout,
  layoutId,
  setIsOpen,
}: SidebarContentProps) {
  return (
    <>
      {/* Header */}
      <div className="h-20 flex items-center justify-between px-8 border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-500/20">
            S
          </div>
          <h1 className="text-white font-bold text-xl tracking-wide">
            Society<span className="text-indigo-400">Hub</span>
          </h1>
        </div>

        {setIsOpen && (
          <button
            className="lg:hidden text-slate-400 hover:text-white"
            onClick={() => setIsOpen(false)}
          >
            <X className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Menu */}
      <div className="flex-1 overflow-y-auto py-6 px-4 no-scrollbar">
        <div className="space-y-1.5">
          <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
            Menu
          </p>

          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              pathname?.startsWith(item.href + "/");

            const Icon = item.icon;

            return (
              <Link key={item.name} href={item.href} className="block relative">
                {isActive && (
                  <motion.div
                    layoutId={layoutId}
                    className="absolute inset-0 bg-indigo-500/10 rounded-xl border border-indigo-500/20"
                    initial={false}
                  />
                )}

                <div
                  className={`relative flex items-center gap-3 px-4 py-3.5 rounded-xl z-10 group ${
                    isActive
                      ? "text-indigo-400 font-medium"
                      : "hover:bg-slate-800/50 hover:text-white"
                  }`}
                >
                  {Icon && (
                    <Icon
                      className={`w-5 h-5 ${
                        isActive
                          ? "text-indigo-400"
                          : "text-slate-400 group-hover:text-slate-300"
                      }`}
                    />
                  )}

                  <span className="text-[15px]">{item.name}</span>

                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-500 rounded-r-full" />
                  )}
                </div>
              </Link>
            );
          })}

          {/* Profile */}
          <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 mt-8">
            Account
          </p>

          <Link href={profileHref}>
            <div className="flex items-center gap-3 px-4 py-3.5 rounded-xl hover:bg-slate-800/50">
              <User className="w-5 h-5 text-slate-400" />
              <span>{profileLabel}</span>
            </div>
          </Link>
        </div>
      </div>

      {/* Logout */}
      <div className="p-4 border-t border-slate-800 shrink-0">
        <button
          onClick={onLogout}
          className="flex items-center gap-3 px-4 py-3.5 w-full rounded-xl hover:bg-slate-800/50"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </>
  );
}