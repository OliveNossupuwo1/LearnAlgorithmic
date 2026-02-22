import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { interpreterService } from '../services/api';
import Header from '../components/Header';
import Footer from '../components/Footer';

const EXAMPLES = [
  {
    name: 'Somme de 2 nombres',
    code: `ALGORITHME Somme
VARIABLES
  a, b, somme : ENTIER
DEBUT
  ECRIRE("Entrez le premier nombre :")
  LIRE(a)
  ECRIRE("Entrez le deuxieme nombre :")
  LIRE(b)
  somme <- a + b
  ECRIRE("La somme est : ", somme)
FIN`,
    inputs: ['5', '3']
  },
  {
    name: 'Factorielle',
    code: `ALGORITHME Factorielle
VARIABLES
  n, i, fact : ENTIER
DEBUT
  ECRIRE("Entrez un nombre :")
  LIRE(n)
  fact <- 1
  POUR i DE 1 A n FAIRE
    fact <- fact * i
  FINPOUR
  ECRIRE("La factorielle de ", n, " est : ", fact)
FIN`,
    inputs: ['5']
  },
  {
    name: 'Maximum de 3 nombres',
    code: `ALGORITHME Maximum
VARIABLES
  a, b, c, max : ENTIER
DEBUT
  ECRIRE("Entrez trois nombres :")
  LIRE(a)
  LIRE(b)
  LIRE(c)
  max <- a
  SI b > max ALORS
    max <- b
  FINSI
  SI c > max ALORS
    max <- c
  FINSI
  ECRIRE("Le maximum est : ", max)
FIN`,
    inputs: ['7', '12', '5']
  },
  {
    name: 'Pair ou Impair',
    code: `ALGORITHME PairImpair
VARIABLES
  n : ENTIER
DEBUT
  ECRIRE("Entrez un nombre :")
  LIRE(n)
  SI n MOD 2 = 0 ALORS
    ECRIRE(n, " est pair")
  SINON
    ECRIRE(n, " est impair")
  FINSI
FIN`,
    inputs: ['7']
  },
  {
    name: 'Suite de Fibonacci',
    code: `ALGORITHME Fibonacci
VARIABLES
  n, i, a, b, temp : ENTIER
DEBUT
  ECRIRE("Combien de termes ?")
  LIRE(n)
  a <- 0
  b <- 1
  ECRIRE("Suite de Fibonacci :")
  POUR i DE 1 A n FAIRE
    ECRIRE(a)
    temp <- a + b
    a <- b
    b <- temp
  FINPOUR
FIN`,
    inputs: ['8']
  }
];

const SYNTAX_REFERENCE = [
  { category: 'Structure', items: ['ALGORITHME NomAlgo', 'VARIABLES', 'DEBUT', 'FIN'] },
  { category: 'Types', items: ['ENTIER', 'REEL', 'CHAINE', 'BOOLEEN', 'CARACTERE'] },
  { category: 'Affectation', items: ['variable <- valeur'] },
  { category: 'Entree/Sortie', items: ['LIRE(variable)', 'ECRIRE("texte", variable)'] },
  { category: 'Conditions', items: ['SI condition ALORS', 'SINON', 'FINSI'] },
  { category: 'Boucle Pour', items: ['POUR i DE debut A fin FAIRE', 'FINPOUR'] },
  { category: 'Boucle Tant Que', items: ['TANT QUE condition FAIRE', 'FINTANTQUE'] },
  { category: 'Boucle Repeter', items: ['REPETER', "JUSQU'A condition"] },
  { category: 'Operateurs', items: ['+  -  *  /  MOD', '=  <>  <  >  <=  >=', 'ET  OU  NON'] },
  { category: 'Fonctions', items: ['ABS(x)', 'RACINE(x)', 'PUISSANCE(x, n)', 'LONGUEUR(ch)'] },
];

