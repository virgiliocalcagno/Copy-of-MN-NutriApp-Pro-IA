import { useState, useEffect } from 'react';
import { auth, db, googleProvider, facebookProvider } from '../firebase';
import { signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { Store, initialStore } from '../types/store';

export const useStore = () => {
    const [user, setUser] = useState<User | null>(null);
    const [store, setStore] = useState<Store>(initialStore);
    const [loading, setLoading] = useState(true);

    // Load from LocalStorage on mount (offline support)
    useEffect(() => {
        const local = localStorage.getItem('mn_pro_clinic_v6');
        if (local) {
            try {
                setStore(JSON.parse(local));
            } catch (e) {
                console.error('Error parsing local storage', e);
            }
        }
    }, []);

    // Auth Listener & Firestore Sync
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            setLoading(true);

            if (currentUser) {
                const docRef = doc(db, 'users', currentUser.uid);

                // Real-time listener
                const unsubDoc = onSnapshot(docRef, (docSnap) => {
                    if (docSnap.exists()) {
                        const data = docSnap.data() as Store;
                        setStore(prev => ({ ...prev, ...data })); // Merge with local to be safe
                        localStorage.setItem('mn_pro_clinic_v6', JSON.stringify(data)); // Backup to local
                    } else {
                        // If new user, save current local store to cloud
                        setDoc(docRef, store);
                    }
                    setLoading(false);
                });

                return () => unsubDoc();
            } else {
                setLoading(false);
            }
        });
        return () => unsubscribe();
    }, []);

    // Manual Sync Function
    const saveStore = async (newStore: Store) => {
        setStore(newStore);
        localStorage.setItem('mn_pro_clinic_v6', JSON.stringify(newStore));

        if (user) {
            try {
                await setDoc(doc(db, 'users', user.uid), newStore);
            } catch (e) {
                console.error("Error saving to cloud", e);
            }
        }
    };

    const login = async (method: 'google' | 'facebook') => {
        try {
            const provider = method === 'google' ? googleProvider : facebookProvider;
            await signInWithPopup(auth, provider);
        } catch (e: any) {
            console.error(e);
            alert("Error login: " + e.message);
        }
    };

    const logout = async () => {
        await signOut(auth);
        setStore(initialStore);
        localStorage.removeItem('mn_pro_clinic_v6');
    };

    return { user, store, loading, saveStore, login, logout };
};
