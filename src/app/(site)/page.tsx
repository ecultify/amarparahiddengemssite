import { Hero } from "@/components/home/Hero";
import { ExploreGems } from "@/components/home/ExploreGems";
import { StoriesFromParas } from "@/components/home/StoriesFromParas";
import { ArticlesFeatures } from "@/components/home/ArticlesFeatures";
import { CreatorTrails } from "@/components/home/CreatorTrails";
import { getContent } from "@/lib/content";

/** Homepage — Figma node 49:1939 (amar-para-homepage - final). */
export default async function HomePage() {
  const content = await getContent();

  return (
    <>
      <Hero gemCount={content.gemCount} />
      <ExploreGems gems={content.gems} />
      <StoriesFromParas stories={content.stories} />
      <ArticlesFeatures
        rowOne={content.articles.filter((article) => article.row !== "2")}
        rowTwo={content.articles.filter((article) => article.row === "2")}
      />
      <CreatorTrails trails={content.creatorTrails} />
    </>
  );
}
