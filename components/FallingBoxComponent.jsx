import React, { useState } from 'react';

// Estilos CSS en una constante
const styles = {
  container: {
    position: 'relative',
    width: '300px',
    height: '200px',
    border: '1px solid #ccc',
    overflow: 'hidden',
    margin: '50px',
  },
  fallingBox: {
    position: 'absolute',
    top: '0',
    left: '50px', // Inicia desde una ubicación X específica
    width: '200px',
    height: 'auto',
    backgroundColor: 'lightblue',
    clipPath: 'inset(0 0 100% 0)', // Oculta el contenido al inicio
    transition: 'clip-path 0.1s ease-out', // Ajuste para un efecto más rápido
  },
  fallingBoxShow: {
    clipPath: 'inset(0 0 0 0)', // Muestra el contenido
  },
  button: {
    margin: '20px',
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer',
  }
};

const FallingBoxComponent = () => {
  const [showBox, setShowBox] = useState(false);

  const handleButtonClick = () => {
    setShowBox(prevShowBox => !prevShowBox); // Alterna entre mostrar y ocultar la caja
  };

  return (
    <div>
      <div style={styles.container}>
        <div
          style={{
            ...styles.fallingBox,
            ...(showBox ? styles.fallingBoxShow : {})
          }}
        >
          <p>Contenido que aparece con efecto de caja cayendo.</p>
        </div>
      </div>
      <button style={styles.button} onClick={handleButtonClick}>
        {showBox ? 'Cerrar Caja' : 'Mostrar Caja'}
      </button>
    </div>
  );
};

export default FallingBoxComponent;
