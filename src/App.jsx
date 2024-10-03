import './App.css';
import MainPage from "./Pages/MainPage";
import appFirebase from "../src/credenciales";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Importa Router, Route y Routes
import React, { Suspense, useState, useEffect } from 'react'; // Importa Suspense para el Lazy Loading

// Obtiene la autenticación mediante las credenciales
const auth = getAuth(appFirebase);

// Importación diferida (Lazy Loading) de los componentes
const Home = React.lazy(() => import('../src/Components/Home'));
const Login = React.lazy(() => import('../src/Components/Login'));
const Register = React.lazy(() => import('./Components/Register'));

function App() {
  const [usuario, setUsuario] = useState(null);

  // Escuchar cambios en el estado de autenticación
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (usuarioFirebase) => {
      if (usuarioFirebase) {
        console.log("Usuario loggeado exitosamente :3");
        setUsuario(usuarioFirebase);
      } else {
        console.log("Usuario no fue loggeado :c");
        setUsuario(null);
      }
    });

    // Limpiar la suscripción
    return () => unsubscribe();
  }, []);

  return (
    <Router basename="/alzhividaWeb">
      {/* Suspense muestra un "loading" mientras se cargan componentes diferidos */}
      <Suspense fallback={<div>Cargando...</div>}>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/login" element={<Login />} /> 
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={usuario ? <Home correoUsuario={usuario.email} /> : <Login />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
