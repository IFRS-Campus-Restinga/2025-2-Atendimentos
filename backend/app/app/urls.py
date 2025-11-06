from django.contrib import admin
from django.urls import path, include
from services.views.complemento_views import ComplementoCadastroView
from django.shortcuts import redirect

urlpatterns = [
    #path('', lambda request: redirect('/admin/')),
    path('', lambda request: redirect('/services/')),
    path('admin/', admin.site.urls),
    path('services/', include('services.urls'))
]