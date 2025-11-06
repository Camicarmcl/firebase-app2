import { useState, useEffect } from "react";
import { db } from "../lib/firebase.js";

import {collection,
  onSnapshot,
  query,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

function Post() {
  const [post, setPost] = useState([]);
  const [texto, setTexto] = useState("");
  const [autor, setAutor] = useState("");
  const [error, setError] = useState("");
  const [editandoId, setEditandoId] = useState(null);
  const [nuevoTexto, setNuevoTexto] = useState("");
  const [nuevoAutor, setNuevoAutor] = useState("");

  useEffect(() => {
    const consulta = query(collection(db, "post"));
    const unsubscribe = onSnapshot(consulta, (snapshot) => {
      const docs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPost(docs);
    });
    return () => unsubscribe();
  }, []);

  const agregarPost = async () => {
    if (texto.trim() === "") {
      setError("⚠️ Por favor escribe un mensaje antes de enviarlo.");
      return;
    }

    await addDoc(collection(db, "post"), {
      mensaje: texto,
      autor: autor.trim() === "" ? "Anónimo 🌸" : autor,
      createAt: new Date(),
    });

    setTexto("");
    setAutor("");
    setError("");
  };

  const eliminarPost = async (id) => {
    await deleteDoc(doc(db, "post", id));
  };

  const editarPost = (id, mensajeActual, autorActual) => {
    setEditandoId(id);
    setNuevoTexto(mensajeActual);
    setNuevoAutor(autorActual === "Anónimo 🌸" ? "" : autorActual);
  };

  const actualizarPost = async (id) => {
    if (nuevoTexto.trim() === "") {
      alert("El texto no puede estar vacío 💭");
      return;
    }
    const ref = doc(db, "post", id);
    await updateDoc(ref, {
      mensaje: nuevoTexto,
      autor: nuevoAutor.trim() === "" ? "Anónimo 🌸" : nuevoAutor,
    });
    setEditandoId(null);
    setNuevoTexto("");
    setNuevoAutor("");
  };

  const manejarEnter = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      agregarPost();
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-pink-100 via-purple-100 to-blue-100 flex flex-col items-center py-10 px-4">
      <h1 className="text-4xl font-bold text-purple-700 mb-6 drop-shadow-sm">
        🌷 Lista de Posts 🌷
      </h1>

      <div className="flex flex-col items-center gap-3 mb-8 bg-white p-5 rounded-2xl shadow-md border border-purple-200">
        <input
          className="border border-purple-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-purple-300 focus:outline-none w-64"
          type="text"
          placeholder="Escribe un nuevo post 💭"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && agregarPost()}
        />
        <input
          className="border border-pink-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-pink-300 focus:outline-none w-64"
          type="text"
          placeholder="Tu nombre (opcional) 🌸"
          value={autor}
          onChange={(e) => setAutor(e.target.value)}
          onKeyDown={manejarEnter}
        />

        <button
          className="bg-linear-to-r from-pink-400 to-purple-400 text-white px-6 py-2 rounded-xl shadow-md hover:scale-105 transform transition duration-300"
          onClick={agregarPost}
        >
          Guardar 💌
        </button>

        {error && (
          <div className="text-red-500 text-sm font-medium mt-2 bg-red-50 border border-red-200 px-3 py-1 rounded-xl">
            {error}
          </div>
        )}
      </div>

      <ul className="w-full max-w-md space-y-4">
        {post.map((doc) => (
          <li
            key={doc.id}
            className="bg-white border border-purple-200 rounded-2xl p-4 shadow-sm hover:shadow-lg transition duration-300 flex flex-col gap-3"
          >
            {editandoId === doc.id ? (
              <div className="flex flex-col gap-2">
                <input
                  className="border border-pink-300 rounded-xl px-3 py-1 focus:ring-2 focus:ring-pink-300 flex-1"
                  value={nuevoTexto}
                  onChange={(e) => setNuevoTexto(e.target.value)}
                  placeholder="Edita tu mensaje 💭"
                />
                <input
                  className="border border-purple-300 rounded-xl px-3 py-1 focus:ring-2 focus:ring-purple-300 flex-1"
                  value={nuevoAutor}
                  onChange={(e) => setNuevoAutor(e.target.value)}
                  placeholder="Edita el autor (opcional) 🌸"
                />
                <div className="flex gap-2 justify-end mt-2">
                  <button
                    onClick={() => actualizarPost(doc.id)}
                    className="bg-linear-to-r from-green-400 to-emerald-400 text-white px-3 py-1 rounded-xl shadow-md hover:scale-105 transition duration-300"
                  >
                    ✔️
                  </button>
                  <button
                    onClick={() => setEditandoId(null)}
                    className="bg-gray-300 text-gray-700 px-3 py-1 rounded-xl shadow-md hover:bg-gray-400 transition duration-300"
                  >
                    ✖️
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-semibold text-purple-700 mb-1">
                    {doc.mensaje}
                  </h2>
                  <p className="text-sm text-gray-500 italic">
                    {doc.autor || "Anónimo 🌸"}
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => editarPost(doc.id, doc.mensaje, doc.autor)}
                    className="bg-yellow-300 text-yellow-800 px-3 py-2 rounded-full shadow hover:scale-110 hover:bg-yellow-400 transition duration-300"
                    title="Editar"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => eliminarPost(doc.id)}
                    className="bg-red-400 text-white px-3 py-2 rounded-full shadow hover:scale-110 hover:bg-red-500 transition duration-300"
                    title="Eliminar"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Post;
