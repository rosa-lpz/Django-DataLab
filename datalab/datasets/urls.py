from django.urls import path

from . import views

app_name = 'datasets'

urlpatterns = [
    # Index -  Homepage view, lists latest Datasets, Visualizations
    #path('', views.index, name='datasets'),
    # Page for datasets
    #path('datasets/', views.datasets, name='datasets'),
]