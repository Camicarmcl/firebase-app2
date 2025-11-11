import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import confetti from "canvas-confetti";

export function Usuario() {
  const [usuarios, setUsuarios] = useState([]);
  const [formUsuario, setFormUsuario] = useState({
    nombre: "",
    celular: "",
    email: "", // ✅ CAMBIADO DE correo → email
  });
  const [editingId, setEditingId] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔄 Obtener usuarios de Firestore
  useEffect(() => {
    const q = query(collection(db, "usuarios"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      setUsuarios(data);
    });

    return () => unsubscribe();
  }, []);

  // 🧠 Manejar cambios del formulario
  const handleChange = (e) => {
    setFormUsuario({ ...formUsuario, [e.target.name]: e.target.value });
    setErrorMsg("");
    setSuccessMsg("");
  };

  // 💾 Guardar / Actualizar
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { nombre, celular, email } = formUsuario;

    if (!nombre || !celular || !email) {
      setErrorMsg("⚠️ Por favor completa todos los campos antes de guardar.");
      return;
    }

    setLoading(true);

    try {
      if (editingId) {
        await updateDoc(doc(db, "usuarios", editingId), formUsuario);
        setEditingId(null);
      } else {
        await addDoc(collection(db, "usuarios"), formUsuario);
      }

      setFormUsuario({ nombre: "", celular: "", email: "" });

      // 🎉 Confetti
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ["#ec4899", "#f9a8d4", "#fbcfe8"],
      });

      setSuccessMsg("💖 ¡Usuario guardado con éxito!");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (error) {
      console.error("Error:", error);
      setErrorMsg("❌ Ocurrió un error al guardar el usuario.");
    } finally {
      setLoading(false);
    }
  };

  // ✏️ Editar usuario
  const handleEdit = (user) => {
    setFormUsuario({
      nombre: user.nombre || "",
      celular: user.celular || "",
      email: user.email || "", // ✅ SE USA EMAIL
    });
    setEditingId(user.id);
    setErrorMsg("");
    setSuccessMsg("");
  };

  // ❌ Cancelar edición
  const handleCancelEdit = () => {
    setEditingId(null);
    setFormUsuario({ nombre: "", celular: "", email: "" });
    setErrorMsg("");
  };

  // 🗑️ Eliminar usuario
  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este usuario? 🗑️")) return;

    try {
      await deleteDoc(doc(db, "usuarios", id));
    } catch (error) {
      console.error("Error:", error);
      alert("❌ No se pudo eliminar el usuario.");
    }
  };

  return (
    <div className="min-h-screen bg-pink-50 flex flex-col items-center py-10 px-4">
      <h1 className="text-3xl font-bold text-pink-600 mb-6 animate-pulse">
        💕 Registro de Usuarios 💕
      </h1>

      {/* 🧾 Formulario */}
      <form
        id="user-form"
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-2xl p-6 w-full max-w-md border border-pink-200"
      >
        <div className="mb-4">
          <label className="block text-pink-600 font-medium mb-2">Nombre</label>
          <input
            type="text"
            name="nombre"
            value={formUsuario.nombre}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-pink-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400"
            placeholder="Escribe tu nombre..."
          />
        </div>

        <div className="mb-4">
          <label className="block text-pink-600 font-medium mb-2">Celular</label>
          <input
            type="text"
            name="celular"
            value={formUsuario.celular}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-pink-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400"
            placeholder="Tu número de celular..."
          />
        </div>

        <div className="mb-4">
          <label className="block text-pink-600 font-medium mb-2">Correo</label>
          <input
            type="email"
            name="email"
            value={formUsuario.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-pink-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400"
            placeholder="Tu correo electrónico..."
          />
        </div>

        {errorMsg && (
          <p className="text-red-500 text-sm mb-4 font-medium">{errorMsg}</p>
        )}
        {successMsg && (
          <p className="text-green-500 text-sm mb-4 font-medium">{successMsg}</p>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 inline-flex items-center justify-center bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 rounded-xl shadow-md transition-all duration-200 disabled:opacity-60"
          >
            {editingId ? "✏️ Guardar cambios" : "💌 Guardar Usuario"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="inline-flex items-center justify-center px-4 py-2 rounded-xl border border-pink-300 bg-white text-pink-600 font-medium shadow-sm"
            >
              ✖️ Cancelar
            </button>
          )}
        </div>
      </form>

      {/* 📋 Lista */}
      <div className="mt-10 w-full max-w-md">
        <h2 className="text-xl font-semibold text-pink-600 mb-4 text-center">
          🌸 Usuarios Registrados 🌸
        </h2>

        <ul className="space-y-3">
          {usuarios.map((user) => (
            <li
              key={user.id}
              className="bg-white border border-pink-200 rounded-xl shadow-sm p-4 flex items-start justify-between hover:shadow-md transition-all"
            >
              <div className="flex-1">
                <span className="font-bold text-pink-700">{user.nombre}</span>
                <div className="text-sm text-pink-500">
                  <div>{user.celular}</div>
                  <div>{user.email}</div> {/* ✅ AHORA SE MUESTRA EMAIL */}
                </div>
              </div>

              <div className="ml-4 flex items-center space-x-2">
                <button
                  onClick={() => handleEdit(user)}
                  title="Editar usuario"
                  className="p-2 rounded-full hover:bg-pink-50 transition"
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleDelete(user.id)}
                  title="Eliminar usuario"
                  className="p-2 rounded-full hover:bg-pink-50 transition"
                >
                  🗑️
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
