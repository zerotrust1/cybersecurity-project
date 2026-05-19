"use client";

import { useState, useMemo } from "react";
import { identifyAndDecode } from "@/lib/cipher-utils";

export default function Home() {
  const [input, setInput] = useState("");

  const results = useMemo(() => {
    return input.trim() ? identifyAndDecode(input) : [];
  }, [input]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-mono p-4 sm:p-8 lg:p-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="space-y-2 border-l-4 border-emerald-500 pl-4">
          <h1 className="text-4xl font-bold tracking-tighter text-emerald-400">
            CIPHER_IDENTIFIER
          </h1>
          <p className="text-zinc-500 text-sm">
            Detect and crack common encodings and ciphers in real-time.
          </p>
        </header>

        <main className="grid gap-8">
          <section className="space-y-4">
            <label htmlFor="ciphertext" className="text-xs uppercase tracking-widest text-emerald-500/50 font-bold">
              Input Ciphertext
            </label>
            <textarea
              id="ciphertext"
              className="w-full h-48 bg-zinc-900 border border-zinc-800 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-emerald-50 transition-all resize-none"
              placeholder="Support Base64, Hex, Binary, Morse, base32, affine, vigenere or Caesar cipher. (soon will be more)"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </section>

          <section className="space-y-4">
            <h2 className="text-xs uppercase tracking-widest text-emerald-500/50 font-bold">
              Analysis Results
            </h2>
            
            {results.length > 0 ? (
              <div className="grid gap-4">
                {results.map((result, idx) => (
                  <div 
                    key={idx} 
                    className="bg-zinc-900/50 border border-emerald-500/20 rounded-lg p-6 hover:border-emerald-500/40 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <span className="bg-emerald-500/10 text-emerald-400 text-xs px-2 py-1 rounded border border-emerald-500/20">
                        {result.type}
                      </span>
                      <span className="text-zinc-600 text-[10px] uppercase">
                        Confidence: {Math.round(result.confidence)}%
                      </span>
                    </div>
                    <div className="bg-black/40 p-4 rounded border border-zinc-800 break-all text-sm leading-relaxed">
                      {result.decoded}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-32 flex items-center justify-center border-2 border-dashed border-zinc-800 rounded-lg text-zinc-700">
                {input ? "No likely matches identified." : "Waiting for input..."}
              </div>
            )}
          </section>
        </main>

        <footer className="pt-8 border-t border-zinc-900 text-[10px] text-zinc-700 uppercase tracking-widest flex justify-between">
          <span>Copyright © {new Date().getFullYear()} zerotrust1 (fahrel)</span>
          <span>System Online</span>
        </footer>
      </div>
    </div>
  );
}
