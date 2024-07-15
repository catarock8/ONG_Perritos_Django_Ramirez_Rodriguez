from django.db import models
from django.db.models.signals import post_delete, post_save
from django.dispatch import receiver

class Categoria(models.Model):
    id = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100)

    def __str__(self):
        return self.nombre

class Producto(models.Model):
    id = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField()
    precio = models.DecimalField(max_digits=10, decimal_places=0)
    imagen = models.ImageField(upload_to='productos/')
    categoria = models.ForeignKey(Categoria, on_delete=models.CASCADE)
    cantidad = models.PositiveIntegerField(default=0)  # Campo añadido

    def __str__(self):
        return self.nombre

class Usuario(models.Model):
    rut = models.CharField(max_length=12, primary_key=True)
    nombres = models.CharField(max_length=100)
    apellido_paterno = models.CharField(max_length=100)
    apellido_materno = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.nombres} {self.apellido_paterno} {self.apellido_materno}"

class Carrito(models.Model):
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    productos = models.ManyToManyField(Producto, through='CarritoProducto')

    def __str__(self):
        return f"Carrito de {self.usuario.nombres} {self.usuario.apellido_paterno}"
 
class CarritoProducto(models.Model):
    carrito = models.ForeignKey(Carrito, on_delete=models.CASCADE)
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE)
    cantidad = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"{self.cantidad} x {self.producto.nombre}"

class Orden(models.Model):
    id = models.AutoField(primary_key=True)
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    fecha = models.DateTimeField(auto_now_add=True)
    total = models.DecimalField(max_digits=10, decimal_places=2)
    productos_ids = models.TextField(default='')  # Nuevo campo para almacenar las IDs de productos

    def __str__(self):
        return f"Orden {self.id} de {self.usuario.nombres} {self.usuario.apellido_paterno}"
    
class OrdenProducto(models.Model):
    id = models.AutoField(primary_key=True)
    orden = models.ForeignKey(Orden, on_delete=models.CASCADE, related_name='ordenes_producto')
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE)
    cantidad = models.PositiveIntegerField(default=1)
    precio = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.cantidad} x {self.producto.nombre} (Orden {self.orden.id})"

# Signal para ajustar las IDs después de eliminar una orden
@receiver(post_delete, sender=Orden)
def rearrange_ids(sender, **kwargs):
    for index, obj in enumerate(Orden.objects.all(), start=1):
        obj.id = index
        obj.save()

@receiver(post_delete, sender=OrdenProducto)
def rearrange_orden_producto_ids(sender, **kwargs):
    for index, obj in enumerate(OrdenProducto.objects.all(), start=1):
        obj.id = index
        obj.save()

@receiver(post_save, sender=OrdenProducto)
def update_productos_ids(sender, instance, **kwargs):
    orden = instance.orden
    orden.productos_ids += f"{instance.id},"
    orden.save()

class Pago(models.Model):
    id = models.AutoField(primary_key=True)
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    monto = models.DecimalField(max_digits=10, decimal_places=2)
    descripcion = models.TextField()

    def __str__(self):
        return f"Pago {self.id} de {self.usuario.rut} por ${self.monto}"
