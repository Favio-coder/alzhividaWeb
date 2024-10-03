import './App.css';
import MainPage from "./Pages/MainPage";
import appFirebase from "../src/credenciales";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Importa Router, Route y Routes

// Obtiene la autenticación mediante las credenciales
const auth = getAuth(appFirebase);

// Obtener otros módulos
import Home from "../src/Components/Home";
import Login from "../src/Components/Login";
import { useState, useEffect } from 'react';
import Register from './Components/Register';

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
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<Login />} /> 
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={usuario ? <Home correoUsuario={usuario.email} /> : <Login />} />
      </Routes>
    </Router>
  );
}

export default App;
