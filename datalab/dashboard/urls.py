from django.urls import path

from . import views

app_name = 'dashboard'

urlpatterns = [
    # Index -  Homepage view, lists latest Datasets, Visualizations
    path('', views.index, name='index'),
]