from django.db import models

class Tarifa(models.Model):
    tipo = models.CharField(max_length=50)
    precio = models.DecimalField(max_digits=6, decimal_places=2)
    descripcion = models.TextField()
    def __str__(self):
        return f"{self.nombre} - {self.precio}€"

class Monitor(models.Model):
    nombre = models.CharField(max_length=100)
    especialidad = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    def __str__(self):
        return self.nombre

class Socio(models.Model):
    nombre = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    tarifa = models.ForeignKey(Tarifa, on_delete=models.SET_NULL, null=True)
    def __str__(self):
        return self.nombre
    
class Clase(models.Model):
    nombre=models.CharField(max_length=100)
    horario = models.DateTimeField()
    monitor = models.ForeignKey(Monitor, on_delete=models.SET_NULL, null=True)
    asistentes = models.ManyToManyField(Socio, blank=True)
    def __str__(self):
        return f"{self.nombre} - {self.horario}"
