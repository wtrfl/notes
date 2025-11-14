import formattedNoteDate from "@/lib/formatNoteDate";
import { Note } from "./page";

export default function NoteEditor({ note }: { note: Note }) {
    return (
        <div className="flex flex-col flex-1 px-6">
            <span className="text-sm opacity-60 self-center my-3">{formattedNoteDate(note.createdAt, "long")}</span>
            <input type="text" className='text-xl font-bold outline-0 mb-2' value={note.title} />
            <textarea className='flex-1 resize-none outline-0' value={note.content}></textarea>
        </div>
    )
}