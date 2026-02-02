// components/Comments.tsx
"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import type { Recipe } from "@/lib/types/recipes";

type Comment = NonNullable<Recipe["comments"]>[number];

interface CommentsProps {
  initialComments?: Comment[];
  onChange?: (comments: Comment[]) => void; // opcional para persistir
}

export const Comments: React.FC<CommentsProps> = ({ initialComments = [], onChange }) => {
  const [comments, setComments] = useState<Comment[]>(() => initialComments);
  const [newCommentText, setNewCommentText] = useState("");
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");

  const notifyChange = (next: Comment[]) => {
    setComments(next);
    if (onChange) onChange(next);
  };

  const addComment = () => {
    const text = newCommentText.trim();
    if (!text) return toast.error("Escribe un comentario antes de publicar");
    const newC: Comment = {
      user: "Usuario (demo)",
      comment: text,
      likeCount: 0,
      dislikeCount: 0,
      date: new Date().toISOString().slice(0, 10),
      answers: [],
    };
    notifyChange([newC, ...comments]);
    setNewCommentText("");
    toast.success("Comentario publicado");
  };

  const toggleLike = (index: number) => {
    const copy = [...comments];
    copy[index] = { ...copy[index], likeCount: copy[index].likeCount + 1 };
    notifyChange(copy);
  };

  const toggleDislike = (index: number) => {
    const copy = [...comments];
    copy[index] = { ...copy[index], dislikeCount: copy[index].dislikeCount + 1 };
    notifyChange(copy);
  };

  const startReply = (index: number) => {
    setReplyingTo(index);
    setReplyText("");
  };

  const submitReply = (index: number) => {
    const text = replyText.trim();
    if (!text) return toast.error("Escribe una respuesta antes de publicar");
    const copy = [...comments];
    const answer = {
      user: "Usuario (demo)",
      comment: text,
      date: new Date().toISOString().slice(0, 10),
    };
    copy[index] = { ...copy[index], answers: [...copy[index].answers, answer] };
    notifyChange(copy);
    setReplyingTo(null);
    setReplyText("");
    toast.success("Respuesta publicada");
  };

  return (
    <div className="space-y-4">
      {/* Nuevo comentario */}
      <div className="rounded-lg border bg-card p-4">
        <h4 className="font-semibold mb-2">Escribe un comentario</h4>
        <textarea
          value={newCommentText}
          onChange={(e) => setNewCommentText(e.target.value)}
          placeholder="Comparte tu experiencia con esta receta..."
          className="w-full resize-none rounded-md border border-border bg-color-input p-3 text-sm"
          rows={3}
        />
        <div className="mt-3 flex justify-end">
          <button
            onClick={addComment}
            className="rounded-md bg-primary px-4 py-2 text-primary-foreground text-sm"
          >
            Publicar
          </button>
        </div>
      </div>

      {/* Lista comentarios o caja vacía */}
      {comments.length === 0 ? (
        <div className="rounded-lg border p-6 text-center">
          <p className="mb-3 text-muted-foreground">Aún no hay comentarios para esta receta.</p>
          <p className="mb-4 text-sm">Sé el primero en escribir uno y compartir tu experiencia.</p>
          <div className="flex justify-center">
            <button
              onClick={() => {
                const el = document.querySelector<HTMLTextAreaElement>("textarea");
                el?.focus();
              }}
              className="rounded-md bg-primary px-4 py-2 text-primary-foreground text-sm"
            >
              Escribir comentario
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((c, i) => (
            <div key={i} className="rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">{c.user}</p>
                  <p className="text-xs text-muted-foreground">{c.date}</p>
                </div>
                <div className="text-sm text-muted-foreground flex gap-3">
                  <button onClick={() => toggleLike(i)} aria-label="Me gusta">
                    👍 {c.likeCount}
                  </button>
                  <button onClick={() => toggleDislike(i)} aria-label="No me gusta">
                    👎 {c.dislikeCount}
                  </button>
                  <button onClick={() => startReply(i)} aria-label="Responder">
                    Responder
                  </button>
                </div>
              </div>

              <p className="mt-3 text-sm">{c.comment}</p>

              {/* Answers */}
              {c.answers.length > 0 && (
                <div className="mt-4 ml-4 space-y-3 border-l-2 border-muted pl-4">
                  {c.answers.map((a, ai) => (
                    <div key={ai} className="rounded-lg bg-muted p-3">
                      <div className="mb-1 flex items-center justify-between">
                        <span className="text-sm font-semibold">{a.user}</span>
                        <span className="text-xs text-muted-foreground">{a.date}</span>
                      </div>
                      <p className="text-sm">{a.comment}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Reply box */}
              {replyingTo === i && (
                <div className="mt-3 ml-4">
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    rows={2}
                    className="w-full rounded-md border border-border bg-color-input p-2 text-sm"
                    placeholder="Escribe tu respuesta..."
                  />
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={() => submitReply(i)}
                      className="rounded-md bg-primary px-3 py-1 text-primary-foreground text-sm"
                    >
                      Responder
                    </button>
                    <button
                      onClick={() => {
                        setReplyingTo(null);
                        setReplyText("");
                      }}
                      className="rounded-md border border-border px-3 py-1 text-sm"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
