'use client';

// TODO: markdown support, apple notes desktop style layout, updating and deleting notes

import { auth, db } from '@/lib/firebase';
import { addDoc, collection, getDocs, serverTimestamp, CollectionReference, Timestamp, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import UserDropdown from './UserDropdown';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

interface Doc { title: string, content: string, createdAt: Timestamp }
interface Note extends Doc { id: string }

export default function Notes() {

    const { loading, user } = useAuth();
    const router = useRouter();
    const [notes, setNotes] = useState<null | Note[]>(null);

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
            })
        })

        return () => {
            unsubscribeAuth();
            if (unsubscribeNotes) unsubscribeNotes();
        }
    }, [router])

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
            <div className="flex flex-1 items-stretch">
                <div className="flex flex-col w-75 border-r h-full">
                    <button className="border-b flex px-3 py-3 items-center gap-2" onClick={addNote}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-plus-icon lucide-plus"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                        New Note
                    </button>
                    {notes.map(note => (
                        <div className="border-b flex flex-col px-4 py-3" key={note.id}>
                            <strong>{note.title}</strong>
                            <span>
                                {
                                    note.createdAt
                                    ? (
                                        note.createdAt.toDate().getMonth()+1 + "/" +
                                        note.createdAt.toDate().getDate() + "/" +
                                        note.createdAt.toDate().getFullYear().toString().slice(-2)
                                    )
                                    : ""
                                }
                                <span className='opacity-75'> {note.content}</span>
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
