import type { Element } from "@/types/story";

const ELEMENT_EMOJI: Record<Element, string> = {
  anemo: "💨",
  geo: "🪨",
  electro: "⚡",
  dendro: "🌿",
  hydro: "💧",
  pyro: "🔥",
  cryo: "❄️",
  none: "✦",
};

const ELEMENT_LABEL: Record<Element, string> = {
  anemo: "Anemo",
  geo: "Geo",
  electro: "Electro",
  dendro: "Dendro",
  hydro: "Hydro",
  pyro: "Pyro",
  cryo: "Cryo",
  none: "",
};

export default function ElementBadge({ element }: { element: Element }) {
  if (element === "none") return null;
  return (
    <span
      className={`badge-${element} inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full border`}
    >
      <span>{ELEMENT_EMOJI[element]}</span>
      <span>{ELEMENT_LABEL[element]}</span>
    </span>
  );
}

