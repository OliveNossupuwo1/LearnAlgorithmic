import React from 'react';
import './CartoonVisualization.css';

const CartoonVisualization = ({ data }) => {
  const character = data.character || {};
  const boxes = data.boxes || [];
  const calculation = data.calculation;
  const display = data.display;

  return (
    <div className="cartoon-scene">
      {/* Character */}
      <div className={`character character-${character.position} character-${character.emotion}`}>
        <div className="character-body">
          <div className="robot-head">
            <div className="robot-antenna"></div>
            <div className="robot-eyes">
              <div className="robot-eye"></div>
              <div className="robot-eye"></div>
            </div>
            <div className="robot-mouth"></div>
          </div>
          <div className="robot-body"></div>
          <div className="robot-arms">
            <div className="robot-arm left"></div>
            <div className="robot-arm right"></div>
          </div>
        </div>
        
        {/* Valeur portée */}
        {character.carrying && (
          <div className="carrying-value">
            {character.carrying}
          </div>
        )}
        
        {/* Bulle de dialogue */}
        {character.speech && (
          <div className="speech-bubble">
            {character.speech}
          </div>
        )}
      </div>

      {/* Calcul en cours */}
      {calculation && (
        <div className="calculation-display">
          <span className="calc-number">{calculation.left}</span>
          <span className="calc-operator">{calculation.operator}</span>
          <span className="calc-number">{calculation.right}</span>
          <span className="calc-equals">=</span>
          <span className="calc-result">{calculation.result}</span>
        </div>
      )}

      {/* Boîtes de variables */}
{boxes && boxes.length > 0 && (
  <div className="variable-boxes">
    {boxes.map((box, index) => (
      <div key={index} className="box-container">
        <div className="box-label">{box.name}</div>
        <div className={`variable-box ${box.highlight ? 'highlighted' : ''} ${box.animation || ''}`}>
          <div className="box-content">
            {box.value !== null && box.value !== undefined ? box.value : '?'}
          </div>
        </div>
      </div>
    ))}
  </div>
)}

      {/* Affichage du résultat final */}
      {display && (
        <div className="result-display">
          <div className="result-label">Résultat</div>
          <div className="result-value">{display.value}</div>
        </div>
      )}
    </div>
  );
};

export default CartoonVisualization;