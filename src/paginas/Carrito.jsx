import React, { useState } from "react";
import { useCarrito } from "./CarritoContext";
import { Trash2, ShoppingBag, CheckCircle2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Carrito() {
  const { carrito, actualizarCantidad, eliminarProducto, vaciarCarrito } = useCarrito();

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [compraFinalizada, setCompraFinalizada] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    nombre: "",
    celular: "",
    direccion: "",
    metodoPago: "efectivo",
    detalles: "",
  });

  const totalCarrito = carrito.reduce(
    (acc, item) => acc + (item.precio || 0) * (item.cantidad || 0),
    0
  );

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleFinalizar = (e) => {
    e.preventDefault();

    if (!formData.nombre || !formData.celular || !formData.direccion) {
      setError("Por favor, completa todos los campos obligatorios 💗");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setCompraFinalizada(true);
      vaciarCarrito();
      setFormData({
        nombre: "",
        celular: "",
        direccion: "",
        metodoPago: "efectivo",
        detalles: "",
      });

      setTimeout(() => {
        setCompraFinalizada(false);
        setMostrarFormulario(false);
      }, 4000);
    }, 1500);
  };

  if (carrito.length === 0 && !compraFinalizada) {
    return (
      <div className="min-h-screen bg-pink-50 flex flex-col items-center justify-center text-center p-6">
        <ShoppingBag size={70} className="text-pink-400 mb-4 animate-bounce" />
        <h2 className="text-3xl font-bold text-pink-700">Tu carrito está vacío 💖</h2>
        <p className="text-pink-500 mt-2 text-lg">Agrega productos para comenzar tus compras.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pink-50 p-6 flex flex-col items-center justify-center">
      <AnimatePresence>
        {compraFinalizada ? (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-white rounded-3xl shadow-lg p-10 text-center border border-pink-200"
          >
            <CheckCircle2 size={90} className="text-pink-500 mx-auto mb-4 animate-bounce" />
            <h2 className="text-3xl font-bold text-pink-600 mb-2">¡Gracias por tu compra! 💞</h2>
            <p className="text-pink-400 text-lg">
              Tus productos llegarán pronto con mucho amor 🌷
            </p>
          </motion.div>
        ) : mostrarFormulario ? (
          // 🌸 FORMULARIO PROFESIONAL
          <motion.form
            onSubmit={handleFinalizar}
            onKeyDown={(e) => e.key === "Enter" && handleFinalizar(e)}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white max-w-lg w-full rounded-2xl shadow-lg p-8 border border-pink-100 space-y-5"
          >
            <h2 className="text-2xl font-bold text-pink-700 text-center mb-4">
              💌 Completa tus datos para finalizar
            </h2>

            {error && (
              <div className="flex items-center gap-2 bg-pink-100 text-pink-600 p-3 rounded-xl">
                <AlertCircle size={20} /> <span>{error}</span>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-pink-600">Nombre completo *</label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  className="w-full border border-pink-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-pink-300 mt-1"
                  placeholder="Ej: Camila López"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-pink-600">Celular *</label>
                <input
                  type="tel"
                  name="celular"
                  value={formData.celular}
                  onChange={handleChange}
                  className="w-full border border-pink-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-pink-300 mt-1"
                  placeholder="Ej: 987654321"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-pink-600">Dirección *</label>
                <input
                  type="text"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleChange}
                  className="w-full border border-pink-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-pink-300 mt-1"
                  placeholder="Ej: Calle Los Rosales 123, Lima"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-pink-600">Método de pago *</label>
                <select
                  name="metodoPago"
                  value={formData.metodoPago}
                  onChange={handleChange}
                  className="w-full border border-pink-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-pink-300 mt-1"
                >
                  <option value="efectivo">Efectivo</option>
                  <option value="tarjeta">Tarjeta</option>
                  <option value="yape">Yape / Plin</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-semibold text-pink-600">Detalles del pedido</label>
                <textarea
                  name="detalles"
                  value={formData.detalles}
                  onChange={handleChange}
                  rows={3}
                  className="w-full border border-pink-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-pink-300 mt-1"
                  placeholder="Ej: Entregar antes del mediodía 💬"
                ></textarea>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full font-semibold py-3 rounded-xl transition shadow-md ${
                loading
                  ? "bg-pink-300 text-white cursor-not-allowed"
                  : "bg-pink-500 hover:bg-pink-600 text-white"
              }`}
            >
              {loading ? "Procesando pedido..." : "Confirmar pedido 💞"}
            </button>

            <button
              type="button"
              onClick={() => setMostrarFormulario(false)}
              className="w-full mt-3 text-pink-500 hover:text-pink-700 font-semibold"
            >
              ← Volver al carrito
            </button>
          </motion.form>
        ) : (
          // 🛍️ CARRITO NORMAL
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl w-full bg-white rounded-2xl shadow-md p-6 border border-pink-100"
          >
            <h2 className="text-3xl font-bold text-pink-700 mb-6 text-center">
              🛍️ Tu carrito de compras
            </h2>

            <ul className="space-y-6">
              {carrito.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between bg-pink-100/60 rounded-xl p-4 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-4">
                    
                   <img
  src={item.imagenUrl} // ✅ usar la propiedad correcta
  alt={item.nombre}
  className="w-16 h-16 object-cover rounded-lg border border-pink-200"
/>





                    <div>
                      <h3 className="text-lg font-semibold text-pink-700">
                        {item.nombre}
                      </h3>
                      <p className="text-pink-500">
                        S/ {item.precio?.toFixed(2) || "0.00"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => actualizarCantidad(item.id, item.cantidad - 1)}
                      className="bg-pink-300 text-white px-2 rounded-full hover:bg-pink-400 transition"
                    >
                      −
                    </button>
                    <span className="font-semibold text-pink-700">{item.cantidad}</span>
                    <button
                      onClick={() => actualizarCantidad(item.id, item.cantidad + 1)}
                      className="bg-pink-300 text-white px-2 rounded-full hover:bg-pink-400 transition"
                    >
                      +
                    </button>
                  </div>

                  <div className="flex items-center gap-6">
                    <p className="font-semibold text-pink-700">
                      S/ {(item.precio * item.cantidad).toFixed(2)}
                    </p>
                    <button
                      onClick={() => eliminarProducto(item.id)}
                      className="text-pink-500 hover:text-pink-700 transition"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-8 border-t border-pink-200 pt-6 flex justify-between items-center">
              <button
                onClick={vaciarCarrito}
                className="text-pink-600 font-semibold hover:text-pink-800 transition"
              >
                Vaciar carrito 🗑️
              </button>
              <h3 className="text-xl font-bold text-pink-800">
                Total: S/ {totalCarrito.toFixed(2)}
              </h3>
            </div>

            <button
              onClick={() => setMostrarFormulario(true)}
              className="mt-6 w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 rounded-xl shadow-md transition"
            >
              Finalizar compra 💞
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
