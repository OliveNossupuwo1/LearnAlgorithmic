import React from 'react';
import './VariablesVisualization.css';

const VariablesVisualization = ({ data }) => {
  const { variables = [], constants = [], operation, message, error, success, highlight, output } = data;

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
      case 'constante':
        return '🔒';
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
      case 'constante':
        return '#1e40af'; // dark blue
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
          {constants.map((constant, index) => {
            const boxColorClass = constant.boxColor === 'blue' ? 'box-blue' : '';

            return (
            <div
              key={`const-${index}`}
              className={`variable-box ${boxColorClass} ${
                highlight === constant.name ? 'highlighted' : ''
              } ${constant.isNew ? 'new' : ''} ${constant.isModified ? 'modified' : ''} ${constant.isUsed ? 'used' : ''} ${constant.isError ? 'error shake' : ''}`}
              style={{ borderColor: constant.boxColor ? undefined : getTypeColor(constant.type) }}
            >
              {/* Constant Header */}
              <div
                className="variable-header"
                style={{ backgroundColor: getTypeColor(constant.type) }}
              >
                <span className="variable-icon">
                  {getTypeIcon(constant.type)}
                </span>
                <span className="variable-type">{constant.type}</span>
                {constant.isLocked && <span className="lock-icon">🔒</span>}
              </div>

              {/* Constant Name */}
              <div className="variable-name-display">
                <span className="label">Nom:</span>
                <span className="name">{constant.name}</span>
              </div>

              {/* Constant Value */}
              <div className="variable-value-display constant-value">
                <span className="label">Valeur:</span>
                <div className="value-box constant-locked" style={{
                  backgroundColor: constant.isError ? '#fecaca' : '#dbeafe',
                  borderColor: constant.isError ? '#dc2626' : '#3b82f6',
                  position: 'relative'
                }}>
                  {constant.isLocked && !constant.isError && (
                    <div className="lock-overlay">
                      <span className="lock-overlay-icon">🔒</span>
                    </div>
                  )}
                  {constant.value !== undefined && constant.value !== null ? (
                    <span className="value" style={{
                      color: constant.isError ? '#dc2626' : '#1e3a8a',
                      fontWeight: 'bold',
                      opacity: constant.isLocked && !constant.isError ? 0.6 : 1
                    }}>
                      {typeof constant.value === 'string' && isNaN(constant.value) && !constant.value.includes('❌')
                        ? `"${constant.value}"`
                        : String(constant.value)}
                    </span>
                  ) : (
                    <span className="value-empty">non initialisée</span>
                  )}
                </div>
              </div>
            </div>
            );
          })}

          {variables.map((variable, index) => {
            const boxColorClass = variable.boxColor === 'red' ? 'box-red' :
                                  variable.boxColor === 'yellow' ? 'box-yellow' :
                                  variable.boxColor === 'green' ? 'box-green' : '';

            return (
            <div
              key={`var-${index}`}
              className={`variable-box ${boxColorClass} ${
                highlight === variable.name ? 'highlighted' : ''
              } ${variable.isNew ? 'new' : ''} ${variable.isModified ? 'modified' : ''} ${variable.status || ''}`}
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
                  {variable.value !== undefined && variable.value !== null && variable.value !== '' ? (
                    <span className="value" style={{
                      color: variable.status === 'error' ? '#dc2626' : '#0f172a'
                    }}>
                      {typeof variable.value === 'string' && isNaN(variable.value) && !variable.value.includes('❌')
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

      {/* Message Display */}
      {message && (
        <div className={`message-display ${success ? 'success' : ''} ${error ? 'error' : ''}`}>
          <div className="message-icon">{success ? '✅' : error ? '❌' : 'ℹ️'}</div>
          <div className="message-text">{message}</div>
        </div>
      )}

      {/* Operation Display */}
      {operation && (
        <div className="operation-display">
          <div className="operation-icon">⚙️</div>
          <div className="operation-text">{operation}</div>
        </div>
      )}

      {/* Error Display */}
      {error && !message && (
        <div className="error-display">
          <div className="error-icon">❌</div>
          <div className="error-text">{error}</div>
        </div>
      )}

      {/* Output Display */}
      {output && (
        <div className="output-display">
          <div className="output-title">
            <span>🖥️</span>
            <span>Sortie du programme</span>
          </div>
          <div className="output-content">
            {output}
          </div>
        </div>
      )}

    </div>
  );
};

export default VariablesVisualization;
