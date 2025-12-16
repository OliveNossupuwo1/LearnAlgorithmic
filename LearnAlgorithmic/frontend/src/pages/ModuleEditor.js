import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ModuleEditor = () => {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    order: 1,
  });

  useEffect(() => {
    if (moduleId && moduleId !== 'new') {
      loadModule();
    }
  }, [moduleId]);

  const loadModule = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.get(
        `http://localhost:8000/api/modules/${moduleId}/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setFormData({
        title: response.data.title,
        description: response.data.description,
        order: response.data.order,
      });
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors du chargement du module');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('access_token');
      const url =
        moduleId === 'new'
          ? 'http://localhost:8000/api/admin/modules/'
          : `http://localhost:8000/api/admin/modules/${moduleId}/`;

      const method = moduleId === 'new' ? 'post' : 'put';

      await axios[method](url, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert(
        moduleId === 'new'
          ? 'Module créé avec succès !'
          : 'Module modifié avec succès !'
      );
      navigate('/admin');
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la sauvegarde');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce module ?')) {
      return;
    }

    try {
      const token = localStorage.getItem('access_token');
      await axios.delete(
        `http://localhost:8000/api/admin/modules/${moduleId}/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert('Module supprimé avec succès !');
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => navigate('/admin')}
            className="flex items-center text-primary-600 hover:text-primary-700 mb-4"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Retour à l'admin
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            {moduleId === 'new' ? '➕ Nouveau Module' : '✏️ Modifier le Module'}
          </h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="card">
          {/* Titre */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Titre du Module *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="input-field"
              placeholder="Ex: Introduction à l'algorithmique"
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
              rows={4}
              className="input-field"
              placeholder="Décrivez brièvement le contenu de ce module..."
            ></textarea>
          </div>

          {/* Ordre */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ordre (Position) *
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
            <p className="text-sm text-gray-500 mt-1">
              L'ordre détermine la position du module (1, 2, 3...)
            </p>
          </div>

          {/* Boutons */}
          <div className="flex justify-between items-center pt-6 border-t">
            <div>
              {moduleId !== 'new' && (
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
                  : moduleId === 'new'
                  ? '✅ Créer le Module'
                  : '💾 Enregistrer'}
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};

export default ModuleEditor;