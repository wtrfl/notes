import { db } from "@/lib/firebase"
import { User } from "firebase/auth"
import { doc, deleteDoc } from "firebase/firestore";
import { Dispatch, SetStateAction } from "react";



export default function DeleteNoteButton({ id, user, setCurrentNoteId }: { id: string, user: User, setCurrentNoteId: Dispatch<SetStateAction<string | null>> }) {

    const handleDelete = async () => {
        setCurrentNoteId(null)
        deleteDoc(doc(db, "users", user!.uid, "notes", id));
    }

    return (
        <div className="absolute top-0 right-0 my-2.5 mx-4.5 cursor-pointer grayscale hover:grayscale-0" onClick={handleDelete}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ff7373" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash-icon lucide-trash"><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
        </div>
    )
}