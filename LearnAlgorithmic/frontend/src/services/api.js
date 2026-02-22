import axios from 'axios';

const API_BASE_URL = `http://${window.location.hostname}:8000/api`;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token à chaque requête
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercepteur pour gérer le rafraîchissement du token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        const response = await axios.post(`${API_BASE_URL}/auth/refresh/`, {
          refresh: refreshToken,
        });

        const { access } = response.data;
        localStorage.setItem('access_token', access);

        originalRequest.headers.Authorization = `Bearer ${access}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Services d'authentification
export const authService = {
  register: async (userData) => {
    const response = await api.post('/auth/register/', userData);
    if (response.data.tokens) {
      localStorage.setItem('access_token', response.data.tokens.access);
      localStorage.setItem('refresh_token', response.data.tokens.refresh);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post('/auth/login/', credentials);
    if (response.data.tokens) {
      localStorage.setItem('access_token', response.data.tokens.access);
      localStorage.setItem('refresh_token', response.data.tokens.refresh);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/user/');
    return response.data;
  },

  passwordResetRequest: async (email) => {
    const response = await api.post('/auth/password-reset/', { email });
    return response.data;
  },

  verifyResetCode: async (email, code) => {
    const response = await api.post('/auth/verify-reset-code/', {
      email,
      code,
    });
    return response.data;
  },

  passwordResetConfirm: async (email, code, new_password) => {
    const response = await api.post('/auth/password-reset-confirm/', {
      email,
      code,
      new_password,
    });
    return response.data;
  },
};

// Services pour les modules
export const moduleService = {
  getAll: async () => {
    const response = await api.get('/modules/');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/modules/${id}/`);
    return response.data;
  },

  getLessons: async (moduleId) => {
    const response = await api.get(`/modules/${moduleId}/lessons/`);
    return response.data;
  },

  markComplete: async (moduleId) => {
    const response = await api.post(`/modules/${moduleId}/mark-complete/`);
    return response.data;
  },
};

// Services pour les leçons
export const lessonService = {
  getById: async (id) => {
    const response = await api.get(`/lessons/${id}/`);
    return response.data;
  },
};

// Services pour les quiz
export const quizService = {
  submit: async (quizId, answers) => {
    const response = await api.post('/quiz/submit/', {
      quiz_id: quizId,
      answers: answers,
    });
    return response.data;
  },
};

// Services pour les exercices
export const exerciseService = {
  submit: async (exerciseId, code) => {
    const response = await api.post('/exercise/submit/', {
      exercise_id: exerciseId,
      code: code,
    });
    return response.data;
  },

  resetAttempts: async (exerciseId) => {
    const response = await api.post('/exercise/reset/', {
      exercise_id: exerciseId,
    });
    return response.data;
  },

  getAttempts: async (exerciseId) => {
    const response = await api.get(`/exercise/${exerciseId}/attempts/`);
    return response.data;
  },
};

// Services pour l'interpréteur de pseudo-code
export const interpreterService = {
  execute: async (code, inputs = []) => {
    const response = await api.post('/interpreter/execute/', { code, inputs });
    return response.data;
  },
};

// Services pour le dashboard
export const dashboardService = {
  getStats: async () => {
    const response = await api.get('/dashboard/stats/');
    return response.data;
  },

  getProgress: async () => {
    const response = await api.get('/progress/');
    return response.data;
  },
};

export default api;
