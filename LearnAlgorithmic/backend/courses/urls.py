from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from .views import *
from .admin_views import (
    module_list_create,
    module_detail,
    lesson_list_create,
    lesson_detail,
)
from .admin_views import (
    module_list_create,
    module_detail,
    lesson_list_create,
    lesson_detail,
    quiz_list_create,
    quiz_detail,
    exercise_list_create,
    exercise_detail,
    admin_stats,
)
from .admin_views import (
    # ... autres imports
    all_lessons_list,
)

router = DefaultRouter()
router.register(r'modules', ModuleViewSet, basename='module')
router.register(r'lessons', LessonViewSet, basename='lesson')

urlpatterns = [
    # Authentication
    path('auth/register/', UserRegistrationView.as_view(), name='register'),
    path('auth/login/', login_view, name='login'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/user/', current_user_view, name='current-user'),
    path('auth/password-reset/', password_reset_request, name='password-reset-request'),
    path('auth/verify-reset-code/', verify_reset_code, name='verify-reset-code'),
    path('auth/password-reset-confirm/', password_reset_confirm, name='password-reset-confirm'),
    
    # Router URLs
    path('', include(router.urls)),
    
    # Quiz et Exercices
    path('quiz/submit/', submit_quiz, name='submit-quiz'),
    path('exercise/submit/', submit_exercise, name='submit-exercise'),

    # Modules
    path('modules/<int:module_id>/mark-complete/', mark_module_complete, name='mark-module-complete'),

    # Dashboard et progression
    path('dashboard/stats/', dashboard_stats, name='dashboard-stats'),
    path('progress/', user_progress_view, name='user-progress'),
    path('admin/modules/', module_list_create, name='admin-module-list'),
    path('admin/modules/<int:pk>/', module_detail, name='admin-module-detail'),
    path('admin/lessons/', lesson_list_create, name='admin-lesson-list'),
    path('admin/lessons/<int:pk>/', lesson_detail, name='admin-lesson-detail'),

    # Routes quiz et exercices (admin)
    path('admin/quizzes/', quiz_list_create, name='admin-quiz-list'),
    path('admin/quizzes/<int:pk>/', quiz_detail, name='admin-quiz-detail'),
    path('admin/exercises/', exercise_list_create, name='admin-exercise-list'),
    path('admin/exercises/<int:pk>/', exercise_detail, name='admin-exercise-detail'),

    path('admin/all-lessons/', all_lessons_list, name='admin-all-lessons'),

    path('admin/stats/', admin_stats, name='admin-stats'),
]
