import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Tarifa, Monitor, Socio, Clase

def socio_to_dict(s):
    return{
        'id': s.id,
        'email': s.email,
        'tarifa_id': s.tarifa.id if s.tarifa else None,
        'tarifa_nombre': s.tarifa.nombre if s.tarifa else 'Sin tarifa'
    }

def monitor_to_dict(m):
    return {
        'id': m.id,
        'nombre': m.nombre,
        'especialidad': m.especialidad,
        'email': m.email
    }

def clase_to_dict(c):
    return {
        'id': c.id,
        'nombre': c.nombre,
        'horario': c.horario.isoformat() if c.horario else None, 
        'monitor_id': c.monitor.id if c.monitor else None,
        'monitor_nombre': c.monitor.nombre if c.monitor else 'Sin monitor asignado',
        'asistentes_count': c.asistentes.count()
    }
    
def lista_tarifas(request):
    if request.method == 'GET':
        tarifas = list(Tarifa.objects.values())
        return JsonResponse(tarifas, safe=False)

@csrf_exempt
def gestion_socios(request):
    if request.method == 'GET':
        socios = [socio_to_dict(s) for s in Socio.objects.all()]
        return JsonResponse(socios, safe=False)
    
    elif request.method == 'POST':
        data = json.loads(request.body)
        nuevo_socio = Socio.objects.create(
            nombre=data['nombre'], 
            email=data['email'],
            tarifa_id=data.get('tarifa_id')
        )
        return JsonResponse(socio_to_dict(nuevo_socio), status=201)

@csrf_exempt
def detalle_socio(request, id):
    try:
        socio = Socio.objects.get(id=id)
    except Socio.DoesNotExist:
        return JsonResponse({'error': 'Socio no encontrado'}, status=404)

    if request.method == 'GET':
        return JsonResponse(socio_to_dict(socio))

    elif request.method == 'PUT':
        data = json.loads(request.body)
        socio.nombre = data['nombre']
        socio.email = data['email']
        socio.tarifa_id = data.get('tarifa_id')
        socio.save()
        return JsonResponse(socio_to_dict(socio))

    elif request.method == 'PATCH':
        data = json.loads(request.body)
        if 'nombre' in data: socio.nombre = data['nombre']
        if 'email' in data: socio.email = data['email']
        if 'tarifa_id' in data: socio.tarifa_id = data['tarifa_id']
        socio.save()
        return JsonResponse(socio_to_dict(socio))

    elif request.method == 'DELETE':
        socio.delete()
        return JsonResponse({'mensaje': 'Socio eliminado correctamente'}, status=204)


@csrf_exempt
def gestion_monitores(request):
    if request.method == 'GET':
        monitores = [monitor_to_dict(m) for m in Monitor.objects.all()]
        return JsonResponse(monitores, safe=False)
    
    elif request.method == 'POST':
        data = json.loads(request.body)
        nuevo_monitor = Monitor.objects.create(
            nombre=data['nombre'], 
            especialidad=data['especialidad'], 
            email=data['email']
        )
        return JsonResponse(monitor_to_dict(nuevo_monitor), status=201)

@csrf_exempt
def detalle_monitor(request, id):
    try:
        monitor = Monitor.objects.get(id=id)
    except Monitor.DoesNotExist:
        return JsonResponse({'error': 'Monitor no encontrado'}, status=404)

    if request.method == 'GET':
        return JsonResponse(monitor_to_dict(monitor))

    elif request.method == 'PUT':
        data = json.loads(request.body)
        monitor.nombre = data['nombre']
        monitor.especialidad = data['especialidad']
        monitor.email = data['email']
        monitor.save()
        return JsonResponse(monitor_to_dict(monitor))

    elif request.method == 'PATCH':
        data = json.loads(request.body)
        if 'nombre' in data: monitor.nombre = data['nombre']
        if 'especialidad' in data: monitor.especialidad = data['especialidad']
        if 'email' in data: monitor.email = data['email']
        monitor.save()
        return JsonResponse(monitor_to_dict(monitor))

    elif request.method == 'DELETE':
        monitor.delete()
        return JsonResponse({'mensaje': 'Monitor eliminado correctamente'}, status=204)
    
@csrf_exempt
def gestion_clases(request):
    if request.method == 'GET':
        clases = [clase_to_dict(c) for c in Clase.objects.all()]
        return JsonResponse(clases, safe=False)
    
    elif request.method == 'POST':
        data = json.loads(request.body)
        nueva_clase = Clase.objects.create(
            nombre=data['nombre'], 
            horario=data['horario'], 
            monitor_id=data.get('monitor_id')
        )
        if 'asistentes' in data:
            nueva_clase.asistentes.set(data['asistentes'])
            
        return JsonResponse(clase_to_dict(nueva_clase), status=201)

@csrf_exempt
def detalle_clase(request, id):
    try:
        clase = Clase.objects.get(id=id)
    except Clase.DoesNotExist:
        return JsonResponse({'error': 'Clase no encontrada'}, status=404)

    if request.method == 'GET':
        return JsonResponse(clase_to_dict(clase))

    elif request.method == 'PATCH':
        data = json.loads(request.body)
        if 'horario' in data:
            clase.horario = data['horario']

        if 'asistentes' in data:
            clase.asistentes.set(data['asistentes'])
            
        clase.save()
        return JsonResponse(clase_to_dict(clase))
