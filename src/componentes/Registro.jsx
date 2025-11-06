import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import confetti from "canvas-confetti";
import { motion } from "framer-motion";
import { db, storage } from "../lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function Registro() {
  const { registrar } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre: "",
    email: "",
    password: "",
    confirmPassword: "",
    foto: null,
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    if (e.target.name === "foto") {
      setForm({ ...form, foto: e.target.files[0] });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.nombre || !form.email || !form.password || !form.confirmPassword) {
      return setError("⚠ Todos los campos son obligatorios");
    }
    if (form.password !== form.confirmPassword) {
      return setError("⚠ Las contraseñas no coinciden");
    }

    try {
      const userCred = await registrar(form.email, form.password);

      let photoURL = "";
      if (form.foto) {
        const storageRef = ref(storage, `usuarios/${userCred.user.uid}/${form.foto.name}`);
        await uploadBytes(storageRef, form.foto);
        photoURL = await getDownloadURL(storageRef);
      }

      await setDoc(doc(db, "usuarios", userCred.user.uid), {
        nombre: form.nombre,
        email: form.email,
        photoURL,
        createdAt: new Date(),
      });

      confetti({ particleCount: 200, spread: 80, origin: { y: 0.6 } });

      setTimeout(() => {
        alert("🌸 ¡Registro exitoso! Ahora puedes iniciar sesión.");
        navigate("/login");
      }, 1000);
    } catch (err) {
      console.error(err);
      setError("⚠ Error registrando usuario");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-200 via-pink-100 to-white p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl p-8 border border-pink-200"
      >
        <h2 className="text-3xl font-bold text-center text-pink-600 mb-6">🌷 Crear Cuenta 🌷</h2>

        {error && (
          <p className="text-red-500 text-sm text-center bg-red-100 p-2 rounded-xl mb-4">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="nombre"
            placeholder="Nombre completo"
            className="w-full p-3 border border-pink-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400"
            onChange={handleChange}
          />
          <input
            name="email"
            type="email"
            placeholder="Correo electrónico"
            className="w-full p-3 border border-pink-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400"
            onChange={handleChange}
          />
          <input
            name="password"
            type="password"
            placeholder="Contraseña"
            className="w-full p-3 border border-pink-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400"
            onChange={handleChange}
          />
          <input
            name="confirmPassword"
            type="password"
            placeholder="Confirmar contraseña"
            className="w-full p-3 border border-pink-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400"
            onChange={handleChange}
          />
          <input
            type="file"
            name="foto"
            accept="image/*"
            onChange={handleChange}
            className="w-full text-sm text-pink-700 border border-pink-300 rounded-xl p-2 cursor-pointer"
          />

          <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.03 }}
            type="submit"
            className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 rounded-xl shadow-lg"
          >
            Registrarme 💖
          </motion.button>
        </form>

        <p className="text-center mt-4 text-sm">
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" className="text-pink-600 hover:underline font-semibold">
            Inicia sesión aquí
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
