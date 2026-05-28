document.addEventListener('DOMContentLoaded', () => {
    
    const formLogin = document.getElementById('form-login');
    const pantallaLogin = document.getElementById('pantalla-login');
    const appContainer = document.getElementById('app-container');
    const btnLogout = document.getElementById('btn-logout');
    const errorMsg = document.getElementById('login-error');
    const nombreDisplay = document.getElementById('nombre-usuario-display');

    function iniciarSesion(nombre, esAdmin) {
        localStorage.setItem('fitgym_session', nombre);
        localStorage.setItem('fitgym_is_admin', esAdmin); 
        
        nombreDisplay.innerText = nombre;

        document.querySelectorAll('.solo-admin').forEach(elemento => {
            elemento.style.display = esAdmin ? 'block' : 'none';
        });

        pantallaLogin.style.display = 'none';
        appContainer.style.display = 'flex';

        //Llamada a la función para que se pinten los socios al momento de iniciar sesión sin tener que actualizar la página
        cargarTotalSocios();
    }

    const sesionGuardada = localStorage.getItem('fitgym_session');
    const adminGuardado = localStorage.getItem('fitgym_is_admin') === 'true';
    if (sesionGuardada) {
        iniciarSesion(sesionGuardada, adminGuardado);
    }

    if (formLogin) {
        formLogin.addEventListener('submit', (evento) => {
            evento.preventDefault(); 
            const user = document.getElementById('login-username').value;
            const pass = document.getElementById('login-password').value;

            if (user === "admin" && pass === "1234") {
                errorMsg.style.display = 'none';
                iniciarSesion("Administrador", true);
            } else if (user === "pepe" && pass === "1234") {
                errorMsg.style.display = 'none';
                iniciarSesion("Pepe", false);
            } else {
                errorMsg.style.display = 'block';
            }
        });
    }

    if (btnLogout) {
        btnLogout.addEventListener('click', (evento) => {
            evento.preventDefault();
            localStorage.clear();
            window.location.reload(); 
        });
    }

    // --- CONTADOR DINÁMICO DE SOCIOS ---
    const contadorSocios = document.getElementById('contador-socios');
    
    async function cargarTotalSocios() {
        if (!contadorSocios) return; 

        try {
            const respuesta = await fetch('http://127.0.0.1:8000/api/socios/count/');
            if (!respuesta.ok) throw new Error('Error al obtener el contador');
            
            const datos = await respuesta.json();
            
            contadorSocios.innerText = datos.total_socios;
            
        } catch (error) {
            console.error("No se pudo cargar el contador:", error);
            contadorSocios.innerText = "-"; 
        }
    }

    if (sesionGuardada) {
        cargarTotalSocios();
    }
});