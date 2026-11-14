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
  ExternalLink,
  Filter,
  CheckCircle2,
  BookOpen
} from "lucide-react";
import charactersData from "@/data/database/characters.json";
import weaponsData from "@/data/database/weapons.json";
import materialsData from "@/data/database/materials.json";
import worldItemsData from "@/data/database/world-items.json";
import questItemsData from "@/data/database/quest-items.json";
import type {
  CharacterInfo,
  WeaponInfo,
  MaterialInfo,
  WorldItemInfo,
  QuestItemInfo,
  WeaponType
} from "@/types/database";
import ElementBadge from "@/components/ElementBadge";

type TabKey = "characters" | "weapons" | "materials" | "world-items" | "quest-items";

const ELEMENT_COLORS: Record<string, string> = {
  anemo: "#72E2C4",
  geo: "#E3B342",
  electro: "#C67BF2",
  dendro: "#8FD843",
  hydro: "#4CC2F8",
  pyro: "#EF7845",
  cryo: "#9CE8FF",
};

export default function DatabasePage() {
  const [activeTab, setActiveTab] = useState<TabKey>("characters");
  const [search, setSearch] = useState("");
  
  // Filters
  const [selectedRarity, setSelectedRarity] = useState<string>("all");
  const [selectedElement, setSelectedElement] = useState<string>("all");
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [selectedWeaponType, setSelectedWeaponType] = useState<string>("all");
  const [selectedMaterialCategory, setSelectedMaterialCategory] = useState<string>("all");

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

  // Filtered Materials
  const filteredMaterials = useMemo(() => {
    return (materialsData as MaterialInfo[]).filter((m) => {
      const matchSearch =
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.source.toLowerCase().includes(search.toLowerCase()) ||
        m.description.toLowerCase().includes(search.toLowerCase());
      const matchCategory =
        selectedMaterialCategory === "all" || m.category === selectedMaterialCategory;
      const matchRegion = selectedRegion === "all" || m.region.includes(selectedRegion);
      return matchSearch && matchCategory && matchRegion;
    });
  }, [search, selectedMaterialCategory, selectedRegion]);

  // Filtered World Items
  const filteredWorldItems = useMemo(() => {
    return (worldItemsData as WorldItemInfo[]).filter((item) => {
      return (
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase()) ||
        item.locationLore.toLowerCase().includes(search.toLowerCase())
      );
    });
  }, [search]);

  // Filtered Quest Items
  const filteredQuestItems = useMemo(() => {
    return (questItemsData as QuestItemInfo[]).filter((item) => {
      return (
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.questName.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase()) ||
        item.historicalSignificance.toLowerCase().includes(search.toLowerCase())
      );
    });
  }, [search]);

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* ── Page Header ── */}
      <div className="text-center mb-10">
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="gold-divider w-12" />
          <span className="text-gold-300 text-xs tracking-[0.3em] uppercase font-bold flex items-center gap-1.5">
            <Sparkles size={13} />
            The Grand Compendium
          </span>
          <div className="gold-divider w-12" />
        </div>
        <h1
          className="text-3xl sm:text-5xl font-black text-transparent bg-clip-text mb-4 glow-gold-text"
          style={{
            fontFamily: "Cinzel, Georgia, serif",
            backgroundImage: "linear-gradient(135deg, #F3D797 0%, #E5BA69 50%, #D49A3C 100%)",
          }}
        >
          Ensiklopedia & Database Teyvat
        </h1>
        <p className="text-parchment-dim text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          Kompilasi ensiklopedia terlengkap seputar karakter yang dapat dimainkan, persenjataan legendaris, material alam, serta artefak peninggalan bersejarah di seluruh benua Teyvat.
        </p>
      </div>

      {/* ── Tab Navigation ── */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-8 border-b border-gold-300/15 pb-4">
        {[
          { key: "characters", label: "Karakter", icon: <Shield size={15} />, count: charactersData.length },
          { key: "weapons", label: "Senjata", icon: <Swords size={15} />, count: weaponsData.length },
          { key: "materials", label: "Material & Makanan", icon: <Gem size={15} />, count: materialsData.length },
          { key: "world-items", label: "Item Dunia & Oculi", icon: <Compass size={15} />, count: worldItemsData.length },
          { key: "quest-items", label: "Item Quest & Relik", icon: <Scroll size={15} />, count: questItemsData.length },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => {
              setActiveTab(tab.key as TabKey);
              setSearch("");
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all shadow-sm ${
              activeTab === tab.key
                ? "bg-gradient-to-r from-gold-500 to-gold-400 text-celestia-950 font-bold shadow-gold-500/20 scale-105"
                : "bg-celestia-800/80 hover:bg-celestia-700/80 text-parchment-dim hover:text-gold-200 border border-gold-300/10"
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                activeTab === tab.key ? "bg-celestia-950/20 text-celestia-950" : "bg-celestia-950 text-gold-300/80"
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
          <div className="relative w-full md:w-96">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-parchment-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`Cari di ${activeTab}...`}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-celestia-950 border border-gold-300/20 text-parchment text-sm placeholder:text-parchment-muted focus:outline-none focus:border-gold-400/60 transition-colors"
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

          {/* Tab Specific Filter Chips */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* Filter Rarity (Karakter & Senjata) */}
            {(activeTab === "characters" || activeTab === "weapons") && (
              <div className="flex items-center gap-1.5 bg-celestia-950 px-2.5 py-1 rounded-xl border border-gold-300/10 text-xs">
                <span className="text-parchment-muted">Bintang:</span>
                {["all", "5", "4", ...(activeTab === "weapons" ? ["3", "1"] : [])].map((r) => (
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
            )}

            {/* Filter Elemen (Karakter) */}
            {activeTab === "characters" && (
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
              </select>
            )}

            {/* Filter Region (Karakter & Material) */}
            {(activeTab === "characters" || activeTab === "materials") && (
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
              </select>
            )}

            {/* Filter Weapon Class (Senjata & Karakter) */}
            {(activeTab === "characters" || activeTab === "weapons") && (
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
            )}

            {/* Filter Kategori Material */}
            {activeTab === "materials" && (
              <select
                value={selectedMaterialCategory}
                onChange={(e) => setSelectedMaterialCategory(e.target.value)}
                className="bg-celestia-950 border border-gold-300/15 rounded-xl px-3 py-1.5 text-xs text-parchment focus:outline-none focus:border-gold-400/50"
              >
                <option value="all">Semua Jenis Material</option>
                <option value="ascension">Ascension Gems</option>
                <option value="specialty">Local Specialty</option>
                <option value="food">Makanan / Resep</option>
              </select>
            )}
          </div>
        </div>
      </div>

      {/* ── Content Grid ── */}

      {/* 1. TAB: CHARACTERS */}
      {activeTab === "characters" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredCharacters.map((c) => (
            <article
              key={c.id}
              onClick={() => setModalItem({ type: "characters", data: c })}
              className="primogem-corner group cursor-pointer relative flex flex-col bg-scroll-800 border border-gold-300/15 rounded-xl p-5 hover:border-gold-300/40 transition-all duration-300 hover:glow-gold"
            >
              {/* Top Accent line */}
              <div
                className="absolute top-0 left-0 right-0 h-1 rounded-t-xl"
                style={{ background: ELEMENT_COLORS[c.element] || "#E5BA69" }}
              />

              {/* Header Badges */}
              <div className="flex items-center justify-between gap-2 mb-3 mt-1">
                <span
                  className={`inline-flex items-center gap-1 text-[11px] font-extrabold px-2 py-0.5 rounded border shadow-sm ${
                    c.rarity === 5
                      ? "bg-amber-500/20 text-gold-300 border-gold-400/50 shadow-gold-500/10"
                      : "bg-purple-500/20 text-purple-300 border-purple-400/50 shadow-purple-500/10"
                  }`}
                >
                  <span>{c.rarity === 5 ? "★★★★★" : "★★★★"}</span>
                  <span>{c.rarity}★</span>
                </span>
                <ElementBadge element={c.element} />
              </div>

              {/* Character Name & Title */}
              <h3
                className="text-parchment font-bold text-lg group-hover:text-gold-200 transition-colors"
                style={{ fontFamily: "Cinzel, Georgia, serif" }}
              >
                {c.name}
              </h3>
              <p className="text-xs text-gold-300/80 italic mb-2">{c.title}</p>

              {/* Meta details */}
              <div className="text-xs text-parchment-muted space-y-1 mb-3">
                <p>📍 <span className="text-parchment-dim">{c.region}</span></p>
                <p>⚔️ <span className="text-parchment-dim">{c.weapon}</span></p>
                <p>🏛️ <span className="text-parchment-dim line-clamp-1">{c.affiliation}</span></p>
              </div>

              {/* Summary */}
              <p className="text-xs text-parchment-dim line-clamp-3 leading-relaxed mb-4 flex-1">
                {c.summary}
              </p>

              {/* Footer action */}
              <div className="pt-3 border-t border-gold-300/10 flex items-center justify-between text-xs text-gold-300 font-semibold">
                <span>Rincian Profil</span>
                <span className="text-parchment-muted group-hover:text-gold-300 transition-colors">→</span>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* 2. TAB: WEAPONS */}
      {activeTab === "weapons" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredWeapons.map((w) => (
            <article
              key={w.id}
              onClick={() => setModalItem({ type: "weapons", data: w })}
              className="primogem-corner group cursor-pointer relative flex flex-col bg-scroll-800 border border-gold-300/15 rounded-xl p-5 hover:border-gold-300/40 transition-all duration-300 hover:glow-gold"
            >
              {/* Top Accent line */}
              <div
                className={`absolute top-0 left-0 right-0 h-1 rounded-t-xl ${
                  w.rarity === 5
                    ? "bg-gradient-to-r from-amber-500 via-amber-300 to-amber-500"
                    : w.rarity === 4
                    ? "bg-gradient-to-r from-purple-500 via-purple-300 to-purple-500"
                    : "bg-blue-400"
                }`}
              />

              {/* Rarity & Weapon Type */}
              <div className="flex items-center justify-between gap-2 mb-3 mt-1">
                <span
                  className={`inline-flex items-center gap-1 text-[11px] font-extrabold px-2 py-0.5 rounded border shadow-sm ${
                    w.rarity === 5
                      ? "bg-amber-500/20 text-gold-300 border-gold-400/50"
                      : w.rarity === 4
                      ? "bg-purple-500/20 text-purple-300 border-purple-400/50"
                      : "bg-blue-500/20 text-blue-300 border-blue-400/50"
                  }`}
                >
                  <span>{"★".repeat(w.rarity)}</span>
                  <span>{w.rarity}★</span>
                </span>
                <span className="text-xs text-parchment-muted bg-celestia-700 px-2 py-0.5 rounded-full border border-celestia-500">
                  {w.type}
                </span>
              </div>

              {/* Weapon Name */}
              <h3
                className="text-parchment font-bold text-lg group-hover:text-gold-200 transition-colors mb-2"
                style={{ fontFamily: "Cinzel, Georgia, serif" }}
              >
                {w.name}
              </h3>

              {/* Base Stats */}
              <div className="flex items-center gap-4 text-xs font-semibold bg-celestia-950/70 p-2 rounded-lg border border-gold-300/10 mb-3">
                <span className="text-parchment">Base ATK: <strong className="text-gold-300">{w.baseAtk}</strong></span>
                <span className="text-parchment">Sub: <strong className="text-emerald-300">{w.subStat}</strong></span>
              </div>

              {/* Passive */}
              <div className="mb-4 flex-1">
                <p className="text-xs font-bold text-gold-300 mb-0.5">{w.passiveName}</p>
                <p className="text-xs text-parchment-dim line-clamp-3 leading-relaxed">
                  {w.passiveDesc}
                </p>
              </div>

              {/* Footer action */}
              <div className="pt-3 border-t border-gold-300/10 flex items-center justify-between text-xs text-gold-300 font-semibold">
                <span>Lore Senjata</span>
                <span className="text-parchment-muted group-hover:text-gold-300 transition-colors">→</span>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* 3. TAB: MATERIALS */}
      {activeTab === "materials" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredMaterials.map((m) => (
            <article
              key={m.id}
              onClick={() => setModalItem({ type: "materials", data: m })}
              className="primogem-corner group cursor-pointer relative flex flex-col bg-scroll-800 border border-gold-300/15 rounded-xl p-5 hover:border-gold-300/40 transition-all duration-300 hover:glow-gold"
            >
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-xs uppercase tracking-wider font-bold text-gold-300 bg-gold-400/10 border border-gold-300/20 px-2 py-0.5 rounded-md">
                  {m.category}
                </span>
                <span className="text-xs text-parchment-muted">{m.region}</span>
              </div>

              <h3
                className="text-parchment font-bold text-lg group-hover:text-gold-200 transition-colors mb-2"
                style={{ fontFamily: "Cinzel, Georgia, serif" }}
              >
                {m.name}
              </h3>

              <p className="text-xs text-parchment-muted mb-2">
                <strong>Lokasi/Sumber:</strong> {m.source}
              </p>

              {m.effect && (
                <div className="text-xs bg-emerald-950/40 border border-emerald-500/20 text-emerald-300 p-2 rounded-lg mb-3">
                  <strong>Efek:</strong> {m.effect}
                </div>
              )}

              <p className="text-xs text-parchment-dim line-clamp-3 leading-relaxed flex-1">
                {m.description}
              </p>
            </article>
          ))}
        </div>
      )}

      {/* 4. TAB: WORLD ITEMS */}
      {activeTab === "world-items" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredWorldItems.map((item) => (
            <article
              key={item.id}
              onClick={() => setModalItem({ type: "world-items", data: item })}
              className="primogem-corner group cursor-pointer relative flex flex-col bg-scroll-800 border border-gold-300/15 rounded-xl p-5 hover:border-gold-300/40 transition-all duration-300 hover:glow-gold"
            >
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-xs uppercase tracking-wider font-bold text-anemo bg-anemo/10 border border-anemo/30 px-2.5 py-0.5 rounded-full">
                  {item.type}
                </span>
                <span className="text-xs text-parchment-muted">{item.region}</span>
              </div>

              <h3
                className="text-parchment font-bold text-lg group-hover:text-gold-200 transition-colors mb-2"
                style={{ fontFamily: "Cinzel, Georgia, serif" }}
              >
                {item.name}
              </h3>

              <p className="text-xs text-parchment-dim leading-relaxed mb-3">
                {item.description}
              </p>

              <div className="p-3 bg-celestia-950/70 border border-gold-300/10 rounded-lg text-xs text-gold-300/90 leading-relaxed flex-1">
                <strong>Lore Eksplorasi:</strong> {item.locationLore}
              </div>
            </article>
          ))}
        </div>
      )}

      {/* 5. TAB: QUEST ITEMS */}
      {activeTab === "quest-items" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {filteredQuestItems.map((q) => (
            <article
              key={q.id}
              onClick={() => setModalItem({ type: "quest-items", data: q })}
              className="primogem-corner group cursor-pointer relative flex flex-col bg-scroll-800 border border-gold-300/15 rounded-xl p-6 hover:border-gold-300/40 transition-all duration-300 hover:glow-gold"
            >
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-xs text-parchment-muted bg-celestia-700 px-2.5 py-0.5 rounded-full border border-celestia-500">
                  {q.chapter}
                </span>
                <span className="text-xs text-gold-300 font-semibold">{q.origin}</span>
              </div>

              <h3
                className="text-gold-200 font-bold text-xl group-hover:text-gold-100 transition-colors mb-2"
                style={{ fontFamily: "Cinzel, Georgia, serif" }}
              >
                {q.name}
              </h3>

              <p className="text-xs text-parchment-muted italic mb-3">
                Terkait Quest: <span className="text-parchment font-semibold">{q.questName}</span>
              </p>

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

      {/* Empty State */}
      {((activeTab === "characters" && filteredCharacters.length === 0) ||
        (activeTab === "weapons" && filteredWeapons.length === 0) ||
        (activeTab === "materials" && filteredMaterials.length === 0) ||
        (activeTab === "world-items" && filteredWorldItems.length === 0) ||
        (activeTab === "quest-items" && filteredQuestItems.length === 0)) && (
        <div className="text-center py-20 bg-celestia-900/40 border border-gold-300/10 rounded-2xl">
          <Search size={32} className="mx-auto text-parchment-muted mb-3 opacity-60" />
          <p className="text-parchment font-semibold text-lg mb-1">Tidak Ada Data Ditemukan</p>
          <p className="text-xs text-parchment-muted">Coba ubah kata kunci pencarian atau bersihkan filter di atas.</p>
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
                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded border ${
                        c.rarity === 5
                          ? "bg-amber-500/20 text-gold-300 border-gold-400/50"
                          : "bg-purple-500/20 text-purple-300 border-purple-400/50"
                      }`}
                    >
                      {"★".repeat(c.rarity)} {c.rarity}★
                    </span>
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
                  <p className="text-xs text-gold-300 italic mb-5">{c.title}</p>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-celestia-950 p-4 rounded-xl border border-gold-300/15 text-xs text-parchment-dim mb-5">
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
                    <div className="col-span-2 sm:col-span-3">
                      <span className="text-parchment-muted block">Afiliasi</span>
                      <strong className="text-parchment">{c.affiliation}</strong>
                    </div>
                  </div>

                  <div className="space-y-4 text-sm text-parchment leading-relaxed mb-6">
                    <div>
                      <h4 className="text-xs uppercase font-bold text-gold-300 tracking-wider mb-1">Ringkasan</h4>
                      <p className="text-parchment-dim">{c.summary}</p>
                    </div>
                    <div>
                      <h4 className="text-xs uppercase font-bold text-gold-300 tracking-wider mb-1">Catatan Lore & Sejarah</h4>
                      <p className="text-parchment-dim">{c.loreDescription}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-gold-300/15">
                    <Link
                      href={`/cerita/character-backstory-${c.id}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gold-400 text-celestia-950 font-bold text-xs hover:bg-gold-300 transition-all shadow-md"
                    >
                      <BookOpen size={14} />
                      <span>Baca Naskah Lore Lengkap</span>
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
                  <div className="flex items-center gap-2 mb-3">
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
                    className="text-2xl sm:text-3xl font-black text-gold-200 mb-4"
                    style={{ fontFamily: "Cinzel, Georgia, serif" }}
                  >
                    {w.name}
                  </h2>

                  <div className="flex items-center gap-6 bg-celestia-950 p-4 rounded-xl border border-gold-300/15 text-sm mb-5">
                    <div>
                      <span className="text-xs text-parchment-muted block">Base ATK (Lv. 90)</span>
                      <strong className="text-gold-300 text-lg font-bold">{w.baseAtk}</strong>
                    </div>
                    <div>
                      <span className="text-xs text-parchment-muted block">Secondary Stat</span>
                      <strong className="text-emerald-300 text-lg font-bold">{w.subStat}</strong>
                    </div>
                  </div>

                  <div className="p-4 bg-celestia-950/60 rounded-xl border border-gold-300/15 mb-5">
                    <h4 className="text-xs uppercase font-bold text-gold-300 tracking-wider mb-1">
                      Kemampuan Pasif: {w.passiveName}
                    </h4>
                    <p className="text-xs sm:text-sm text-parchment leading-relaxed">{w.passiveDesc}</p>
                  </div>

                  <div className="mb-6">
                    <h4 className="text-xs uppercase font-bold text-gold-300 tracking-wider mb-1">Kisah & Deskripsi Lore</h4>
                    <p className="text-xs sm:text-sm text-parchment-dim leading-relaxed italic">{w.description}</p>
                  </div>

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

            {/* Material & World / Quest Items Detail Modal */}
            {(modalItem.type === "materials" || modalItem.type === "world-items" || modalItem.type === "quest-items") && (
              <div>
                <h2
                  className="text-2xl font-bold text-gold-200 mb-3"
                  style={{ fontFamily: "Cinzel, Georgia, serif" }}
                >
                  {modalItem.data.name}
                </h2>
                <div className="p-4 bg-celestia-950 rounded-xl border border-gold-300/15 space-y-3 text-xs sm:text-sm text-parchment-dim mb-6">
                  {modalItem.data.region && (
                    <p><strong>Wilayah:</strong> <span className="text-parchment">{modalItem.data.region}</span></p>
                  )}
                  {modalItem.data.source && (
                    <p><strong>Sumber:</strong> <span className="text-parchment">{modalItem.data.source}</span></p>
                  )}
                  {modalItem.data.effect && (
                    <p><strong>Efek:</strong> <span className="text-emerald-300">{modalItem.data.effect}</span></p>
                  )}
                  {modalItem.data.questName && (
                    <p><strong>Terkait Quest:</strong> <span className="text-gold-300">{modalItem.data.questName}</span></p>
                  )}
                  {modalItem.data.chapter && (
                    <p><strong>Babak:</strong> <span className="text-parchment">{modalItem.data.chapter}</span></p>
                  )}
                  {modalItem.data.origin && (
                    <p><strong>Asal Usul:</strong> <span className="text-parchment">{modalItem.data.origin}</span></p>
                  )}
                  <p className="pt-2 border-t border-gold-300/10 leading-relaxed text-parchment">
                    {modalItem.data.description}
                  </p>
                  {modalItem.data.historicalSignificance && (
                    <p className="pt-2 border-t border-gold-300/10 leading-relaxed text-gold-300/90">
                      <strong>Signifikansi:</strong> {modalItem.data.historicalSignificance}
                    </p>
                  )}
                  {modalItem.data.locationLore && (
                    <p className="pt-2 border-t border-gold-300/10 leading-relaxed text-gold-300/90">
                      <strong>Lore Lokasi:</strong> {modalItem.data.locationLore}
                    </p>
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
            )}
          </div>
        </div>
      )}
    </div>
  );
}
