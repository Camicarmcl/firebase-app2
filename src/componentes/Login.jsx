import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import confetti from "canvas-confetti";
import { motion } from "framer-motion";

export default function Login() {
  const { login, resetPassword } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMensaje("");

    try {
      const userCred = await login(email, password);

      // 🎉 Confeti al iniciar sesión correctamente
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#ffafcc", "#ffc8dd", "#ffcad4"],
      });

      // Navegar a home después de 1s
      setTimeout(() => {
        navigate("/"); // El Navbar actualizará el nombre y la foto automáticamente
      }, 1000);
    } catch (err) {
      console.error(err);
      setError("❌ Usuario o contraseña incorrectos");
    }
  };

  const handleResetPassword = async () => {
    setError("");
    setMensaje("");
    if (!email) return setError("⚠ Escribe tu correo para recuperar.");
    try {
      await resetPassword(email);
      setMensaje("📩 ¡Revisa tu correo para restablecer la contraseña!");
    } catch (err) {
      console.error(err);
      setError("Hubo un error al enviar el correo.");
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
        {/* 🌸 Título */}
        <h1 className="text-4xl font-bold mb-6 text-center text-pink-600 drop-shadow-sm">
          🌷 Iniciar Sesión 🌷
        </h1>

        {/* Mensajes de error o éxito */}
        {error && (
          <p className="mb-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl p-3">
            {error}
          </p>
        )}
        {mensaje && (
          <p className="mb-3 text-sm text-green-700 bg-green-50 border border-green-200 rounded-xl p-3">
            {mensaje}
          </p>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-pink-700 mb-1">
              Correo electrónico
            </label>
            <input
              type="email"
              className="w-full border border-pink-300 rounded-xl px-4 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tucorreo@ejemplo.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-pink-700 mb-1">
              Contraseña
            </label>
            <input
              type="password"
              className="w-full border border-pink-300 rounded-xl px-4 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Tu contraseña"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2.5 rounded-xl transition-all shadow-lg"
          >
            Iniciar Sesión 💖
          </button>
        </form>

        {/* Recuperar contraseña */}
        <div className="mt-5 text-right">
          <button
            onClick={handleResetPassword}
            className="text-sm text-pink-600 hover:text-pink-700 hover:underline transition"
          >
            ¿Olvidaste tu contraseña?
          </button>
        </div>

        {/* Registro */}
        <p className="text-center mt-6 text-sm">
          ¿No tienes cuenta?{" "}
          <Link to="/registro" className="text-pink-600 font-semibold hover:underline">
            Crear cuenta
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
