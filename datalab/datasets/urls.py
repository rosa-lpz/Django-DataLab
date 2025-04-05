from django.urls import path, include

#from .views import render_datasets, datasets_index
from . import views

app_name = 'datasets'

urlpatterns = [
    # Index -  Homepage view, lists latest Datasets, Visualizations
    path('', views.datasets_index, name='datasets_index'),
    # Page for datasets
    path('datasets/', views.render_datasets, name='datasets'),
]