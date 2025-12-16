import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { moduleService } from '../services/api';

const LessonEditor = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [modules, setModules] = useState([]);
  const [activeTab, setActiveTab] = useState('general');
  
  const [formData, setFormData] = useState({
    module: '',
    title: '',
    description: '',
    order: 1,
    video_url: '',
  });

  // États pour les concepts
  const [concepts, setConcepts] = useState([]);
  
  // États pour les exemples
  const [examples, setExamples] = useState([]);
  
  // États pour les simulations
  const [simulations, setSimulations] = useState([]);

  useEffect(() => {
    loadModules();
    if (lessonId && lessonId !== 'new') {
      loadLesson();
    }
  }, [lessonId]);

  const loadModules = async () => {
    try {
      const data = await moduleService.getAll();
      setModules(data);
      if (lessonId === 'new' && data.length > 0) {
        setFormData((prev) => ({ ...prev, module: data[0].id }));
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const loadLesson = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.get(
        `http://localhost:8000/api/lessons/${lessonId}/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      setFormData({
        module: response.data.module,
        title: response.data.title,
        description: response.data.description,
        order: response.data.order,
        video_url: response.data.video_url || '',
      });
      
      // Charger concepts
      setConcepts(response.data.concepts || []);
      
      // Charger exemples
      setExamples(response.data.examples || []);
      
      // Charger simulations
      setSimulations(response.data.simulations || []);
      
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // CONCEPTS
  const addConcept = () => {
    setConcepts([...concepts, {
      id: Date.now(),
      title: '',
      definition: '',
      syntax: '',
      order: concepts.length + 1,
      isNew: true
    }]);
  };

  const updateConcept = (index, field, value) => {
    const newConcepts = [...concepts];
    newConcepts[index][field] = value;
    setConcepts(newConcepts);
  };

  const removeConcept = (index) => {
    setConcepts(concepts.filter((_, i) => i !== index));
  };

  // EXEMPLES
  const addExample = () => {
    setExamples([...examples, {
      id: Date.now(),
      title: '',
      description: '',
      code: '',
      explanation: '',
      order: examples.length + 1,
      isNew: true
    }]);
  };

  const updateExample = (index, field, value) => {
    const newExamples = [...examples];
    newExamples[index][field] = value;
    setExamples(newExamples);
  };

  const removeExample = (index) => {
    setExamples(examples.filter((_, i) => i !== index));
  };

  // SIMULATIONS
  const addSimulation = () => {
    setSimulations([...simulations, {
      id: Date.now(),
      title: '',
      description: '',
      algorithm_code: '',
      order: simulations.length + 1,
      isNew: true
    }]);
  };

  const updateSimulation = (index, field, value) => {
    const newSimulations = [...simulations];
    newSimulations[index][field] = value;
    setSimulations(newSimulations);
  };

  const removeSimulation = (index) => {
    setSimulations(simulations.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('access_token');
      const url =
        lessonId === 'new'
          ? 'http://localhost:8000/api/admin/lessons/'
          : `http://localhost:8000/api/admin/lessons/${lessonId}/`;

      const method = lessonId === 'new' ? 'post' : 'put';

      // Préparer les données complètes
      const completeData = {
        ...formData,
        concepts: concepts.map((c, idx) => ({
          ...c,
          order: idx + 1
        })),
        examples: examples.map((e, idx) => ({
          ...e,
          order: idx + 1
        })),
        simulations: simulations.map((s, idx) => ({
          ...s,
          order: idx + 1
        }))
      };

      await axios[method](url, completeData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert(
        lessonId === 'new'
          ? 'Leçon créée avec succès !'
          : 'Leçon modifiée avec succès !'
      );
      navigate('/admin');
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la sauvegarde: ' + (error.response?.data?.detail || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette leçon ?')) {
      return;
    }

    try {
      const token = localStorage.getItem('access_token');
      await axios.delete(
        `http://localhost:8000/api/admin/lessons/${lessonId}/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert('Leçon supprimée avec succès !');
      navigate('/admin');
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la suppression');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => navigate('/admin')}
            className="flex items-center text-primary-600 hover:text-primary-700 mb-4"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Retour à l'admin
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            {lessonId === 'new' ? '➕ Nouvelle Leçon' : '✏️ Modifier la Leçon'}
          </h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Onglets */}
        <div className="flex space-x-4 mb-6 border-b">
          {['general', 'concepts', 'examples', 'simulations'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                activeTab === tab
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab === 'general' && '📝 Général'}
              {tab === 'concepts' && '📖 Concepts'}
              {tab === 'examples' && '💡 Exemples'}
              {tab === 'simulations' && '🎬 Simulations'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          {/* ONGLET GÉNÉRAL */}
          {activeTab === 'general' && (
            <div className="card">
              <h2 className="text-xl font-bold mb-6">Informations générales</h2>
              
              {/* Module parent */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Module *
                </label>
                <select
                  name="module"
                  value={formData.module}
                  onChange={handleChange}
                  required
                  className="input-field"
                >
                  <option value="">Sélectionnez un module</option>
                  {modules.map((module) => (
                    <option key={module.id} value={module.id}>
                      Module {module.order}: {module.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Titre */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Titre de la Leçon *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="input-field"
                  placeholder="Ex: Qu'est-ce qu'un algorithme ?"
                />
              </div>

              {/* Description */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="input-field"
                  placeholder="Décrivez brièvement le contenu de cette leçon..."
                ></textarea>
              </div>

              {/* Ordre */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ordre (Position dans le module) *
                </label>
                <input
                  type="number"
                  name="order"
                  value={formData.order}
                  onChange={handleChange}
                  required
                  min="1"
                  className="input-field"
                  placeholder="1"
                />
              </div>

              {/* Vidéo URL */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL de la vidéo (optionnel)
                </label>
                <input
                  type="url"
                  name="video_url"
                  value={formData.video_url}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="https://www.youtube.com/watch?v=..."
                />
                <p className="text-sm text-gray-500 mt-1">
                  Collez le lien YouTube complet de la vidéo explicative
                </p>
              </div>
            </div>
          )}

          {/* ONGLET CONCEPTS */}
          {activeTab === 'concepts' && (
            <div className="card">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Concepts clés</h2>
                <button
                  type="button"
                  onClick={addConcept}
                  className="btn-primary"
                >
                  ➕ Ajouter un concept
                </button>
              </div>

              {concepts.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  Aucun concept ajouté. Cliquez sur "Ajouter un concept" pour commencer.
                </p>
              ) : (
                <div className="space-y-6">
                  {concepts.map((concept, index) => (
                    <div key={concept.id || index} className="border-2 border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="font-semibold text-lg">Concept #{index + 1}</h3>
                        <button
                          type="button"
                          onClick={() => removeConcept(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          🗑️ Supprimer
                        </button>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Titre *
                          </label>
                          <input
                            type="text"
                            value={concept.title}
                            onChange={(e) => updateConcept(index, 'title', e.target.value)}
                            required
                            className="input-field"
                            placeholder="Ex: Les variables"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Définition *
                          </label>
                          <textarea
                            value={concept.definition}
                            onChange={(e) => updateConcept(index, 'definition', e.target.value)}
                            required
                            rows={3}
                            className="input-field"
                            placeholder="Expliquez le concept..."
                          ></textarea>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Syntaxe *
                          </label>
                          <textarea
                            value={concept.syntax}
                            onChange={(e) => updateConcept(index, 'syntax', e.target.value)}
                            required
                            rows={2}
                            className="input-field font-mono text-sm"
                            placeholder="Ex: VARIABLE nom: TYPE"
                          ></textarea>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ONGLET EXEMPLES */}
          {activeTab === 'examples' && (
            <div className="card">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Exemples</h2>
                <button
                  type="button"
                  onClick={addExample}
                  className="btn-primary"
                >
                  ➕ Ajouter un exemple
                </button>
              </div>

              {examples.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  Aucun exemple ajouté. Cliquez sur "Ajouter un exemple" pour commencer.
                </p>
              ) : (
                <div className="space-y-6">
                  {examples.map((example, index) => (
                    <div key={example.id || index} className="border-2 border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="font-semibold text-lg">Exemple #{index + 1}</h3>
                        <button
                          type="button"
                          onClick={() => removeExample(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          🗑️ Supprimer
                        </button>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Titre *
                          </label>
                          <input
                            type="text"
                            value={example.title}
                            onChange={(e) => updateExample(index, 'title', e.target.value)}
                            required
                            className="input-field"
                            placeholder="Ex: Calculer la somme"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description *
                          </label>
                          <textarea
                            value={example.description}
                            onChange={(e) => updateExample(index, 'description', e.target.value)}
                            required
                            rows={2}
                            className="input-field"
                            placeholder="Décrivez l'exemple..."
                          ></textarea>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Code *
                          </label>
                          <textarea
                            value={example.code}
                            onChange={(e) => updateExample(index, 'code', e.target.value)}
                            required
                            rows={8}
                            className="input-field font-mono text-sm"
                            placeholder="Écrivez le code de l'exemple..."
                          ></textarea>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Explication *
                          </label>
                          <textarea
                            value={example.explanation}
                            onChange={(e) => updateExample(index, 'explanation', e.target.value)}
                            required
                            rows={3}
                            className="input-field"
                            placeholder="Expliquez le code..."
                          ></textarea>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ONGLET SIMULATIONS */}
          {activeTab === 'simulations' && (
            <div className="card">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Simulations interactives</h2>
                <button
                  type="button"
                  onClick={addSimulation}
                  className="btn-primary"
                >
                  ➕ Ajouter une simulation
                </button>
              </div>

              <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4 mb-6">
                <p className="text-yellow-800 text-sm">
                  <strong>⚠️ Note :</strong> Les simulations créées ici sont des structures de base. 
                  Pour créer les étapes détaillées de simulation (avec animations), 
                  vous devrez utiliser Django shell ou créer une interface dédiée.
                </p>
              </div>

              {simulations.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  Aucune simulation ajoutée. Cliquez sur "Ajouter une simulation" pour commencer.
                </p>
              ) : (
                <div className="space-y-6">
                  {simulations.map((simulation, index) => (
                    <div key={simulation.id || index} className="border-2 border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="font-semibold text-lg">Simulation #{index + 1}</h3>
                        <button
                          type="button"
                          onClick={() => removeSimulation(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          🗑️ Supprimer
                        </button>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Titre *
                          </label>
                          <input
                            type="text"
                            value={simulation.title}
                            onChange={(e) => updateSimulation(index, 'title', e.target.value)}
                            required
                            className="input-field"
                            placeholder="Ex: Calcul de la somme"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description *
                          </label>
                          <textarea
                            value={simulation.description}
                            onChange={(e) => updateSimulation(index, 'description', e.target.value)}
                            required
                            rows={2}
                            className="input-field"
                            placeholder="Décrivez la simulation..."
                          ></textarea>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Code de l'algorithme *
                          </label>
                          <textarea
                            value={simulation.algorithm_code}
                            onChange={(e) => updateSimulation(index, 'algorithm_code', e.target.value)}
                            required
                            rows={10}
                            className="input-field font-mono text-sm"
                            placeholder="ALGORITHME NomAlgorithme..."
                          ></textarea>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Boutons */}
          <div className="flex justify-between items-center pt-6 border-t mt-8">
            <div>
              {lessonId !== 'new' && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
                >
                  🗑️ Supprimer
                </button>
              )}
            </div>
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => navigate('/admin')}
                className="btn-secondary"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary disabled:opacity-50"
              >
                {loading
                  ? 'Enregistrement...'
                  : lessonId === 'new'
                  ? '✅ Créer la Leçon'
                  : '💾 Enregistrer'}
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};

export default LessonEditor;