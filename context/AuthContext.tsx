'use client';

import { auth } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";

type AuthUser = null | User;
interface AuthContextType { user: AuthUser, loading: boolean }

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [ user, setUser ] = useState<AuthUser>(null);
    const [ loading, setLoading ] = useState<boolean>(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            setUser(firebaseUser);
            setLoading(false);
        })

        return () => unsubscribe();
    }, [])

    return (
        <AuthContext.Provider value={{ user, loading }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext);
}