require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const path = require('path');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Force rebuild: 2025-11-17 03:41 - Fix Render Node.js deployment - Cliente M test ready
// Se recomienda guardar el secreto en una variable de entorno para mayor seguridad
const JWT_SECRET = process.env.JWT_SECRET || 'your-default-secret';

const app = express();
// El puerto se toma de las variables de entorno en producción, o se usa 3001 para desarrollo
const PORT = process.env.PORT || 3001;

// --- CONFIGURACIÓN DE LA BASE DE DATOS ---
// La URL de conexión se toma de la variable de entorno MONGODB_URI para seguridad
const MONGO_URL = process.env.MONGODB_URI;
let db;

// --- MIDDLEWARE ---
app.use(cors());
app.use(express.json({ limit: '5mb' }));

// --- HELPERS ---

// Conexión a la base de datos
const connectDb = async () => {
    if (!MONGO_URL) {
        console.error('Error: La variable de entorno MONGODB_URI no está definida.');
        process.exit(1);
    }
    try {
        const client = new MongoClient(MONGO_URL);
        await client.connect();
        // La base de datos se especifica en la URL de conexión de Atlas
        db = client.db();
        console.log(`Conectado exitosamente a la base de datos: ${db.databaseName}`);
    } catch (error) {
        console.error('Error al conectar con MongoDB Atlas.', error);
        process.exit(1); // Termina el proceso si no se puede conectar a la BD
    }
};

// Wrapper para capturar errores en rutas asíncronas
const asyncHandler = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(err => {
        console.error('Error en el manejador de la ruta:', err);
        console.error('Stack trace:', err.stack);
        res.status(500).json({ message: 'Ocurrió un error interno en el servidor.', error: err.message });
    });
};

// Middleware de autenticación JWT
const authenticateToken = asyncHandler(async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: 'Token de acceso requerido.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const payload = jwt.verify(token, JWT_SECRET);

        // Verificar si el usuario existe según el rol
        if (payload.role === 'client') {
            const client = await db.collection('clients').findOne({ id: payload.userId });
            if (!client) {
                return res.status(403).json({ message: 'Usuario no encontrado.' });
            }
        } else if (payload.role === 'trainer') {
            const trainer = await db.collection('trainers').findOne({ id: payload.trainerId });
            if (!trainer) {
                return res.status(403).json({ message: 'Entrenador no encontrado.' });
            }
        }

        next();
    } catch (error) {
        return res.status(403).json({ message: 'Token inválido o expirado.' });
    }
});

