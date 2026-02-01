import React, { useState, useEffect, useRef } from 'react';
import './AlgorithmSimulation.css';
import CartoonVisualization from './CartoonVisualization';
import VariablesVisualization from './VariablesVisualization';

// Composant de visualisation pour les structures conditionnelles (SI...ALORS...FIN SI)
const ConditionalVisualization = ({ data }) => {
  const {
    title,
    explanation,
    condition,
    evaluation,
    result,
    result_text,
    syntax,
    highlight,
    output,
    skipped_code,
    key_points,
    syntax_reminder,
    variables_after,
    input_prompt,
    user_input,
    arrow,
    summary
  } = data;

  return (
    <div style={{
      padding: '1.5rem',
      backgroundColor: '#f8fafc',
      borderRadius: '12px',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      overflowY: 'auto'
    }}>
      {/* Titre de l'étape */}
      {title && (
        <h4 style={{
          margin: 0,
          fontSize: '1.25rem',
          fontWeight: '600',
          color: '#1e40af',
          textAlign: 'center'
        }}>
          {title}
        </h4>
      )}

      {/* Syntaxe de la structure */}
      {syntax && (
        <div style={{
          backgroundColor: '#1e293b',
          color: '#e2e8f0',
          padding: '1rem',
          borderRadius: '8px',
          fontFamily: 'monospace',
          fontSize: '0.95rem',
          whiteSpace: 'pre-wrap'
        }}>
          {syntax}
        </div>
      )}

      {/* Code mis en surbrillance */}
      {highlight && (
        <div style={{
          backgroundColor: '#fef3c7',
          border: '2px solid #f59e0b',
          padding: '1rem',
          borderRadius: '8px',
          fontFamily: 'monospace',
          fontSize: '0.95rem',
          whiteSpace: 'pre-wrap'
        }}>
          <span style={{ color: '#92400e', fontWeight: '600' }}>Code: </span>
          {highlight}
        </div>
      )}

      {/* Entrée utilisateur */}
      {input_prompt && (
        <div style={{
          backgroundColor: '#dbeafe',
          padding: '1rem',
          borderRadius: '8px',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem'
        }}>
          <span style={{ color: '#1e40af' }}>{input_prompt}</span>
          {user_input && (
            <div style={{
              backgroundColor: '#fff',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              fontFamily: 'monospace',
              fontWeight: '600',
              color: '#059669'
            }}>
              Saisie: {user_input}
            </div>
          )}
        </div>
      )}

      {/* Variables après exécution */}
      {variables_after && (
        <div style={{
          backgroundColor: '#ecfdf5',
          padding: '1rem',
          borderRadius: '8px'
        }}>
          <span style={{ fontWeight: '600', color: '#065f46' }}>Variables: </span>
          {Object.entries(variables_after).map(([name, value]) => (
            <span key={name} style={{
              marginLeft: '0.5rem',
              backgroundColor: '#d1fae5',
              padding: '0.25rem 0.5rem',
              borderRadius: '4px',
              fontFamily: 'monospace'
            }}>
              {name} = {JSON.stringify(value)}
            </span>
          ))}
        </div>
      )}

      {/* Évaluation de la condition */}
      {condition && (
        <div style={{
          backgroundColor: '#fff',
          border: '2px solid #6366f1',
          padding: '1rem',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <div style={{ marginBottom: '0.5rem', color: '#4f46e5', fontWeight: '600' }}>
            Condition à évaluer:
          </div>
          <div style={{
            fontSize: '1.25rem',
            fontFamily: 'monospace',
            fontWeight: '600',
            color: '#1f2937'
          }}>
            {condition}
          </div>
          {evaluation && (
            <div style={{
              marginTop: '0.5rem',
              fontSize: '1.1rem',
              fontFamily: 'monospace',
              color: '#6b7280'
            }}>
              → {evaluation}
            </div>
          )}
          {result !== undefined && (
            <div style={{
              marginTop: '0.75rem',
              fontSize: '1.25rem',
              fontWeight: '700',
              color: result ? '#059669' : '#dc2626',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}>
              <span style={{ fontSize: '1.5rem' }}>{result ? '✅' : '❌'}</span>
              {result_text || (result ? 'VRAI' : 'FAUX')}
            </div>
          )}
        </div>
      )}

      {/* Flèche/indication de flux */}
      {arrow && (
        <div style={{
          backgroundColor: '#fef3c7',
          padding: '0.75rem 1rem',
          borderRadius: '8px',
          textAlign: 'center',
          fontWeight: '600',
          color: '#92400e'
        }}>
          → {arrow}
        </div>
      )}

      {/* Code sauté (condition fausse) */}
      {skipped_code && (
        <div style={{
          backgroundColor: '#fee2e2',
          border: '2px dashed #ef4444',
          padding: '1rem',
          borderRadius: '8px',
          opacity: 0.7
        }}>
          <span style={{ color: '#991b1b', fontWeight: '600' }}>Code ignoré: </span>
          <span style={{ fontFamily: 'monospace', textDecoration: 'line-through' }}>
            {skipped_code}
          </span>
        </div>
      )}

      {/* Sortie du programme */}
      {output && (
        <div style={{
          backgroundColor: '#1e293b',
          color: '#4ade80',
          padding: '1rem',
          borderRadius: '8px',
          fontFamily: 'monospace'
        }}>
          <span style={{ color: '#9ca3af' }}>Sortie: </span>
          {output}
        </div>
      )}

      {/* Explication */}
      {explanation && (
        <div style={{
          backgroundColor: '#eff6ff',
          borderLeft: '4px solid #3b82f6',
          padding: '1rem',
          borderRadius: '0 8px 8px 0',
          fontSize: '0.95rem',
          lineHeight: '1.6',
          color: '#1e40af'
        }}>
          💡 {explanation}
        </div>
      )}

      {/* Résumé */}
      {summary && (
        <div style={{
          backgroundColor: '#f0fdf4',
          padding: '1rem',
          borderRadius: '8px',
          fontWeight: '500',
          color: '#166534'
        }}>
          📋 {summary}
        </div>
      )}

      {/* Points clés (résumé final) */}
      {key_points && key_points.length > 0 && (
        <div style={{
          backgroundColor: '#faf5ff',
          border: '2px solid #a855f7',
          padding: '1rem',
          borderRadius: '8px'
        }}>
          <div style={{ fontWeight: '600', color: '#7c3aed', marginBottom: '0.75rem' }}>
            Points clés à retenir:
          </div>
          <ul style={{ margin: 0, paddingLeft: '1.25rem', color: '#581c87' }}>
            {key_points.map((point, idx) => (
              <li key={idx} style={{ marginBottom: '0.5rem' }}>{point}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Rappel de syntaxe */}
      {syntax_reminder && (
        <div style={{
          backgroundColor: '#1e293b',
          color: '#e2e8f0',
          padding: '1rem',
          borderRadius: '8px',
          fontFamily: 'monospace',
          fontSize: '0.9rem',
          whiteSpace: 'pre-wrap',
          textAlign: 'center'
        }}>
          {syntax_reminder}
        </div>
      )}
    </div>
  );
};

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
{!visualData.type && (visualData.variables || visualData.constants) && (
  <VariablesVisualization data={visualData} />
)}
{/* Visualisation pour les structures conditionnelles (SI...ALORS) */}
{!visualData.type && (visualData.condition || visualData.title || visualData.key_points) && (
  <ConditionalVisualization data={visualData} />
)}
{!visualData.type && !visualData.variables && !visualData.constants && !visualData.condition && !visualData.title && !visualData.key_points && (
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
            visualData?.code_line === idx + 1 ? 'highlighted' : ''
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