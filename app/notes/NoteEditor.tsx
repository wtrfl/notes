import formattedNoteDate from "@/lib/formatNoteDate";
import { Doc, Note } from "./page";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { doc, DocumentReference, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { User } from "firebase/auth";

export default function NoteEditor({ note, modified, setModified, user }: { note: Note, modified: boolean, setModified: Dispatch<SetStateAction<boolean>>, user: User }) {

    const [titleValue, setTitleValue] = useState<string>(note.title);
    const [contentValue, setContentValue] = useState<string>(note.content);

    useEffect(() => {
        if (titleValue === note.title && contentValue === note.content) {
            setModified(false);
        } else {
            setModified(true);
        }
    }, [titleValue, contentValue, note])

    useEffect(() => {
        setTitleValue(note.title);
        setContentValue(note.content);
    }, [note])

    const handleRevert = () => {
        setTitleValue(note.title);
        setContentValue(note.content);
        setModified(false);
    }

    const handleUpdate = async () => {
        const noteRef = doc(db, "users", user.uid, "notes", note.id) as DocumentReference<Doc>;
        updateDoc(noteRef, {
            title: titleValue,
            content: contentValue,
            createdAt: serverTimestamp()
        })
        .catch((error) => {
            console.log(error);
        })
    }

    return (
        <div className="flex flex-col flex-1">
            <span className="text-sm opacity-60 self-center my-3 px-6">{formattedNoteDate(note.createdAt, "long")}</span>
            <input name="title" type="text" className='text-xl font-bold outline-0 mb-2 px-6' value={titleValue} onChange={(e) => setTitleValue(e.target.value)} />
            <textarea name="content" className='flex-1 resize-none outline-0 px-6' value={contentValue} onChange={(e) => setContentValue(e.target.value)}></textarea>
            {modified && (
                <div className="flex items-center border-t">
                    <span className="flex-1 opacity-70 text-sm px-6">You have unsaved changes.</span>
                    <button onClick={handleRevert} className="px-6 py-4 border-l cursor-pointer bg-foreground/(--bg-opacity) hover:[--bg-opacity:5%]">Revert</button>
                    <button onClick={handleUpdate} className="px-6 py-4 border-l cursor-pointer bg-foreground/(--bg-opacity) hover:[--bg-opacity:5%]">Save Changes</button>
                </div>
            )}
        </div>
    )
}