// --- LÓGICA DE SEEDING DE LA BASE DE DATOS ---
const seedDatabase = async () => {
    const defaultExercises = [
        // ========== GLÚTEOS (10 ejercicios) ==========
        { id: 'ex-glute-01', name: 'Hip Thrust con Barra', category: 'Glúteos', tags: ['Glúteos'], description: 'Ejercicio clave para la fuerza y el tamaño de los glúteos.', sets: 4, reps: 12, rest: 90 },
        { id: 'ex-glute-02', name: 'Sentadilla Búlgara con Mancuernas', category: 'Glúteos', tags: ['Glúteos', 'Piernas'], description: 'Excelente para el glúteo y cuádriceps, trabaja de forma unilateral.', sets: 3, reps: 10, rest: 60 },
        { id: 'ex-glute-03', name: 'Patada de Glúteo en Polea', category: 'Glúteos', tags: ['Glúteos'], description: 'Aísla el glúteo mayor para una máxima contracción.', sets: 3, reps: 15, rest: 45 },
        { id: 'ex-glute-04', name: 'Abducción de Cadera en Máquina', category: 'Glúteos', tags: ['Glúteos'], description: 'Fortalece el glúteo medio y menor, mejorando la estabilidad de la cadera.', sets: 3, reps: 20, rest: 45 },
        { id: 'ex-glute-05', name: 'Peso Muerto Rumano con Mancuernas', category: 'Glúteos', tags: ['Glúteos', 'Femorales'], description: 'Enfatiza el trabajo en los isquiotibiales y glúteos.', sets: 4, reps: 12, rest: 90 },
        { id: 'ex-glute-06', name: 'Puente de Glúteo con Banda', category: 'Glúteos', tags: ['Glúteos'], description: 'Ejercicio de activación que se puede usar para calentar o como finisher.', sets: 3, reps: 20, rest: 30 },
        { id: 'ex-glute-07', name: 'Peso Muerto Sumo', category: 'Glúteos', tags: ['Glúteos', 'Fuerza'], description: 'Variante de peso muerto que enfatiza glúteos y aductores.', sets: 4, reps: 8, rest: 90 },
        { id: 'ex-glute-08', name: 'Step Ups con Mancuernas', category: 'Glúteos', tags: ['Glúteos', 'Piernas'], description: 'Ejercicio unilateral funcional.', sets: 3, reps: 12, rest: 60 },
        { id: 'ex-glute-09', name: 'Elevación de Cadera en Banco', category: 'Glúteos', tags: ['Glúteos'], description: 'Hiperextensión de cadera para aislar glúteos.', sets: 3, reps: 15, rest: 45 },
        { id: 'ex-glute-10', name: 'Clamshells con Banda', category: 'Glúteos', tags: ['Glúteos'], description: 'Activación de glúteo medio.', sets: 3, reps: 20, rest: 30 },

        // ========== PIERNAS (20 ejercicios) ==========
        { id: 'ex-legs-01', name: 'Sentadilla Goblet', category: 'Piernas', tags: ['Piernas', 'Cuádriceps'], description: 'Variación de sentadilla que ayuda a mantener una postura correcta.', sets: 4, reps: 12, rest: 90 },
        { id: 'ex-legs-02', name: 'Prensa de Piernas', category: 'Piernas', tags: ['Piernas', 'Cuádriceps', 'Glúteos'], description: 'Permite mover cargas pesadas con gran seguridad para las piernas.', sets: 4, reps: 15, rest: 90 },
        { id: 'ex-legs-03', name: 'Extensiones de Cuádriceps', category: 'Piernas', tags: ['Piernas', 'Cuádriceps'], description: 'Aísla los cuádriceps para definirlos y fortalecerlos.', sets: 3, reps: 15, rest: 60 },
        { id: 'ex-legs-04', name: 'Curl Femoral Tumbado', category: 'Piernas', tags: ['Piernas', 'Femorales'], description: 'Aísla los isquiotibiales.', sets: 3, reps: 15, rest: 60 },
        { id: 'ex-legs-05', name: 'Zancadas Caminando', category: 'Piernas', tags: ['Piernas', 'Cuádriceps', 'Glúteos'], description: 'Ejercicio funcional que trabaja piernas y glúteos de forma dinámica.', sets: 3, reps: 12, rest: 60 },
        { id: 'ex-legs-06', name: 'Sentadilla Sumo con Pesa Rusa', category: 'Piernas', tags: ['Piernas', 'Aductores', 'Glúteos'], description: 'Enfatiza el trabajo en los aductores y glúteos.', sets: 3, reps: 12, rest: 90 },
        { id: 'ex-legs-07', name: 'Elevación de Talones de Pie', category: 'Piernas', tags: ['Piernas', 'Gemelos'], description: 'Fortalecimiento de pantorrillas - gastrocnemio.', sets: 4, reps: 15, rest: 45 },
        { id: 'ex-legs-08', name: 'Sentadilla Frontal', category: 'Piernas', tags: ['Piernas', 'Cuádriceps', 'Core'], description: 'Enfatiza cuádriceps y requiere mayor estabilidad del core.', sets: 4, reps: 10, rest: 90 },
        { id: 'ex-legs-09', name: 'Elevación de Gemelos Sentado', category: 'Piernas', tags: ['Piernas', 'Gemelos'], description: 'Enfatiza el sóleo.', sets: 3, reps: 15, rest: 45 },
        { id: 'ex-legs-10', name: 'Sentadilla con Barra', category: 'Piernas', tags: ['Piernas', 'Fuerza'], description: 'El rey de los ejercicios para piernas.', sets: 5, reps: 8, rest: 90 },
        { id: 'ex-legs-11', name: 'Zancadas Estáticas', category: 'Piernas', tags: ['Piernas', 'Cuádriceps'], description: 'Zancadas en posición fija.', sets: 3, reps: 12, rest: 60 },
        { id: 'ex-legs-12', name: 'Curl Femoral Sentado', category: 'Piernas', tags: ['Piernas', 'Femorales'], description: 'Variante del curl femoral.', sets: 3, reps: 15, rest: 60 },
        { id: 'ex-legs-13', name: 'Hack Squat', category: 'Piernas', tags: ['Piernas', 'Cuádriceps'], description: 'Sentadilla en máquina para aislamiento de cuádriceps.', sets: 4, reps: 12, rest: 90 },
        { id: 'ex-legs-14', name: 'Peso Muerto Pierna Rígida', category: 'Piernas', tags: ['Piernas', 'Femorales'], description: 'Enfatiza isquiotibiales y espalda baja.', sets: 4, reps: 10, rest: 90 },
        { id: 'ex-legs-15', name: 'Aducciones en Máquina', category: 'Piernas', tags: ['Piernas', 'Aductores'], description: 'Fortalece la cara interna del muslo.', sets: 3, reps: 15, rest: 45 },
        { id: 'ex-legs-16', name: 'Sentadilla Pistol (Asistida)', category: 'Piernas', tags: ['Piernas', 'Unilateral'], description: 'Sentadilla a una pierna para fuerza unilateral.', sets: 3, reps: 8, rest: 90 },
        { id: 'ex-legs-17', name: 'Buenos Días (Good Mornings)', category: 'Piernas', tags: ['Piernas', 'Femorales'], description: 'Bisagra de cadera para femorales y lumbares.', sets: 3, reps: 12, rest: 60 },
        { id: 'ex-legs-18', name: 'Zancadas Laterales', category: 'Piernas', tags: ['Piernas', 'Aductores'], description: 'Movimiento lateral para aductores y abductores.', sets: 3, reps: 12, rest: 60 },
        { id: 'ex-legs-19', name: 'Leg Press Unilateral', category: 'Piernas', tags: ['Piernas', 'Unilateral'], description: 'Prensa de pierna a una pierna.', sets: 3, reps: 12, rest: 60 },
        { id: 'ex-legs-20', name: 'Wall Sit (Sentadilla Isométrica)', category: 'Piernas', tags: ['Piernas', 'Isométrico'], description: 'Resistencia isométrica de cuádriceps.', sets: 3, time: 60, rest: 60 },

        // ========== ESPA LDA (15 ejercicios) ==========
        { id: 'ex-back-01', name: 'Jalón al Pecho (Polea Alta)', category: 'Espalda', tags: ['Espalda', 'Dorsales'], description: 'Desarrolla la amplitud de la espalda (dorsales).', sets: 4, reps: 12, rest: 60 },
        { id: 'ex-back-02', name: 'Remo Sentado en Polea', category: 'Espalda', tags: ['Espalda'], description: 'Trabaja la densidad y grosor de la espalda media.', sets: 4, reps: 12, rest: 60 },
        { id: 'ex-back-03', name: 'Dominadas', category: 'Espalda', tags: ['Espalda', 'Dorsales'], description: 'El ejercicio rey para la espalda.', sets: 3, reps: 8, rest: 90 },
        { id: 'ex-back-04', name: 'Pull-over con Mancuerna', category: 'Espalda', tags: ['Espalda', 'Dorsales', 'Pecho'], description: 'Trabaja el dorsal y el serrato, expandiendo la caja torácica.', sets: 3, reps: 15, rest: 60 },
        { id: 'ex-back-05', name: 'Hiperextensiones (Lumbares)', category: 'Espalda', tags: ['Espalda', 'Lumbares'], description: 'Fortalece la espalda baja y cadena posterior.', sets: 3, reps: 15, rest: 60 },
        { id: 'ex-back-06', name: 'Remo con Barra', category: 'Espalda', tags: ['Espalda', 'Fuerza'], description: 'Ejercicio compuesto fundamental para grosor de espalda.', sets: 4, reps: 10, rest: 90 },
        { id: 'ex-back-07', name: 'Jalón con Agarre Cerrado', category: 'Espalda', tags: ['Espalda', 'Dorsales'], description: 'Variante que enfatiza el grosor del dorsal.', sets: 4, reps: 12, rest: 60 },
        { id: 'ex-back-08', name: 'Remo con Mancuerna a Una Mano', category: 'Espalda', tags: ['Espalda', 'Unilateral'], description: 'Trabajo unilateral de espalda.', sets: 3, reps: 12, rest: 60 },
        { id: 'ex-back-09', name: 'Peso Muerto Convencional', category: 'Espalda', tags: ['Espalda', 'Fuerza'], description: 'Ejercicio fundamental de fuerza total.', sets: 5, reps: 5, rest: 90 },
        { id: 'ex-back-10', name: 'Jalón tras Nuca', category: 'Espalda', tags: ['Espalda', 'Dorsales'], description: 'Variante del jalón (no recomendado para todos).', sets: 3, reps: 12, rest: 60 },
        { id: 'ex-back-11', name: 'Remo en T', category: 'Espalda', tags: ['Espalda'], description: 'Remo con barra en T para grosor.', sets: 4, reps: 10, rest: 90 },
        { id: 'ex-back-12', name: 'Pulldown con Cuerda', category: 'Espalda', tags: ['Espalda', 'Dorsales'], description: 'Variante con cuerda para mayor activación.', sets: 3, reps: 15, rest: 60 },
        { id: 'ex-back-13', name: 'Shrugs con Barra', category: 'Espalda', tags: ['Espalda', 'Trapecios'], description: 'Encogimientos para trapecio superior.', sets: 4, reps: 15, rest: 60 },
        { id: 'ex-back-14', name: 'Superman (Espalda Baja)', category: 'Espalda', tags: ['Espalda', 'Lumbares'], description: 'Ejercicio de peso corporal para lumbares.', sets: 3, reps: 15, rest: 45 },
        { id: 'ex-back-15', name: 'Remo Invertido (Australian Pull-up)', category: 'Espalda', tags: ['Espalda'], description: 'Remo con peso corporal.', sets: 3, reps: 12, rest: 60 },

        // ========== HOMBROS (12 ejercicios) ==========
        { id: 'ex-shoulders-01', name: 'Press Militar con Mancuernas', category: 'Hombros', tags: ['Hombros'], description: 'Ejercicio fundamental para la fuerza y tamaño de los hombros.', sets: 4, reps: 10, rest: 90 },
        { id: 'ex-shoulders-02', name: 'Elevaciones Laterales con Mancuernas', category: 'Hombros', tags: ['Hombros'], description: 'Aísla la cabeza media del deltoides, dando amplitud a los hombros.', sets: 3, reps: 15, rest: 45 },
        { id: 'ex-shoulders-03', name: 'Pájaros (Elevaciones Posteriores)', category: 'Hombros', tags: ['Hombros'], description: 'Enfocado en el deltoides posterior, clave para una buena postura.', sets: 3, reps: 15, rest: 45 },
        { id: 'ex-shoulders-04', name: 'Face Pulls en Polea', category: 'Hombros', tags: ['Hombros', 'Espalda'], description: 'Mejora la salud del hombro y la postura, trabajando el deltoides posterior y manguito rotador.', sets: 3, reps: 20, rest: 45 },
        { id: 'ex-shoulders-05', name: 'Encogimientos con Mancuernas', category: 'Hombros', tags: ['Hombros', 'Trapecios'], description: 'Desarrollo de trapecios superiores.', sets: 4, reps: 15, rest: 60 },
        { id: 'ex-shoulders-06', name: 'Press Militar con Barra', category: 'Hombros', tags: ['Hombros', 'Fuerza'], description: 'Versión con barra del press militar.', sets: 4, reps: 8, rest: 90 },
        { id: 'ex-shoulders-07', name: 'Elevaciones Frontales', category: 'Hombros', tags: ['Hombros'], description: 'Trabaja el deltoides anterior.', sets: 3, reps: 15, rest: 45 },
        { id: 'ex-shoulders-08', name: 'Arnold Press', category: 'Hombros', tags: ['Hombros'], description: 'Variante del press que trabaja todo el deltoides.', sets: 3, reps: 12, rest: 60 },
        { id: 'ex-shoulders-09', name: 'Elevaciones Laterales en Polea', category: 'Hombros', tags: ['Hombros'], description: 'Tensión constante para deltoides medio.', sets: 3, reps: 15, rest: 45 },
        { id: 'ex-shoulders-10', name: 'Press Bradford', category: 'Hombros', tags: ['Hombros'], description: 'Press alternando adelante y atrás.', sets: 3, reps: 12, rest: 60 },
        { id: 'ex-shoulders -11', name: 'Elevaciones en Y', category: 'Hombros', tags: ['Hombros'], description: 'Trabaja manguito rotador y deltoides.', sets: 3, reps: 15, rest: 45 },
        { id: 'ex-shoulders-12', name: 'Pájaros en Máquina Pec Deck', category: 'Hombros', tags: ['Hombros'], description: 'Deltoides posterior con máquina.', sets: 3, reps: 15, rest: 45 },

        // ========== PECHO (12 ejercicios) ==========
        { id: 'ex-chest-01', name: 'Press de Banca con Mancuernas', category: 'Pecho', tags: ['Pecho'], description: 'Permite un mayor rango de movimiento que la barra, beneficiando el desarrollo pectoral.', sets: 4, reps: 12, rest: 90 },
        { id: 'ex-chest-02', name: 'Aperturas con Mancuernas (Banco Inclinado)', category: 'Pecho', tags: ['Pecho'], description: 'Enfocado en la parte superior del pectoral.', sets: 3, reps: 15, rest: 60 },
        { id: 'ex-chest-03', name: 'Flexiones (Push-ups)', category: 'Pecho', tags: ['Pecho', 'Hombros', 'Tríceps'], description: 'Ejercicio de peso corporal fundamental para el tren superior.', sets: 3, reps: 15, rest: 60 },
        { id: 'ex-chest-04', name: 'Press Inclinado con Mancuernas', category: 'Pecho', tags: ['Pecho', 'Superior'], description: 'Enfatiza la porción clavicular (superior) del pectoral.', sets: 4, reps: 10, rest: 90 },
        { id: 'ex-chest-05', name: 'Press de Banca con Barra', category: 'Pecho', tags: ['Pecho', 'Fuerza'], description: 'El ejercicio clásico para desarrollar pecho.', sets: 4, reps: 8, rest: 90 },
        { id: 'ex-chest-06', name: 'Aperturas en Polea (Cable Crossover)', category: 'Pecho', tags: ['Pecho'], description: 'Tensión constante en el pectoral.', sets: 3, reps: 15, rest: 60 },
        { id: 'ex-chest-07', name: 'Press Declinado con Mancuernas', category: 'Pecho', tags: ['Pecho', 'Inferior'], description: 'Trabaja la parte inferior del pecho.', sets: 3, reps: 12, rest: 60 },
        { id: 'ex-chest-08', name: 'Flexiones Declinadas', category: 'Pecho', tags: ['Pecho'], description: 'Pies elevados para enfatizar pecho superior.', sets: 3, reps: 15, rest: 60 },
        { id: 'ex-chest-09', name: 'Press en Máquina', category: 'Pecho', tags: ['Pecho'], description: 'Press de pecho en máquina.', sets: 3, reps: 12, rest: 60 },
        { id: 'ex-chest-10', name: 'Pec Deck (Mariposa)', category: 'Pecho', tags: ['Pecho'], description: 'Aislamiento de pectoral en máquina.', sets: 3, reps: 15, rest: 45 },
        { id: 'ex-chest-11', name: 'Flexiones Diamante', category: 'Pecho', tags: ['Pecho', 'Tríceps'], description: 'Flexiones con manos juntas.', sets: 3, reps: 12, rest: 60 },
        { id: 'ex-chest-12', name: 'Fondos en Paralelas (Pecho)', category: 'Pecho', tags: ['Pecho', 'Tríceps'], description: 'Inclinado hacia adelante para enfatizar pecho.', sets: 3, reps: 10, rest: 90 },

        // ========== BRAZOS (16 ejercicios) ==========
        { id: 'ex-arms-01', name: 'Curl de Bíceps con Barra Z', category: 'Brazos', tags: ['Brazos', 'Bíceps'], description: 'Reduce la tensión en las muñecas mientras se trabaja el bíceps.', sets: 3, reps: 12, rest: 60 },
        { id: 'ex-arms-02', name: 'Extensiones de Tríceps en Polea Alta', category: 'Brazos', tags: ['Brazos', 'Tríceps'], description: 'Aísla el tríceps para un desarrollo completo.', sets: 3, reps: 15, rest: 45 },
        { id: 'ex-arms-03', name: 'Fondos en Banco', category: 'Brazos', tags: ['Brazos', 'Tríceps'], description: 'Excelente ejercicio de peso corporal para tríceps.', sets: 3, reps: 12, rest: 60 },
        { id: 'ex-arms-04', name: 'Curl Martillo con Mancuernas', category: 'Brazos', tags: ['Brazos', 'Bíceps', 'Antebrazo'], description: 'Trabaja el braquial y el antebrazo además del bíceps.', sets: 3, reps: 12, rest: 45 },
        { id: 'ex-arms-05', name: 'Curl de Bíceps con Barra Recta', category: 'Brazos', tags: ['Brazos', 'Bíceps'], description: 'Curl clásico con barra recta.', sets: 3, reps: 12, rest: 60 },
        { id: 'ex-arms-06', name: 'Press Francés (Extensión de Tríceps Tumbado)', category: 'Brazos', tags: ['Brazos', 'Tríceps'], description: 'Trabajo intenso de tríceps.', sets: 3, reps: 12, rest: 60 },
        { id: 'ex-arms-07', name: 'Curl Concentrado', category: 'Brazos', tags: ['Brazos', 'Bíceps'], description: 'Aislamiento total del bíceps.', sets: 3, reps: 15, rest: 45 },
        { id: 'ex-arms-08', name: 'Patada de Tríceps con Mancuerna', category: 'Brazos', tags: ['Brazos', 'Tríceps'], description: 'Aislamiento de tríceps.', sets: 3, reps: 15, rest: 45 },
        { id: 'ex-arms-09', name: 'Curl en Predicador', category: 'Brazos', tags: ['Brazos', 'Bíceps'], description: 'Curl en banco Scott.', sets: 3, reps: 12, rest: 60 },
        { id: 'ex-arms-10', name: 'Extensión de Tríceps sobre Cabeza con Mancuerna', category: 'Brazos', tags: ['Brazos', 'Tríceps'], description: 'Trabaja la cabeza larga del tríceps.', sets: 3, reps: 12, rest: 60 },
        { id: 'ex-arms-11', name: 'Curl de Cable', category: 'Brazos', tags: ['Brazos', 'Bíceps'], description: 'Tensión constante en bíceps.', sets: 3, reps: 15, rest: 45 },
        { id: 'ex-arms-12', name: 'Extensión de Tríceps con Cuerda', category: 'Brazos', tags: ['Brazos', 'Tríceps'], description: 'Mayor rango de movimiento.', sets: 3, reps: 15, rest: 45 },
        { id: 'ex-arms-13', name: 'Curl 21s', category: 'Brazos', tags: ['Brazos', 'Bíceps'], description: 'Técnica avanzada de bíceps (7+7+7).', sets: 3, reps: 21, rest: 60 },
        { id: 'ex-arms-14', name: 'Curl Inverso', category: 'Brazos', tags: ['Brazos', 'Antebrazo'], description: 'Trabaja braquiorradial y antebrazos.', sets: 3, reps: 15, rest: 45 },
        { id: 'ex-arms-15', name: 'Extensión de Muñeca', category: 'Brazos', tags: ['Brazos', 'Antebrazo'], description: 'Fortalece extensores de muñeca.', sets: 3, reps: 20, rest: 30 },
        { id: 'ex-arms-16', name: 'Flexión de Muñeca', category: 'Brazos', tags: ['Brazos', 'Antebrazo'], description: 'Fortalece flexores de muñeca.', sets: 3, reps: 20, rest: 30 },

        // ========== ABDOMEN Y CORE (14 ejercicios) ==========
        { id: 'ex-core-01', name: 'Plancha (Plank)', category: 'Abdomen y Core', tags: ['Core', 'Abdomen'], description: 'Ejercicio isométrico para la estabilidad de todo el core.', sets: 3, time: 60, rest: 45 },
        { id: 'ex-core-02', name: 'Elevación de Piernas Colgado', category: 'Abdomen y Core', tags: ['Core', 'Abdomen'], description: 'Intenso ejercicio para la parte inferior del abdomen.', sets: 3, reps: 15, rest: 45 },
        { id: 'ex-core-03', name: 'Crunch Abdominal en Polea Alta', category: 'Abdomen y Core', tags: ['Core', 'Abdomen'], description: 'Permite añadir resistencia al crunch para mayor hipertrofia.', sets: 3, reps: 20, rest: 45 },
        { id: 'ex-core-04', name: 'Rueda Abdominal (Ab Wheel)', category: 'Abdomen y Core', tags: ['Core', 'Abdomen', 'Espalda'], description: 'Ejercicio avanzado para una fuerza abdominal y de core superior.', sets: 3, reps: 12, rest: 60 },
        { id: 'ex-core-05', name: 'Russian Twists', category: 'Abdomen y Core', tags: ['Core', 'Oblicuos'], description: 'Trabajo rotacional para oblicuos.', sets: 3, reps: 20, rest: 45 },
        { id: 'ex-core-06', name: 'Elevación de Piernas Tumbado', category: 'Abdomen y Core', tags: ['Core', 'Abdomen'], description: 'Control abdominal inferior.', sets: 3, reps: 15, rest: 45 },
        { id: 'ex-core-07', name: 'Plancha Lateral', category: 'Abdomen y Core', tags: ['Core', 'Oblicuos'], description: 'Isométrico para oblicuos y estabilizadores laterales.', sets: 3, time: 45, rest: 45 },
        { id: 'ex-core-08', name: 'Mountain Climbers', category: 'Abdomen y Core', tags: ['Core', 'Cardio'], description: 'Ejercicio dinámico de core y cardio.', sets: 3, time: 60, rest: 60 },
        { id: 'ex-core-09', name: 'Dead Bug', category: 'Abdomen y Core', tags: ['Core', 'Abdomen'], description: 'Coordinación y estabilidad de core.', sets: 3, reps: 15, rest: 45 },
        { id: 'ex-core-10', name: 'Bicicleta Abdominal', category: 'Abdomen y Core', tags: ['Core', 'Oblicuos'], description: 'Trabaja todo el core.', sets: 3, reps: 20, rest: 45 },
        { id: 'ex-core-11', name: 'Pallof Press', category: 'Abdomen y Core', tags: ['Core'], description: 'Anti-rotación de core.', sets: 3, reps: 15, rest: 45 },
        { id: 'ex-core-12', name: 'Plancha con Toque de Hombro', category: 'Abdomen y Core', tags: ['Core'], description: 'Plancha dinámica para estabilidad.', sets: 3, reps: 20, rest: 45 },
        { id: 'ex-core-13', name: 'V-Ups', category: 'Abdomen y Core', tags: ['Core', 'Abdomen'], description: 'Ejercicio completo de abdomen.', sets: 3, reps: 15, rest: 60 },
        { id: 'ex-core-14', name: 'Hollow Hold', category: 'Abdomen y Core', tags: ['Core'], description: 'Isométrico avanzado de gimnasia.', sets: 3, time: 45, rest: 60 },

        // ========== CARDIO (10 ejercicios) ==========
        { id: 'ex-cardio-01', name: 'Caminadora (Cinta)', category: 'Cardio', tags: ['Cardio', 'Resistencia'], description: 'Caminata o trote suave para calentamiento o quema de calorías.', sets: 1, time: 1200, rest: 0 },
        { id: 'ex-cardio-02', name: 'Bicicleta Estática', category: 'Cardio', tags: ['Cardio', 'Piernas'], description: 'Cardio de bajo impacto.', sets: 1, time: 1200, rest: 0 },
        { id: 'ex-cardio-03', name: 'Elíptica', category: 'Cardio', tags: ['Cardio', 'Full Body'], description: 'Cardio de bajo impacto que involucra brazos y piernas.', sets: 1, time: 1200, rest: 0 },
        { id: 'ex-cardio-04', name: 'Salto a la Cuerda', category: 'Cardio', tags: ['Cardio', 'Coordinación'], description: 'Cardio intenso para coordinación y agilidad.', sets: 3, time: 180, rest: 60 },
        { id: 'ex-cardio-05', name: 'Remo (Rowing Machine)', category: 'Cardio', tags: ['Cardio', 'Full Body'], description: 'Cardio de cuerpo completo de bajo impacto.', sets: 1, time: 1200, rest: 0 },
        { id: 'ex-cardio-06', name: 'Escaladora (Stair Climber)', category: 'Cardio', tags: ['Cardio', 'Piernas'], description: 'Excelente para glúteos y resistencia cardiovascular.', sets: 1, time: 900, rest: 0 },
        { id: 'ex-cardio-07', name: 'Sprints en Cinta', category: 'Cardio', tags: ['Cardio', 'HIIT'], description: 'Intervalos de alta intensidad.', sets: 8, time: 30, rest: 90 },
        { id: 'ex-cardio-08', name: 'Natación', category: 'Cardio', tags: ['Cardio', 'Full Body'], description: 'Cardio de muy bajo impacto.', sets: 1, time: 1800, rest: 0 },
        { id: 'ex-cardio-09', name: 'Assault Bike (Airdyne)', category: 'Cardio', tags: ['Cardio', 'HIIT'], description: 'Bici de brazos y piernas para HIIT.', sets: 5, time: 60, rest: 120 },
        { id: 'ex-cardio-10', name: 'Battle Ropes', category: 'Cardio', tags: ['Cardio', 'Brazos'], description: 'Cuerdas para cardio y brazos.', sets: 4, time: 45, rest: 60 },

        // ========== FULL BODY & FUNCIONAL (10 ejercicios) ==========
        { id: 'ex-full-01', name: 'Burpees', category: 'Full Body', tags: ['Cardio', 'Fuerza'], description: 'Ejercicio metabólico completo.', sets: 3, reps: 15, rest: 90 },
        { id: 'ex-full-02', name: 'Thrusters (Sentadilla + Press)', category: 'Full Body', tags: ['Full Body', 'Fuerza'], description: 'Movimiento compuesto completo.', sets: 4, reps: 12, rest: 90 },
        { id: 'ex-full-03', name: 'Clean and Press', category: 'Full Body', tags: ['Full Body', 'Fuerza'], description: 'Levantamiento olímpico modificado.', sets: 4, reps: 8, rest: 90 },
        { id: 'ex-full-04', name: 'Swing con Pesa Rusa (Kettlebell)', category: 'Full Body', tags: ['Full Body', 'Potencia'], description: 'Explosivo para cadena posterior.', sets: 4, reps: 20, rest: 60 },
        { id: 'ex-full-05', name: 'Turkish Get-Up', category: 'Full Body', tags: ['Full Body', 'Core'], description: 'Movimiento funcional completo.', sets: 3, reps: 5, rest: 90 },
        { id: 'ex-full-06', name: 'Man Makers', category: 'Full Body', tags: ['Full Body', 'Cardio'], description: 'Burpee + remo + press.', sets: 3, reps: 10, rest: 90 },
        { id: 'ex-full-07', name: 'Wall Balls', category: 'Full Body', tags: ['Full Body', 'Potencia'], description: 'Sentadilla + lanzamiento de balón.', sets: 4, reps: 15, rest: 60 },
        { id: 'ex-full-08', name: 'Devil Press', category: 'Full Body', tags: ['Full Body', 'Cardio'], description: 'Burpee con mancuernas + press.', sets: 3, reps: 10, rest: 90 },
        { id: 'ex-full-09', name: 'Farmer Walk (Caminata del Granjero)', category: 'Full Body', tags: ['Full Body', 'Agarre'], description: 'Carga pesada para agarre y core.', sets: 3, time: 60, rest: 90 },
        { id: 'ex-full-10', name: 'Bear Crawl', category: 'Full Body', tags: ['Full Body', 'Core'], description: 'Movimiento animal para core y coordinación.', sets: 3, time: 60, rest: 60 },

        // ========== MOVILIDAD & ESTIRAMIENTO (8 ejercicios) ==========
        { id: 'ex-mobility-01', name: 'Cat-Cow (Gato-Vaca)', category: 'Movilidad', tags: ['Movilidad', 'Espalda'], description: 'Movilidad de columna vertebral.', sets: 2, reps: 15, rest: 30 },
        { id: 'ex-mobility-02', name: 'World\'s Greatest Stretch', category: 'Movilidad', tags: ['Movilidad', 'Caderas'], description: 'Estiramiento completo de cadera.', sets: 2, reps: 10, rest: 30 },
        { id: 'ex-mobility-03', name: 'Estiramiento de Isquiotibiales', category: 'Movilidad', tags: ['Movilidad', 'Piernas'], description: 'Flexibilidad de femorales.', sets: 2, time: 60, rest: 30 },
        { id: 'ex-mobility-04', name: 'Estiramiento de Cuádriceps', category: 'Movilidad', tags: ['Movilidad', 'Piernas'], description: 'Flexibilidad de cuádriceps.', sets: 2, time: 60, rest: 30 },
        { id: 'ex-mobility-05', name: 'Rotaciones de Hombro', category: 'Movilidad', tags: ['Movilidad', 'Hombros'], description: 'Movilidad de cápsula del hombro.', sets: 2, reps: 15, rest: 30 },
        { id: 'ex-mobility-06', name: '90/90 Hip Stretch', category: 'Movilidad', tags: ['Movilidad', 'Caderas'], description: 'Movilidad de cadera.', sets: 2, time: 60, rest: 30 },
        { id: 'ex-mobility-07', name: 'Thoracic Rotation', category: 'Movilidad', tags: ['Movilidad', 'Espalda'], description: 'Rotación de columna torácica.', sets: 2, reps: 15, rest: 30 },
        { id: 'ex-mobility-08', name: 'Cobra Stretch', category: 'Movilidad', tags: ['Movilidad', 'Core'], description: 'Extensión de columna.', sets: 2, time: 45, rest: 30 }
    ];

    try {
        const collection = db.collection('system');

        // FORZAR actualización completa de ejercicios default
        // Esto sobrescribe TODOS los valores para asegurar consistencia
        await collection.updateOne(
            { _id: 'exercises' },
            { $set: { data: defaultExercises } },
            { upsert: true }
        );
        console.log('✓ Biblioteca de ejercicios FORZADA a valores correctos (reemplazo completo).');

    } catch (error) {
        console.error('Error al sembrar la base de datos de ejercicios:', error);
    }
};

