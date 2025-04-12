const agricultores = [
    { cedula: '123', nombre: 'Angelica', email: 'angelica@gmail.com', tipoCultivo: 'Mora', municipio: 'Cucunubá' },
    { cedula: '456', nombre: 'Carlos', email: 'carlos@yahoo.com', tipoCultivo: 'Papa', municipio: 'Ubaté' },
];

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
                    body: JSON.stringify({ message: 'Agricultor agregado correctamente', agricultor: nuevoAgricultor }),
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
            const updatedAgricultores = agricultores.filter(a => a.cedula !== cedula);
            if (updatedAgricultores.length < initialLength) {
                agricultores.length = 0; // Limpiar el array original
                agricultores.push(...updatedAgricultores); // Reemplazar con el array actualizado
                return {
                    statusCode: 200,
                    body: JSON.stringify({ message: 'Agricultor eliminado correctamente' }),
                };
            } else {
                return { statusCode: 404, body: JSON.stringify({ message: 'Agricultor no encontrado' }) };
            }
        default:
            return {
                statusCode: 405,
                body: JSON.stringify({ message: 'Método no permitido' }),
            };
    }
};