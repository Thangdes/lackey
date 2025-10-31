"use client";
import type React from "react";
import { CHECKOUT_TEXT } from "@/constant/checkout";

export type NotesFieldProps = {
  notes: string;
  onNotesChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
};

export function NotesField({ notes, onNotesChange }: NotesFieldProps) {
  return (
    <div className="sm:col-span-2">
      <label className="mb-1 block text-sm text-black/70">{CHECKOUT_TEXT.labels.notesOptional}</label>
      <textarea
        value={notes}
        onChange={onNotesChange}
        rows={3}
        placeholder={CHECKOUT_TEXT.placeholders.notes}
        className="w-full rounded-lg border border-black/15 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/10"
      />
    </div>
  );
}
