"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import Modal from "@/components/Modal/Modal";
import Loading from "@/app/loading";
import { fetchNoteById } from "@/lib/api";

import css from "./NotePreview.module.css";

export default function NotePreview() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const closeModal = () => router.back();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
    enabled: !!id,
    refetchOnMount: false,
  });

  return (
    <Modal onClose={closeModal}>
      {isLoading && <Loading />}
      {isError && <p className={css.error}>Could not fetch note details.</p>}

      {data && (
        <div className={css.container}>
          <div className={css.item}>
            <div className={css.header}>
              <h2>{data.title}</h2>
            </div>
            <p className={css.content}>{data.content}</p>
            <p className={css.date}>
              {new Date(data.createdAt).toLocaleDateString()}
            </p>
          </div>
          <span className={css.tag}>{data.tag}</span>
        </div>
      )}

      <button type="button" onClick={closeModal} className={css.backBtn}>
        Close
      </button>
    </Modal>
  );
}
