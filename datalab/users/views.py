from django.http import HttpResponse
from django.shortcuts import render
from django.contrib.auth import authenticate, login
from django.contrib.auth.decorators import login_required
from .forms import LoginForm

def user_login(request):
    if request.method == "POST":
        form = LoginForm(request.POST)
        if form.is_valid():
            data = form.cleaned_data
            user = authenticate(
                request, username=data['username'], 
                password=data['password'])
            if user is not None:
                login(request,user)
                return HttpResponse("User authenticated and logged in")
            else:
                return HttpResponse("Invalidad Credentials")


    else:
        form = LoginForm()
    return render(request, 'login/login.html', {'form':form})
    
@login_required
def index(request):
    return render(request, 'index.html')