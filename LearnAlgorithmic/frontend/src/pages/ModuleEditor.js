import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Notification from '../components/Notification';
import ConfirmDialog from '../components/ConfirmDialog';
import { useNotification } from '../hooks/useNotification';

const ModuleEditor = () => {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    order: 1,
  });
  const { notification, confirmDialog, showSuccess, showError, hideNotification, confirm } = useNotification();

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
      showError('Erreur de chargement', 'Erreur lors du chargement du module');
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

      showSuccess(
        moduleId === 'new' ? 'Module créé !' : 'Module modifié !',
        moduleId === 'new' ? 'Le module a été créé avec succès' : 'Les modifications ont été enregistrées'
      );
      setTimeout(() => navigate('/admin'), 1500);
    } catch (error) {
      console.error('Erreur:', error);
      showError('Erreur de sauvegarde', 'Impossible de sauvegarder le module');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = await confirm(
      'Supprimer ce module ?',
      'Cette action est irréversible. Toutes les leçons associées seront également supprimées.',
      { type: 'danger', confirmText: 'Supprimer', cancelText: 'Annuler' }
    );

    if (!confirmed) return;

    try {
      const token = localStorage.getItem('access_token');
      await axios.delete(
        `http://localhost:8000/api/admin/modules/${moduleId}/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      showSuccess('Module supprimé !', 'Le module a été supprimé avec succès');
      setTimeout(() => navigate('/admin'), 1500);
    } catch (error) {
      console.error('Erreur:', error);
      showError('Erreur de suppression', 'Impossible de supprimer le module');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate('/admin')}
            className="flex items-center text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Admin
          </button>
          <div className="border-l border-gray-300 h-4"></div>
          <h1 className="text-sm font-bold text-gray-900">
            {moduleId === 'new' ? '➕ Nouveau Module' : '✏️ Modifier le Module'}
          </h1>
        </div>
      </Header>

      <main className="w-full px-4 sm:px-6 lg:px-8 py-6">
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

      <Footer />

      {notification && (
        <Notification
          type={notification.type}
          title={notification.title}
          message={notification.message}
          onClose={hideNotification}
          autoClose={notification.autoClose}
          duration={notification.duration}
        />
      )}

      {confirmDialog && (
        <ConfirmDialog
          title={confirmDialog.title}
          message={confirmDialog.message}
          type={confirmDialog.type}
          confirmText={confirmDialog.confirmText}
          cancelText={confirmDialog.cancelText}
          onConfirm={confirmDialog.onConfirm}
          onCancel={confirmDialog.onCancel}
        />
      )}
    </div>
  );
};

export default ModuleEditor;