import { useState, useEffect } from "react";
import './App.css'
import { db } from './lib/firebase.js'
import { collection, onSnapshot ,query, addDoc, deleteDoc, doc } from 'firebase/firestore'

function App() {
  const [post, setPost] = useState([])
  const [texto, setTexto] = useState("")
  const [error, setError] = useState("") // ⚠️ estado para mensaje de advertencia

  useEffect(() => {
    const consulta = query(collection(db, "post"));
    const unsubscribe = onSnapshot(consulta, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPost(docs);
    });
    return () => unsubscribe()
  }, [])

  // Agregar nuevo post
  const agregarPost = async () => {
    if (texto.trim() === "") {
      setError("⚠️ Por favor escribe un mensaje antes de enviarlo.");
      return;
    }

    await addDoc(collection(db, "post"), {
      mensaje: texto,
      createAt: new Date(),
    });

    setTexto("");
    setError(""); 
  }

  // Eliminar post
  const eliminarPost = async (id) => {
    await deleteDoc(doc(db, "post", id));
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-pink-100 via-purple-100 to-blue-100 flex flex-col items-center py-10 px-4">
      <h1 className="text-4xl font-bold text-purple-700 mb-6 drop-shadow-sm">
        🌷 Lista de Posts 🌷
      </h1>

      {/* Input para escribir mensaje */}
      <div className="flex flex-col items-center gap-3 mb-8 bg-white p-4 rounded-2xl shadow-md border border-purple-200">
        <div className="flex items-center gap-3">
          <input 
            className="border border-purple-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-purple-300 focus:outline-none w-64"
            type="text" 
            placeholder="Escribe un nuevo post 💭"
            value={texto} 
            onChange={(e) => setTexto(e.target.value)} 
            onKeyDown={(e) => e.key === "Enter" && agregarPost()}
          />
          <button
            className="bg-linear-to-r from-pink-400 to-purple-400 text-white px-4 py-2 rounded-xl shadow-md hover:scale-105 transform transition duration-300"
            onClick={agregarPost}>
            Guardar 💌
          </button>
        </div>

        {/* ⚠️ mensaje de error */}
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
            className="bg-white border border-purple-200 rounded-2xl p-4 shadow-sm hover:shadow-lg transition duration-300 flex justify-between items-center"
          >
            <div>
              <h2 className="text-lg font-semibold text-purple-700 mb-1">{doc.mensaje}</h2>
              <p className="text-sm text-gray-500 italic">{doc.autor || "Anónimo 🌸"}</p>
            </div>

            {/* 🗑️ Botón eliminar */}
            <button 
              onClick={() => eliminarPost(doc.id)}
              className="bg-red-400 hover:bg-red-500 text-white px-3 py-1 rounded-xl shadow-md transition duration-300"
            >
              Eliminar 🗑️
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App