const InterpreterPage = () => {
  const [code, setCode] = useState(EXAMPLES[0].code);
  const [inputs, setInputs] = useState(EXAMPLES[0].inputs);
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [variables, setVariables] = useState({});
  const [loading, setLoading] = useState(false);
  const [showSyntax, setShowSyntax] = useState(false);
  const [executed, setExecuted] = useState(false);
  const textareaRef = useRef(null);
  const navigate = useNavigate();

  const handleExecute = async () => {
    setLoading(true);
    setOutput('');
    setError('');
    setVariables({});
    setExecuted(false);

    try {
      const result = await interpreterService.execute(code, inputs);
      setOutput(result.output || '');
      setError(result.error || '');
      setVariables(result.variables || {});
      setExecuted(true);
    } catch (err) {
      const msg = err.response?.data?.error || 'Erreur de connexion au serveur';
      setError(msg);
      setExecuted(true);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setCode('');
    setInputs([]);
    setOutput('');
    setError('');
    setVariables({});
    setExecuted(false);
  };

  const handleLoadExample = (example) => {
    setCode(example.code);
    setInputs([...example.inputs]);
    setOutput('');
    setError('');
    setVariables({});
    setExecuted(false);
  };

  const addInput = () => setInputs([...inputs, '']);
  const removeInput = (index) => setInputs(inputs.filter((_, i) => i !== index));
  const updateInput = (index, value) => {
    const newInputs = [...inputs];
    newInputs[index] = value;
    setInputs(newInputs);
  };

  const lineCount = code.split('\n').length;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header dashboardButtons={
        <button
          onClick={() => navigate('/dashboard')}
          className="bg-primary-600 text-white px-3 sm:px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-primary-700 transition-all duration-300"
        >
          Dashboard
        </button>
      } />

      <main className="flex-1 w-full px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* Titre */}
        <div className="mb-4 sm:mb-6 animate-fade-in-up">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2 sm:gap-3">
            <svg className="w-6 h-6 sm:w-8 sm:h-8 text-teal-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Interpreteur de Pseudo-code
          </h1>
          <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
            Ecrivez votre algorithme, ajoutez des entrees et executez-le.
          </p>
        </div>

        {/* Exemples */}
        <div className="mb-3 sm:mb-4 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex flex-wrap gap-1.5 sm:gap-2 items-center">
            <span className="text-xs sm:text-sm font-semibold text-gray-700 w-full sm:w-auto mb-1 sm:mb-0">Exemples :</span>
            {EXAMPLES.map((ex, i) => (
              <button
                key={i}
                onClick={() => handleLoadExample(ex)}
                className="px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs bg-white border border-gray-300 rounded-full hover:bg-primary-50 hover:border-primary-400 hover:text-primary-700 transition-all duration-200 font-medium"
              >
                {ex.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
          {/* Editeur de code */}
          <div className="lg:col-span-2 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="bg-gray-900 rounded-xl overflow-hidden shadow-xl">
              <div className="flex items-center justify-between px-3 sm:px-4 py-2 bg-gray-800">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-500"></div>
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-500"></div>
                </div>
                <span className="text-gray-400 text-xs font-mono hidden sm:inline">pseudo-code.algo</span>
                <span className="text-gray-500 text-xs">{lineCount} lignes</span>
              </div>
              <div className="flex overflow-hidden">
                {/* Numeros de ligne */}
                <div className="select-none py-3 sm:py-4 px-1.5 sm:px-2 text-right text-gray-600 font-mono text-[10px] sm:text-xs leading-5 sm:leading-6 bg-gray-950 min-w-[2rem] sm:min-w-[3rem] flex-shrink-0">
                  {Array.from({ length: lineCount }, (_, i) => (
                    <div key={i}>{i + 1}</div>
                  ))}
                </div>
                {/* Textarea */}
                <textarea
                  ref={textareaRef}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="flex-1 bg-gray-900 text-green-400 font-mono text-[11px] sm:text-xs md:text-sm p-3 sm:p-4 resize-none outline-none leading-5 sm:leading-6 min-h-[200px] sm:min-h-[300px] md:min-h-[400px] w-full"
                  style={{ tabSize: 2 }}
                  spellCheck={false}
                  placeholder="Ecrivez votre pseudo-code ici..."
                />
              </div>
            </div>

            {/* Boutons d'action */}
            <div className="grid grid-cols-3 gap-2 sm:flex sm:flex-wrap sm:gap-3 mt-3 sm:mt-4">
              <button
                onClick={handleExecute}
                disabled={loading || !code.trim()}
                className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 bg-green-600 text-white rounded-lg text-xs sm:text-sm font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-lg"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    <span className="hidden sm:inline">Execution...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Executer
                  </>
                )}
              </button>
              <button
                onClick={handleClear}
                className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 bg-gray-600 text-white rounded-lg text-xs sm:text-sm font-semibold hover:bg-gray-700 transition-all duration-300"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Effacer
              </button>
              <button
                onClick={() => setShowSyntax(!showSyntax)}
                className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 bg-blue-600 text-white rounded-lg text-xs sm:text-sm font-semibold hover:bg-blue-700 transition-all duration-300"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Syntaxe
              </button>
            </div>
          </div>

          {/* Panneau droit */}
          <div className="flex flex-col gap-3 sm:gap-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            {/* Entrees */}
            <div className="bg-white rounded-xl shadow-md p-3 sm:p-4">
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <h3 className="font-bold text-gray-800 text-sm sm:text-base flex items-center gap-2">
                  <svg className="w-5 h-5 text-primary-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Entrees (LIRE)
                </h3>
                <button
                  onClick={addInput}
                  className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-primary-100 text-primary-700 rounded-full hover:bg-primary-200 transition-colors font-bold text-base sm:text-lg"
                >
                  +
                </button>
              </div>
              {inputs.length === 0 ? (
                <p className="text-xs sm:text-sm text-gray-500 italic">Aucune entree. Cliquez + pour ajouter.</p>
              ) : (
                <div className="space-y-1.5 sm:space-y-2">
                  {inputs.map((val, i) => (
                    <div key={i} className="flex items-center gap-1.5 sm:gap-2">
                      <span className="text-[10px] sm:text-xs text-gray-500 font-mono w-5 sm:w-6 flex-shrink-0">#{i + 1}</span>
                      <input
                        type="text"
                        value={val}
                        onChange={(e) => updateInput(i, e.target.value)}
                        className="flex-1 min-w-0 px-2 sm:px-3 py-1 sm:py-1.5 border border-gray-300 rounded-lg text-xs sm:text-sm font-mono focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none"
                        placeholder={`Valeur ${i + 1}`}
                      />
                      <button
                        onClick={() => removeInput(i)}
                        className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center text-red-500 hover:bg-red-50 rounded-full transition-colors text-xs sm:text-sm flex-shrink-0"
                      >
                        &#10005;
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Console de sortie */}
            <div className="bg-white rounded-xl shadow-md p-3 sm:p-4">
              <h3 className="font-bold text-gray-800 text-sm sm:text-base mb-2 sm:mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                Sortie
              </h3>
              <div className="bg-gray-900 rounded-lg p-3 sm:p-4 min-h-[80px] sm:min-h-[120px] max-h-[200px] sm:max-h-[250px] overflow-auto font-mono text-xs sm:text-sm">
                {!executed ? (
                  <p className="text-gray-500 italic text-xs sm:text-sm">Cliquez sur Executer pour voir le resultat...</p>
                ) : error ? (
                  <div className="text-red-400 whitespace-pre-wrap break-words">{error}</div>
                ) : output ? (
                  <div className="text-green-400 whitespace-pre-wrap break-words">{output}</div>
                ) : (
                  <p className="text-gray-500 italic text-xs sm:text-sm">Aucune sortie.</p>
                )}
              </div>
            </div>

            {/* Variables */}
            {executed && Object.keys(variables).length > 0 && (
              <div className="bg-white rounded-xl shadow-md p-3 sm:p-4">
                <h3 className="font-bold text-gray-800 text-sm sm:text-base mb-2 sm:mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5 text-purple-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                  </svg>
                  Variables
                </h3>
                <div className="space-y-1 sm:space-y-1.5 max-h-[150px] sm:max-h-[200px] overflow-y-auto">
                  {Object.entries(variables).map(([name, info]) => (
                    <div key={name} className="flex items-center justify-between px-2 sm:px-3 py-1.5 sm:py-2 bg-gray-50 rounded-lg text-xs sm:text-sm gap-2">
                      <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                        <span className="font-bold font-mono text-primary-700 truncate">{name}</span>
                        <span className="text-[10px] sm:text-xs text-gray-400 bg-gray-200 px-1 sm:px-1.5 py-0.5 rounded flex-shrink-0">{info.type}</span>
                      </div>
                      <span className="font-mono font-semibold text-gray-800 truncate text-right">{info.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Reference syntaxe */}
        {showSyntax && (
          <div className="mt-4 sm:mt-6 bg-white rounded-xl shadow-md p-3 sm:p-4 md:p-6 animate-fade-in-up">
            <h3 className="text-sm sm:text-lg font-bold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Reference rapide de la syntaxe
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3 md:gap-4">
              {SYNTAX_REFERENCE.map((section, i) => (
                <div key={i} className="bg-gray-50 rounded-lg p-2 sm:p-3">
                  <h4 className="font-bold text-primary-700 text-xs sm:text-sm mb-1.5 sm:mb-2">{section.category}</h4>
                  <ul className="space-y-0.5 sm:space-y-1">
                    {section.items.map((item, j) => (
                      <li key={j} className="text-[10px] sm:text-xs font-mono text-gray-700 bg-white px-1.5 sm:px-2 py-0.5 sm:py-1 rounded break-all">{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default InterpreterPage;
