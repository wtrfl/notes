'use client';

import { db } from '@/lib/firebase';
import { addDoc, collection, getDocs, serverTimestamp, CollectionReference, Timestamp, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';

interface Doc { title: string, content: string, createdAt: Timestamp }
interface Note extends Doc { id: string }

export default function Home() {

    const [notes, setNotes] = useState<null | Note[]>(null);

    const addNote = async () => {
        const notesRef = collection(db, "notes") as CollectionReference<Doc>;

        await addDoc(notesRef, {
            title: "Note",
            content: "test",
            createdAt: serverTimestamp()
        });
    }

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "notes") as CollectionReference<Doc>, (snapshot) => {
            const notes: Note[] = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
            setNotes(notes);
        })

        return () => unsubscribe();
    }, [])

    if (notes === null) return (
        <div className="flex min-h-screen justify-center items-center">
            <div className="loader"></div>
        </div>
    )

    console.log(notes);

    return (
        <div className="flex flex-col gap-4 min-h-screen justify-center items-center">
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
