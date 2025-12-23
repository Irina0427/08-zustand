import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";

import { fetchNotes } from "@/lib/api";
import type { Tag } from "@/types/note";
import NotesClient from "./Notes.client";

type Props = {
  params: Promise<{ slug: string[] }>;
};

export default async function NotesPage({ params }: Props) {
  const { slug } = await params;

  const slugArray = Array.isArray(slug) && slug.length ? slug : ["all"];

  const category: Tag | "" = slugArray[0] === "all" ? "" : (slugArray[0] as Tag);

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", { search: "", category, page: 1 }],
    queryFn: () =>
      fetchNotes({
        page: 1,
        perPage: 12,
        tag: category || undefined,
      }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient category={category} />
    </HydrationBoundary>
  );
}
