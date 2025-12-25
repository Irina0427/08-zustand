"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { fetchNotes, type NotesHttpResponse } from "@/lib/api";
import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import { useDebounce } from "@/components/hooks/UseDebounce";
import NoteList from "@/components/NoteList/NoteList";
import ErrorMessage from "@/components/ErrorMessage/ErrorMessage";

import Loading from "@/app/loading";
import css from "./LayoutNotes.module.css";

interface NotesClientProps {
  category: string;
}

export default function NotesClient({ category }: NotesClientProps) {
  const [page, setPage] = useState<number>(1);
  const [topic, setTopic] = useState<string>("");

  const debouncedSearch = useDebounce(topic, 500);

  const handleSearchChange = (value: string) => {
    setTopic(value);
    setPage(1);
  };

  useEffect(() => {
    setPage(1);
  }, [category]);

  const tag = category && category !== "all" ? category : undefined;

  const search =
    debouncedSearch.trim().length > 0 ? debouncedSearch.trim() : undefined;

  const {
    data,
    isLoading,
    isError,
    isSuccess,
    error,
  } = useQuery<NotesHttpResponse, Error>({
    queryKey: ["notes", { search: search ?? "", category: tag ?? "", page }],
    queryFn: () =>
      fetchNotes({
        page,
        perPage: 12,
        tag,
        search,
      }),
    placeholderData: keepPreviousData,
    refetchOnMount: false,
  });

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 1;
  const hasNotes = notes.length > 0;

  return (
    <div className={css.app}>
      <div className={css.topBar}>
        <SearchBox value={topic} onChange={handleSearchChange} />

        <Link href="/notes/action/create" className={css.createBtn}>
          Створити нотатку +
        </Link>
      </div>

      {isLoading && <Loading />}

      {isError && (
        <div>
          <ErrorMessage />
          <p>{error.message}</p>
        </div>
      )}

      {isSuccess && (
        <>
          {hasNotes ? (
            <NoteList notes={notes} />
          ) : (
            <p>Нотаток не знайдено.</p>
          )}

          {hasNotes && totalPages > 1 && (
            <Pagination page={page} totalPages={totalPages} onChange={setPage} />
          )}
        </>
      )}
    </div>
  );
}
