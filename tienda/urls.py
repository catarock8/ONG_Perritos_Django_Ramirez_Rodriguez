from django.urls import path
from . import views

urlpatterns = [
    path('index', views.index, name='index'),
    path('fundacionpatas/', views.fundacionpatas, name='fundacionpatas'),
    path('gatos/', views.gatos, name='gatos'),
    path('gatos_bandanas/', views.gatos_bandanas, name='gatos_bandanas'),
    path('gatos_identificadores/', views.gatos_identificadores, name='gatos_identificadores'),
    path('paginadepagos/', views.paginadepagos, name='paginadepagos'),
    path('perros/', views.perros, name='perros'),
    path('perros_bandanas/', views.perros_bandanas, name='perros_bandanas'),
    path('perros_identificadores/', views.perros_identificadores, name='perros_identificadores'),
    path('registro/', views.registro, name='registro'),
]
