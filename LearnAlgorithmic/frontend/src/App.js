import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Modules from './pages/Modules';
import ModuleDetail from './pages/ModuleDetail';
import LessonDetail from './pages/LessonDetail';
import AdminDashboard from './pages/AdminDashboard';
import ModuleEditor from './pages/ModuleEditor';
import LessonEditor from './pages/LessonEditor';
import QuizEditor from './pages/QuizEditor';
import ExerciseEditor from './pages/ExerciseEditor';
// Composant de route protégée
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Composant de route publique
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  return !isAuthenticated ? children : <Navigate to="/dashboard" replace />;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Routes publiques */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />

      {/* Routes d'administration - AVANT les autres routes */}
      <Route
        path="/admin/modules/:moduleId"
        element={
          <PrivateRoute>
            <ModuleEditor />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/lessons/:lessonId"
        element={
          <PrivateRoute>
            <LessonEditor />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <PrivateRoute>
            <AdminDashboard />
          </PrivateRoute>
        }
      />

      {/* Routes utilisateur normales */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/modules/:moduleId"
        element={
          <PrivateRoute>
            <ModuleDetail />
          </PrivateRoute>
        }
      />
      <Route
        path="/modules"
        element={
          <PrivateRoute>
            <Modules />
          </PrivateRoute>
        }
      />
      <Route
        path="/lessons/:lessonId"
        element={
          <PrivateRoute>
            <LessonDetail />
          </PrivateRoute>
        }
      />
      <Route
  path="/admin/quizzes/:quizId"
  element={
    <PrivateRoute>
      <QuizEditor />
    </PrivateRoute>
  }
/>
<Route
  path="/admin/exercises/:exerciseId"
  element={
    <PrivateRoute>
      <ExerciseEditor />
    </PrivateRoute>
  }
/>

      {/* Redirection par défaut - EN DERNIER */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;