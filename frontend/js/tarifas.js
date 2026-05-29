document.addEventListener('DOMContentLoaded', () => {
    
    const usuario = localStorage.getItem('fitgym_session');
    const esAdmin = localStorage.getItem('fitgym_is_admin') === 'true';

    if (!usuario) {
        window.location.href = 'index.html';
        return;
    }

    const btnLogout = document.getElementById('btn-logout');
    if (btnLogout) {
        btnLogout.onclick = (e) => {
            e.preventDefault();
            localStorage.clear();
            window.location.href = 'index.html';
        };
    }

    if (!esAdmin) {
        document.querySelectorAll('.solo-admin').forEach(el => {
            el.style.setProperty('display', 'none', 'important');
        });
    }

    const nombreHeader = document.getElementById('nombre-usuario-display');
    if (nombreHeader) nombreHeader.innerText = usuario;

    const API_URL = 'http://127.0.0.1:8000/api/tarifas'; 
    const contenedorTarifas = document.getElementById('contenedor-tarifas');

    async function cargarTarifas() {
        if (!contenedorTarifas) return;

        try {
            const respuesta = await fetch(API_URL);
            if (!respuesta.ok) throw new Error('Error al conectar con el servidor');
            
            const tarifas = await respuesta.json();
            renderizarTarifas(tarifas);
        } catch (error) {
            console.error("Error de conexión:", error);
            contenedorTarifas.innerHTML = `<div class="mensaje-carga" style="color: #ef4444;">
                <i class="fas fa-exclamation-triangle"></i> No se pudo conectar con la base de datos de tarifas.
            </div>`;
        }
    }

    function renderizarTarifas(listaTarifas) {
        contenedorTarifas.innerHTML = ''; 

        if (listaTarifas.length === 0) {
            contenedorTarifas.innerHTML = '<div class="mensaje-carga">No hay tarifas ofertadas en este momento.</div>';
            return;
        }

        listaTarifas.forEach(tarifa => {
            const tipo = tarifa.tipo || 'Sin nombre';
            const precio = parseFloat(tarifa.precio || 0).toFixed(2);
            const descripcion = tarifa.descripcion || 'Sin descripción disponible.';

            const tarjetaHTML = `
                <div class="flip-card">
                    <div class="flip-card-inner">
                        
                        <div class="flip-card-front">
                            <h2>${tipo}</h2>
                            <div class="precio">${precio}€</div>
                            <div class="mes">/mes</div>
                        </div>

                        <div class="flip-card-back">
                            <h3>¿Qué incluye?</h3>
                            <p>${descripcion}</p>
                        </div>

                    </div>
                </div>
            `;
            
            contenedorTarifas.innerHTML += tarjetaHTML;
        });
    }

    const btnMenu = document.getElementById('btn-menu-movil');
    const navMenu = document.querySelector('.sidebar nav');

    if (btnMenu && navMenu) {
        btnMenu.addEventListener('click', () => {
            navMenu.classList.toggle('activo');
        });
    }
    
    cargarTarifas();
});