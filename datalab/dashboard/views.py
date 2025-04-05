from django.shortcuts import render, get_object_or_404, redirect
from datasets.models import Dataset# Tag

#from datasets.forms import CreateDatasetForm


def index(request):
    datasets = Dataset.objects.all()
    context= {'datasets':datasets}
    """recent_datasets = Dataset.objects.all().order_by('-date_added')[1:6]  # Get the next 5 recent posts
    context= {'datasets':datasets,
        'recent_datasets': recent_datasets}"""
    return render(request, 'dashboard/index.html', context)