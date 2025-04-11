// backend/controllers/agricultorController.js (simulado para Netlify Function)
const agricultores = []; // Simulación de una base de datos en memoria

exports.handler = async (event, context) => {
    const { httpMethod, path, body } = event;
    const parts = path.split('/').filter(p => p !== '');
    const cedula = parts.length > 1 ? parts[1] : null;

    switch (httpMethod) {
        case 'GET':
            if (cedula) {
                const agricultor = agricultores.find(a => a.cedula === cedula);
                return {
                    statusCode: agricultor ? 200 : 404,
                    body: agricultor ? JSON.stringify(agricultor) : JSON.stringify({ message: 'Agricultor no encontrado' }),
                };
            } else {
                return {
                    statusCode: 200,
                    body: JSON.stringify(agricultores),
                };
            }
        case 'POST':
            try {
                const nuevoAgricultor = JSON.parse(body);
                agricultores.push(nuevoAgricultor);
                return {
                    statusCode: 201,
                    body: JSON.stringify({ message: 'Agricultor agregado correctamente' }),
                };
            } catch (error) {
                return {
                    statusCode: 400,
                    body: JSON.stringify({ message: 'Error al parsear el cuerpo de la solicitud' }),
                };
            }
        case 'PUT':
            if (!cedula) {
                return { statusCode: 400, body: JSON.stringify({ message: 'Se requiere la cédula para actualizar' }) };
            }
            try {
                const datosActualizar = JSON.parse(body);
                const index = agricultores.findIndex(a => a.cedula === cedula);
                if (index !== -1) {
                    agricultores[index] = { ...agricultores[index], ...datosActualizar };
                    return {
                        statusCode: 200,
                        body: JSON.stringify({ message: 'Agricultor actualizado correctamente' }),
                    };
                } else {
                    return { statusCode: 404, body: JSON.stringify({ message: 'Agricultor no encontrado' }) };
                }
            } catch (error) {
                return {
                    statusCode: 400,
                    body: JSON.stringify({ message: 'Error al parsear el cuerpo de la solicitud' }),
                };
            }
        case 'DELETE':
            if (!cedula) {
                return { statusCode: 400, body: JSON.stringify({ message: 'Se requiere la cédula para eliminar' }) };
            }
            const initialLength = agricultores.length;
            agricultores = agricultores.filter(a => a.cedula !== cedula);
            return {
                statusCode: agricultores.length < initialLength ? 200 : 404,
                body: JSON.stringify({ message: agricultores.length < initialLength ? 'Agricultor eliminado correctamente' : 'Agricultor no encontrado' }),
            };
        default:
            return {
                statusCode: 405,
                body: JSON.stringify({ message: 'Método no permitido' }),
            };
    }
};