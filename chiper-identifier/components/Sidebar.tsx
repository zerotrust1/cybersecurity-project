"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV_ITEMS = [
  { name: "Cipher Identifier", href: "/", icon: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  )},
  { name: "Coming Soon...", href: "#", icon: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ), disabled: true },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 right-4 z-50 p-2 bg-zinc-900 border border-emerald-500/30 rounded-md text-emerald-500 hover:bg-zinc-800 transition-colors"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          )}
        </svg>
      </button>

      {/* Backdrop for Mobile */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-zinc-950 border-r border-zinc-900 z-40 transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-zinc-900">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-emerald-500 rounded flex items-center justify-center text-black font-bold">
                C
              </div>
              <span className="font-bold tracking-tighter text-zinc-100 uppercase">Cipher_tools</span>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            <div className="px-3 mb-4 text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
              Available Tools
            </div>
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all duration-200
                    ${item.disabled ? 'opacity-50 cursor-not-allowed grayscale' : 'hover:bg-zinc-900'}
                    ${isActive ? 'bg-emerald-500/10 text-emerald-400 border-l-2 border-emerald-500' : 'text-zinc-400'}
                  `}
                  onClick={() => setIsOpen(false)}
                >
                  <span className={isActive ? 'text-emerald-400' : 'text-zinc-500'}>
                    {item.icon}
                  </span>
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-zinc-900">
            <div className="bg-zinc-900/50 p-4 rounded-lg border border-zinc-800">
              <div className="text-[10px] text-zinc-600 font-bold uppercase mb-2">System Status</div>
              <div className="flex items-center gap-2 text-[10px] text-emerald-500">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                OPERATIONAL
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
