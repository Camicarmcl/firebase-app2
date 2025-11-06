// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  updateProfile,
  sendPasswordResetEmail
} from "firebase/auth";
import { auth, db } from "../lib/firebase";
import { doc, getDoc } from "firebase/firestore";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);

  const registrar = async (email, password) => {
    const userCred = await createUserWithEmailAndPassword(auth, email, password);
    return userCred;
  };

  const login = async (email, password) => {
    const userCred = await signInWithEmailAndPassword(auth, email, password);
    const docRef = doc(db, "usuarios", userCred.user.uid);
    const docSnap = await getDoc(docRef);
    const data = docSnap.exists() ? docSnap.data() : {};
    setUsuario({
      uid: userCred.user.uid,
      email: userCred.user.email,
      nombre: data.nombre,
      photoURL: data.photoURL || ""
    });
    return userCred;
  };

  const logout = async () => { await signOut(auth); setUsuario(null); };

  const resetPassword = async (email) => { await sendPasswordResetEmail(auth, email); };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, "usuarios", user.uid);
        const docSnap = await getDoc(docRef);
        const data = docSnap.exists() ? docSnap.data() : {};
        setUsuario({
          uid: user.uid,
          email: user.email,
          nombre: data.nombre,
          photoURL: data.photoURL || ""
        });
      } else setUsuario(null);
    });
    return () => unsub();
  }, []);

  return (
    <AuthContext.Provider value={{ usuario, registrar, login, logout, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
}
