import { getStoryBySlug, getAllStories } from "@/lib/stories";
import StoryReader from "@/components/StoryReader";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getAllStories().map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const story = await getStoryBySlug(slug);
  if (!story) return { title: "Cerita tidak ditemukan — Teyvat Lore" };
  return {
    title: `${story.title} — Teyvat Lore`,
    description: story.summary,
  };
}

export default async function LorePage({ params }: Props) {
  const { slug } = await params;
  const story = await getStoryBySlug(slug);
  if (!story) notFound();
  return <StoryReader story={story} />;
}

