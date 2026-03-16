from django.urls import path
from . import views

urlpatterns = [
    path('tarifas', views.lista_tarifas),
    path('socios', views.gestion_socios),
    path('socios/<int:id>', views.detalle_socio),
    path('monitores', views.gestion_monitores),
    path('monitores/<int:id>', views.detalle_monitor),
    path('clases', views.gestion_clases),
    path('clases/<int:id>', views.detalle_clase),
]