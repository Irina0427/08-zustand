"use client";

import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { fetchNotes } from "@/lib/api";
import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import { useDebounce } from "@/components/hooks/UseDebounce";
import NoteList from "@/components/NoteList/NoteList";
import Modal from "@/components/Modal/Modal";
import NoteForm from "@/components/NoteForm/NoteForm";

import Loading from "@/app/loading";
import Error from "./error";
import css from "./LayoutNotes.module.css";

interface NotesClientProps {
  // "" означає показати всі теги
  category: string;
}

export default function NotesClient({ category }: NotesClientProps) {
  const [page, setPage] = useState<number>(1);
  const [topic, setTopic] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const debouncedSearch = useDebounce(topic, 500);

  const handleSearchChange = (value: string) => {
    setTopic(value);
    setPage(1);
  };

  const { data, isLoading, isError, isSuccess, error } = useQuery({
    queryKey: ["notes", { search: debouncedSearch, category, page }],
    queryFn: () =>
      fetchNotes({
        page,
        perPage: 12,
        tag: category || undefined,
        search: debouncedSearch || undefined,
      }),
    placeholderData: keepPreviousData,
    refetchOnMount: false,
  });

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 1;

  return (
    <div className={css.app}>
      <SearchBox value={topic} onChange={handleSearchChange} />

      {isSuccess && totalPages > 1 && (
        <Pagination page={page} totalPages={totalPages} onChange={setPage} />
      )}

      <button type="button" className={css.button} onClick={openModal}>
        Create note +
      </button>

      {isLoading && <Loading />}
      {isError && <Error error={error} />}

      <NoteList notes={notes} />

      {isModalOpen && (
        <Modal onClose={closeModal}>
          <NoteForm onClose={closeModal} />
        </Modal>
      )}
    </div>
  );
}
