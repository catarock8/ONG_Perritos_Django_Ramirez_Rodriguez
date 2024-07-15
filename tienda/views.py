import datetime
from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt, csrf_protect
from django.contrib.auth.decorators import login_required
from django.contrib.auth import logout
from .models import Producto, Usuario, Carrito, CarritoProducto, Orden, OrdenProducto, Pago

@csrf_exempt
def index(request):
    productos = Producto.objects.all()
    user_info = None

    if request.session.get('rut'):
        user = Usuario.objects.get(rut=request.session['rut'])
        ordenes = Orden.objects.filter(usuario=user)
        user_info = {
            'nombres': user.nombres,
            'apellido_paterno': user.apellido_paterno,
            'apellido_materno': user.apellido_materno,
            'email': user.email,
            'ordenes': ordenes,
        }
    context = {'productos': productos, 'user_info': user_info}
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

    return redirect('tienda/paginadepagos.html')

def obtener_cantidad_producto(request, producto_id):
    producto = Producto.objects.get(id=producto_id)
    return JsonResponse({'cantidad': producto.cantidad})

# Las demás vistas
def fundacionpatas(request):
    context = {}
    return render(request, 'tienda/fundacionpatas.html', context)

def gatos(request):
    productos_gatos = Producto.objects.filter(categoria__nombre='Correa gato')
    user_info = None

    if request.session.get('rut'):
        user = Usuario.objects.get(rut=request.session['rut'])
        user_info = {
            'nombres': user.nombres,
            'apellido_paterno': user.apellido_paterno,
            'apellido_materno': user.apellido_materno,
            'email': user.email,
        }
    context = {'productos_gatos': productos_gatos, 'user_info': user_info}
    return render(request, 'tienda/gatos.html', context)

def gatos_bandanas(request):
    productos_bandanas_gatos = Producto.objects.filter(categoria__nombre='Bandana gato')
    user_info = None

    if request.session.get('rut'):
        user = Usuario.objects.get(rut=request.session['rut'])
        user_info = {
            'nombres': user.nombres,
            'apellido_paterno': user.apellido_paterno,
            'apellido_materno': user.apellido_materno,
            'email': user.email,
        }
    context = {'productos_bandanas_gatos': productos_bandanas_gatos, 'user_info': user_info}
    return render(request, 'tienda/gatos_bandanas.html', context)

def gatos_identificadores(request):
    productos_identificadores_gatos = Producto.objects.filter(categoria__nombre='Identificacion gato')
    user_info = None

    if request.session.get('rut'):
        user = Usuario.objects.get(rut=request.session['rut'])
        user_info = {
            'nombres': user.nombres,
            'apellido_paterno': user.apellido_paterno,
            'apellido_materno': user.apellido_materno,
            'email': user.email,
        }
    context = {'productos_identificadores_gatos': productos_identificadores_gatos, 'user_info': user_info}
    return render(request, 'tienda/gatos_identificadores.html', context)

def paginadepagos(request):
    context = {}
    return render(request, 'tienda/paginadepagos.html', context)

def perros(request):
    productos_perros = Producto.objects.filter(categoria__nombre='Correa perro')
    user_info = None

    if request.session.get('rut'):
        user = Usuario.objects.get(rut=request.session['rut'])
        user_info = {
            'nombres': user.nombres,
            'apellido_paterno': user.apellido_paterno,
            'apellido_materno': user.apellido_materno,
            'email': user.email,
        }
    context = {'productos_perros': productos_perros, 'user_info': user_info}
    return render(request, 'tienda/perros.html', context)

def perros_bandanas(request):
    productos_bandanas_perros = Producto.objects.filter(categoria__nombre='Bandana perro')
    user_info = None

    if request.session.get('rut'):
        user = Usuario.objects.get(rut=request.session['rut'])
        user_info = {
            'nombres': user.nombres,
            'apellido_paterno': user.apellido_paterno,
            'apellido_materno': user.apellido_materno,
            'email': user.email,
        }
    context = {'productos_bandanas_perros': productos_bandanas_perros, 'user_info': user_info}
    return render(request, 'tienda/perros_bandanas.html', context)

def perros_identificadores(request):
    productos_identificadores_perros = Producto.objects.filter(categoria__nombre='Identificacion perro')
    user_info = None

    if request.session.get('rut'):
        user = Usuario.objects.get(rut=request.session['rut'])
        user_info = {
            'nombres': user.nombres,
            'apellido_paterno': user.apellido_paterno,
            'apellido_materno': user.apellido_materno,
            'email': user.email,
        }
    context = {'productos_identificadores_perros': productos_identificadores_perros, 'user_info': user_info}
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

def login_user(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        password = request.POST.get('password')
        try:
            user = Usuario.objects.get(email=email, password=password)
            if user:
                request.session['rut'] = user.rut  # Guardar el RUT en la sesión
                return JsonResponse({'status': 'ok'}, status=200)
        except Usuario.DoesNotExist:
            return JsonResponse({'status': 'error', 'message': 'Invalid credentials'}, status=401)
    return JsonResponse({'status': 'error', 'message': 'Invalid request'}, status=400)  #cambio

def logout_user(request):
    try:
        # Eliminar la clave 'rut' de la sesión
        if 'rut' in request.session:
            del request.session['rut']

        # Usar la función de Django para cerrar sesión
        logout(request)
        return JsonResponse({'status': 'ok'}, status=200)
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)

@csrf_protect
def procesar_pago(request):
    if request.method == 'POST':
        rut = request.session.get('rut')
        if not rut:
            return JsonResponse({'status': 'error', 'message': 'Usuario no autenticado'}, status=401)

        usuario = Usuario.objects.get(rut=rut)
        carrito = request.session.get('carrito', {})
        total = request.POST.get('monto', 0)

        # Crear la orden
        orden = Orden.objects.create(usuario=usuario, total=0)

        # Procesar cada producto en el carrito
        productos_ids = []
        for producto_id, cantidad in carrito.items():
            producto = Producto.objects.get(id=producto_id)
            if producto.cantidad >= cantidad:
                producto.cantidad -= cantidad
                producto.save()
                orden_producto = OrdenProducto.objects.create(
                    orden=orden,
                    producto=producto,
                    cantidad=cantidad,
                    precio=producto.precio
                )
                orden_producto.save()
                productos_ids.append(str(orden_producto.id))
            else:
                return JsonResponse({'status': 'error', 'message': 'No hay suficiente cantidad de ' + producto.nombre}, status=400)

        orden.total = total
        orden.fecha = datetime.datetime.now()  # Corrección aquí
        orden.save()

        # Crear el registro de pago
        Pago.objects.create(
            usuario=usuario,
            monto=total,
            descripcion="Pago de la orden #{}".format(orden.id)
        )

        # Vaciar el carrito después de la compra
        request.session['carrito'] = {}

        return JsonResponse({'status': 'ok'}, status=200)

    return JsonResponse({'status': 'error', 'message': 'Método no permitido'}, status=405)
