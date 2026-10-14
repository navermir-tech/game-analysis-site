import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AnalysisPage } from "@/components/analysis-page";
import { analysisItems, getItem } from "@/lib/analysis";
import { loadAnalysisDoc } from "@/lib/content";
import { site } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return analysisItems.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: PageProps<"/analysis/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const item = getItem(slug);
  if (!item) return {};
  const title = `${item.title} | ${site.owner} 분석서`;
  return {
    title,
    description: item.logline,
    openGraph: { title, description: item.logline, type: "article" },
  };
}

export default async function Page({ params }: PageProps<"/analysis/[slug]">) {
  const { slug } = await params;
  const item = getItem(slug);
  if (!item) notFound();
  const blocks = loadAnalysisDoc(slug);
  const related = item.relatedSlugs.map(getItem).filter((x): x is NonNullable<typeof x> => Boolean(x));
  return <AnalysisPage item={item} blocks={blocks} related={related} />;
}
