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
});