// Función para sembrar el usuario específico
const seedTrainerUser = async () => {
    try {
        const trainersCollection = db.collection('trainers');

        // Datos del usuario específico
        const trainerData = {
            id: "trainer_user_001",
            name: "Entrenador Usuario",
            email: "8092073906k@gmail.com",
            password: await bcrypt.hash('123', 10), // Hash de la contraseña '123'
            role: "entrenador",
            active: true,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        // Verificar si ya existe
        const existingTrainer = await trainersCollection.findOne({ email: trainerData.email });

        if (existingTrainer) {
            console.log('El usuario ya existe:', trainerData.email);

            // Actualizar si existe
            await trainersCollection.updateOne(
                { email: trainerData.email },
                {
                    $set: {
                        password: trainerData.password,
                        name: trainerData.name,
                        active: true,
                        updatedAt: new Date()
                    }
                }
            );
            console.log('Usuario actualizado correctamente.');
        } else {
            // Insertar nuevo usuario
            await trainersCollection.insertOne(trainerData);
            console.log('Usuario creado correctamente:', trainerData.email);
        }
    } catch (error) {
        console.error('Error al sembrar el usuario entrenador:', error);
    }
};

// --- API ENDPOINTS ---

// --- Auth ---
// Función para generar tokens JWT
// POLÍTICA DE SESIONES:
// - CLIENTES: Tokens con expiración de 40 días para retención a largo plazo
// - TRAINERS: Tokens con expiración (1h/7d) por seguridad
const generateTokens = (payload) => {
    if (payload.role === 'client') {
        // Tokens de 40 días para clientes
        const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '40d' });
        const refreshToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '40d' });
        return { accessToken, refreshToken };
    } else {
        // Sesiones con expiración para trainers
        const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
        const refreshToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
        return { accessToken, refreshToken };
    }
};

app.post('/api/auth/client/login', asyncHandler(async (req, res) => {
    const { username, password } = req.body;
    const client = await db.collection('clients').findOne({ username });

    if (!client) {
        return res.status(401).json({ message: 'Nombre de usuario o contraseña incorrectos.' });
    }

    const isPasswordValid = await bcrypt.compare(password, client.password);

    if (isPasswordValid) {
        const payload = { userId: client.id, role: 'client' };
        const { accessToken, refreshToken } = generateTokens(payload);

        // ACTUALIZAR SIEMPRE el refreshToken en la BD para clientes existentes
        await db.collection('clients').updateOne(
            { _id: client._id },
            { $set: { refreshToken } }
        );

        const { password, ...clientData } = client;
        res.json({ accessToken, refreshToken, user: clientData });
    } else {
        res.status(401).json({ message: 'Nombre de usuario o contraseña incorrectos.' });
    }
}));

app.post('/api/auth/client/refresh-token', asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(401).json({ message: 'Refresh token no proporcionado.' });
    }

    let payload;
    try {
        // Intentar verificar el token normalmente
        payload = jwt.verify(refreshToken, JWT_SECRET);
    } catch (error) {
        // Si el token expiró (solo para clientes), generar tokens nuevos
        if (error.name === 'TokenExpiredError') {
            console.log('Refresh token expirado para cliente, generando tokens nuevos');

            try {
                // Decodificar el payload sin verificar la expiración
                const decoded = jwt.decode(refreshToken);
                if (decoded && decoded.role === 'client') {
                    const client = await db.collection('clients').findOne({ id: decoded.userId });
                    if (client && client.refreshToken === refreshToken) {
                        // Cliente válido con refresh token expirado, generar nuevos tokens
                        const newPayload = { userId: client.id, role: 'client' };
                        const { accessToken, refreshToken: newRefreshToken } = generateTokens(newPayload);

                        // Actualizar el refresh token en la BD
                        await db.collection('clients').updateOne(
                            { _id: client._id },
                            { $set: { refreshToken: newRefreshToken } }
                        );

                        return res.json({ accessToken, refreshToken: newRefreshToken });
                    }
                }
            } catch (decodeError) {
                console.error('Error al decodificar token expirado:', decodeError);
            }
        }

        return res.status(403).json({ message: 'Refresh token inválido o expirado.' });
    }

    try {
        const client = await db.collection('clients').findOne({ id: payload.userId });

        if (!client || client.refreshToken !== refreshToken) {
            return res.status(403).json({ message: 'Refresh token inválido o revocado.' });
        }

        // Generar un nuevo access token sin expiración para clientes
        const newPayload = { userId: client.id, role: 'client' };
        const { accessToken } = generateTokens(newPayload);

        res.json({ accessToken });
    } catch (error) {
        return res.status(403).json({ message: 'Error al procesar refresh token.' });
    }
}));

app.post('/api/auth/trainer/login', asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const trainer = await db.collection('trainers').findOne({ email });

    if (!trainer) {
        console.log('Login failed (user not found) for:', email);
        return res.status(401).json({ message: 'Email o contraseña de entrenador incorrectos.' });
    }

    const isPasswordValid = await bcrypt.compare(password, trainer.password);

    if (isPasswordValid) {
        console.log('Login successful for:', email);
        // Generar un token que no expira.
        const token = jwt.sign({ trainerId: trainer.id, role: 'trainer' }, JWT_SECRET);

        const { password, ...trainerData } = trainer;
        res.json({ token, user: trainerData });
    } else {
        console.log('Login failed (invalid password) for:', email);
        res.status(401).json({ message: 'Email o contraseña de entrenador incorrectos.' });
    }
}));

app.post('/api/auth/trainer/register', asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    if (!password) {
        return res.status(400).json({ message: 'La contraseña es requerida.' });
    }

    const existingTrainer = await db.collection('trainers').findOne({ email });
    if (existingTrainer) {
        return res.status(400).json({ message: 'Este correo electrónico ya está registrado.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newTrainer = {
        id: `trainer-${crypto.randomUUID()}`,
        name,
        email,
        password: hashedPassword,
        role: 'trainer'
    };

    await db.collection('trainers').insertOne(newTrainer);

    // Después de registrar, también iniciamos sesión generando un token
    const token = jwt.sign({ trainerId: newTrainer.id, role: 'trainer' }, JWT_SECRET);

    // No enviar la contraseña hasheada al cliente
    const { password: _, ...trainerData } = newTrainer;

    // Enviar el token y los datos del usuario, igual que en el login
    res.json({ message: 'Entrenador registrado con éxito.', token, user: { ...newTrainer, password: undefined } });
}));

// ENDPOINT TEMPORAL - LISTAR ENTRENADORES (SOLO PARA DEBUG)
app.get('/api/admin/list-trainers', asyncHandler(async (req, res) => {
    const trainers = await db.collection('trainers').find({}).toArray();
    const trainerList = trainers.map(t => ({
        id: t.id,
        name: t.name,
        email: t.email,
        createdAt: t.createdAt,
        totalClients: 0 // Podrías contar clientes si quieres
    }));
    res.json({
        total: trainers.length,
        trainers: trainerList
    });
}));

// --- Clients ---
app.get('/api/clients', authenticateToken, asyncHandler(async (req, res) => {
    const { trainerId } = req.query;
    if (!trainerId) {
        return res.status(400).json({ message: 'trainerId es requerido' });
    }
    const clients = await db.collection('clients').find({ trainerId }).toArray();
    res.json(clients);
}));

app.post('/api/clients', authenticateToken, asyncHandler(async (req, res) => {
    const { clientData, trainerId } = req.body;

    // Verificar si ya existe un cliente con el mismo nombre de usuario
    const existingClient = await db.collection('clients').findOne({ username: clientData.username });
    if (existingClient) {
        return res.status(400).json({ message: 'Este nombre de usuario ya está en uso. Por favor, elige otro.' });
    }

    // --- Validación de Contraseña ---
    if (!clientData.password || clientData.password.trim() === '') {
        return res.status(400).json({ message: 'La contraseña es un campo obligatorio.' });
    }

    const newClient = {
        id: `client-${crypto.randomUUID()}`,
        ...clientData,
        trainerId,
        role: 'client',
        measurements: [],
        customRoutine: [],
        workoutLogs: []
    };

    // Hashear la contraseña proporcionada
    const salt = await bcrypt.genSalt(10);
    newClient.password = await bcrypt.hash(clientData.password, salt);

    await db.collection('clients').insertOne(newClient);

    const { password, ...responseData } = newClient;
    res.status(201).json(responseData);
}));

