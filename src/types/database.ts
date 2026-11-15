export type WeaponType = "Sword" | "Claymore" | "Polearm" | "Bow" | "Catalyst";

export interface CharacterInfo {
  id: string;
  name: string;
  title: string;
  rarity: 4 | 5;
  element: "pyro" | "hydro" | "anemo" | "electro" | "dendro" | "cryo" | "geo" | "none";
  weapon: WeaponType;
  region: string;
  affiliation: string;
  constellation: string;
  birthday: string;
  summary: string;
  loreDescription: string;
  iconUrl?: string;
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

export interface FoodIngredient {
  name: string;
  count: number;
  iconUrl?: string;
}

export interface FoodInfo {
  id: string;
  name: string;
  nameEn: string;
  rarity: 1 | 2 | 3 | 4 | 5;
  category: "attack" | "defense" | "recovery" | "adventure" | "other" | string;
  categoryLabel: string;
  effect: string;
  description: string;
  ingredients: FoodIngredient[];
  suspicious?: string;
  delicious?: string;
  iconUrl: string;
}

export interface WorldItemInfo {
  id: string;
  name: string;
  nameEn: string;
  subCategory: string;
  region: string;
  rarity: 1 | 2 | 3 | 4 | 5;
  typeText: string;
  description: string;
  sources: string[];
  iconUrl?: string;
}

export interface MaterialInfo {
  id: string;
  name: string;
  nameEn: string;
  subCategory: string;
  rarity: 1 | 2 | 3 | 4 | 5;
  typeText: string;
  description: string;
  sources: string[];
  iconUrl?: string;
}

export interface QuestItemInfo {
  id: string;
  name: string;
  questName: string;
  chapter: string;
  origin: string;
  description: string;
  historicalSignificance: string;
  iconUrl?: string;
}
