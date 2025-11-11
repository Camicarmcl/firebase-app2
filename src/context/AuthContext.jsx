// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  sendPasswordResetEmail
} from "firebase/auth";
import { auth, db } from "../lib/firebase";
import { doc, getDoc } from "firebase/firestore";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);

  // ✅ Registrar usuario (solo AUTH, NO Firestore)
  const registrar = async (email, password) => {
    const userCred = await createUserWithEmailAndPassword(auth, email, password);
    return userCred;
  };

  // ✅ LOGIN
  const login = async (email, password) => {
    const userCred = await signInWithEmailAndPassword(auth, email, password);

    const docRef = doc(db, "usuarios", userCred.user.uid);
    const docSnap = await getDoc(docRef);
    const data = docSnap.exists() ? docSnap.data() : {};

    setUsuario({
      uid: userCred.user.uid,
      email: userCred.user.email,
      nombre: data.nombre || "",
      photoURL: data.photoURL || ""
    });

    return userCred;
  };

  // ✅ LOGOUT
  const logout = async () => {
    await signOut(auth);
    setUsuario(null);
  };

  // ✅ RECUPERAR CONTRASEÑA
  const resetPassword = async (email) => {
    await sendPasswordResetEmail(auth, email);
  };

  // ✅ DETECTAR USUARIO ACTIVO
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, "usuarios", user.uid);
        const snap = await getDoc(docRef);
        const data = snap.exists() ? snap.data() : {};

        setUsuario({
          uid: user.uid,
          email: user.email,
          nombre: data.nombre || "",
          photoURL: data.photoURL || ""
        });
      } else {
        setUsuario(null);
      }
    });

    return () => unsub();
  }, []);

  return (
    <AuthContext.Provider value={{ usuario, registrar, login, logout, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
}
