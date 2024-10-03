// src/Pages/Login.jsx
import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './Styles/Login.css';
import appFirebase from "../credenciales"; 
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { Link, useNavigate } from 'react-router-dom';
import HeaderComponent from '../Components/HeaderComponent';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const auth = getAuth(appFirebase);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            await signInWithEmailAndPassword(auth, email, password);
            alert("Inicio de sesión exitoso!");
            navigate('/home');
        } catch (error) {
            // Manejo de errores más específico
            const errorCode = error.code;
            let errorMessage = "Error desconocido.";
            switch (errorCode) {
                case 'auth/invalid-email':
                    errorMessage = "El correo electrónico no es válido.";
                    break;
                case 'auth/user-disabled':
                    errorMessage = "Este usuario ha sido deshabilitado.";
                    break;
                case 'auth/user-not-found':
                    errorMessage = "No hay ningún usuario registrado con este correo.";
                    break;
                case 'auth/wrong-password':
                    errorMessage = "La contraseña es incorrecta.";
                    break;
                default:
                    errorMessage = error.message;
            }
            setError(errorMessage);
        }
    };

    return (
        <div>
            <HeaderComponent />
            <div className="login-container" style={{ marginTop: '70px', marginRight:'500PX'}}>
                <form className="w-100" onSubmit={handleLogin}>
                    <h2 className="text-center">Iniciar Sesión</h2>
                    {error && <div className="alert alert-danger">{error}</div>} {/* Mostrar mensaje de error */}
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Correo electrónico</label>
                        <input 
                            type="email" 
                            placeholder='Correo electrónico' 
                            className="form-control" 
                            id="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required 
                        />
                        <div id="emailHelp" className="form-text">Nunca compartiremos su correo electrónico con nadie más.</div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Contraseña</label>
                        <div className="input-group">
                            <input 
                                placeholder="Contraseña" 
                                type={showPassword ? "text" : "password"} 
                                className="form-control" 
                                id="password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required 
                            />
                            <button 
                                type="button" 
                                className="input-group-text" 
                                onClick={togglePasswordVisibility} 
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />} 
                            </button>
                        </div>
                    </div>
                    <div className="mb-3 form-check">
                        <input type="checkbox" className="form-check-input" id="rememberMe" />
                        <label className="form-check-label" htmlFor="rememberMe">Mantener la sesión iniciada</label>
                    </div>
                    <button type="submit" className="btn custom-btn w-100">Iniciar Sesión</button>
                    <Link className="nav-link active text-center mt-2" to="/register">Aún no tienes cuenta, crea una</Link>
                </form>
            </div>
        </div>
    );
}

export default Login;
