import { Routes, Route } from "react-router-dom";
import Navbar from "./componentes/Navbar.jsx";
import { Inicio } from "./paginas/Inicio.jsx";
import Post from "./paginas/Post.jsx";
import { Usuario } from "./paginas/Usuario";
import { Productos } from "./paginas/Productos";
import  Carrito  from "./paginas/Carrito.jsx";
import  Login from "./componentes/Login.jsx";
import Registro from "./componentes/Registro.jsx";
function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/usuarios" element={<Usuario />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/post" element={<Post />} />
        <Route path="/carrito" element={<Carrito />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
      </Routes>
    </>
  );
}

export default App;
