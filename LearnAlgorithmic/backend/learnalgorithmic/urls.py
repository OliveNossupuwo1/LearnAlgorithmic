from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import TemplateView
import os

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('courses.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

# En production, servir le build React pour toutes les autres routes
# Le fichier index.html est dans TEMPLATES DIRS (frontend/build/)
react_index = os.path.join(settings.REACT_BUILD_DIR, 'index.html')
if os.path.exists(react_index):
    urlpatterns += [
        re_path(r'^(?!api/|admin/).*$', TemplateView.as_view(template_name='index.html')),
    ]
