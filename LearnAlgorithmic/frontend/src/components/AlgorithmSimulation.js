import React, { useState, useEffect, useRef } from 'react';
import './AlgorithmSimulation.css';
import CartoonVisualization from './CartoonVisualization';
import VariablesVisualization from './VariablesVisualization';

const AlgorithmSimulation = ({ simulation }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000); // ms par étape
  const intervalRef = useRef(null);

  const steps = simulation.steps || [];
  const algorithmCode = simulation.algorithm_code || '';

  useEffect(() => {
    if (isPlaying && currentStep < steps.length - 1) {
      intervalRef.current = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, speed);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, currentStep, speed, steps.length]);

  const handlePlay = () => {
    if (currentStep >= steps.length - 1) {
      setCurrentStep(0);
    }
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStep(0);
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (!steps.length) {
    return (
      <div className="simulation-container">
        <p className="text-gray-500 text-center py-8">
          Aucune étape de simulation disponible.
        </p>
      </div>
    );
  }

  const currentStepData = steps[currentStep];
  const visualData = currentStepData?.visual_data || {};

  return (
    <div className="simulation-container">
      {/* Header */}
      <div className="simulation-header">
        <h3 className="simulation-title">🎬 {simulation.title}</h3>
        <p className="simulation-description">{simulation.description}</p>
      </div>

      {/* Main Content: Visualization + Code */}
      <div className="simulation-main">
        {/* LEFT: Visualization */}
        <div className="visualization-panel">
          <div className="cartoon-stage">
            {/* Rendu de la visualisation selon le type */}
{visualData.type === 'cartoon' && (
  <CartoonVisualization data={visualData} />
)}
{visualData.type === 'variables' && (
  <VariablesVisualization data={visualData} />
)}
{visualData.type === 'array' && (
  <ArrayVisualization data={visualData} />
)}
{visualData.type === 'sorting' && (
  <SortingVisualization data={visualData} />
)}
{visualData.type === 'search' && (
  <SearchVisualization data={visualData} />
)}
{!visualData.type && (
  <div className="placeholder-visual">
    <div className="cartoon-character">🤖</div>
    <p>Visualisation en cours...</p>
  </div>
)}
          </div>

          {/* Current Step Description */}
          <div className="step-description">
            <div className="step-badge">
              Étape {currentStep + 1} / {steps.length}
            </div>
            <p className="step-text">{currentStepData?.description}</p>
          </div>
        </div>

        {/* RIGHT: Code & Variables */}
        <div className="code-panel">
          {/* Algorithm Code */}
<div className="code-section">
  <h4 className="code-title">📝 Code de l'algorithme</h4>
  <pre className="code-block">
    <code>
      {algorithmCode.split('\n').map((line, idx) => (
        <div
          key={idx}
          className={`code-line ${
            currentStepData?.step_number === idx + 1 ? 'highlighted' : ''
          }`}
        >
          <span className="line-number">{idx + 1}</span>
          <span className="line-content">{line}</span>
        </div>
      ))}
    </code>
  </pre>
</div>

          {/* Variables State */}
          <div className="variables-section">
            <h4 className="variables-title">📊 Variables</h4>
            <div className="variables-list">
              {Object.entries(currentStepData?.state_data || {}).map(
                ([key, value]) => (
                  <div key={key} className="variable-item">
                    <span className="variable-name">{key}:</span>
                    <span className="variable-value">
                      {JSON.stringify(value)}
                    </span>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="simulation-controls">
        <button onClick={handleReset} className="control-btn reset-btn" title="Reset">
          ⏮️
        </button>
        <button
          onClick={handlePrevious}
          className="control-btn"
          disabled={currentStep === 0}
          title="Previous"
        >
          ◀️
        </button>
        {isPlaying ? (
          <button onClick={handlePause} className="control-btn play-btn" title="Pause">
            ⏸️
          </button>
        ) : (
          <button onClick={handlePlay} className="control-btn play-btn" title="Play">
            ▶️
          </button>
        )}
        <button
          onClick={handleNext}
          className="control-btn"
          disabled={currentStep >= steps.length - 1}
          title="Next"
        >
          ▶️
        </button>

        {/* Speed Control */}
        <div className="speed-control">
          <label>⚡ Vitesse:</label>
          <select
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="speed-select"
          >
            <option value={2000}>0.5x</option>
            <option value={1000}>1x</option>
            <option value={500}>2x</option>
            <option value={250}>4x</option>
          </select>
        </div>
      </div>
    </div>
  );
};

// Composants de visualisation spécifiques

const ArrayVisualization = ({ data }) => {
  const array = data.array || [];
  const labels = data.labels || [];
  const highlightIndex = data.highlightIndex;

  return (
    <div className="array-viz">
      {array.map((value, index) => (
        <div key={index} className="array-item">
          {labels[index] && (
            <div className="array-label">{labels[index]}</div>
          )}
          <div
            className={`array-box ${index === highlightIndex ? 'highlighted' : ''}`}
          >
            <div className="array-value">{value !== null ? value : '?'}</div>
          </div>
        </div>
      ))}
    </div>
  );
};
const SortingVisualization = ({ data }) => {
  const array = data.array || [];
  const comparing = data.comparing || [];
  const sorted = data.sorted || [];

  return (
    <div className="sorting-viz">
      {array.map((value, index) => (
        <div key={index} className="bar-container">
          <div
            className={`bar ${
              comparing.includes(index)
                ? 'comparing'
                : sorted.includes(index)
                ? 'sorted'
                : ''
            }`}
            style={{ height: `${value * 3}px` }}
          >
            <span className="bar-value">{value}</span>
          </div>
          <div className="bar-index">{index}</div>
        </div>
      ))}
    </div>
  );
};

const SearchVisualization = ({ data }) => {
  const array = data.array || [];
  const currentIndex = data.currentIndex;
  const found = data.found;
  const target = data.target;

  return (
    <div className="search-viz">
      <div className="search-target">
        🎯 Recherche de : <strong>{target}</strong>
      </div>
      <div className="search-array">
        {array.map((value, index) => (
          <div
            key={index}
            className={`search-box ${
              index === currentIndex
                ? found
                  ? 'found'
                  : 'checking'
                : index < currentIndex
                ? 'checked'
                : ''
            }`}
          >
            <div className="search-value">{value}</div>
            <div className="search-index">{index}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlgorithmSimulation;