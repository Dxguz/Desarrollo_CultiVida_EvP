const { db } = require('./firebase');

exports.handler = async (event) => {
  const { httpMethod, path, body } = event;
  const parts = path.split('/').filter(p => p !== '');
  const cedula = parts.length > 1 ? parts[1] : null;

  switch (httpMethod) {
    case 'GET':
      if (cedula) {
        const doc = await db.collection('agricultores').doc(cedula).get();
        if (!doc.exists) {
          return { statusCode: 404, body: JSON.stringify({ message: 'Agricultor no encontrado' }) };
        }
        return { statusCode: 200, body: JSON.stringify(doc.data()) };
      } else {
        const snapshot = await db.collection('agricultores').get();
        const agricultores = snapshot.docs.map(doc => doc.data());
        return { statusCode: 200, body: JSON.stringify(agricultores) };
      }

      case 'POST':
        try {
          const nuevoAgricultor = JSON.parse(body);
          console.log('Datos recibidos para agregar:', nuevoAgricultor);
          await db.collection('agricultores').doc(nuevoAgricultor.cedula).set(nuevoAgricultor);
          return {
            statusCode: 201,
            body: JSON.stringify({ message: 'Agricultor agregado correctamente', agricultor: nuevoAgricultor }),
          };
        } catch (error) {
          console.error('Error al agregar agricultor en Firestore:', error);
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
        const docRef = db.collection('agricultores').doc(cedula);
        const doc = await docRef.get();
        if (!doc.exists) {
          return { statusCode: 404, body: JSON.stringify({ message: 'Agricultor no encontrado' }) };
        }
        await docRef.update(datosActualizar);
        return {
          statusCode: 200,
          body: JSON.stringify({ message: 'Agricultor actualizado correctamente' }),
        };
      } catch (error) {
        console.error('Error al agregar agricultor en Firestore:', error);
        return {
          statusCode: 400,
          body: JSON.stringify({ message: 'Error al parsear el cuerpo de la solicitud' }),
        };
      }

    case 'DELETE':
      if (!cedula) {
        return { statusCode: 400, body: JSON.stringify({ message: 'Se requiere la cédula para eliminar' }) };
      }
      const docRef = db.collection('agricultores').doc(cedula);
      const doc = await docRef.get();
      if (!doc.exists) {
        return { statusCode: 404, body: JSON.stringify({ message: 'Agricultor no encontrado' }) };
      }
      await docRef.delete();
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Agricultor eliminado correctamente' }),
      };

    default:
      return {
        statusCode: 405,
        body: JSON.stringify({ message: 'Método no permitido' }),
      };
  }
};

