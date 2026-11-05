import CommunityLoreReader from "@/components/CommunityLoreReader";
import { INITIAL_COMMUNITY_LORES } from "@/lib/community";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return INITIAL_COMMUNITY_LORES.map((item) => ({
    slug: item.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const found = INITIAL_COMMUNITY_LORES.find((item) => item.slug === slug);
  return {
    title: found ? `${found.title} — Community Lore` : "Community Lore — Teyvat Lore",
    description: found?.summary || "Baca arsip dan diskusi teori komunitas Genshin Impact.",
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const initialLore = INITIAL_COMMUNITY_LORES.find((item) => item.slug === slug) || null;
  return <CommunityLoreReader slug={slug} initialLore={initialLore} />;
}

