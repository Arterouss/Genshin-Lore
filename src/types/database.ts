export type WeaponType = "Sword" | "Claymore" | "Polearm" | "Bow" | "Catalyst";

export interface CharacterInfo {
  id: string;
  name: string;
  title: string;
  rarity: 4 | 5;
  element: "pyro" | "hydro" | "anemo" | "electro" | "dendro" | "cryo" | "geo";
  weapon: WeaponType;
  region: string;
  affiliation: string;
  constellation: string;
  birthday: string;
  summary: string;
  loreDescription: string;
}

export interface WeaponInfo {
  id: string;
  name: string;
  type: WeaponType;
  rarity: 1 | 2 | 3 | 4 | 5;
  baseAtk: number;
  subStat: string;
  passiveName: string;
  passiveDesc: string;
  description: string;
  loreStory?: string;
  iconUrl?: string;
}

export interface MaterialInfo {
  id: string;
  name: string;
  category: "ascension" | "talent" | "specialty" | "food";
  rarity: 1 | 2 | 3 | 4 | 5;
  region: string;
  source: string;
  effect?: string;
  description: string;
}

export interface WorldItemInfo {
  id: string;
  name: string;
  type: "oculus" | "chest" | "key" | "puzzle" | "monument";
  region: string;
  description: string;
  locationLore: string;
}

export interface QuestItemInfo {
  id: string;
  name: string;
  questName: string;
  chapter: string;
  origin: string;
  description: string;
  historicalSignificance: string;
}
