import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function Inicio() {
  const [particles, setParticles] = useState([]);

  // ✨ Generar partículas decorativas del fondo
  useEffect(() => {
    const generated = Array.from({ length: 25 }).map(() => ({
      id: Math.random(),
      left: Math.random() * 100,
      size: 4 + Math.random() * 10,
      duration: 6 + Math.random() * 4,
      delay: Math.random() * 5,
      type: Math.random() > 0.7 ? "glow" : "soft",
    }));
    setParticles(generated);
  }, []);

  return (
    <div className="relative min-h-[calc(100vh-80px)] overflow-hidden bg-gradient-to-br from-rose-100 via-pink-50 to-purple-100 flex flex-col items-center justify-center text-center px-6 pt-24">
      {/* ✨ Fondo animado */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ y: "100vh", opacity: 0 }}
            animate={{ y: "-10vh", opacity: [0, 0.8, 0] }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className={`absolute rounded-full ${
              p.type === "glow"
                ? "bg-white/70 blur-[2px] shadow-[0_0_8px_#fff8]"
                : "bg-pink-300/30 blur-md"
            }`}
            style={{
              left: `${p.left}%`,
              width: p.size,
              height: p.size,
            }}
          />
        ))}
      </div>

      {/* 🌸 Hero principal (centrado y elegante) */}
      <div className="max-w-3xl space-y-6 z-10 flex flex-col items-center justify-center mt-[-1rem]">
        {/* 🌷 Título con flores giratorias a los costados */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="flex items-center justify-center gap-4 text-5xl md:text-6xl font-extrabold text-pink-600 drop-shadow-sm"
        >
          <RotatingFlower />
          Bienvenid@ a tu espacio seguro
          <RotatingFlower reverse />
        </motion.h1>

        {/* ✨ Subtítulo */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl"
        >
          Un rincón digital hecho con amor, donde puedes compartir, crear y
          brillar. Todo en un ambiente delicado, moderno y lleno de encanto 💌
        </motion.p>

        {/* 💗 Botones */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.6 }}
          className="flex flex-wrap gap-4 justify-center mt-8"
        >
          <a
            href="/post"
            className="bg-pink-500 hover:bg-pink-600 text-white font-semibold px-8 py-3 rounded-full shadow-md transition-transform duration-300 hover:scale-105"
          >
            Escribir un Post 💭
          </a>

          <a
            href="/productos"
            className="bg-white border-2 border-pink-300 text-pink-600 font-semibold px-8 py-3 rounded-full shadow-sm hover:bg-pink-50 transition-transform duration-300 hover:scale-105"
          >
            Ver Productos 🛍️
          </a>
        </motion.div>
      </div>

      {/* 🌼 Sección “Sobre este espacio” */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className="mt-28 mb-20 bg-white/70 backdrop-blur-sm border border-pink-200 rounded-3xl p-8 md:p-12 shadow-md max-w-4xl z-10"
      >
        <h2 className="text-3xl font-bold text-pink-600 mb-4 text-center">
          🌼 Sobre este espacio
        </h2>
        <p className="text-gray-700 text-lg leading-relaxed">
          Aquí podrás compartir tus pensamientos, publicar tus ideas o descubrir
          productos adorables hechos con cariño.  
          Este espacio está diseñado para inspirarte y recordarte lo hermoso de ser tú misma ✨
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          <Feature
            emoji="🪞"
            title="Exprésate"
            desc="Publica tus ideas y pensamientos en un entorno que refleja tu estilo y creatividad."
          />
          <Feature
            emoji="🎀"
            title="Descubre"
            desc="Explora productos únicos y encantadores que combinan estética y dulzura."
          />
          <Feature
            emoji="💌"
            title="Conecta"
            desc="Forma parte de una comunidad rosita que comparte tus gustos y energía positiva."
          />
        </div>
      </motion.section>

      {/* 🌈 Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 1 }}
        className="mt-10 mb-6 text-sm text-pink-500 z-10"
      >
        Hecho con 💗 por <span className="font-medium text-pink-600">Camila</span>
      </motion.footer>
    </div>
  );
}

// 🌸 Flor giratoria
function RotatingFlower({ reverse = false }) {
  return (
    <motion.span
      initial={{ scale: 1, opacity: 1 }}
      animate={{
        rotate: reverse ? -360 : 360,
        scale: [1, 1.1, 1],
        opacity: [0.9, 1, 0.9],
      }}
      transition={{
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className="text-5xl md:text-6xl text-pink-400 drop-shadow-[0_0_10px_rgba(255,192,203,0.8)]"
      style={{
        filter: "drop-shadow(0 0 8px rgba(255,182,193,0.9))",
      }}
    >
      🌸
    </motion.span>
  );
}

// 💎 Tarjeta de feature
function Feature({ emoji, title, desc }) {
  return (
    <div className="flex flex-col items-center text-center space-y-3">
      <div className="text-4xl">{emoji}</div>
      <h3 className="text-xl font-semibold text-pink-600">{title}</h3>
      <p className="text-gray-600">{desc}</p>
    </div>
  );
}
