document.addEventListener('DOMContentLoaded', () => {
    
    // 1. OBTENER DATOS
    const usuario = localStorage.getItem('fitgym_session');
    const esAdmin = localStorage.getItem('fitgym_is_admin') === 'true';

    // 2. SEGURIDAD (Pepe puede entrar, pero solo si hay sesión)
    if (!usuario) {
        window.location.href = 'index.html';
        return;
    }

    // 3. LOGOUT (Asegúrate de que el ID en el HTML sea 'btn-logout')
    const btnLogout = document.getElementById('btn-logout');
    if (btnLogout) {
        btnLogout.onclick = (e) => {
            e.preventDefault();
            localStorage.clear();
            window.location.href = 'index.html';
        };
    }

    // 4. CONTROL DE VISIBILIDAD PARA PEPE
    // Si el usuario es Pepe, ocultamos las opciones de Monitores y Socios
    if (!esAdmin) {
        document.querySelectorAll('.solo-admin').forEach(el => {
            el.style.setProperty('display', 'none', 'important');
        });
    }

    // 5. PONER NOMBRE EN CABECERA
    const nombreHeader = document.getElementById('nombre-usuario-display');
    if (nombreHeader) nombreHeader.innerText = usuario;

    // --- 6. CONFIGURACIÓN DEL BACKEND ---
    const API_URL = 'http://localhost:8000/api/clases'; 
    const contenedorClases = document.getElementById('contenedor-clases');

    // --- 7. LEER DATOS REALES (GET) ---
    async function cargarClases() {
        if (!contenedorClases) return;
        
        try {
            const respuesta = await fetch(API_URL);
            if (!respuesta.ok) throw new Error('Error al conectar con el servidor');
            
            const clases = await respuesta.json();
            renderizarClases(clases);
        } catch (error) {
            console.error("Error de conexión:", error);
            contenedorClases.innerHTML = `<div class="mensaje-carga" style="color: #ef4444;">
                <i class="fas fa-exclamation-triangle"></i> No se pudo conectar con la base de datos de clases.
            </div>`;
        }
    }

    // --- 8. DIBUJAR LAS TARJETAS DINÁMICAMENTE ---
    function renderizarClases(listaClases) {
        contenedorClases.innerHTML = ''; 

        if (listaClases.length === 0) {
            contenedorClases.innerHTML = '<div class="mensaje-carga">No hay clases ofertadas en este momento.</div>';
            return;
        }

        listaClases.forEach(clase => {
            const nombre = clase.nombre || 'Clase sin nombre';
            const horario = clase.horario || 'Horario no especificado';
            
            // Tu backend ya hace el trabajo duro, así que simplemente cogemos la variable:
            const monitorInfo = clase.monitor_nombre;

            // (Opcional) Si quieres mostrar también los asistentes que calculaste:
            const numAsistentes = clase.asistentes_count || 0;

            const tarjetaHTML = `
                <div class="clases-card">
                    <div class="avatar-container">
                        <div class="avatar"><i class="fas fa-running"></i></div>
                    </div>
                    <div class="clases-info">
                        <h3>${nombre}</h3>
                        
                        <p class="horario"><i class="far fa-clock"></i> ${horario}</p>
                        
                        <div class="clases-tags">
                            <span class="tag-label">Personal:</span>
                            <span class="etiqueta-precio" style="background-color: #e0e7ff; color: #4f46e5;">
                                <i class="fas fa-user-tie"></i> ${monitorInfo}
                            </span>
                        </div>
                    </div>
                </div>
            `;
            contenedorClases.innerHTML += tarjetaHTML;
        });
    }

    // --- FUNCIONALIDAD DEL MENÚ HAMBURGUESA ---
    const btnMenu = document.getElementById('btn-menu-movil');
    const navMenu = document.querySelector('.sidebar nav'); // Seleccionamos el nav

    if (btnMenu && navMenu) {
        btnMenu.addEventListener('click', () => {
            navMenu.classList.toggle('activo');
        });
    }

    // --- 9. INICIAR PETICIÓN ---
    cargarClases();
});