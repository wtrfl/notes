'use client';

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
        <div className="flex flex-col gap-4 min-h-screen justify-center items-center">
            <UserDropdown />
            <div className="grid grid-cols-4 gap-2">
                {notes.map(note => (
                    <div className="border flex flex-col gap-2 p-3" key={note.id}>
                        <strong>{note.title}</strong>
                        <span>{note.content}</span>
                        <span className='text-xs opacity-50'>{note.createdAt ? note.createdAt.seconds : "pending..."}</span>
                    </div>
                ))}
            </div>
            <button onClick={addNote}>NEW NOTE</button>
        </div>
    );
}
