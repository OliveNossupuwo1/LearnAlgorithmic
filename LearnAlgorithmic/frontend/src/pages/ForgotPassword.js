import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/api';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: email, 2: code, 3: nouveau mot de passe
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Étape 1: Demander le code par email
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const response = await authService.passwordResetRequest(email);
      setMessage(response.message);
      setStep(2); // Passer à l'étape de saisie du code
    } catch (err) {
      setError(err.response?.data?.error || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  // Étape 2: Vérifier le code
  const handleCodeSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      await authService.verifyResetCode(email, code);
      setStep(3); // Passer à l'étape du nouveau mot de passe
    } catch (err) {
      setError(err.response?.data?.error || 'Code invalide ou expiré');
    } finally {
      setLoading(false);
    }
  };

  // Étape 3: Définir le nouveau mot de passe
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    // Validation
    if (newPassword !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (newPassword.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }

    setLoading(true);

    try {
      await authService.passwordResetConfirm(email, code, newPassword);
      setMessage('Mot de passe réinitialisé avec succès!');

      // Rediriger vers la page de connexion après 2 secondes
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Bouton retour */}
        <div className="text-left">
          <Link
            to="/login"
            className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
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
            Retour à la connexion
          </Link>
        </div>

        <div className="text-center">
          <h1 className="text-5xl font-bold text-primary-700 mb-2">
            LearnAlgorithmic
          </h1>
          <h2 className="text-3xl font-extrabold text-gray-900">
            {step === 1 && 'Mot de passe oublié'}
            {step === 2 && 'Code de vérification'}
            {step === 3 && 'Nouveau mot de passe'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {step === 1 && 'Entrez votre email pour recevoir un code de vérification'}
            {step === 2 && 'Entrez le code à 6 chiffres envoyé par email'}
            {step === 3 && 'Définissez votre nouveau mot de passe'}
          </p>
        </div>

        <div className="card">
          {/* Étape 1: Email */}
          {step === 1 && (
            <form className="space-y-6" onSubmit={handleEmailSubmit}>
              {error && (
                <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              {message && (
                <div className="bg-green-50 border border-green-400 text-green-700 px-4 py-3 rounded">
                  {message}
                </div>
              )}

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Adresse email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="input-field"
                  placeholder="exemple@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Envoi en cours...' : 'Envoyer le code'}
                </button>
              </div>
            </form>
          )}

          {/* Étape 2: Code */}
          {step === 2 && (
            <form className="space-y-6" onSubmit={handleCodeSubmit}>
              {error && (
                <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              <div className="bg-blue-50 border border-blue-400 text-blue-700 px-4 py-3 rounded">
                Un code à 6 chiffres a été envoyé à <strong>{email}</strong>
              </div>

              <div>
                <label
                  htmlFor="code"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Code de vérification
                </label>
                <input
                  id="code"
                  name="code"
                  type="text"
                  required
                  maxLength={6}
                  className="input-field text-center text-2xl tracking-widest"
                  placeholder="000000"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                />
                <p className="mt-1 text-xs text-gray-500">
                  Le code expire dans 15 minutes
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300"
                >
                  Retour
                </button>
                <button
                  type="submit"
                  disabled={loading || code.length !== 6}
                  className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Vérification...' : 'Vérifier'}
                </button>
              </div>
            </form>
          )}

          {/* Étape 3: Nouveau mot de passe */}
          {step === 3 && (
            <form className="space-y-6" onSubmit={handlePasswordSubmit}>
              {error && (
                <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              {message && (
                <div className="bg-green-50 border border-green-400 text-green-700 px-4 py-3 rounded">
                  <div className="flex items-center">
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {message}
                  </div>
                </div>
              )}

              <div>
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Nouveau mot de passe
                </label>
                <input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  required
                  minLength={8}
                  className="input-field"
                  placeholder="Minimum 8 caractères"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Confirmer le mot de passe
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  minLength={8}
                  className="input-field"
                  placeholder="Confirmez votre mot de passe"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Réinitialisation...' : 'Réinitialiser le mot de passe'}
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="text-center text-sm text-gray-600">
          <p>
            Vous vous souvenez de votre mot de passe ?{' '}
            <Link
              to="/login"
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              Connectez-vous
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