app.put('/api/clients/:id', authenticateToken, asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { password, _id, ...restOfBody } = req.body;

    const updateData = { ...restOfBody };

    // Si se está actualizando la contraseña, hashearla
    if (password && typeof password === 'string' && password.trim() !== '') {
        const salt = await bcrypt.genSalt(10);
        updateData.password = await bcrypt.hash(password, salt);
    }

    const result = await db.collection('clients').updateOne(
        { id: id },
        { $set: updateData }
    );

    if (result.matchedCount === 0) {
        return res.status(404).json({ message: 'Cliente no encontrado' });
    }

    const updatedClient = await db.collection('clients').findOne({ id: id });
    const { password: _, ...responseData } = updatedClient;
    res.json(responseData);
}));

app.delete('/api/clients/:id', authenticateToken, asyncHandler(async (req, res) => {
    const { id } = req.params;
    const result = await db.collection('clients').deleteOne({ id: id });
    if (result.deletedCount > 0) {
        res.status(204).send();
    } else {
        res.status(404).json({ message: 'Cliente no encontrado' });
    }
}));

// --- Exercises ---
app.get('/api/exercises', authenticateToken, asyncHandler(async (req, res) => {
    const exerciseDoc = await db.collection('system').findOne({ _id: 'exercises' });
    res.json(exerciseDoc ? exerciseDoc.data : []);
}));

app.put('/api/exercises', authenticateToken, asyncHandler(async (req, res) => {
    await db.collection('system').updateOne(
        { _id: 'exercises' },
        { $set: { data: req.body } },
        { upsert: true } // Crea el documento si no existe
    );
    res.json(req.body);
}));

// --- Notifications ---
app.get('/api/notifications', authenticateToken, asyncHandler(async (req, res) => {
    const notifications = await db.collection('notifications').find().sort({ date: -1 }).toArray();
    res.json(notifications);
}));

app.post('/api/notifications/clear', authenticateToken, asyncHandler(async (req, res) => {
    await db.collection('notifications').updateMany({ read: false }, { $set: { read: true } });
    res.status(204).send();
}));

// Ruta manual para eliminar notificaciones antiguas
app.delete('/api/notifications/cleanup', authenticateToken, asyncHandler(async (req, res) => {
    const result = await cleanupNotifications();
    res.json(result);
}));

// Función de limpieza automática de notificaciones
const cleanupNotifications = async () => {
    try {
        const now = new Date();
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const fourHoursAgo = new Date(now.getTime() - 4 * 60 * 60 * 1000);

        // Eliminar notificaciones NO VISTAS con más de 7 días
        const unreadResult = await db.collection('notifications').deleteMany({
            read: false,
            createdAt: { $lt: sevenDaysAgo }
        });

        // Eliminar notificaciones VISTAS con más de 4 horas
        const readResult = await db.collection('notifications').deleteMany({
            read: true,
            viewedAt: { $lt: fourHoursAgo }
        });

        const summary = {
            unreadDeleted: unreadResult.deletedCount,
            readDeleted: readResult.deletedCount,
            timestamp: now.toISOString()
        };

        console.log(`[Limpieza automática] Notificaciones eliminadas: ${summary.unreadDeleted} no vistas, ${summary.readDeleted} vistas.`);
        return summary;
    } catch (error) {
        console.error('Error en limpieza automática de notificaciones:', error);
        return { error: error.message };
    }
};

