document.addEventListener('DOMContentLoaded', () => {
    const agregarForm = document.getElementById('agregarForm');
    const consultarForm = document.getElementById('consultarForm');
    const actualizarForm = document.getElementById('actualizarForm');
    const eliminarForm = document.getElementById('eliminarForm');
    const resultadoConsultaDiv = document.getElementById('resultadoConsulta');
    const resultadoActualizacionDiv = document.getElementById('resultadoActualizacion');
    const resultadoEliminacionDiv = document.getElementById('resultadoEliminacion');

    const API_URL = '/.netlify/functions/agricultores';

    // **AGREGAR DATOS (POST)**

    agregarForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        console.log('Formulario de agregar enviado');
        const formData = new FormData(agregarForm);
        const data = Object.fromEntries(formData);

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
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

    // **CONSULTAR DATOS (GET)**

    consultarForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        console.log('Formulario de consulta enviado');
        const cedula = document.getElementById('cedulaConsultar').value;

        try {
            const response = await fetch(`${API_URL}/${cedula}`, {
                method: 'GET',
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

    // **ACTUALIZAR DATOS (PUT)**

    actualizarForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        console.log('Formulario de actualización enviado');
        const cedulaActualizar = document.getElementById('cedulaActualizar').value;
        const formData = new FormData(actualizarForm);
        const data = Object.fromEntries(formData);
        delete data.cedulaActualizar;
        const datosActualizar = Object.fromEntries(Object.entries(data).filter(([_, v]) => v !== ''));

        if (Object.keys(datosActualizar).length === 0) {
            alert('Por favor, ingrese al menos un campo para actualizar.');
            return;
        }

        try {
            const response = await fetch(`${API_URL}/${cedulaActualizar}`, {
                method: 'PUT',
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

    // **ELIMINAR DATOS (DELETE)**

    eliminarForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        console.log('Formulario de eliminación enviado');
        const cedulaEliminar = document.getElementById('cedulaEliminar').value;

        try {
            const response = await fetch(`${API_URL}/${cedulaEliminar}`, {
                method: 'DELETE',
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