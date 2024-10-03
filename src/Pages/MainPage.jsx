// src/Pages/MainPage.jsx
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import HeaderComponent from '../Components/HeaderComponent'; // Asegúrate de que la ruta sea correcta

const MainPage = () => {
    return (
        <>
            <HeaderComponent /> {/* Agrega el Header aquí */}
            <div className="container" style={{ marginTop: '70px' }}> {/* Ajusta el margen según el tamaño de tu cabecera */}
                <h1>Pagina principal</h1>
                {/* Resto del contenido */}
            </div>
        </>
    );
}

export default MainPage;
