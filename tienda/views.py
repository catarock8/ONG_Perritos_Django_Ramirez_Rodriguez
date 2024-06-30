from django.shortcuts import render, redirect
from django.http import JsonResponse
from .models import Producto, Usuario, Carrito, CarritoProducto, Orden, OrdenProducto

def index(request):
    productos = Producto.objects.all()
    context = {'productos': productos}
    return render(request, 'tienda/index.html', context)

def realizar_compra(request):
    carrito = request.session.get('carrito', {})
    usuario = Usuario.objects.get(rut=request.user.username)  # Asumiendo que el usuario está autenticado y su nombre de usuario es su RUT
    total = 0

    # Crear la orden
    orden = Orden.objects.create(usuario=usuario, total=0)
    
    # Procesar cada producto en el carrito
    for producto_id, cantidad in carrito.items():
        producto = Producto.objects.get(id=producto_id)
        if producto.cantidad >= cantidad:
            producto.cantidad -= cantidad
            producto.save()
            total += producto.precio * cantidad
            OrdenProducto.objects.create(
                orden=orden,
                producto=producto,
                cantidad=cantidad,
                precio=producto.precio
            )
        else:
            # Manejar caso donde no hay suficiente cantidad
            return redirect('carrito')  # Redirigir al carrito o manejar el error

    orden.total = total
    orden.save()
    
    # Vaciar el carrito después de la compra
    request.session['carrito'] = {}

    return redirect('paginadepagos')

def obtener_cantidad_producto(request, producto_id):
    producto = Producto.objects.get(id=producto_id)
    return JsonResponse({'cantidad': producto.cantidad})

# Las demás vistas
def fundacionpatas(request):
    context = {}
    return render(request, 'tienda/fundacionpatas.html', context)

def gatos(request):
    productos_gatos = Producto.objects.filter(categoria__nombre='Correa gato')
    context = {'productos_gatos': productos_gatos}
    return render(request, 'tienda/gatos.html', context)

def gatos_bandanas(request):
    productos_bandanas_gatos = Producto.objects.filter(categoria__nombre='Bandana gato')
    context = {'productos_bandanas_gatos': productos_bandanas_gatos}
    return render(request, 'tienda/gatos_bandanas.html', context)

def gatos_identificadores(request):
    productos_identificadores_gatos = Producto.objects.filter(categoria__nombre='Identificacion gato')
    context = {'productos_identificadores_gatos': productos_identificadores_gatos}
    return render(request, 'tienda/gatos_identificadores.html', context)

def paginadepagos(request):
    context = {}
    return render(request, 'tienda/paginadepagos.html', context)

def perros(request):
    productos_perros = Producto.objects.filter(categoria__nombre='Correa perro')
    context = {'productos_perros': productos_perros}
    return render(request, 'tienda/perros.html', context)

def perros_bandanas(request):
    productos_bandanas_perros = Producto.objects.filter(categoria__nombre='Bandana perro')
    context = {'productos_bandanas_perros': productos_bandanas_perros}
    return render(request, 'tienda/perros_bandanas.html', context)

def perros_identificadores(request):
    productos_identificadores_perros = Producto.objects.filter(categoria__nombre='Identificacion perro')
    context = {'productos_identificadores_perros': productos_identificadores_perros}
    return render(request, 'tienda/perros_identificadores.html', context)

def registro(request):
    if request.method == 'POST':
        rut = request.POST.get('rut')
        nombres = request.POST.get('nombres')
        apellido_paterno = request.POST.get('apellido_paterno')
        apellido_materno = request.POST.get('apellido_materno')
        email = request.POST.get('email')
        password = request.POST.get('password')
        confirm_password = request.POST.get('confirmPassword')

        # Validación de campos
        if password != confirm_password:
            return render(request, 'tienda/registro.html', {'error': 'Las contraseñas no coinciden'})

        # Crear instancia del modelo Usuario y guardar en la base de datos
        usuario = Usuario(rut=rut, nombres=nombres, apellido_paterno=apellido_paterno, apellido_materno=apellido_materno, email=email, password=password)
        usuario.save()

        return render(request, 'tienda/registro.html', {'success': True})
        #hola
    else:
        return render(request, 'tienda/registro.html')
