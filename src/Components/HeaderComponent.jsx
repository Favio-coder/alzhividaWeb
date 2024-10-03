// src/Components/Header.jsx
import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa'; // Importar iconos de react-icons
import './Styles/HeaderComponent.css';

const HeaderComponent = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleNavbar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>
            {/* Capa gris semitransparente */}
            <div className={`overlay ${isOpen ? 'show' : ''}`} onClick={toggleNavbar}></div>
            <header className="bg-white fixed-top shadow header"> {/* Añadir clase 'header' */}
                <div className="container">
                    <nav className="navbar navbar-expand-lg navbar-light">
                        <Link
                            className="navbar-brand mx-auto navbar-link-custom"
                            to="/"
                        >
                            Alzhivida
                        </Link>

                        <button
                            className="navbar-toggler"
                            type="button"
                            onClick={toggleNavbar}
                            aria-controls="navbarNav"
                            aria-expanded={isOpen}
                            aria-label="Toggle navigation"
                        >
                            {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />} {/* Cambiar icono */}
                        </button>
                        <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`} id="navbarNav">
                            <ul className="navbar-nav ms-auto">
                                <li className="nav-item">
                                    <Link to="/" className="nav-link">Inicio</Link>
                                </li>
                                
                                
                                <li className="nav-item">
                                    <Link to="/home" className="nav-link">Home</Link>
                                </li>
                            </ul>
                            <div className="ms-auto d-flex flex-column flex-lg-row">
                                <Link to="/login" className="btn btn-outline-primary mb-1 mb-lg-0" style={{ marginBottom: '5px' , marginRight: '5px'}}>
                                    Iniciar sesión
                                </Link>
                                <Link to="/register" className="btn btn-outline-primary">
                                    Crear Nueva Cuenta
                                </Link>
                            </div>


                        </div>
                    </nav>
                </div>
            </header>
        </>
    );
}

export default HeaderComponent;
