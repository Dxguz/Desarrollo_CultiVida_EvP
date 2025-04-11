document.addEventListener('DOMContentLoaded', () => {
    const agregarForm = document.getElementById('agregarForm');
    const consultarForm = document.getElementById('consultarForm');
    const actualizarForm = document.getElementById('actualizarForm');
    const eliminarForm = document.getElementById('eliminarForm');
    const resultadoConsultaDiv = document.getElementById('resultadoConsulta');
    const resultadoActualizacionDiv = document.getElementById('resultadoActualizacion');
    const resultadoEliminacionDiv = document.getElementById('resultadoEliminacion');

    const API_URL = '/.netlify/functions/agricultores';

    agregarForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(agregarForm);
        const data = Object.fromEntries(formData);

        // **AGREGAR DATOS (POST)**
        try {
            const response = await fetch(API_URL, {
                method: 'POST', // Método HTTP POST para enviar datos para crear un nuevo recurso
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                alert('Agricultor agregado exitosamente.');
                agregarForm.reset();
            } else {
                const error = await response.json();
                alert(`Error al agregar agricultor: ${error.message || 'Error desconocido'}`);
            }
        } catch (error) {
            console.error('Error al enviar la solicitud POST:', error);
            alert('Ocurrió un error al agregar el agricultor.');
        }
    });

    consultarForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const cedula = document.getElementById('cedulaConsultar').value;

        // **CONSULTAR DATOS (GET)**
        try {
            const response = await fetch(`${API_URL}/${cedula}`, {
                method: 'GET', // Método HTTP GET para solicitar datos de un recurso específico
            });

            if (response.ok) {
                const agricultor = await response.json();
                resultadoConsultaDiv.innerHTML = `<pre>${JSON.stringify(agricultor, null, 2)}</pre>`;
            } else if (response.status === 404) {
                resultadoConsultaDiv.textContent = 'Agricultor no encontrado.';
            } else {
                const error = await response.json();
                resultadoConsultaDiv.textContent = `Error al consultar: ${error.message || 'Error desconocido'}`;
            }
        } catch (error) {
            console.error('Error al enviar la solicitud GET:', error);
            resultadoConsultaDiv.textContent = 'Ocurrió un error al consultar.';
        }
    });

    actualizarForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const cedulaActualizar = document.getElementById('cedulaActualizar').value;
        const formData = new FormData(actualizarForm);
        const data = Object.fromEntries(formData);

        delete data.cedulaActualizar;
        const datosActualizar = Object.fromEntries(Object.entries(data).filter(([_, v]) => v !== ''));

        if (Object.keys(datosActualizar).length === 0) {
            alert('Por favor, ingrese al menos un campo para actualizar.');
            return;
        }

        // **ACTUALIZAR DATOS (PUT)**
        try {
            const response = await fetch(`${API_URL}/${cedulaActualizar}`, {
                method: 'PUT', // Método HTTP PUT para enviar datos para modificar un recurso existente
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(datosActualizar),
            });

            if (response.ok) {
                const resultado = await response.json();
                resultadoActualizacionDiv.textContent = resultado.message || 'Agricultor actualizado exitosamente.';
                actualizarForm.reset();
            } else if (response.status === 404) {
                resultadoActualizacionDiv.textContent = 'Agricultor no encontrado.';
            } else {
                const error = await response.json();
                resultadoActualizacionDiv.textContent = `Error al actualizar: ${error.message || 'Error desconocido'}`;
            }
        } catch (error) {
            console.error('Error al enviar la solicitud PUT:', error);
            resultadoActualizacionDiv.textContent = 'Ocurrió un error al actualizar.';
        }
    });

    eliminarForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const cedulaEliminar = document.getElementById('cedulaEliminar').value;

        // **ELIMINAR DATOS (DELETE)**
        try {
            const response = await fetch(`${API_URL}/${cedulaEliminar}`, {
                method: 'DELETE', // Método HTTP DELETE para solicitar la eliminación de un recurso específico
            });

            if (response.ok) {
                const resultado = await response.json();
                resultadoEliminacionDiv.textContent = resultado.message || 'Agricultor eliminado exitosamente.';
                eliminarForm.reset();
            } else if (response.status === 404) {
                resultadoEliminacionDiv.textContent = 'Agricultor no encontrado.';
            } else {
                const error = await response.json();
                resultadoEliminacionDiv.textContent = `Error al eliminar: ${error.message || 'Error desconocido'}`;
            }
        } catch (error) {
            console.error('Error al enviar la solicitud DELETE:', error);
            resultadoEliminacionDiv.textContent = 'Ocurrió un error al eliminar.';
        }
    });
});