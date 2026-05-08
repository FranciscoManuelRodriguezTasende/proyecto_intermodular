document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. SEGURIDAD ---
    const usuario = localStorage.getItem('fitgym_session');
    const esAdmin = localStorage.getItem('fitgym_is_admin') === 'true';

    if (!usuario || !esAdmin) {
        window.location.href = 'index.html';
        return;
    }

    // --- 2. CONFIGURACIÓN DEL BACKEND ---
    const API_URL = 'http://localhost:8000/api/socios';
    const contenedorSocios = document.getElementById('contenedor-socios');
    let listaSociosGlobal = [];

    // --- CONSTANTES PARA MODALES ---
    const modalCrear = document.getElementById('modal-crear');
    const modalEditar = document.getElementById('modal-editar');
    const modalPatch = document.getElementById('modal-patch');

    // --- 3. LÓGICA DE MENÚ Y LOGOUT ---
    const btnLogout = document.getElementById('btn-logout');
    if (btnLogout) {
        btnLogout.onclick = (e) => {
            e.preventDefault();
            localStorage.clear();
            window.location.href = 'index.html';
        };
    }

    // --- 4. BUSCADOR EN TIEMPO REAL ---
    const buscador = document.getElementById('buscador-socios');
    if (buscador) {
        buscador.addEventListener('input', (evento) => {
            const textoBusqueda = evento.target.value.toLowerCase();
            
            // Filtramos la lista global buscando coincidencias en el nombre
            const sociosFiltrados = listaSociosGlobal.filter(socio => {
                // Usamos un string vacío por si el nombre viene nulo desde la base de datos
                const nombreSocio = (socio.nombre || '').toLowerCase();
                return nombreSocio.includes(textoBusqueda);
            });
            
            // Volvemos a pintar solo los que coinciden
            renderizarSocios(sociosFiltrados);
        });
    }

    // --- 5. LEER DATOS REALES (GET) ---
    async function cargarSocios() {
        if (!contenedorSocios) return;
        
        try {
            const respuesta = await fetch(API_URL);
            if (!respuesta.ok) throw new Error('Error al conectar con el servidor');
            
            const socios = await respuesta.json();
            listaSociosGlobal = socios; // Guardamos la lista completa para el buscador
            renderizarSocios(listaSociosGlobal);
        } catch (error) {
            console.error("Error de conexión:", error);
            contenedorSocios.innerHTML = `<div class="mensaje-carga" style="color: #ef4444;">
                <i class="fas fa-exclamation-triangle"></i> No se pudo conectar con la base de datos.
            </div>`;
        }
    }

    // --- 6. DIBUJAR LAS TARJETAS DINÁMICAMENTE ---
    function renderizarSocios(listaSocios) {
        contenedorSocios.innerHTML = ''; 

        if (listaSocios.length === 0) {
            contenedorSocios.innerHTML = '<div class="mensaje-carga">No se encontraron socios.</div>';
            return;
        }

        listaSocios.forEach(socio => {
            const nombre = socio.nombre || 'Sin nombre';
            const tarifaNombre = socio.tarifa_nombre || 'Sin tarifa';

            const tarjetaHTML = `
                <div class="monitor-card" data-id="${socio.id}">
                    <div class="avatar-container">
                        <div class="avatar"><i class="far fa-user"></i></div>
                    </div>
                    <div class="monitor-info">
                        <h3>${nombre}</h3>
                        <p class="email"><i class="far fa-envelope"></i> ${socio.email}</p>
                        <div class="clases-tags">
                            <span class="tag-label">Tarifa:</span>
                            <span class="tag">${tarifaNombre}</span>
                        </div>
                    </div>
                    <div class="monitor-actions">
                        <button class="btn btn-primary btn-editar" data-id="${socio.id}" data-tarifa-id="${socio.tarifa_id || ''}"><i class="far fa-edit"></i> Editar todo</button>
                        <button class="btn btn-success btn-patch" data-id="${socio.id}" data-tarifa-id="${socio.tarifa_id || ''}"><i class="far fa-envelope"></i> Editar tarifa/email</button>
                        <button class="btn btn-danger btn-eliminar" data-id="${socio.id}"><i class="far fa-trash-alt"></i> Eliminar</button>
                    </div>
                </div>
            `;
            contenedorSocios.innerHTML += tarjetaHTML;
        });
        asignarEventosBotones();
    }

    // --- 7. EVENTOS DE LOS BOTONES DE TARJETA ---
    function asignarEventosBotones() {
        // BORRAR (DELETE)
        document.querySelectorAll('.btn-eliminar').forEach(boton => {
            boton.addEventListener('click', async (evento) => {
                const id = evento.target.closest('button').dataset.id;
                if (confirm(`¿Eliminar al socio de forma permanente?`)) {
                    try {
                        const respuesta = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
                        if (respuesta.ok) cargarSocios(); 
                        else alert('Error al eliminar.');
                    } catch (error) { console.error(error); }
                }
            });
        });

        // EDITAR TODO (PUT)
        document.querySelectorAll('.btn-editar').forEach(boton => {
            boton.addEventListener('click', (evento) => {
                const btn = evento.target.closest('button');
                const id = btn.dataset.id;
                const tarifaId = btn.dataset.tarifaId;
                const tarjeta = btn.closest('.monitor-card');
                
                const nombre = tarjeta.querySelector('h3').innerText;
                const email = tarjeta.querySelector('.email').innerText.trim();

                document.getElementById('edit-id').value = id;
                document.getElementById('edit-nombre').value = nombre;
                document.getElementById('edit-email').value = email;
                document.getElementById('edit-tarifa').value = tarifaId;
                
                modalEditar.style.display = 'flex';
            });
        });

        // EDITAR PARCIAL (PATCH)
        document.querySelectorAll('.btn-patch').forEach(boton => {
            boton.addEventListener('click', (evento) => {
                const btn = evento.target.closest('button');
                const id = btn.dataset.id;
                const tarifaId = btn.dataset.tarifaId;
                const tarjeta = btn.closest('.monitor-card');
                
                const email = tarjeta.querySelector('.email').innerText.trim();

                document.getElementById('patch-id').value = id;
                document.getElementById('patch-email').value = email;
                document.getElementById('patch-tarifa').value = tarifaId;
                
                modalPatch.style.display = 'flex';
            });
        });
    }

    // --- 8. APERTURA Y CIERRE DE MODALES ---
    const btnNuevoSocio = document.getElementById('btn-nuevo-socio');
    if (btnNuevoSocio) {
        btnNuevoSocio.onclick = () => {
            document.getElementById('form-crear').reset();
            modalCrear.style.display = 'flex';
        };
    }

    // Cerrar modales
    const cerrarModal = (modal) => modal.style.display = 'none';
    
    if (document.getElementById('btn-cerrar-crear')) document.getElementById('btn-cerrar-crear').onclick = () => cerrarModal(modalCrear);
    if (document.getElementById('btn-cancelar-crear')) document.getElementById('btn-cancelar-crear').onclick = () => cerrarModal(modalCrear);
    
    if (document.getElementById('btn-cerrar-modal')) document.getElementById('btn-cerrar-modal').onclick = () => cerrarModal(modalEditar);
    if (document.getElementById('btn-cancelar')) document.getElementById('btn-cancelar').onclick = () => cerrarModal(modalEditar);
    
    if (document.getElementById('btn-cerrar-patch')) document.getElementById('btn-cerrar-patch').onclick = () => cerrarModal(modalPatch);
    if (document.getElementById('btn-cancelar-patch')) document.getElementById('btn-cancelar-patch').onclick = () => cerrarModal(modalPatch);


    // --- 9. FUNCIONES DE ENVÍO DE FORMULARIOS (POST, PUT, PATCH) ---

    // CREAR (POST)
    window.crearSocio = async function() {
        const tarifaId = document.getElementById('crear-tarifa').value;
        const datos = {
            nombre: document.getElementById('crear-nombre').value,
            email: document.getElementById('crear-email').value,
            tarifa_id: tarifaId ? parseInt(tarifaId) : null
        };

        try {
            const respuesta = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datos)
            });

            if (respuesta.ok) {
                cerrarModal(modalCrear);
                cargarSocios();
            } else alert("Error al crear el socio");
        } catch (error) { console.error(error); }
    };

    // EDITAR TODO (PUT)
    const formEditar = document.getElementById('form-editar');
    if (formEditar) {
        formEditar.addEventListener('submit', async (evento) => {
            evento.preventDefault(); 
            const id = document.getElementById('edit-id').value;
            const tarifaId = document.getElementById('edit-tarifa').value;
            const datosActualizados = {
                nombre: document.getElementById('edit-nombre').value,
                email: document.getElementById('edit-email').value,
                tarifa_id: tarifaId ? parseInt(tarifaId) : null
            };
            
            try {
                const respuesta = await fetch(`${API_URL}/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(datosActualizados)
                });
                if (respuesta.ok) {
                    cerrarModal(modalEditar);
                    cargarSocios(); 
                } else alert('Error al actualizar.');
            } catch (error) { console.error(error); }
        });
    }

    // EDITAR PARCIAL (PATCH)
    window.enviarPatch = async function() {
        const id = document.getElementById('patch-id').value;
        const tarifaId = document.getElementById('patch-tarifa').value;
        const datos = { 
            email: document.getElementById('patch-email').value, 
            tarifa_id: tarifaId ? parseInt(tarifaId) : null
        };

        try {
            const respuesta = await fetch(`${API_URL}/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datos)
            });
            if (respuesta.ok) { 
                cerrarModal(modalPatch);
                cargarSocios(); 
            } else alert("Error en el servidor");
        } catch (error) { console.error(error); }
    };

    // --- 10. INICIAR ---
    cargarSocios();
});