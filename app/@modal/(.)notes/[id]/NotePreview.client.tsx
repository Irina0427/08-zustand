"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import Modal from "@/components/Modal/Modal";
import { fetchNoteById } from "@/lib/api";
import type { Note } from "@/types/note";

import css from "./NotePreview.module.css";

type NotePreviewProps = {
  id: string;
};

export default function NotePreview({ id }: NotePreviewProps) {
  const router = useRouter();

  const {
    data: note,
    isLoading,
    error,
  } = useQuery<Note>({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  });

  const handleClose = () => {
    router.back();
  };

  return (
    <Modal onClose={handleClose}>
      <div className={css.container}>
        <button type="button" className={css.backBtn} onClick={handleClose}>
          ← Back
        </button>

        {isLoading && <p>Loading...</p>}
        {!isLoading && (error || !note) && <p>Failed to load note</p>}

        {!isLoading && note && (
          <div className={css.item}>
            <div className={css.header}>
              <h2>{note.title}</h2>
              <span className={css.tag}>{note.tag}</span>
            </div>

            <p className={css.content}>{note.content}</p>
            <p className={css.date}>
              {new Date(note.createdAt).toLocaleString()}
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
}
