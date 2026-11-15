"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Sparkles,
  Search,
  Shield,
  Swords,
  Gem,
  Compass,
  Scroll,
  X,
  BookOpen,
  Utensils,
  ChevronDown
} from "lucide-react";
import charactersData from "@/data/database/characters.json";
import weaponsData from "@/data/database/weapons.json";
import foodsData from "@/data/database/foods.json";
import worldItemsData from "@/data/database/world-items.json";
import materialsData from "@/data/database/materials.json";
import questItemsData from "@/data/database/quest-items.json";
import type {
  CharacterInfo,
  WeaponInfo,
  FoodInfo,
  WorldItemInfo,
  MaterialInfo,
  QuestItemInfo
} from "@/types/database";
import ElementBadge from "@/components/ElementBadge";

type TabKey = "characters" | "weapons" | "foods" | "world-items" | "materials" | "quest-items";

const RARITY_BG_GRADIENTS: Record<number, string> = {
  5: "from-amber-500/20 via-amber-400/10 to-transparent border-gold-400/40 text-gold-300",
  4: "from-purple-500/20 via-purple-400/10 to-transparent border-purple-400/40 text-purple-200",
  3: "from-blue-500/20 via-blue-400/10 to-transparent border-blue-400/40 text-blue-200",
  2: "from-emerald-500/20 via-emerald-400/10 to-transparent border-emerald-400/40 text-emerald-200",
  1: "from-slate-500/20 via-slate-400/10 to-transparent border-slate-400/30 text-slate-300",
};

const RARITY_BORDER_COLORS: Record<number, string> = {
  5: "border-gold-400/60 shadow-[0_0_12px_rgba(229,186,105,0.25)]",
  4: "border-purple-400/50 shadow-[0_0_12px_rgba(198,123,242,0.2)]",
  3: "border-blue-400/40",
  2: "border-emerald-400/30",
  1: "border-slate-400/20",
};

