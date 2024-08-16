// ../../components/new-section/NewSection.js
import React from 'react';
import './NewSection.css';

// Importa las imágenes
import coleccionHombre from '../../assets/images/carpeta_pruebas/prueba8.jpg';
import coleccionMujer from '../../assets/images/carpeta_pruebas/coleccion_para_mujer.jpg';

const NewSection = () => {
  return (
    <div className="new-section">
      <div className="image-container">
        <img src={coleccionHombre} alt="Colección Hombre 2024" />
        <div className="button-overlay">
          <button className="collection-button">COLECCIÓN HOMBRE</button>
        </div>
      </div>
      <div className="image-container">
        <img src={coleccionMujer} alt="Colección Mujer 2024" />
        <div className="button-overlay">
          <button className="collection-button">COLECCIÓN MUJER</button>
        </div>
      </div>
    </div>
  );
};

export default NewSection;
