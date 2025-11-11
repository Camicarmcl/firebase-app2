import { NavLink, useNavigate } from "react-router-dom";
import { Home, Users, FileText, ShoppingBag, LogIn, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { useCarrito } from "../paginas/CarritoContext.jsx";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { carrito } = useCarrito();
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  const totalProductos = carrito.reduce((acc, item) => acc + item.cantidad, 0);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="bg-pink-100/70 backdrop-blur-md border-b border-pink-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* LOGO */}
        <motion.h1
          className="text-3xl font-semibold text-pink-600 tracking-tight cursor-default"
          animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          🌸
        </motion.h1>

        <ul className="flex gap-6 text-pink-700 font-medium items-center">
          <NavItem to="/" icon={<Home size={18} />} label="Inicio" />
          <NavItem to="/usuarios" icon={<Users size={18} />} label="Usuarios" />
          <NavItem to="/post" icon={<FileText size={18} />} label="Post" />
          <NavItem to="/productos" icon={<ShoppingBag size={18} />} label="Productos" />

          {/* CARRITO */}
          <li className="relative">
            <NavLink
              to="/carrito"
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all ${isActive
                  ? "bg-pink-300 text-white shadow-sm"
                  : "hover:bg-pink-200 hover:text-pink-900"
                }`
              }
            >
              <ShoppingBag size={20} />
              <span>Carrito</span>
            </NavLink>

            {totalProductos > 0 && (
              <motion.span
                className="absolute -top-1 -right-2 bg-pink-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 1.2 }}
              >
                {totalProductos}
              </motion.span>
            )}
          </li>

          {/* USUARIO */}
          {usuario ? (
            <div className="flex items-center gap-3">

              {/* CARGA DEL USUARIO */}
              {usuario === null ? (
                <div className="w-9 h-9 rounded-full bg-pink-300 animate-pulse"></div>
              ) : usuario.photoURL ? (
                <img
                  src={usuario.photoURL}
                  alt="Foto Usuario"
                  className="w-9 h-9 rounded-full border-2 border-pink-300 object-cover"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-pink-400 text-white flex items-center justify-center font-bold">
                  {usuario.nombre?.charAt(0)?.toUpperCase() || "U"}
                </div>
              )}

              <span className="bg-white px-3 py-1.5 rounded-full text-pink-600 shadow-md text-sm font-medium">
                Hola, {usuario.nombre || usuario.email}
              </span>

              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-pink-300 text-white hover:bg-pink-400 transition shadow-sm"
              >
                <LogOut size={18} />
                <span>Salir</span>
              </button>
            </div>
          ) : (
            <NavLink
              to="/login"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-pink-300 text-pink-700 hover:bg-pink-200 transition shadow-sm"
            >
              <LogIn size={18} />
              <span>Iniciar sesión</span>
            </NavLink>
          )}
        </ul>
      </div>
    </nav>
  );
}

function NavItem({ to, icon, label }) {
  return (
    <li>
      <NavLink
        to={to}
        className={({ isActive }) =>
          `flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all ${
            isActive ? "bg-pink-300 text-white shadow-sm" : "hover:bg-pink-200 hover:text-pink-900"
          }`
        }
      >
        {icon}
        <span>{label}</span>
      </NavLink>
    </li>
  );
}
