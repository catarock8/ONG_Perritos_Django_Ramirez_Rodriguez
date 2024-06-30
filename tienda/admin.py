from django.contrib import admin
from .models import Categoria, Producto, Usuario, Carrito, CarritoProducto, Orden, OrdenProducto, Pago

# Register your models here.
admin.site.register(Categoria)
admin.site.register(Producto)
admin.site.register(Usuario)
admin.site.register(Carrito)
admin.site.register(CarritoProducto)
admin.site.register(Orden)
admin.site.register(OrdenProducto)
admin.site.register(Pago)