export default function DatabasePage() {
  const [activeTab, setActiveTab] = useState<TabKey>("characters");
  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState<number>(36);

  // Filters: Characters
  const [selectedRarity, setSelectedRarity] = useState<string>("all");
  const [selectedElement, setSelectedElement] = useState<string>("all");
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [selectedWeaponType, setSelectedWeaponType] = useState<string>("all");

  // Filters: Foods
  const [selectedFoodCategory, setSelectedFoodCategory] = useState<string>("all");
  const [selectedFoodRarity, setSelectedFoodRarity] = useState<string>("all");

  // Filters: World Items
  const [selectedWorldSubCategory, setSelectedWorldSubCategory] = useState<string>("all");
  const [selectedWorldRegion, setSelectedWorldRegion] = useState<string>("all");

  // Filters: Materials
  const [selectedMaterialSubCategory, setSelectedMaterialSubCategory] = useState<string>("all");
  const [selectedMaterialRarity, setSelectedMaterialRarity] = useState<string>("all");

  // Modal Detail State
  const [modalItem, setModalItem] = useState<{
    type: TabKey;
    data: any;
  } | null>(null);

  // Filtered Characters
  const filteredCharacters = useMemo(() => {
    return (charactersData as CharacterInfo[]).filter((c) => {
      const matchSearch =
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.affiliation.toLowerCase().includes(search.toLowerCase()) ||
        c.region.toLowerCase().includes(search.toLowerCase());
      const matchRarity = selectedRarity === "all" || c.rarity.toString() === selectedRarity;
      const matchElement = selectedElement === "all" || c.element === selectedElement;
      const matchRegion = selectedRegion === "all" || c.region === selectedRegion;
      const matchWeapon = selectedWeaponType === "all" || c.weapon === selectedWeaponType;
      return matchSearch && matchRarity && matchElement && matchRegion && matchWeapon;
    });
  }, [search, selectedRarity, selectedElement, selectedRegion, selectedWeaponType]);

  // Filtered Weapons
  const filteredWeapons = useMemo(() => {
    return (weaponsData as WeaponInfo[]).filter((w) => {
      const matchSearch =
        w.name.toLowerCase().includes(search.toLowerCase()) ||
        w.passiveName.toLowerCase().includes(search.toLowerCase()) ||
        w.description.toLowerCase().includes(search.toLowerCase());
      const matchRarity = selectedRarity === "all" || w.rarity.toString() === selectedRarity;
      const matchType = selectedWeaponType === "all" || w.type === selectedWeaponType;
      return matchSearch && matchRarity && matchType;
    });
  }, [search, selectedRarity, selectedWeaponType]);

  // Filtered Foods
  const filteredFoods = useMemo(() => {
    return (foodsData as FoodInfo[]).filter((f) => {
      const matchSearch =
        f.name.toLowerCase().includes(search.toLowerCase()) ||
        f.nameEn.toLowerCase().includes(search.toLowerCase()) ||
        f.effect.toLowerCase().includes(search.toLowerCase()) ||
        f.description.toLowerCase().includes(search.toLowerCase());
      const matchCategory =
        selectedFoodCategory === "all" || f.category === selectedFoodCategory;
      const matchRarity =
        selectedFoodRarity === "all" || f.rarity.toString() === selectedFoodRarity;
      return matchSearch && matchCategory && matchRarity;
    });
  }, [search, selectedFoodCategory, selectedFoodRarity]);

  // Filtered World Items (Batu Tambang, Flora, Kayu, Ikan, Eksplorasi)
  const filteredWorldItems = useMemo(() => {
    return (worldItemsData as WorldItemInfo[]).filter((w) => {
      const matchSearch =
        w.name.toLowerCase().includes(search.toLowerCase()) ||
        w.nameEn.toLowerCase().includes(search.toLowerCase()) ||
        w.description.toLowerCase().includes(search.toLowerCase()) ||
        w.sources.some((s) => s.toLowerCase().includes(search.toLowerCase()));
      const matchSubCategory =
        selectedWorldSubCategory === "all" || w.subCategory === selectedWorldSubCategory;
      const matchRegion =
        selectedWorldRegion === "all" || w.region === selectedWorldRegion;
      return matchSearch && matchSubCategory && matchRegion;
    });
  }, [search, selectedWorldSubCategory, selectedWorldRegion]);

  // Filtered Materials (Material Penguatan)
  const filteredMaterials = useMemo(() => {
    return (materialsData as MaterialInfo[]).filter((m) => {
      const matchSearch =
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.nameEn.toLowerCase().includes(search.toLowerCase()) ||
        m.description.toLowerCase().includes(search.toLowerCase()) ||
        m.sources.some((s) => s.toLowerCase().includes(search.toLowerCase()));
      const matchSubCategory =
        selectedMaterialSubCategory === "all" || m.subCategory === selectedMaterialSubCategory;
      const matchRarity =
        selectedMaterialRarity === "all" || m.rarity.toString() === selectedMaterialRarity;
      return matchSearch && matchSubCategory && matchRarity;
    });
  }, [search, selectedMaterialSubCategory, selectedMaterialRarity]);

  // Filtered Quest Items
  const filteredQuestItems = useMemo(() => {
    return (questItemsData as QuestItemInfo[]).filter((q) => {
      return (
        q.name.toLowerCase().includes(search.toLowerCase()) ||
        q.questName.toLowerCase().includes(search.toLowerCase()) ||
        q.origin.toLowerCase().includes(search.toLowerCase()) ||
        q.description.toLowerCase().includes(search.toLowerCase())
      );
    });
  }, [search]);

  // Handle Tab Change
  const handleTabChange = (key: TabKey) => {
    setActiveTab(key);
    setSearch("");
    setVisibleCount(36);
  };

  // Dynamic Image Fallback Handler for CDN resilience
  const handleItemImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>,
    fallbackIcon = "UI_ItemIcon_108001"
  ) => {
    const target = e.currentTarget;
    const step = target.getAttribute("data-fallback-step");
    if (step === "2") {
      return;
    }
    if (!step) {
      target.setAttribute("data-fallback-step", "1");
      if (target.src.includes("gi.yatta.moe")) {
        target.src = target.src.replace("https://gi.yatta.moe/assets/UI/", "https://enka.network/ui/");
        return;
      } else if (target.src.includes("enka.network")) {
        target.src = target.src.replace("https://enka.network/ui/", "https://gi.yatta.moe/assets/UI/");
        return;
      }
    }
    target.setAttribute("data-fallback-step", "2");
    target.src = `https://gi.yatta.moe/assets/UI/${fallbackIcon}.png`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* ── Page Header ── */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-400/10 border border-gold-400/30 text-gold-300 text-xs font-semibold mb-3">
          <Sparkles size={14} />
          <span>Arsip Ensiklopedia Lengkap Teyvat</span>
        </div>
        <h1
          className="text-3xl sm:text-5xl font-extrabold text-parchment tracking-wide mb-3"
          style={{ fontFamily: "Cinzel, Georgia, serif" }}
        >
          Database &amp; Inventaris Teyvat
        </h1>
        <p className="text-parchment-dim text-sm sm:text-base max-w-3xl mx-auto leading-relaxed">
          Kompilasi ensiklopedia terlengkap seputar karakter playable, persenjataan legendaris,
          kuliner &amp; resep masakan, batu tambang &amp; bahan alam dunia, serta material penguatan di seluruh penjuru Teyvat.
        </p>
      </div>

      {/* ── Tab Navigation (Dipisahkan secara Rapi & Lengkap) ── */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-8 border-b border-gold-300/15 pb-4">
        {[
          { key: "characters", label: "Karakter", icon: <Shield size={15} />, count: charactersData.length },
          { key: "weapons", label: "Senjata", icon: <Swords size={15} />, count: weaponsData.length },
          { key: "foods", label: "Makanan & Kuliner", icon: <Utensils size={15} />, count: foodsData.length },
          { key: "world-items", label: "Batu & Bahan Alam Dunia", icon: <Gem size={15} />, count: worldItemsData.length },
          { key: "materials", label: "Material Penguatan", icon: <Sparkles size={15} />, count: materialsData.length },
          { key: "quest-items", label: "Item Quest & Relik", icon: <Scroll size={15} />, count: questItemsData.length },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => handleTabChange(tab.key as TabKey)}
            className={`flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all shadow-sm ${
              activeTab === tab.key
                ? "bg-gradient-to-r from-gold-500 to-gold-400 text-celestia-950 font-bold shadow-gold-500/20 scale-105"
                : "bg-celestia-800/80 hover:bg-celestia-700/80 text-parchment-dim hover:text-gold-200 border border-gold-300/10"
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                activeTab === tab.key ? "bg-celestia-950/25 text-celestia-950 font-black" : "bg-celestia-950 text-gold-300/80"
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* ── Search & Filter Controls ── */}
      <div className="bg-celestia-900/80 border border-gold-300/15 rounded-2xl p-4 sm:p-5 mb-8 shadow-xl backdrop-blur-sm">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search Bar */}
          <div className="relative w-full md:w-80">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-parchment-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setVisibleCount(36);
              }}
              placeholder={`Cari nama, efek, atau deskripsi...`}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-celestia-950 border border-gold-300/20 text-parchment text-xs sm:text-sm placeholder:text-parchment-muted focus:outline-none focus:border-gold-400/60 transition-colors"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-parchment-muted hover:text-parchment"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Tab Specific Filter Controls */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* 1. FILTER KARAKTER */}
            {activeTab === "characters" && (
              <>
                <div className="flex items-center gap-1.5 bg-celestia-950 px-2.5 py-1 rounded-xl border border-gold-300/10 text-xs">
                  <span className="text-parchment-muted">Bintang:</span>
                  {["all", "5", "4"].map((r) => (
                    <button
                      key={r}
                      onClick={() => setSelectedRarity(r)}
                      className={`px-2 py-0.5 rounded-lg font-bold transition-colors ${
                        selectedRarity === r
                          ? r === "5"
                            ? "bg-gold-400 text-celestia-950"
                            : r === "4"
                            ? "bg-purple-500 text-white"
                            : "bg-celestia-700 text-parchment"
                          : "text-parchment-dim hover:text-gold-200"
                      }`}
                    >
                      {r === "all" ? "Semua" : `${r}★`}
                    </button>
                  ))}
                </div>

                <select
                  value={selectedElement}
                  onChange={(e) => setSelectedElement(e.target.value)}
                  className="bg-celestia-950 border border-gold-300/15 rounded-xl px-3 py-1.5 text-xs text-parchment focus:outline-none focus:border-gold-400/50"
                >
                  <option value="all">Semua Elemen</option>
                  <option value="pyro">🔥 Pyro</option>
                  <option value="hydro">💧 Hydro</option>
                  <option value="anemo">🌪️ Anemo</option>
                  <option value="electro">⚡ Electro</option>
                  <option value="dendro">🌿 Dendro</option>
                  <option value="cryo">❄️ Cryo</option>
                  <option value="geo">🔶 Geo</option>
                  <option value="none">⚪ Unaligned</option>
                </select>

                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="bg-celestia-950 border border-gold-300/15 rounded-xl px-3 py-1.5 text-xs text-parchment focus:outline-none focus:border-gold-400/50"
                >
                  <option value="all">Semua Wilayah</option>
                  <option value="Mondstadt">Mondstadt</option>
                  <option value="Liyue">Liyue</option>
                  <option value="Inazuma">Inazuma</option>
                  <option value="Sumeru">Sumeru</option>
                  <option value="Fontaine">Fontaine</option>
                  <option value="Natlan">Natlan</option>
                  <option value="Snezhnaya">Snezhnaya</option>
                  <option value="Khaenri'ah">Khaenri&apos;ah</option>
                  <option value="Nod-Krai">Nod-Krai</option>
                  <option value="Teyvat">Teyvat / Pengelana</option>
                </select>
              </>
            )}

            {/* 2. FILTER SENJATA */}
            {activeTab === "weapons" && (
              <>
                <div className="flex items-center gap-1.5 bg-celestia-950 px-2.5 py-1 rounded-xl border border-gold-300/10 text-xs">
                  <span className="text-parchment-muted">Bintang:</span>
                  {["all", "5", "4", "3", "1"].map((r) => (
                    <button
                      key={r}
                      onClick={() => setSelectedRarity(r)}
                      className={`px-2 py-0.5 rounded-lg font-bold transition-colors ${
                        selectedRarity === r
                          ? r === "5"
                            ? "bg-gold-400 text-celestia-950"
                            : r === "4"
                            ? "bg-purple-500 text-white"
                            : "bg-blue-500 text-white"
                          : "text-parchment-dim hover:text-gold-200"
                      }`}
                    >
                      {r === "all" ? "Semua" : `${r}★`}
                    </button>
                  ))}
                </div>

                <select
                  value={selectedWeaponType}
                  onChange={(e) => setSelectedWeaponType(e.target.value)}
                  className="bg-celestia-950 border border-gold-300/15 rounded-xl px-3 py-1.5 text-xs text-parchment focus:outline-none focus:border-gold-400/50"
                >
                  <option value="all">Semua Jenis Senjata</option>
                  <option value="Sword">Sword (Pedang)</option>
                  <option value="Claymore">Claymore (Pedang Besar)</option>
                  <option value="Polearm">Polearm (Tombak)</option>
                  <option value="Bow">Bow (Busur)</option>
                  <option value="Catalyst">Catalyst (Katalis)</option>
                </select>
              </>
            )}

            {/* 3. FILTER MAKANAN (TAB BARU) */}
            {activeTab === "foods" && (
              <>
                <select
                  value={selectedFoodCategory}
                  onChange={(e) => {
                    setSelectedFoodCategory(e.target.value);
                    setVisibleCount(36);
                  }}
                  className="bg-celestia-950 border border-gold-300/15 rounded-xl px-3 py-1.5 text-xs text-parchment focus:outline-none focus:border-gold-400/50"
                >
                  <option value="all">Semua Kategori Makanan</option>
                  <option value="attack">⚔️ Makanan Penyerangan (ATK)</option>
                  <option value="defense">🛡️ Makanan Pertahanan (DEF)</option>
                  <option value="recovery">💖 Makanan Pemulihan (HP &amp; Revive)</option>
                  <option value="adventure">⚡ Makanan Petualangan &amp; Stamina</option>
                </select>

                <div className="flex items-center gap-1.5 bg-celestia-950 px-2.5 py-1 rounded-xl border border-gold-300/10 text-xs">
                  <span className="text-parchment-muted">Bintang:</span>
                  {["all", "5", "4", "3", "2", "1"].map((r) => (
                    <button
                      key={r}
                      onClick={() => {
                        setSelectedFoodRarity(r);
                        setVisibleCount(36);
                      }}
                      className={`px-1.5 py-0.5 rounded-lg font-bold transition-colors ${
                        selectedFoodRarity === r
                          ? "bg-gold-400 text-celestia-950"
                          : "text-parchment-dim hover:text-gold-200"
                      }`}
                    >
                      {r === "all" ? "Semua" : `${r}★`}
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* 4. FILTER BATU & BAHAN ALAM DUNIA */}
            {activeTab === "world-items" && (
              <>
                <select
                  value={selectedWorldSubCategory}
                  onChange={(e) => {
                    setSelectedWorldSubCategory(e.target.value);
                    setVisibleCount(36);
                  }}
                  className="bg-celestia-950 border border-gold-300/15 rounded-xl px-3 py-1.5 text-xs text-parchment focus:outline-none focus:border-gold-400/50"
                >
                  <option value="all">Semua Kategori Alam</option>
                  <option value="Batu & Tambang">💎 Batu Tambang &amp; Mineral</option>
                  <option value="Spesialis Daerah">🌸 Produk Khas Wilayah</option>
                  <option value="Bahan Alam & Flora">🌿 Bahan Alam &amp; Flora</option>
                  <option value="Kayu Alam">🪵 Kayu-kayuan Teyvat</option>
                  <option value="Ikan & Pancing">🐟 Ikan &amp; Umpan Pancing</option>
                  <option value="Eksplorasi & Relik Dunia">🧭 Eksplorasi &amp; Oculi</option>
                </select>

                <select
                  value={selectedWorldRegion}
                  onChange={(e) => {
                    setSelectedWorldRegion(e.target.value);
                    setVisibleCount(36);
                  }}
                  className="bg-celestia-950 border border-gold-300/15 rounded-xl px-3 py-1.5 text-xs text-parchment focus:outline-none focus:border-gold-400/50"
                >
                  <option value="all">Semua Wilayah</option>
                  <option value="Mondstadt">Mondstadt</option>
                  <option value="Liyue">Liyue</option>
                  <option value="Inazuma">Inazuma</option>
                  <option value="Sumeru">Sumeru</option>
                  <option value="Fontaine">Fontaine</option>
                  <option value="Natlan">Natlan</option>
                  <option value="Snezhnaya">Snezhnaya</option>
                  <option value="Dragonspine">Dragonspine</option>
                  <option value="Teyvat">Teyvat / Umum</option>
                </select>
              </>
            )}

            {/* 5. FILTER MATERIAL PENGUATAN */}
            {activeTab === "materials" && (
              <>
                <select
                  value={selectedMaterialSubCategory}
                  onChange={(e) => {
                    setSelectedMaterialSubCategory(e.target.value);
                    setVisibleCount(36);
                  }}
                  className="bg-celestia-950 border border-gold-300/15 rounded-xl px-3 py-1.5 text-xs text-parchment focus:outline-none focus:border-gold-400/50"
                >
                  <option value="all">Semua Material Penguatan</option>
                  <option value="Batu Elemen & Boss Normal">🔶 Batu Elemen &amp; Boss Normal</option>
                  <option value="Buku Bakat & Boss Mingguan">📖 Buku Bakat &amp; Boss Mingguan</option>
                  <option value="Material Ascension Senjata">🗡️ Ascension Senjata</option>
                  <option value="Drop Monster & Musuh">👾 Drop Monster &amp; Musuh</option>
                  <option value="Penguatan EXP & Senjata">⚡ EXP &amp; Batu Tempa</option>
                </select>

                <div className="flex items-center gap-1.5 bg-celestia-950 px-2.5 py-1 rounded-xl border border-gold-300/10 text-xs">
                  <span className="text-parchment-muted">Bintang:</span>
                  {["all", "5", "4", "3", "2", "1"].map((r) => (
                    <button
                      key={r}
                      onClick={() => {
                        setSelectedMaterialRarity(r);
                        setVisibleCount(36);
                      }}
                      className={`px-1.5 py-0.5 rounded-lg font-bold transition-colors ${
                        selectedMaterialRarity === r
                          ? "bg-gold-400 text-celestia-950"
                          : "text-parchment-dim hover:text-gold-200"
                      }`}
                    >
                      {r === "all" ? "Semua" : `${r}★`}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Content Grid ── */}

      {/* 1. TAB: CHARACTERS */}
      {activeTab === "characters" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredCharacters.slice(0, visibleCount).map((c) => (
            <article
              key={c.id}
              onClick={() => setModalItem({ type: "characters", data: c })}
              className="primogem-corner group cursor-pointer relative flex flex-col bg-scroll-800 border border-gold-300/15 rounded-xl overflow-hidden hover:border-gold-300/40 transition-all duration-300 hover:glow-gold"
            >
              {/* Character Card Image */}
              <div className="relative w-full aspect-[16/11] overflow-hidden bg-celestia-950/90 border-b border-gold-300/15">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/images/characters/${c.id}.png`}
                  alt={c.name}
                  className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (c.iconUrl && target.src !== c.iconUrl) {
                      target.src = c.iconUrl;
                    }
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-scroll-800 via-transparent to-black/40 pointer-events-none" />

                {/* ⭐ Star Rarity Badge in the TOP-LEFT of character photo */}
                <div className="absolute top-2.5 left-2.5 z-10">
                  <span
                    className={`inline-flex items-center gap-1.5 text-xs font-black px-2.5 py-1 rounded-lg border shadow-xl backdrop-blur-md transition-transform group-hover:scale-105 ${
                      c.rarity === 5
                        ? "bg-amber-950/90 text-gold-300 border-gold-400/80 shadow-[0_0_12px_rgba(229,186,105,0.4)]"
                        : "bg-purple-950/90 text-purple-200 border-purple-400/80 shadow-[0_0_12px_rgba(198,123,242,0.4)]"
                    }`}
                  >
                    <span className="text-[10px] tracking-tight text-gold-300">
                      {c.rarity === 5 ? "★★★★★" : "★★★★"}
                    </span>
                    <span>{c.rarity}★</span>
                  </span>
                </div>

                {/* Element Badge in TOP-RIGHT */}
                <div className="absolute top-2.5 right-2.5 z-10 drop-shadow-md">
                  <ElementBadge element={c.element} />
                </div>
              </div>

              <div className="p-5 flex flex-col gap-2.5 flex-1">
                <h3
                  className="text-parchment font-bold text-lg group-hover:text-gold-200 transition-colors"
                  style={{ fontFamily: "Cinzel, Georgia, serif" }}
                >
                  {c.name}
                </h3>
                <p className="text-xs text-gold-300/80 italic mb-1">{c.title}</p>

                <div className="text-xs text-parchment-muted space-y-1 mb-2">
                  <p>📍 <span className="text-parchment-dim">{c.region}</span></p>
                  <p>⚔️ <span className="text-parchment-dim">{c.weapon}</span></p>
                  <p>🏛️ <span className="text-parchment-dim line-clamp-1">{c.affiliation}</span></p>
                </div>

                <p className="text-xs text-parchment-dim line-clamp-3 leading-relaxed mb-3 flex-1">
                  {c.summary}
                </p>

                <div className="pt-3 border-t border-gold-300/10 flex items-center justify-between text-xs text-gold-300 font-semibold">
                  <span>Rincian Profil &amp; Lore</span>
                  <span className="text-parchment-muted group-hover:text-gold-300 transition-colors">→</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* 2. TAB: WEAPONS */}
      {activeTab === "weapons" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredWeapons.slice(0, visibleCount).map((w) => (
            <article
              key={w.id}
              onClick={() => setModalItem({ type: "weapons", data: w })}
              className="primogem-corner group cursor-pointer relative flex flex-col bg-scroll-800 border border-gold-300/15 rounded-xl p-5 hover:border-gold-300/40 transition-all duration-300 hover:glow-gold"
            >
              <div
                className={`absolute top-0 left-0 right-0 h-1 rounded-t-xl ${
                  w.rarity === 5
                    ? "bg-gradient-to-r from-amber-500 via-amber-300 to-amber-500"
                    : w.rarity === 4
                    ? "bg-gradient-to-r from-purple-500 via-purple-300 to-purple-500"
                    : "bg-blue-400"
                }`}
              />

              <div className="flex items-start gap-3.5 mb-3 mt-1">
                {w.iconUrl ? (
                  <div className="w-14 h-14 rounded-xl bg-celestia-950/80 border border-gold-300/20 p-1 flex-shrink-0 overflow-hidden shadow-inner flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={w.iconUrl}
                      alt={w.name}
                      className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                      loading="lazy"
                      onError={(e) => handleItemImageError(e, "UI_EquipIcon_Sword_Blunt")}
                    />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-gold-400/10 border border-gold-300/20 flex items-center justify-center text-gold-300 flex-shrink-0">
                    <Swords size={20} />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-extrabold px-1.5 py-0.5 rounded border shadow-sm ${
                        w.rarity === 5
                          ? "bg-amber-500/20 text-gold-300 border-gold-400/50"
                          : w.rarity === 4
                          ? "bg-purple-500/20 text-purple-300 border-purple-400/50"
                          : "bg-blue-500/20 text-blue-300 border-blue-400/50"
                      }`}
                    >
                      <span>{"★".repeat(w.rarity)}</span>
                    </span>
                    <span className="text-[10px] text-parchment-muted bg-celestia-700 px-2 py-0.5 rounded-full border border-celestia-500">
                      {w.type}
                    </span>
                  </div>
                  <h3
                    className="text-parchment font-bold text-base group-hover:text-gold-200 transition-colors line-clamp-1"
                    style={{ fontFamily: "Cinzel, Georgia, serif" }}
                  >
                    {w.name}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs font-semibold bg-celestia-950/70 p-2 rounded-lg border border-gold-300/10 mb-3">
                <span className="text-parchment">Base ATK: <strong className="text-gold-300">{w.baseAtk}</strong></span>
                <span className="text-parchment">Sub: <strong className="text-emerald-300">{w.subStat}</strong></span>
              </div>

              <div className="mb-4 flex-1">
                <p className="text-xs font-bold text-gold-300 mb-0.5">{w.passiveName}</p>
                <p className="text-xs text-parchment-dim line-clamp-3 leading-relaxed">
                  {w.passiveDesc}
                </p>
              </div>

              <div className="pt-3 border-t border-gold-300/10 flex items-center justify-between text-xs text-gold-300 font-semibold">
                <span>Baca Lore &amp; Cerita Senjata</span>
                <span className="text-parchment-muted group-hover:text-gold-300 transition-colors">→</span>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* 3. TAB: MAKANAN & KULINER (DIPISAHKAN DALAM MENU SENDIRI) */}
      {activeTab === "foods" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredFoods.slice(0, visibleCount).map((food) => (
            <article
              key={food.id}
              onClick={() => setModalItem({ type: "foods", data: food })}
              className="primogem-corner group cursor-pointer relative flex flex-col bg-scroll-800 border border-gold-300/15 rounded-xl p-4 sm:p-5 hover:border-gold-300/40 transition-all duration-300 hover:glow-gold"
            >
              {/* Top Accent line */}
              <div
                className={`absolute top-0 left-0 right-0 h-1 rounded-t-xl ${
                  food.rarity === 5
                    ? "bg-gradient-to-r from-amber-500 via-amber-300 to-amber-500"
                    : food.rarity === 4
                    ? "bg-gradient-to-r from-purple-500 via-purple-300 to-purple-500"
                    : food.rarity === 3
                    ? "bg-blue-400"
                    : "bg-emerald-500/80"
                }`}
              />

              {/* Food Header with Icon */}
              <div className="flex items-start gap-3.5 mb-3 mt-1">
                <div
                  className={`w-14 h-14 rounded-xl bg-celestia-950/90 border p-1 flex-shrink-0 overflow-hidden shadow-inner flex items-center justify-center ${
                    RARITY_BORDER_COLORS[food.rarity] || "border-gold-300/20"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={food.iconUrl}
                    alt={food.name}
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                    loading="lazy"
                    onError={(e) => handleItemImageError(e, "UI_ItemIcon_108001")}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-extrabold px-1.5 py-0.5 rounded border shadow-sm ${
                        RARITY_BG_GRADIENTS[food.rarity] || ""
                      }`}
                    >
                      {"★".repeat(food.rarity)}
                    </span>
                    <span className="text-[10px] text-gold-300/90 bg-celestia-950/80 px-2 py-0.5 rounded-full border border-gold-300/15 truncate max-w-[120px]">
                      {food.categoryLabel}
                    </span>
                  </div>

                  <h3
                    className="text-parchment font-bold text-base group-hover:text-gold-200 transition-colors line-clamp-1"
                    style={{ fontFamily: "Cinzel, Georgia, serif" }}
                  >
                    {food.name}
                  </h3>
                  <p className="text-[11px] text-parchment-muted truncate">{food.nameEn}</p>
                </div>
              </div>

              {/* Effect Box */}
              <div className="p-2.5 bg-celestia-950/70 border border-gold-300/10 rounded-lg text-xs leading-relaxed mb-3">
                <span className="text-emerald-300 font-medium line-clamp-2">
                  ✨ {food.effect || "Memberikan nutrisi khas bagi petualang."}
                </span>
              </div>

              {/* Description */}
              <p className="text-xs text-parchment-dim line-clamp-2 leading-relaxed mb-3 flex-1 italic">
                {food.description}
              </p>

              {/* Ingredients preview */}
              {food.ingredients && food.ingredients.length > 0 && (
                <div className="text-[11px] text-parchment-muted pt-2 border-t border-gold-300/10 mb-2 truncate">
                  <span className="text-gold-300 font-semibold">Bahan:</span>{" "}
                  {food.ingredients.map((i) => `${i.name} (${i.count})`).join(", ")}
                </div>
              )}

              {/* Footer action */}
              <div className="pt-2 border-t border-gold-300/10 flex items-center justify-between text-xs text-gold-300 font-semibold">
                <span>Lihat Resep &amp; Varian</span>
                <span className="text-parchment-muted group-hover:text-gold-300 transition-colors">→</span>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* 4. TAB: BATU & BAHAN ALAM DUNIA (WORLD ITEMS) */}
      {activeTab === "world-items" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredWorldItems.slice(0, visibleCount).map((item) => (
            <article
              key={item.id}
              onClick={() => setModalItem({ type: "world-items", data: item })}
              className="primogem-corner group cursor-pointer relative flex flex-col bg-scroll-800 border border-gold-300/15 rounded-xl p-4 sm:p-5 hover:border-gold-300/40 transition-all duration-300 hover:glow-gold"
            >
              <div className="flex items-start gap-3.5 mb-3">
                {item.iconUrl ? (
                  <div className="w-14 h-14 rounded-xl bg-celestia-950/80 border border-gold-300/20 p-1 flex-shrink-0 overflow-hidden shadow-inner flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.iconUrl}
                      alt={item.name}
                      className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                      loading="lazy"
                      onError={(e) => handleItemImageError(e, "UI_ItemIcon_100058")}
                    />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-gold-400/10 border border-gold-300/20 flex items-center justify-center text-gold-300 flex-shrink-0">
                    <Gem size={20} />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[10px] font-bold text-gold-300 bg-gold-400/10 border border-gold-300/20 px-2 py-0.5 rounded-full truncate">
                      {item.subCategory}
                    </span>
                    <span className="text-[10px] text-parchment-muted bg-celestia-950 px-2 py-0.5 rounded-full border border-celestia-700">
                      {item.region}
                    </span>
                  </div>

                  <h3
                    className="text-parchment font-bold text-base group-hover:text-gold-200 transition-colors line-clamp-1"
                    style={{ fontFamily: "Cinzel, Georgia, serif" }}
                  >
                    {item.name}
                  </h3>
                  <p className="text-[11px] text-parchment-muted truncate">{item.nameEn}</p>
                </div>
              </div>

              {/* Sources */}
              {item.sources && item.sources.length > 0 && (
                <div className="p-2 bg-celestia-950/70 border border-gold-300/10 rounded-lg text-xs text-parchment-muted mb-3 line-clamp-2">
                  <strong className="text-gold-300 font-medium">📍 Lokasi:</strong>{" "}
                  {item.sources[0]}
                </div>
              )}

              <p className="text-xs text-parchment-dim line-clamp-3 leading-relaxed mb-3 flex-1">
                {item.description}
              </p>

              <div className="pt-2 border-t border-gold-300/10 flex items-center justify-between text-xs text-gold-300 font-semibold">
                <span>Rincian Sumber &amp; Lore</span>
                <span className="text-parchment-muted group-hover:text-gold-300 transition-colors">→</span>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* 5. TAB: MATERIAL PENGUATAN (ENHANCEMENT MATERIALS) */}
      {activeTab === "materials" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredMaterials.slice(0, visibleCount).map((m) => (
            <article
              key={m.id}
              onClick={() => setModalItem({ type: "materials", data: m })}
              className="primogem-corner group cursor-pointer relative flex flex-col bg-scroll-800 border border-gold-300/15 rounded-xl p-4 sm:p-5 hover:border-gold-300/40 transition-all duration-300 hover:glow-gold"
            >
              <div className="flex items-start gap-3.5 mb-3">
                {m.iconUrl ? (
                  <div
                    className={`w-14 h-14 rounded-xl bg-celestia-950/90 border p-1 flex-shrink-0 overflow-hidden shadow-inner flex items-center justify-center ${
                      RARITY_BORDER_COLORS[m.rarity] || "border-gold-300/20"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={m.iconUrl}
                      alt={m.name}
                      className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                      loading="lazy"
                      onError={(e) => handleItemImageError(e, "UI_ItemIcon_104104")}
                    />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-gold-400/10 border border-gold-300/20 flex items-center justify-center text-gold-300 flex-shrink-0">
                    <Sparkles size={20} />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-extrabold px-1.5 py-0.5 rounded border ${
                        RARITY_BG_GRADIENTS[m.rarity] || ""
                      }`}
                    >
                      {"★".repeat(m.rarity)}
                    </span>
                    <span className="text-[10px] text-parchment-muted bg-celestia-950 px-2 py-0.5 rounded-full border border-celestia-700 truncate max-w-[120px]">
                      {m.subCategory}
                    </span>
                  </div>

                  <h3
                    className="text-parchment font-bold text-base group-hover:text-gold-200 transition-colors line-clamp-1"
                    style={{ fontFamily: "Cinzel, Georgia, serif" }}
                  >
                    {m.name}
                  </h3>
                  <p className="text-[11px] text-parchment-muted truncate">{m.nameEn}</p>
                </div>
              </div>

              {m.sources && m.sources.length > 0 && (
                <div className="p-2 bg-celestia-950/70 border border-gold-300/10 rounded-lg text-xs text-parchment-muted mb-3 line-clamp-2">
                  <strong className="text-gold-300 font-medium">Drop/Sumber:</strong>{" "}
                  {m.sources[0]}
                </div>
              )}

              <p className="text-xs text-parchment-dim line-clamp-3 leading-relaxed mb-3 flex-1">
                {m.description}
              </p>

              <div className="pt-2 border-t border-gold-300/10 flex items-center justify-between text-xs text-gold-300 font-semibold">
                <span>Rincian Penggunaan</span>
                <span className="text-parchment-muted group-hover:text-gold-300 transition-colors">→</span>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* 6. TAB: QUEST ITEMS & RELIK */}
      {activeTab === "quest-items" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {filteredQuestItems.map((q) => (
            <article
              key={q.id}
              onClick={() => setModalItem({ type: "quest-items", data: q })}
              className="primogem-corner group cursor-pointer relative flex flex-col bg-scroll-800 border border-gold-300/15 rounded-xl p-6 hover:border-gold-300/40 transition-all duration-300 hover:glow-gold"
            >
              <div className="flex items-start gap-4 mb-3">
                {q.iconUrl && (
                  <div className="w-16 h-16 rounded-2xl bg-celestia-950 border border-gold-300/30 p-1.5 flex-shrink-0 overflow-hidden shadow-xl flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={q.iconUrl}
                      alt={q.name}
                      className="w-full h-full object-contain"
                      loading="lazy"
                      onError={(e) => handleItemImageError(e, "UI_ItemIcon_100411")}
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-xs text-parchment-muted bg-celestia-700 px-2.5 py-0.5 rounded-full border border-celestia-500">
                      {q.chapter}
                    </span>
                    <span className="text-xs text-gold-300 font-semibold">{q.origin}</span>
                  </div>

                  <h3
                    className="text-gold-200 font-bold text-xl group-hover:text-gold-100 transition-colors"
                    style={{ fontFamily: "Cinzel, Georgia, serif" }}
                  >
                    {q.name}
                  </h3>
                  <p className="text-xs text-parchment-muted italic">
                    Terkait Quest: <span className="text-parchment font-semibold">{q.questName}</span>
                  </p>
                </div>
              </div>

              <p className="text-sm text-parchment-dim leading-relaxed mb-4">
                {q.description}
              </p>

              <div className="p-3 bg-celestia-950/80 border border-gold-300/15 rounded-xl text-xs text-gold-300/90 leading-relaxed flex-1">
                <strong className="text-gold-200">Signifikansi Sejarah:</strong> {q.historicalSignificance}
              </div>
            </article>
          ))}
        </div>
      )}

      {/* ── Tombol Load More (Tampilkan Lebih Banyak) ── */}
      {((activeTab === "characters" && filteredCharacters.length > visibleCount) ||
        (activeTab === "weapons" && filteredWeapons.length > visibleCount) ||
        (activeTab === "foods" && filteredFoods.length > visibleCount) ||
        (activeTab === "world-items" && filteredWorldItems.length > visibleCount) ||
        (activeTab === "materials" && filteredMaterials.length > visibleCount)) && (
        <div className="flex justify-center mt-10">
          <button
            onClick={() => setVisibleCount((prev) => prev + 36)}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-celestia-850 hover:bg-celestia-750 text-gold-300 hover:text-gold-200 border border-gold-300/25 hover:border-gold-300/50 font-bold text-xs sm:text-sm transition-all shadow-lg"
          >
            <ChevronDown size={16} />
            <span>
              Tampilkan Lebih Banyak ({visibleCount} dari{" "}
              {activeTab === "characters"
                ? filteredCharacters.length
                : activeTab === "weapons"
                ? filteredWeapons.length
                : activeTab === "foods"
                ? filteredFoods.length
                : activeTab === "world-items"
                ? filteredWorldItems.length
                : filteredMaterials.length}{" "}
              item)
            </span>
          </button>
        </div>
      )}

      {/* Empty State */}
      {((activeTab === "characters" && filteredCharacters.length === 0) ||
        (activeTab === "weapons" && filteredWeapons.length === 0) ||
        (activeTab === "foods" && filteredFoods.length === 0) ||
        (activeTab === "world-items" && filteredWorldItems.length === 0) ||
        (activeTab === "materials" && filteredMaterials.length === 0) ||
        (activeTab === "quest-items" && filteredQuestItems.length === 0)) && (
        <div className="text-center py-20 bg-celestia-900/40 border border-gold-300/10 rounded-2xl">
          <Search size={32} className="mx-auto text-parchment-muted mb-3 opacity-60" />
          <p className="text-parchment font-semibold text-lg mb-1">Tidak Ada Data Ditemukan</p>
          <p className="text-xs text-parchment-muted">Coba ubah kata kunci pencarian atau sesuaikan filter di atas.</p>
        </div>
      )}

      {/* ── Detail Modal Dialog ── */}
      {modalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-celestia-900 border border-gold-300/30 rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => setModalItem(null)}
              className="absolute top-5 right-5 text-parchment-muted hover:text-parchment p-1 rounded-lg hover:bg-celestia-800 transition-colors"
            >
              <X size={20} />
            </button>

            {/* Character Detail Modal */}
            {modalItem.type === "characters" && (() => {
              const c = modalItem.data as CharacterInfo;
              return (
                <div>
                  <div className="flex flex-col sm:flex-row gap-5 mb-5 items-start">
                    <div className="relative w-full sm:w-44 aspect-[3/4] rounded-xl overflow-hidden bg-celestia-950 border border-gold-300/30 shadow-xl flex-shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`/images/characters/${c.id}.png`}
                        alt={c.name}
                        className="w-full h-full object-cover object-top"
                        onError={(e) => {
                          const target = e.currentTarget;
                          if (c.iconUrl && target.src !== c.iconUrl) {
                            target.src = c.iconUrl;
                          }
                        }}
                      />
                      <div className="absolute top-2 left-2 z-10">
                        <span
                          className={`inline-flex items-center gap-1 text-[11px] font-black px-2 py-0.5 rounded border shadow-lg backdrop-blur-md ${
                            c.rarity === 5
                              ? "bg-amber-950/90 text-gold-300 border-gold-400/80 shadow-[0_0_10px_rgba(229,186,105,0.4)]"
                              : "bg-purple-950/90 text-purple-200 border-purple-400/80 shadow-[0_0_10px_rgba(198,123,242,0.4)]"
                          }`}
                        >
                          {"★".repeat(c.rarity)} {c.rarity}★
                        </span>
                      </div>
                    </div>

                    <div className="flex-1 w-full">
                      <div className="flex items-center gap-2 mb-2">
                        <ElementBadge element={c.element} />
                        <span className="text-xs text-parchment-muted bg-celestia-800 px-2.5 py-0.5 rounded-full border border-celestia-600">
                          {c.region}
                        </span>
                      </div>

                      <h2
                        className="text-2xl sm:text-3xl font-black text-gold-200 mb-1"
                        style={{ fontFamily: "Cinzel, Georgia, serif" }}
                      >
                        {c.name}
                      </h2>
                      <p className="text-xs text-gold-300 italic mb-4">{c.title}</p>

                      <div className="grid grid-cols-2 gap-2.5 bg-celestia-950 p-3.5 rounded-xl border border-gold-300/15 text-xs text-parchment-dim">
                        <div>
                          <span className="text-parchment-muted block">Senjata</span>
                          <strong className="text-parchment">{c.weapon}</strong>
                        </div>
                        <div>
                          <span className="text-parchment-muted block">Konstelasi</span>
                          <strong className="text-parchment">{c.constellation}</strong>
                        </div>
                        <div>
                          <span className="text-parchment-muted block">Ulang Tahun</span>
                          <strong className="text-parchment">{c.birthday}</strong>
                        </div>
                        <div>
                          <span className="text-parchment-muted block">Afiliasi</span>
                          <strong className="text-parchment line-clamp-1">{c.affiliation}</strong>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 text-sm text-parchment leading-relaxed mb-6">
                    <div>
                      <h4 className="text-xs uppercase font-bold text-gold-300 tracking-wider mb-1">Ringkasan</h4>
                      <p className="text-parchment-dim">{c.summary}</p>
                    </div>
                    <div>
                      <h4 className="text-xs uppercase font-bold text-gold-300 tracking-wider mb-1">Catatan Lore &amp; Sejarah</h4>
                      <p className="text-parchment-dim">{c.loreDescription}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-gold-300/15">
                    <Link
                      href={`/lore/character-backstory-${c.id}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-400 hover:to-gold-300 text-celestia-950 font-bold text-xs transition-all shadow-md"
                    >
                      <BookOpen size={14} />
                      <span>Buka Halaman Arsip Lore</span>
                    </Link>
                    <button
                      onClick={() => setModalItem(null)}
                      className="px-4 py-2 rounded-xl bg-celestia-800 text-parchment text-xs font-semibold hover:bg-celestia-700 transition-colors"
                    >
                      Tutup
                    </button>
                  </div>
                </div>
              );
            })()}

            {/* Weapon Detail Modal */}
            {modalItem.type === "weapons" && (() => {
              const w = modalItem.data as WeaponInfo;
              return (
                <div>
                  <div className="flex items-start gap-4 mb-4">
                    {w.iconUrl && (
                      <div className="w-20 h-20 rounded-2xl bg-celestia-950 border border-gold-300/30 p-1.5 flex-shrink-0 overflow-hidden shadow-xl flex items-center justify-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={w.iconUrl}
                          alt={w.name}
                          className="w-full h-full object-contain"
                          onError={(e) => handleItemImageError(e, "UI_EquipIcon_Sword_Blunt")}
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded border ${
                            w.rarity === 5
                              ? "bg-amber-500/20 text-gold-300 border-gold-400/50"
                              : w.rarity === 4
                              ? "bg-purple-500/20 text-purple-300 border-purple-400/50"
                              : "bg-blue-500/20 text-blue-300 border-blue-400/50"
                          }`}
                        >
                          {"★".repeat(w.rarity)} {w.rarity}★
                        </span>
                        <span className="text-xs text-parchment-muted bg-celestia-800 px-2.5 py-0.5 rounded-full border border-celestia-600">
                          {w.type}
                        </span>
                      </div>

                      <h2
                        className="text-2xl sm:text-3xl font-black text-gold-200"
                        style={{ fontFamily: "Cinzel, Georgia, serif" }}
                      >
                        {w.name}
                      </h2>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 bg-celestia-950 p-4 rounded-xl border border-gold-300/15 text-sm mb-4">
                    <div>
                      <span className="text-xs text-parchment-muted block">Base ATK (Lv. 90)</span>
                      <strong className="text-gold-300 text-lg font-bold">{w.baseAtk}</strong>
                    </div>
                    <div>
                      <span className="text-xs text-parchment-muted block">Secondary Stat</span>
                      <strong className="text-emerald-300 text-lg font-bold">{w.subStat}</strong>
                    </div>
                  </div>

                  <div className="p-4 bg-celestia-950/60 rounded-xl border border-gold-300/15 mb-4">
                    <h4 className="text-xs uppercase font-bold text-gold-300 tracking-wider mb-1">
                      Kemampuan Pasif: {w.passiveName}
                    </h4>
                    <p className="text-xs sm:text-sm text-parchment leading-relaxed">{w.passiveDesc}</p>
                  </div>

                  {w.description && (
                    <div className="mb-4">
                      <h4 className="text-xs uppercase font-bold text-gold-300 tracking-wider mb-1">Deskripsi Singkat</h4>
                      <p className="text-xs text-parchment-dim leading-relaxed italic">{w.description}</p>
                    </div>
                  )}

                  {w.loreStory && (
                    <div className="mb-6 p-4 rounded-xl bg-celestia-950/80 border border-gold-300/15">
                      <h4 className="text-xs uppercase font-bold text-gold-300 tracking-wider mb-2 flex items-center gap-1.5">
                        <Scroll size={14} className="text-gold-300" />
                        <span>Naskah Sejarah &amp; Cerita Senjata</span>
                      </h4>
                      <div className="text-xs sm:text-sm text-parchment-dim leading-relaxed whitespace-pre-line max-h-60 overflow-y-auto pr-2 font-serif border-l-2 border-gold-400/30 pl-3">
                        {w.loreStory}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end pt-4 border-t border-gold-300/15">
                    <button
                      onClick={() => setModalItem(null)}
                      className="px-5 py-2 rounded-xl bg-gradient-to-r from-gold-500 to-gold-300 text-celestia-950 font-bold text-xs hover:from-gold-400 hover:to-gold-200 transition-all shadow-md"
                    >
                      Tutup
                    </button>
                  </div>
                </div>
              );
            })()}

            {/* Food Detail Modal (Modal Khusus Kuliner) */}
            {modalItem.type === "foods" && (() => {
              const f = modalItem.data as FoodInfo;
              return (
                <div>
                  <div className="flex items-start gap-4 mb-4">
                    <div
                      className={`w-20 h-20 rounded-2xl bg-celestia-950 border p-1.5 flex-shrink-0 overflow-hidden shadow-xl flex items-center justify-center ${
                        RARITY_BORDER_COLORS[f.rarity] || "border-gold-300/30"
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={f.iconUrl}
                        alt={f.name}
                        className="w-full h-full object-contain"
                        onError={(e) => handleItemImageError(e, "UI_ItemIcon_108001")}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <span
                          className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded border ${
                            RARITY_BG_GRADIENTS[f.rarity] || ""
                          }`}
                        >
                          {"★".repeat(f.rarity)} {f.rarity}★
                        </span>
                        <span className="text-xs text-gold-300 bg-gold-400/15 border border-gold-300/30 px-2.5 py-0.5 rounded-full font-semibold">
                          {f.categoryLabel}
                        </span>
                      </div>

                      <h2
                        className="text-2xl sm:text-3xl font-black text-gold-200 mb-0.5"
                        style={{ fontFamily: "Cinzel, Georgia, serif" }}
                      >
                        {f.name}
                      </h2>
                      <p className="text-xs text-parchment-muted italic">{f.nameEn}</p>
                    </div>
                  </div>

                  {/* Efek Masakan */}
                  <div className="p-4 bg-emerald-950/40 border border-emerald-500/30 rounded-xl mb-4 text-xs sm:text-sm text-emerald-200 leading-relaxed shadow-inner">
                    <strong className="text-emerald-300 block mb-1 font-semibold">✨ Khasiat / Efek Kuliner:</strong>
                    {f.effect || "Memberikan nutrisi dan stamina bagi karakter."}
                  </div>

                  {/* Deskripsi Lore */}
                  <div className="mb-4">
                    <h4 className="text-xs uppercase font-bold text-gold-300 tracking-wider mb-1.5">
                      Kisah &amp; Filosofi Hidangan
                    </h4>
                    <p className="text-xs sm:text-sm text-parchment-dim leading-relaxed italic bg-celestia-950/60 p-3.5 rounded-xl border border-gold-300/10">
                      {f.description}
                    </p>
                  </div>

                  {/* Resep Bahan-Bahan */}
                  {f.ingredients && f.ingredients.length > 0 && (
                    <div className="mb-5">
                      <h4 className="text-xs uppercase font-bold text-gold-300 tracking-wider mb-2">
                        Bahan Resep Masakan
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {f.ingredients.map((ing, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-2 p-2 bg-celestia-950 rounded-lg border border-gold-300/10 text-xs text-parchment"
                          >
                            {ing.iconUrl && (
                              <img
                                src={ing.iconUrl}
                                alt={ing.name}
                                className="w-6 h-6 object-contain"
                                onError={(e) => handleItemImageError(e, "UI_ItemIcon_100058")}
                              />
                            )}
                            <div className="truncate">
                              <span className="block truncate font-medium">{ing.name}</span>
                              <span className="text-[10px] text-gold-300 font-bold">x{ing.count}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Variasi Enak (Delicious) jika ada */}
                  {f.delicious && (
                    <div className="mb-4 p-3 bg-celestia-950/80 rounded-xl border border-gold-300/15 text-xs text-parchment-dim">
                      <strong className="text-gold-300 block mb-1">🌟 Deskripsi Kualitas Sempurna (Delicious):</strong>
                      <p className="italic leading-relaxed">{f.delicious}</p>
                    </div>
                  )}

                  <div className="flex justify-end pt-3 border-t border-gold-300/15">
                    <button
                      onClick={() => setModalItem(null)}
                      className="px-5 py-2 rounded-xl bg-gold-400 text-celestia-950 font-bold text-xs hover:bg-gold-300 transition-colors"
                    >
                      Tutup
                    </button>
                  </div>
                </div>
              );
            })()}

            {/* World Items & Materials Detail Modal */}
            {(modalItem.type === "materials" || modalItem.type === "world-items") && (() => {
              const item = modalItem.data as WorldItemInfo | MaterialInfo;
              return (
                <div>
                  <div className="flex items-start gap-4 mb-4">
                    {item.iconUrl && (
                      <div
                        className={`w-20 h-20 rounded-2xl bg-celestia-950 border p-1.5 flex-shrink-0 overflow-hidden shadow-xl flex items-center justify-center ${
                          RARITY_BORDER_COLORS[item.rarity] || "border-gold-300/30"
                        }`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.iconUrl}
                          alt={item.name}
                          className="w-full h-full object-contain"
                          onError={(e) =>
                            handleItemImageError(
                              e,
                              modalItem.type === "materials" ? "UI_ItemIcon_104104" : "UI_ItemIcon_100058"
                            )
                          }
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        {item.rarity && (
                          <span
                            className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded border ${
                              RARITY_BG_GRADIENTS[item.rarity] || ""
                            }`}
                          >
                            {"★".repeat(item.rarity)} {item.rarity}★
                          </span>
                        )}
                        <span className="text-xs text-gold-300 bg-gold-400/15 border border-gold-300/30 px-2.5 py-0.5 rounded-full font-semibold">
                          {item.subCategory}
                        </span>
                        {"region" in item && item.region && (
                          <span className="text-xs text-parchment-muted bg-celestia-800 px-2.5 py-0.5 rounded-full border border-celestia-600">
                            {item.region}
                          </span>
                        )}
                      </div>

                      <h2
                        className="text-2xl sm:text-3xl font-black text-gold-200 mb-0.5"
                        style={{ fontFamily: "Cinzel, Georgia, serif" }}
                      >
                        {item.name}
                      </h2>
                      <p className="text-xs text-parchment-muted italic">{item.nameEn}</p>
                    </div>
                  </div>

                  {/* Lokasi / Sumber Drop */}
                  {item.sources && item.sources.length > 0 && (
                    <div className="p-3.5 bg-celestia-950 rounded-xl border border-gold-300/15 text-xs text-parchment-dim mb-4">
                      <strong className="text-gold-300 block mb-1">📍 Sumber Lokasi / Drop Musuh:</strong>
                      <ul className="list-disc list-inside space-y-0.5">
                        {item.sources.map((s, idx) => (
                          <li key={idx} className="text-parchment">{s}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Deskripsi Lore */}
                  <div className="mb-6">
                    <h4 className="text-xs uppercase font-bold text-gold-300 tracking-wider mb-1.5">
                      Catatan Arsip &amp; Lore Material
                    </h4>
                    <p className="text-xs sm:text-sm text-parchment-dim leading-relaxed italic bg-celestia-950/60 p-3.5 rounded-xl border border-gold-300/10">
                      {item.description}
                    </p>
                  </div>

                  <div className="flex justify-end pt-3 border-t border-gold-300/15">
                    <button
                      onClick={() => setModalItem(null)}
                      className="px-5 py-2 rounded-xl bg-gold-400 text-celestia-950 font-bold text-xs hover:bg-gold-300 transition-colors"
                    >
                      Tutup
                    </button>
                  </div>
                </div>
              );
            })()}

            {/* Quest Items Detail Modal */}
            {modalItem.type === "quest-items" && (() => {
              const q = modalItem.data as QuestItemInfo;
              return (
                <div>
                  <div className="flex items-start gap-4 mb-4">
                    {q.iconUrl && (
                      <div className="w-16 h-16 rounded-2xl bg-celestia-950 border border-gold-300/30 p-1.5 flex-shrink-0 overflow-hidden shadow-xl flex items-center justify-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={q.iconUrl}
                          alt={q.name}
                          className="w-full h-full object-contain"
                          onError={(e) => handleItemImageError(e, "UI_ItemIcon_100411")}
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-xs text-parchment-muted bg-celestia-700 px-2.5 py-0.5 rounded-full border border-celestia-500">
                          {q.chapter}
                        </span>
                        <span className="text-xs text-gold-300 font-semibold">{q.origin}</span>
                      </div>

                      <h2
                        className="text-2xl font-bold text-gold-200"
                        style={{ fontFamily: "Cinzel, Georgia, serif" }}
                      >
                        {q.name}
                      </h2>
                      <p className="text-xs text-parchment-muted italic">Terkait: {q.questName}</p>
                    </div>
                  </div>

                  <div className="p-4 bg-celestia-950 rounded-xl border border-gold-300/15 space-y-3 text-xs sm:text-sm text-parchment-dim mb-6">
                    <p className="leading-relaxed text-parchment">{q.description}</p>
                    {q.historicalSignificance && (
                      <div className="pt-2 border-t border-gold-300/10 leading-relaxed text-gold-300/90">
                        <strong className="text-gold-200 block mb-0.5">Signifikansi Sejarah:</strong>
                        {q.historicalSignificance}
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end pt-3 border-t border-gold-300/15">
                    <button
                      onClick={() => setModalItem(null)}
                      className="px-5 py-2 rounded-xl bg-gold-400 text-celestia-950 font-bold text-xs hover:bg-gold-300 transition-colors"
                    >
                      Tutup
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
