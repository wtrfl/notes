'use client';

// TODO: markdown support, apple notes desktop style layout, updating and deleting notes

import { auth, db } from '@/lib/firebase';
import { addDoc, collection, getDocs, serverTimestamp, CollectionReference, Timestamp, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import UserDropdown from './UserDropdown';
import { onAuthStateChanged } from 'firebase/auth';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import formattedNoteDate from '@/lib/formatNoteDate';
import NoteEditor from './NoteEditor';

export interface Doc { title: string, content: string, createdAt: Timestamp }
export interface Note extends Doc { id: string }

export default function Notes() {

    const { loading, user } = useAuth();

    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    const [notes, setNotes] = useState<null | Note[]>(null);

    const [currentNoteId, setCurrentNoteId] = useState<null | string>(null);
    const currentNote = notes ? notes.find(note => note.id === currentNoteId) : null;

    const [editorModified, setEditorModified] = useState<boolean>(false);

    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (editorModified) {
                e.preventDefault();
                e.returnValue = "";
            }
        }

        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        }
    }, [editorModified])

    const addNote = async () => {
        const notesRef = collection(db, "users", user!.uid, "notes") as CollectionReference<Doc>;

        await addDoc(notesRef, {
            title: "Note",
            content: "test",
            createdAt: serverTimestamp()
        });
    }

    useEffect(() => {
        let unsubscribeNotes: (() => void) | undefined;

        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            if (!user) {
                router.replace("/auth");
                if (unsubscribeNotes) unsubscribeNotes();
                return;
            }

            unsubscribeNotes = onSnapshot(collection(db, "users", user?.uid, "notes") as CollectionReference<Doc>, (snapshot) => {
                const notes: Note[] = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
                setNotes(notes);
                if (searchParams.get("note") !== "" && searchParams.get("note") !== null) setCurrentNoteId(searchParams.get("note"));
            })
        })

        return () => {
            unsubscribeAuth();
            if (unsubscribeNotes) unsubscribeNotes();
        }
    }, [router])

    const handleSelectNote = (id: string) => {
        if (editorModified) {
            alert("You have unsaved changes!");
            return;
        }
        setCurrentNoteId(id);
        const params = new URLSearchParams(searchParams);
        params.set("note", id);
        router.replace(`${pathname}?${params.toString()}`)
    } 

    if (loading || notes === null) return (
        <div className="flex min-h-screen justify-center items-center">
            <div className="loader"></div>
        </div>
    )

    return (
        <div className="relative flex flex-col max-w-[960px] mx-auto border h-screen">
            
            <div className="flex justify-between px-4 py-2 border-b">
                <span>NOTES</span>
                <UserDropdown />
            </div>
            <div className="flex flex-1 overflow-hidden">
                <div className="flex flex-col w-75 border-r overflow-auto">
                    <button className="border-b flex px-3 py-3 items-center gap-2 cursor-pointer bg-foreground/(--bg-opacity) hover:[--bg-opacity:5%]" onClick={addNote}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-plus-icon lucide-plus"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                        New Note
                    </button>
                    {notes.map(note => (
                        <div onClick={() => handleSelectNote(note.id)} className={"border-b flex flex-col px-4 py-3 cursor-pointer bg-foreground/(--bg-opacity) " + (note.id === currentNoteId ? "[--bg-opacity:10%]" : "[--bg-opacity:0%] hover:[--bg-opacity:5%]")} key={note.id}>
                            <strong className='line-clamp-1 text-ellipsis'>{note.title}</strong>
                            <span className='line-clamp-1 text-ellipsis'>
                                {formattedNoteDate(note.createdAt, "short")}
                                <span className='opacity-75'> {note.content}</span>
                            </span>
                        </div>
                    ))}
                </div>
                {currentNote && <NoteEditor key={currentNote.id} note={currentNote} modified={editorModified} setModified={setEditorModified} user={user!} />}
            </div>
        </div>
    );
}
