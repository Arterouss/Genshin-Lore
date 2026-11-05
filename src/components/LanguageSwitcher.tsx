"use client";

import { useEffect, useState } from "react";
import { Globe, Check } from "lucide-react";

declare global {
  interface Window {
    google?: {
      translate?: {
        TranslateElement: {
          new (
            options: { pageLanguage: string; includedLanguages: string; autoDisplay: boolean },
            elementId: string
          ): void;
          InlineLayout?: {
            SIMPLE: number;
          };
        };
      };
    };
    googleTranslateElementInit?: () => void;
  }
}

export default function LanguageSwitcher() {
  const [currentLang, setCurrentLang] = useState<"id" | "en">("id");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Cek cookie atau preferensi tersimpan
    const saved = localStorage.getItem("teyvat_language");
    if (saved === "en") {
      setCurrentLang("en");
    } else {
      setCurrentLang("id");
      // Jika pertama kali dibuka dan belum ada cookie, pasang ke Bahasa Indonesia otomatis
      if (!document.cookie.includes("googtrans")) {
        setLanguageCookie("id");
      }
    }

    // Inisialisasi skrip Google Translate sekali saja
    if (!document.getElementById("google-translate-script")) {
      window.googleTranslateElementInit = () => {
        if (window.google?.translate?.TranslateElement) {
          new window.google.translate.TranslateElement(
            {
              pageLanguage: "en",
              includedLanguages: "id,en",
              autoDisplay: false,
            },
            "google_translate_element"
          );
        }
      };

      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const setLanguageCookie = (lang: "id" | "en") => {
    const val = lang === "id" ? "/auto/id" : "/auto/en";
    const hostname = window.location.hostname;
    document.cookie = `googtrans=${val}; path=/;`;
    document.cookie = `googtrans=${val}; path=/; domain=${hostname};`;
    if (hostname.includes("pages.dev")) {
      document.cookie = `googtrans=${val}; path=/; domain=.pages.dev;`;
    }
  };

  const changeLanguage = (lang: "id" | "en") => {
    if (lang === currentLang) {
      setIsOpen(false);
      return;
    }

    setCurrentLang(lang);
    localStorage.setItem("teyvat_language", lang);
    setLanguageCookie(lang);
    setIsOpen(false);

    // Reload cepat agar translasi diterapkan ke seluruh DOM
    window.location.reload();
  };

  return (
    <div className="relative inline-block text-left">
      {/* Hidden container untuk Google Translate script */}
      <div id="google_translate_element" className="hidden" aria-hidden="true" />

      {/* Tombol Pemilih Bahasa */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-celestia-850/80 hover:bg-celestia-800 text-parchment hover:text-gold-300 border border-gold-300/20 text-xs font-semibold transition-all shadow-sm"
        title="Ganti Bahasa / Switch Language"
      >
        <Globe size={14} className="text-gold-300" />
        <span className="uppercase tracking-wider">{currentLang === "id" ? "🇮🇩 ID" : "🇬🇧 EN"}</span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-44 rounded-2xl bg-celestia-900 border border-gold-300/25 shadow-2xl z-50 overflow-hidden py-1.5 backdrop-blur-md animate-fade-in">
            <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-parchment-muted tracking-widest border-b border-gold-300/10">
              Pilih Bahasa
            </div>

            <button
              type="button"
              onClick={() => changeLanguage("id")}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs transition-colors ${
                currentLang === "id"
                  ? "bg-gold-300/15 text-gold-300 font-bold"
                  : "text-parchment hover:bg-celestia-800"
              }`}
            >
              <span className="flex items-center gap-2">
                <span>🇮🇩</span>
                <span>Bahasa Indonesia</span>
              </span>
              {currentLang === "id" && <Check size={14} />}
            </button>

            <button
              type="button"
              onClick={() => changeLanguage("en")}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs transition-colors ${
                currentLang === "en"
                  ? "bg-gold-300/15 text-gold-300 font-bold"
                  : "text-parchment hover:bg-celestia-800"
              }`}
            >
              <span className="flex items-center gap-2">
                <span>🇬🇧</span>
                <span>English (Asli)</span>
              </span>
              {currentLang === "en" && <Check size={14} />}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

