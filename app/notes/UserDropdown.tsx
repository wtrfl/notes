import { useAuth } from "@/context/AuthContext";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useState } from "react";



export default function UserDropdown() {
    const {user} = useAuth();

    const [open, setOpen] = useState<boolean>(false);

    const handleLogout = async () => {
        await signOut(auth);
    }

    return (
        <div className="absolute top-0 right-0 border rounded-full p-2 aspect-square m-4 cursor-pointer" onClick={() => setOpen(!open)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user-icon lucide-user"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            {open && (
                <div className="absolute top-full right-0 border rounded-lg flex flex-col gap-2 mt-1 p-2">
                    <span>{user!.email}</span>
                    <button onClick={handleLogout}>Logout</button>
                </div>
            )}
        </div>
    )
}