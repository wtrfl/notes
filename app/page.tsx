'use client';

import { db } from '@/lib/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

export default function Home() {

    const addNote = async () => {
        const notesRef = collection(db, "notes");

        await addDoc(notesRef, {
            title: "Note",
            content: "test",
            createdAt: serverTimestamp()
        });
    }

    return (
        <div className="flex min-h-screen justify-center items-center">
            Hi<button onClick={addNote}>Add</button>
        </div>
    );
}
