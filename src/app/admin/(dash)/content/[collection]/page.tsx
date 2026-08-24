import { notFound } from "next/navigation";
import { CollectionEditor } from "@/components/admin/CollectionEditor";
import { getContent } from "@/lib/content";
import { collectionByKey } from "@/lib/schema";

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ collection: string }>;
}) {
  const { collection: key } = await params;
  const collection = collectionByKey(key);
  if (!collection) notFound();

  const content = await getContent();
  const items = content[collection.key] as unknown as Record<string, string>[];

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">{collection.label}</h1>
        <p className="text-sm text-muted-foreground">{collection.where}</p>
      </header>
      <CollectionEditor collection={collection} initialItems={items} />
    </div>
  );
}
