document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. SEGURIDAD ---
    const usuario = localStorage.getItem('fitgym_session');
    const esAdmin = localStorage.getItem('fitgym_is_admin') === 'true';

    if (!usuario || !esAdmin) {
        window.location.href = 'index.html';
        return;
    }

    // --- 2. CONFIGURACIÓN DEL BACKEND ---
    const API_URL = 'http://localhost:8000/api/monitores'; 
    const contenedorMonitores = document.getElementById('contenedor-monitores');

    // --- NUEVO: CONSTANTES PARA CREAR ---
    const modalCrear = document.getElementById('modal-crear');
    const btnNuevoMonitor = document.getElementById('btn-nuevo-monitor');

    // --- 3. LÓGICA DE MENÚ Y LOGOUT ---
    const btnLogout = document.getElementById('btn-logout');
    if (btnLogout) {
        btnLogout.onclick = (e) => {
            e.preventDefault();
            localStorage.clear();
            window.location.href = 'index.html';
        };
    }

    // --- NUEVO: LÓGICA APERTURA/CIERRE MODAL CREAR ---
    if (btnNuevoMonitor) {
        btnNuevoMonitor.onclick = () => {
            document.getElementById('form-crear').reset();
            modalCrear.style.display = 'flex';
        };
    }

    if (document.getElementById('btn-cerrar-crear')) {
        document.getElementById('btn-cerrar-crear').onclick = () => modalCrear.style.display = 'none';
    }
    if (document.getElementById('btn-cancelar-crear')) {
        document.getElementById('btn-cancelar-crear').onclick = () => modalCrear.style.display = 'none';
    }

    // --- 4. LEER DATOS REALES (GET) ---
    async function cargarMonitores() {
        if (!contenedorMonitores) return;
        
        try {
            const respuesta = await fetch(API_URL);
            if (!respuesta.ok) throw new Error('Error al conectar con el servidor');
            
            const monitores = await respuesta.json();
            renderizarMonitores(monitores);
        } catch (error) {
            console.error("Error de conexión:", error);
            contenedorMonitores.innerHTML = `<div class="mensaje-carga" style="color: #ef4444;">
                <i class="fas fa-exclamation-triangle"></i> No se pudo conectar con la base de datos.
            </div>`;
        }
    }

    // --- 5. DIBUJAR LAS TARJETAS DINÁMICAMENTE ---
    function renderizarMonitores(listaMonitores) {
        contenedorMonitores.innerHTML = ''; 

        if (listaMonitores.length === 0) {
            contenedorMonitores.innerHTML = '<div class="mensaje-carga">No hay monitores registrados en el sistema.</div>';
            return;
        }

        listaMonitores.forEach(monitor => {
            let tagsClases = '';
            if (monitor.clases && String(monitor.clases).trim() !== "") {
                const textoClases = String(monitor.clases);
                const arrayClases = textoClases.split(',');
                arrayClases.forEach(clase => {
                    if(clase.trim() !== "") {
                        tagsClases += `<span class="tag">${clase.trim()}</span>`;
                    }
                });
            } else {
                tagsClases = '<span class="tag" style="background: #e2e8f0; color: #64748b;">Sin clases</span>';
            }

            const tarjetaHTML = `
                <div class="monitor-card" data-id="${monitor.id}">
                    <div class="avatar-container">
                        <div class="avatar"><i class="far fa-user"></i></div>
                    </div>
                    <div class="monitor-info">
                        <h3>${monitor.nombre} ${monitor.apellidos || ''}</h3>
                        <p class="email"><i class="far fa-envelope"></i> ${monitor.email}</p>
                        <div class="clases-tags">
                            <span class="tag-label">Clases:</span>
                            ${tagsClases}
                        </div>
                    </div>
                    <div class="monitor-actions">
                        <button class="btn btn-primary btn-editar" data-id="${monitor.id}"><i class="far fa-edit"></i> Editar todo</button>
                        <button class="btn btn-success btn-patch" data-id="${monitor.id}"><i class="far fa-envelope"></i> Editar clases/email</button>
                        <button class="btn btn-danger btn-eliminar" data-id="${monitor.id}"><i class="far fa-trash-alt"></i> Eliminar</button>
                    </div>
                </div>
            `;
            contenedorMonitores.innerHTML += tarjetaHTML;
        });
        asignarEventosBotones();
    }

    // --- 6. EVENTOS DE LOS BOTONES ---
    function asignarEventosBotones() {
        // BORRAR (DELETE)
        document.querySelectorAll('.btn-eliminar').forEach(boton => {
            boton.addEventListener('click', async (evento) => {
                const id = evento.target.closest('button').dataset.id;
                if (confirm(`¿Eliminar al monitor de forma permanente?`)) {
                    try {
                        const respuesta = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
                        if (respuesta.ok) cargarMonitores(); 
                        else alert('Error: El servidor no pudo eliminar el registro.');
                    } catch (error) { console.error(error); }
                }
            });
        });

        // EDITAR TODO (PUT)
        document.querySelectorAll('.btn-editar').forEach(boton => {
            boton.addEventListener('click', (evento) => {
                const id = evento.target.closest('button').dataset.id;
                const tarjeta = evento.target.closest('.monitor-card');
                const nombreCompleto = tarjeta.querySelector('h3').innerText.split(' ');
                const email = tarjeta.querySelector('.email').innerText.trim();
                const tags = tarjeta.querySelectorAll('.tag');
                let arrayClases = [];
                tags.forEach(tag => arrayClases.push(tag.innerText));
                if (arrayClases[0] === 'Sin clases') arrayClases = [];

                document.getElementById('edit-id').value = id;
                document.getElementById('edit-nombre').value = nombreCompleto[0] || '';
                document.getElementById('edit-apellidos').value = nombreCompleto.slice(1).join(' ') || '';
                document.getElementById('edit-email').value = email;
                document.getElementById('edit-clases').value = arrayClases.join(', ');
                document.getElementById('modal-editar').style.display = 'flex';
            });
        });

        // EDITAR PARCIAL (PATCH)
        document.querySelectorAll('.btn-patch').forEach(boton => {
            boton.addEventListener('click', (evento) => {
                const id = evento.target.closest('button').dataset.id;
                const tarjeta = evento.target.closest('.monitor-card');
                const email = tarjeta.querySelector('.email').innerText.trim();
                const tags = tarjeta.querySelectorAll('.tag');
                let arrayClases = [];
                tags.forEach(tag => arrayClases.push(tag.innerText));
                if (arrayClases[0] === 'Sin clases') arrayClases = [];

                document.getElementById('patch-id').value = id;
                document.getElementById('patch-email').value = email;
                document.getElementById('patch-clases').value = arrayClases.join(', ');
                document.getElementById('modal-patch').style.display = 'flex';
            });
        });
    }

    // --- 7. LÓGICA DE LOS MODALES ---
    const modalEditar = document.getElementById('modal-editar');
    const formEditar = document.getElementById('form-editar');
    if (document.getElementById('btn-cerrar-modal')) document.getElementById('btn-cerrar-modal').onclick = () => modalEditar.style.display = 'none';
    if (document.getElementById('btn-cancelar')) document.getElementById('btn-cancelar').onclick = () => modalEditar.style.display = 'none';

    if (formEditar) {
        formEditar.addEventListener('submit', async (evento) => {
            evento.preventDefault(); 
            const id = document.getElementById('edit-id').value;
            const datosActualizados = {
                nombre: document.getElementById('edit-nombre').value,
                apellidos: document.getElementById('edit-apellidos').value,
                email: document.getElementById('edit-email').value,
                clases: document.getElementById('edit-clases').value 
            };
            try {
                const respuesta = await fetch(`${API_URL}/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(datosActualizados)
                });
                if (respuesta.ok) {
                    modalEditar.style.display = 'none';
                    cargarMonitores(); 
                } else alert('Error en el PUT.');
            } catch (error) { console.error(error); }
        });
    }

    const modalPatch = document.getElementById('modal-patch');
    if (document.getElementById('btn-cerrar-patch')) document.getElementById('btn-cerrar-patch').onclick = () => modalPatch.style.display = 'none';
    if (document.getElementById('btn-cancelar-patch')) document.getElementById('btn-cancelar-patch').onclick = () => modalPatch.style.display = 'none';

    const btnEnviarPatch = document.getElementById('btn-enviar-patch');
    if (btnEnviarPatch) {
        btnEnviarPatch.addEventListener('click', enviarPatch);
    }

    // --- NUEVO: FUNCIÓN CREAR MONITOR (POST) ---
    window.crearMonitor = async function() {
        const datos = {
            nombre: document.getElementById('crear-nombre').value,
            email: document.getElementById('crear-email').value,
            clases: document.getElementById('crear-clases').value
        };

        try {
            const respuesta = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datos)
            });

            if (respuesta.ok) {
                modalCrear.style.display = 'none';
                alert("Monitor creado con éxito");
                location.reload(); 
            } else {
                alert("Error al crear el monitor");
            }
        } catch (error) { console.error("Error:", error); }
    };

    // --- FUNCIÓN ENVIAR PATCH ---
    async function enviarPatch() {
        const id = document.getElementById('patch-id').value;
        const email = document.getElementById('patch-email').value;
        const clases = document.getElementById('patch-clases').value;
        const datos = { email, clases };

        try {
            const respuesta = await fetch(`${API_URL}/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datos)
            });
            if (respuesta.ok) {
                modalPatch.style.display = 'none';
                alert("¡Guardado correctamente!");
                location.reload(); 
            } else {
                alert("Error en el servidor");
            }
        } catch (error) { console.error("Error:", error); }
    }

    // --- 8. INICIAR ---
    cargarMonitores();
});