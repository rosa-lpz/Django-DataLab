from django.shortcuts import render
from .models import Dataset
#from .forms import DatasetForm

# The home page for Datasets
def datasets_index(request):
    return render(request, 'datasets/datasets.html') 


# Show all datasets
def render_datasets(request):
    datasets = Dataset.objects.all() #order_by('date_added')
    context = {'datasets':datasets}
    return render(request, 'datasets/datasets.html', context) 

"""
Show a single dataset in a table
def dataset(request,dataset_id):
    dataset = Dataset.objects.get(id=dataset_id)
    entries = topic.entry_set.order_by('-date_added')
    context = {'topic': topic, 'entries': entries}
    return render(request,'learning_logs/dataset.html', context)"""

# def new_dataset(request):