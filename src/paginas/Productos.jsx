import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { db, storage } from "../lib/firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  deleteDoc,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export function Productos() {
  const [imagen, setImagen] = useState(null);
  const [nombre, setNombre] = useState("");
  const [categoria, setCategoria] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [subiendo, setSubiendo] = useState(false);
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState(""); // 🔍 Nuevo estado para la búsqueda

  const [editando, setEditando] = useState(null);
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [nuevaCategoria, setNuevaCategoria] = useState("");
  const [nuevaCantidad, setNuevaCantidad] = useState("");
  const [nuevaImagen, setNuevaImagen] = useState(null);
  const [guardando, setGuardando] = useState(false);

  const [notificacion, setNotificacion] = useState({ mensaje: "", tipo: "" });

  // 🔄 Escuchar productos
  useEffect(() => {
    const q = query(collection(db, "productos"), orderBy("fecha", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const lista = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setProductos(lista);
    });
    return () => unsubscribe();
  }, []);

  // 📦 Subir producto
  const subirProducto = async () => {
    if (!imagen || !nombre || !categoria || !cantidad)
      return mostrarNotificacion("⚠️ Completa todos los campos", "error");

    setSubiendo(true);
    try {
      const imagenRef = ref(Storage, `Imagenes/${imagen.name}`);
      await uploadBytes(imagenRef, imagen);
      const urlDescarga = await getDownloadURL(imagenRef);

      await addDoc(collection(db, "productos"), {
        nombre,
        categoria,
        cantidad: Number(cantidad),
        imagenUrl: urlDescarga,
        fecha: serverTimestamp(),
      });

      setNombre("");
      setCategoria("");
      setCantidad("");
      setImagen(null);
      mostrarNotificacion("Producto agregado con éxito", "exito");
    } catch (error) {
      console.error("Error al subir:", error);
      mostrarNotificacion("Error al subir el producto", "error");
    } finally {
      setSubiendo(false);
    }
  };

  // 🗑️ Eliminar producto
  const eliminarProducto = async (id) => {
    if (confirm("¿Seguro que deseas eliminar este producto?")) {
      await deleteDoc(doc(db, "productos", id));
      mostrarNotificacion("Producto eliminado", "eliminar");
    }
  };

  // ✏️ Guardar cambios
  const guardarCambios = async (id) => {
    if (!nuevoNombre || !nuevaCategoria || !nuevaCantidad)
      return mostrarNotificacion("Completa todos los campos", "error");

    setGuardando(true);
    let nuevaUrl = null;

    try {
      if (nuevaImagen) {
        const imagenRef = ref(Storage, `Imagenes/${nuevaImagen.name}`);
        await uploadBytes(imagenRef, nuevaImagen);
        nuevaUrl = await getDownloadURL(imagenRef);
      }

      await updateDoc(doc(db, "productos", id), {
        nombre: nuevoNombre,
        categoria: nuevaCategoria,
        cantidad: Number(nuevaCantidad),
        ...(nuevaUrl && { imagenUrl: nuevaUrl }),
      });

      setEditando(null);
      setNuevaImagen(null);
      mostrarNotificacion("Cambios guardados con éxito", "exito");
    } catch (error) {
      console.error("Error al guardar:", error);
      mostrarNotificacion("Error al guardar los cambios", "error");
    } finally {
      setGuardando(false);
    }
  };

  // 🌈 Notificación
  const mostrarNotificacion = (mensaje, tipo) => {
    setNotificacion({ mensaje, tipo });
    setTimeout(() => setNotificacion({ mensaje: "", tipo: "" }), 2500);
  };

  // 🎨 Colores notificación
  const estilos = {
    exito: { color: "bg-green-500", icono: "✅" },
    eliminar: { color: "bg-red-500", icono: "🗑️" },
    error: { color: "bg-yellow-500", icono: "⚠️" },
  };

  // 🔎 Filtrar productos según búsqueda
  const productosFiltrados = productos.filter(
    (p) =>
      p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.categoria.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-pink-50 p-6 relative">
      <h1 className="text-3xl font-bold text-center text-pink-600 mb-8">
        🌸 Agregar y Administrar Productos
      </h1>

      {/* 🔍 Barra de búsqueda */}
      <div className="max-w-md mx-auto mb-8 flex items-center bg-white shadow-md rounded-full overflow-hidden border border-pink-200">
        <input
          type="text"
          placeholder="🔍 Buscar producto o categoría..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full p-3 outline-none text-gray-700"
        />
        <button
          className="bg-pink-500 text-white px-5 py-3 hover:bg-pink-600 transition"
          onClick={() => setBusqueda(busqueda.trim())}
        >
          Buscar
        </button>
      </div>

      {/* 🌈 Notificación */}
      <AnimatePresence>
        {notificacion.mensaje && (
          <motion.div
            initial={{ opacity: 0, y: -30, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.8 }}
            className={`fixed top-5 left-1/2 transform -translate-x-1/2 text-white px-6 py-3 rounded-full shadow-lg z-50 flex items-center gap-2 ${estilos[notificacion.tipo].color}`}
          >
            <span className="text-2xl">{estilos[notificacion.tipo].icono}</span>
            <span className="font-medium">{notificacion.mensaje}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🌷 Formulario */}
      <div
        className="bg-white rounded-2xl shadow-lg p-6 max-w-md mx-auto mb-10"
        onKeyDown={(e) => e.key === "Enter" && subirProducto()}
      >
        <h2 className="text-xl font-semibold text-center text-gray-700 mb-4">
          Agregar nuevo producto
        </h2>
        <input
          type="text"
          placeholder="Nombre del producto"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="w-full mb-3 p-2 border rounded-md"
        />
        <input
          type="text"
          placeholder="Categoría"
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          className="w-full mb-3 p-2 border rounded-md"
        />
        <input
          type="number"
          placeholder="Cantidad"
          value={cantidad}
          onChange={(e) => setCantidad(e.target.value)}
          className="w-full mb-3 p-2 border rounded-md"
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImagen(e.target.files[0])}
          className="w-full mb-4"
        />
        <button
          onClick={subirProducto}
          disabled={subiendo}
          className="w-full bg-pink-500 hover:bg-pink-600 text-white py-2 rounded-md"
        >
          {subiendo ? "Subiendo..." : "🌸 Subir producto"}
        </button>
      </div>

      {/* 🛍️ Lista filtrada */}
      {productosFiltrados.length === 0 ? (
        <p className="text-center text-gray-500">
          No se encontraron productos que coincidan 😢
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {productosFiltrados.map((producto) => (
            <div
              key={producto.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-pink-200 transition transform hover:-translate-y-1"
            >
              <img
                src={producto.imagenUrl}
                alt={producto.nombre}
                className="w-full h-56 object-cover"
              />
              <div className="p-4 text-center">
                {editando === producto.id ? (
                  <>
                    <input
                      type="text"
                      value={nuevoNombre}
                      onChange={(e) => setNuevoNombre(e.target.value)}
                      className="w-full p-1 border rounded-md mb-2"
                    />
                    <input
                      type="text"
                      value={nuevaCategoria}
                      onChange={(e) => setNuevaCategoria(e.target.value)}
                      className="w-full p-1 border rounded-md mb-2"
                    />
                    <input
                      type="number"
                      value={nuevaCantidad}
                      onChange={(e) => setNuevaCantidad(e.target.value)}
                      className="w-full p-1 border rounded-md mb-2"
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setNuevaImagen(e.target.files[0])}
                      className="w-full mb-3 border p-1 rounded-md"
                    />
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => guardarCambios(producto.id)}
                        disabled={guardando}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md"
                      >
                        {guardando ? "Guardando..." : "Guardar"}
                      </button>
                      <button
                        onClick={() => setEditando(null)}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-3 py-1 rounded-md"
                      >
                        Cancelar
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <h2 className="text-lg font-bold text-gray-800">
                      {producto.nombre}
                    </h2>
                    <p className="text-pink-500 font-medium">
                      {producto.categoria}
                    </p>
                    <p className="text-gray-600 text-sm mt-1">
                      Cantidad:{" "}
                      <span className="font-semibold">
                        {producto.cantidad}
                      </span>
                    </p>
                    <div className="flex justify-center gap-3 mt-4">
                      <button
                        onClick={() => {
                          setEditando(producto.id);
                          setNuevoNombre(producto.nombre);
                          setNuevaCategoria(producto.categoria);
                          setNuevaCantidad(producto.cantidad);
                        }}
                        className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded-md"
                      >
                        ✏️ Editar
                      </button>
                      <button
                        onClick={() => eliminarProducto(producto.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md"
                      >
                        🗑️ Eliminar
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
