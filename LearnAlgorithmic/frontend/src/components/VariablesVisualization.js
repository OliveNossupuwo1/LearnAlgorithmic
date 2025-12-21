import React from 'react';
import './VariablesVisualization.css';

const VariablesVisualization = ({ data }) => {
  const { variables = [], operation, highlight } = data;

  const getTypeIcon = (type) => {
    switch (type) {
      case 'entier':
        return '🔢';
      case 'reel':
        return '💯';
      case 'chaine':
        return '📝';
      case 'booleen':
        return '✔️';
      default:
        return '📦';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'entier':
        return '#3b82f6'; // blue
      case 'reel':
        return '#8b5cf6'; // purple
      case 'chaine':
        return '#10b981'; // green
      case 'booleen':
        return '#f59e0b'; // orange
      default:
        return '#6b7280'; // gray
    }
  };

  return (
    <div className="variables-visualization">
      {/* Memory Representation */}
      <div className="memory-zone">
        <div className="memory-title">
          💾 Mémoire de l'Ordinateur
        </div>

        <div className="variables-grid">
          {variables.map((variable, index) => {
            const boxColorClass = variable.boxColor === 'red' ? 'box-red' :
                                  variable.boxColor === 'yellow' ? 'box-yellow' :
                                  variable.boxColor === 'green' ? 'box-green' : '';

            return (
            <div
              key={index}
              className={`variable-box ${boxColorClass} ${
                highlight === variable.name ? 'highlighted' : ''
              } ${variable.status || ''}`}
              style={{ borderColor: variable.boxColor ? undefined : getTypeColor(variable.type) }}
            >
              {/* Variable Header */}
              <div
                className="variable-header"
                style={{ backgroundColor: getTypeColor(variable.type) }}
              >
                <span className="variable-icon">
                  {getTypeIcon(variable.type)}
                </span>
                <span className="variable-type">{variable.type}</span>
              </div>

              {/* Variable Name */}
              <div className="variable-name-display">
                <span className="label">Nom:</span>
                <span className="name">{variable.name}</span>
              </div>

              {/* Variable Value */}
              <div className="variable-value-display">
                <span className="label">Valeur:</span>
                <div className="value-box" style={{
                  backgroundColor: variable.status === 'error' ? '#fecaca' : '#f1f5f9',
                  borderColor: variable.status === 'error' ? '#dc2626' : '#cbd5e1'
                }}>
                  {variable.value !== undefined && variable.value !== null ? (
                    <span className="value" style={{
                      color: variable.status === 'error' ? '#dc2626' : '#0f172a'
                    }}>
                      {typeof variable.value === 'string' && !variable.value.includes('❌')
                        ? `"${variable.value}"`
                        : String(variable.value)}
                    </span>
                  ) : (
                    <span className="value-empty">non initialisée</span>
                  )}
                </div>
              </div>

              {/* Memory Address (optional) */}
              {variable.address && (
                <div className="variable-address">
                  <span className="address-label">@</span>
                  <span className="address-value">{variable.address}</span>
                </div>
              )}
            </div>
            );
          })}
        </div>
      </div>

      {/* Operation Display */}
      {operation && (
        <div className="operation-display">
          <div className="operation-icon">⚙️</div>
          <div className="operation-text">{operation}</div>
        </div>
      )}

    </div>
  );
};

export default VariablesVisualization;
