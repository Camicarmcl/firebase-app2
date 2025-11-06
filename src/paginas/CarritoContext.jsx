import { createContext, useContext, useState } from "react";

const CarritoContext = createContext();

export function CarritoProvider({ children }) {
  const [carrito, setCarrito] = useState([]);

  // ✅ Agregar producto con cantidad personalizada
  const agregarAlCarrito = (producto) => {
    setCarrito((prev) => {
      const existe = prev.find((item) => item.id === producto.id);
      if (existe) {
        return prev.map((item) =>
          item.id === producto.id
            ? {
                ...item,
                cantidad: item.cantidad + producto.cantidad,
                total: (item.cantidad + producto.cantidad) * item.precio,
              }
            : item
        );
      } else {
        return [
          ...prev,
          { ...producto, total: producto.precio * producto.cantidad },
        ];
      }
    });
  };

  // 🌀 Actualizar cantidad
  const actualizarCantidad = (id, cantidad) => {
    if (cantidad < 1) return;
    setCarrito((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, cantidad, total: item.precio * cantidad }
          : item
      )
    );
  };

  // ❌ Eliminar un producto
  const eliminarProducto = (id) => {
    setCarrito((prev) => prev.filter((item) => item.id !== id));
  };

  // 🧺 Vaciar todo el carrito
  const vaciarCarrito = () => setCarrito([]);

  // 💵 Calcular total general
  const totalCarrito = carrito.reduce((sum, item) => sum + item.total, 0);

  return (
    <CarritoContext.Provider
      value={{
        carrito,
        agregarAlCarrito,
        actualizarCantidad,
        eliminarProducto,
        vaciarCarrito,
        totalCarrito,
      }}
    >
      {children}
    </CarritoContext.Provider>
  );
}

export function useCarrito() {
  return useContext(CarritoContext);
}
