import formattedNoteDate from "@/lib/formatNoteDate";
import { Note } from "./page";
import { useState } from "react";

export default function NoteEditor({ note }: { note: Note }) {

    const [titleValue, setTitleValue] = useState<string>(note.title);
    const [contentValue, setContentValue] = useState<string>(note.content);

    return (
        <div className="flex flex-col flex-1 px-6">
            <span className="text-sm opacity-60 self-center my-3">{formattedNoteDate(note.createdAt, "long")}</span>
            <input type="text" className='text-xl font-bold outline-0 mb-2' value={titleValue} onChange={(e) => setTitleValue(e.target.value)} />
            <textarea className='flex-1 resize-none outline-0' value={contentValue} onChange={(e) => setContentValue(e.target.value)}></textarea>
        </div>
    )
}