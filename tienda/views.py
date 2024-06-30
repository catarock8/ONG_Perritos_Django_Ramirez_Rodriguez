from django.shortcuts import render

# Create your views here.

def index(request):
    context = {}
    return render(request, 'tienda/index.html', context)

def fundacionpatas(request):
    context = {}
    return render(request, 'tienda/fundacionpatas.html', context)

def gatos(request):
    context = {}
    return render(request, 'tienda/gatos.html', context)

def gatos_bandanas(request):
    context = {}
    return render(request, 'tienda/gatos_bandanas.html', context)

def gatos_identificadores(request):
    context = {}
    return render(request, 'tienda/gatos_identificadores.html', context)

def paginadepagos(request):
    context = {}
    return render(request, 'tienda/paginadepagos.html', context)

def perros(request):
    context = {}
    return render(request, 'tienda/perros.html', context)

def perros_bandanas(request):
    context = {}
    return render(request, 'tienda/perros_bandanas.html', context)

def perros_identificadores(request):
    context = {}
    return render(request, 'tienda/perros_identificadores.html', context)

def registro(request):
    context = {}
    return render(request, 'tienda/registro.html', context)