// Función auxiliar para agregar timestamps a notificaciones
app.post('/api/notifications', authenticateToken, asyncHandler(async (req, res) => {
    const { message, type = 'info' } = req.body;
    const newNotification = {
        id: `notif-${crypto.randomUUID()}`,
        message,
        type,
        read: false,
        createdAt: new Date(),
        viewedAt: null,
        date: new Date().toISOString()
    };
    await db.collection('notifications').insertOne(newNotification);
    res.status(201).json(newNotification);
}));

// --- Workout Logs ---
app.post('/api/clients/:id/log-workout', authenticateToken, asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { durationSeconds } = req.body;

    const client = await db.collection('clients').findOne({ id: id });

    if (client) {
        const today = new Date().toISOString().split('T')[0];
        const durationMinutes = Math.round(durationSeconds / 60);

        const workoutLogs = client.workoutLogs || [];
        const todayLogIndex = workoutLogs.findIndex(log => log.date === today);

        if (todayLogIndex > -1) {
            workoutLogs[todayLogIndex].duration += durationMinutes;
        } else {
            workoutLogs.push({ date: today, duration: durationMinutes });
        }

        await db.collection('clients').updateOne({ id: id }, { $set: { workoutLogs: workoutLogs } });

        const updatedClient = await db.collection('clients').findOne({ id: id });
        res.status(200).json(updatedClient);
    } else {
        res.status(404).json({ message: 'Cliente no encontrado' });
    }
}));

// --- SERVIR ARCHIVOS ESTÁTICOS DEL FRONTEND ---
// Usar path.resolve para asegurar rutas absolutas correctas
const frontendPath = path.resolve(__dirname, '..', 'frontend');
console.log('Sirviendo frontend desde:', frontendPath);

app.use(express.static(frontendPath, {
    setHeaders: (res, filepath) => {
        if (filepath.endsWith('index.html')) {
            res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
            res.setHeader('Pragma', 'no-cache');
            res.setHeader('Expires', '0');
        }
    }
}));

app.get(/^(?!\/api).*/, (req, res) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    const indexPath = path.join(frontendPath, 'index.html');
    console.log('Enviando index.html desde:', indexPath);
    res.sendFile(indexPath, (err) => {
        if (err) {
            console.error('Error enviando index.html:', err);
            res.status(500).send('Error loading application');
        }
    });
});

// --- SANEAMIENTO DE DATOS ---
const sanitizeAllData = async () => {
    console.log('--- INICIANDO SANEAMIENTO DE DATOS (V2) ---');
    try {
        const clients = await db.collection('clients').find({}).toArray();
        let updatedCount = 0;

        for (const client of clients) {
            let modified = false;
            // Normalizar estructura: algunos clientes pueden tener 'routine' en lugar de 'customRoutine' o ambos
            const routinesToCheck = [];
            if (client.customRoutine) routinesToCheck.push(client.customRoutine);
            if (client.routine && Array.isArray(client.routine)) routinesToCheck.push(client.routine);

            routinesToCheck.forEach(routine => {
                // Iterar sobre semanas
                routine.forEach((week, weekIndex) => {
                    if (!week) return;
                    // Iterar sobre claves (días)
                    Object.keys(week).forEach(dayKey => {
                        const day = week[dayKey];
                        // Verificar que parece un día con ejercicios
                        if (day && day.exercises && Array.isArray(day.exercises)) {
                            day.exercises.forEach((ex, exIndex) => {
                                const originalRest = ex.rest;
                                const originalTime = ex.time;
                                let newRest = parseFloat(originalRest);
                                let newTime = parseFloat(originalTime);

                                // Regla 1: Tiempos de descanso <= 10 se asumen como MINUTOS -> convertir a segundos
                                // (Cubre el caso de "1.5" -> 90s y "7" -> 420s)
                                if (newRest > 0 && newRest <= 10) {
                                    newRest = Math.round(newRest * 60);
                                }

                                // Regla 2: Tiempos de descanso excesivos (> 300s / 5 min) se capan a 90s
                                // (Cubre el caso de "7 minutos" convertidos a 420s, o "420" directos)
                                if (newRest > 300) {
                                    newRest = 90;
                                }

                                // Regla 3: Tiempos de ejercicio <= 5 se asumen como MINUTOS -> convertir a segundos
                                if (newTime > 0 && newTime <= 5) {
                                    newTime = Math.round(newTime * 60);
                                }

                                // Aplicar cambios si hubo modificación
                                if (newRest !== originalRest) {
                                    console.log(`[Cliente ${client.name}] Corrigiendo Rest: ${originalRest} -> ${newRest} (Semana ${weekIndex + 1}, ${dayKey}, Ejercicio ${ex.name})`);
                                    ex.rest = newRest;
                                    modified = true;
                                }
                                if (newTime !== originalTime) {
                                    console.log(`[Cliente ${client.name}] Corrigiendo Time: ${originalTime} -> ${newTime} (Semana ${weekIndex + 1}, ${dayKey}, Ejercicio ${ex.name})`);
                                    ex.time = newTime;
                                    modified = true;
                                }
                            });
                        }
                    });
                });
            });

            if (modified) {
                // Actualizar ambos campos si existen para mantener consistencia
                const updateFields = {};
                if (client.customRoutine) updateFields.customRoutine = client.customRoutine;
                if (client.routine) updateFields.routine = client.routine; // Por si acaso se usa este campo

                await db.collection('clients').updateOne({ _id: client._id }, { $set: updateFields });
                updatedCount++;
            }
        }
        console.log(`--- SANEAMIENTO COMPLETADO: ${updatedCount} clientes actualizados ---`);
    } catch (error) {
        console.error('FATAL: Error durante el saneamiento de datos:', error);
    }
};

// --- INICIAR SERVIDOR ---
const startServer = async () => {
    await connectDb(); // Conecta a la base de datos primero
    await seedDatabase(); // Puebla la base de datos con ejercicios
    await sanitizeAllData(); // Sanea datos inconsistentes en clientes
    await seedTrainerUser(); // Sembrar usuario específico

    // Ejecutar limpieza automática cada hora
    setInterval(cleanupNotifications, 60 * 60 * 1000); // 1 hora
    console.log('Tarea de limpieza automática de notificaciones programada (cada 1 hora)');

    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
        console.log('Conectado a la base de datos MongoDB.');
    });
};

startServer();