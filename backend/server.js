require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const path = require('path');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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
        const client = new MongoClient(MONGO_URL, { useUnifiedTopology: true });
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
        res.status(500).json({ message: 'Ocurrió un error interno en el servidor.', error: err.message });
    });
};

// --- LÓGICA DE SEEDING DE LA BASE DE DATOS ---
const seedDatabase = async () => {
    const defaultExercises = [
        // Glúteos
        { id: 'ex-glute-01', name: 'Hip Thrust con Barra', category: 'Glúteos', tags: ['Glúteos'], description: 'Ejercicio clave para la fuerza y el tamaño de los glúteos.', sets: 4, reps: 12, rest: 60 },
        { id: 'ex-glute-02', name: 'Sentadilla Búlgara con Mancuernas', category: 'Glúteos', tags: ['Glúteos', 'Piernas'], description: 'Excelente para el glúteo y cuádriceps, trabaja de forma unilateral.', sets: 3, reps: 10, rest: 60 },
        { id: 'ex-glute-03', name: 'Patada de Glúteo en Polea', category: 'Glúteos', tags: ['Glúteos'], description: 'Aísla el glúteo mayor para una máxima contracción.', sets: 3, reps: 15, rest: 45 },
        { id: 'ex-glute-04', name: 'Abducción de Cadera en Máquina', category: 'Glúteos', tags: ['Glúteos'], description: 'Fortalece el glúteo medio y menor, mejorando la estabilidad de la cadera.', sets: 3, reps: 20, rest: 45 },
        { id: 'ex-glute-05', name: 'Peso Muerto Rumano con Mancuernas', category: 'Glúteos', tags: ['Glúteos', 'Femorales'], description: 'Enfatiza el trabajo en los isquiotibiales y glúteos.', sets: 4, reps: 12, rest: 60 },
        { id: 'ex-glute-06', name: 'Puente de Glúteo con Banda', category: 'Glúteos', tags: ['Glúteos'], description: 'Ejercicio de activación que se puede usar para calentar o como finisher.', sets: 3, reps: 20, rest: 30 },

        // Piernas (Cuádriceps y Femorales)
        { id: 'ex-legs-01', name: 'Sentadilla Goblet', category: 'Piernas', tags: ['Piernas', 'Cuádriceps'], description: 'Variación de sentadilla que ayuda a mantener una postura correcta.', sets: 4, reps: 12, rest: 60 },
        { id: 'ex-legs-02', name: 'Prensa de Piernas', category: 'Piernas', tags: ['Piernas', 'Cuádriceps', 'Glúteos'], description: 'Permite mover cargas pesadas con gran seguridad para las piernas.', sets: 4, reps: 15, rest: 75 },
        { id: 'ex-legs-03', name: 'Extensiones de Cuádriceps', category: 'Piernas', tags: ['Piernas', 'Cuádriceps'], description: 'Aísla los cuádriceps para definirlos y fortalecerlos.', sets: 3, reps: 15, rest: 45 },
        { id: 'ex-legs-04', name: 'Curl Femoral Tumbado', category: 'Piernas', tags: ['Piernas', 'Femorales'], description: 'Aísla los isquiotibiales.', sets: 3, reps: 15, rest: 45 },
        { id: 'ex-legs-05', name: 'Zancadas Caminando', category: 'Piernas', tags: ['Piernas', 'Cuádriceps', 'Glúteos'], description: 'Ejercicio funcional que trabaja piernas y glúteos de forma dinámica.', sets: 3, reps: 12, rest: 60 },
        { id: 'ex-legs-06', name: 'Sentadilla Sumo con Pesa Rusa', category: 'Piernas', tags: ['Piernas', 'Aductores', 'Glúteos'], description: 'Enfatiza el trabajo en los aductores y glúteos.', sets: 3, reps: 12, rest: 60 },

        // Espalda
        { id: 'ex-back-01', name: 'Jalón al Pecho (Polea Alta)', category: 'Espalda', tags: ['Espalda', 'Dorsales'], description: 'Desarrolla la amplitud de la espalda (dorsales).', sets: 4, reps: 12, rest: 60 },
        { id: 'ex-back-02', name: 'Remo Sentado en Polea', category: 'Espalda', tags: ['Espalda'], description: 'Trabaja la densidad y grosor de la espalda media.', sets: 4, reps: 12, rest: 60 },
        { id: 'ex-back-03', name: 'Dominadas Asistidas', category: 'Espalda', tags: ['Espalda', 'Dorsales'], description: 'Versión accesible de las dominadas para construir fuerza.', sets: 3, reps: 8, rest: 75 },
        { id: 'ex-back-04', name: 'Pull-over con Mancuerna', category: 'Espalda', tags: ['Espalda', 'Dorsales', 'Pecho'], description: 'Trabaja el dorsal y el serrato, expandiendo la caja torácica.', sets: 3, reps: 15, rest: 60 },

        // Hombros
        { id: 'ex-shoulders-01', name: 'Press Militar con Mancuernas', category: 'Hombros', tags: ['Hombros'], description: 'Ejercicio fundamental para la fuerza y tamaño de los hombros.', sets: 4, reps: 10, rest: 75 },
        { id: 'ex-shoulders-02', name: 'Elevaciones Laterales con Mancuernas', category: 'Hombros', tags: ['Hombros'], description: 'Aísla la cabeza media del deltoides, dando amplitud a los hombros.', sets: 3, reps: 15, rest: 45 },
        { id: 'ex-shoulders-03', name: 'Pájaros (Elevaciones Posteriores)', category: 'Hombros', tags: ['Hombros'], description: 'Enfocado en el deltoides posterior, clave para una buena postura.', sets: 3, reps: 15, rest: 45 },
        { id: 'ex-shoulders-04', name: 'Face Pulls en Polea', category: 'Hombros', tags: ['Hombros', 'Espalda'], description: 'Mejora la salud del hombro y la postura, trabajando el deltoides posterior y manguito rotador.', sets: 3, reps: 20, rest: 45 },

        // Pecho
        { id: 'ex-chest-01', name: 'Press de Banca con Mancuernas', category: 'Pecho', tags: ['Pecho'], description: 'Permite un mayor rango de movimiento que la barra, beneficiando el desarrollo pectoral.', sets: 4, reps: 12, rest: 60 },
        { id: 'ex-chest-02', name: 'Aperturas con Mancuernas (Banco Inclinado)', category: 'Pecho', tags: ['Pecho'], description: 'Enfocado en la parte superior del pectoral.', sets: 3, reps: 15, rest: 45 },
        { id: 'ex-chest-03', name: 'Flexiones (Push-ups)', category: 'Pecho', tags: ['Pecho', 'Hombros', 'Tríceps'], description: 'Ejercicio de peso corporal fundamental para el tren superior.', sets: 3, reps: 15, rest: 60 },

        // Brazos (Bíceps y Tríceps)
        { id: 'ex-arms-01', name: 'Curl de Bíceps con Barra Z', category: 'Brazos', tags: ['Brazos', 'Bíceps'], description: 'Reduce la tensión en las muñecas mientras se trabaja el bíceps.', sets: 3, reps: 12, rest: 45 },
        { id: 'ex-arms-02', name: 'Extensiones de Tríceps en Polea Alta', category: 'Brazos', tags: ['Brazos', 'Tríceps'], description: 'Aísla el tríceps para un desarrollo completo.', sets: 3, reps: 15, rest: 45 },
        { id: 'ex-arms-03', name: 'Fondos en Banco', category: 'Brazos', tags: ['Brazos', 'Tríceps'], description: 'Excelente ejercicio de peso corporal para tríceps.', sets: 3, reps: 12, rest: 60 },
        { id: 'ex-arms-04', name: 'Curl Martillo con Mancuernas', category: 'Brazos', tags: ['Brazos', 'Bíceps', 'Antebrazo'], description: 'Trabaja el braquial y el antebrazo además del bíceps.', sets: 3, reps: 12, rest: 45 },

        // Abdomen y Core
        { id: 'ex-core-01', name: 'Plancha (Plank)', category: 'Abdomen y Core', tags: ['Core', 'Abdomen'], description: 'Ejercicio isométrico para la estabilidad de todo el core.', sets: 3, time: 60, rest: 30 },
        { id: 'ex-core-02', name: 'Elevación de Piernas Colgado', category: 'Abdomen y Core', tags: ['Core', 'Abdomen'], description: 'Intenso ejercicio para la parte inferior del abdomen.', sets: 3, reps: 15, rest: 60 },
        { id: 'ex-core-03', name: 'Crunch Abdominal en Polea Alta', category: 'Abdomen y Core', tags: ['Core', 'Abdomen'], description: 'Permite añadir resistencia al crunch para mayor hipertrofia.', sets: 3, reps: 20, rest: 45 },
        { id: 'ex-core-04', name: 'Rueda Abdominal (Ab Wheel)', category: 'Abdomen y Core', tags: ['Core', 'Abdomen', 'Espalda'], description: 'Ejercicio avanzado para una fuerza abdominal y de core superior.', sets: 3, reps: 12, rest: 60 },
    ];

    try {
        const collection = db.collection('system');
        const exerciseDoc = await collection.findOne({ _id: 'exercises' });

        if (!exerciseDoc || !exerciseDoc.data) {
            // Si no hay documento o no hay datos, se insertan todos los ejercicios por defecto
            await collection.updateOne(
                { _id: 'exercises' },
                { $set: { data: defaultExercises } },
                { upsert: true }
            );
            console.log('Base de datos de ejercicios sembrada con éxito.');
        } else {
            // Si ya existen ejercicios, añadir solo los que no están
            const existingNames = new Set(exerciseDoc.data.map(e => e.name));
            const newExercises = defaultExercises.filter(e => !existingNames.has(e.name));

            if (newExercises.length > 0) {
                await collection.updateOne(
                    { _id: 'exercises' },
                    { $push: { data: { $each: newExercises } } }
                );
                console.log(`${newExercises.length} nuevos ejercicios añadidos a la biblioteca.`);
            }
        }
    } catch (error) {
        console.error('Error al sembrar la base de datos de ejercicios:', error);
    }
};

// --- API ENDPOINTS ---

// --- Auth ---
app.post('/api/auth/client/login', asyncHandler(async (req, res) => {
    const { name, password } = req.body;
    const client = await db.collection('clients').findOne({ name });

    if (!client) {
        return res.status(401).json({ message: 'Nombre de usuario o contraseña de cliente incorrectos.' });
    }

    const isPasswordValid = await bcrypt.compare(password, client.password);

    if (isPasswordValid) {
        // Generar un token que no expira, según lo solicitado.
        const token = jwt.sign({ clientId: client.id, role: 'client' }, JWT_SECRET);
        
        const { password, ...clientData } = client;
        res.json({ token, user: clientData });
    } else {
        res.status(401).json({ message: 'Nombre de usuario o contraseña de cliente incorrectos.' });
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
    res.status(201).json({ token, user: trainerData });
}));

// --- Clients ---
app.get('/api/clients', asyncHandler(async (req, res) => {
    const { trainerId } = req.query;
    if (!trainerId) {
        return res.status(400).json({ message: 'trainerId es requerido' });
    }
    const clients = await db.collection('clients').find({ trainerId }).toArray();
    res.json(clients);
}));

app.post('/api/clients', asyncHandler(async (req, res) => {
    const { clientData, trainerId } = req.body;

    // --- Validación de Contraseña ---
    // Se asegura de que la contraseña exista y no esté vacía al crear un cliente.
    if (!clientData.password || clientData.password.trim() === '') {
        return res.status(400).json({ message: 'La contraseña es un campo obligatorio para crear un cliente.' });
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

app.put('/api/clients/:id', asyncHandler(async (req, res) => {
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

app.delete('/api/clients/:id', asyncHandler(async (req, res) => {
    const { id } = req.params;
    const result = await db.collection('clients').deleteOne({ id: id });
    if (result.deletedCount > 0) {
        res.status(204).send();
    } else {
        res.status(404).json({ message: 'Cliente no encontrado' });
    }
}));

// --- Exercises ---
app.get('/api/exercises', asyncHandler(async (req, res) => {
    const exerciseDoc = await db.collection('system').findOne({ _id: 'exercises' });
    res.json(exerciseDoc ? exerciseDoc.data : []);
}));

app.put('/api/exercises', asyncHandler(async (req, res) => {
    await db.collection('system').updateOne(
        { _id: 'exercises' },
        { $set: { data: req.body } },
        { upsert: true } // Crea el documento si no existe
    );
    res.json(req.body);
}));

// --- Notifications ---
app.get('/api/notifications', asyncHandler(async (req, res) => {
    const notifications = await db.collection('notifications').find().sort({ date: -1 }).toArray();
    res.json(notifications);
}));

app.post('/api/notifications', asyncHandler(async (req, res) => {
    const { message, type = 'info' } = req.body;
    const newNotification = {
        id: `notif-${crypto.randomUUID()}`,
        message,
        type,
        read: false,
        date: new Date().toISOString()
    };
    await db.collection('notifications').insertOne(newNotification);
    res.status(201).json(newNotification);
}));

app.post('/api/notifications/clear', asyncHandler(async (req, res) => {
    await db.collection('notifications').updateMany({ read: false }, { $set: { read: true } });
    res.status(204).send();
}));

// --- Workout Logs ---
app.post('/api/clients/:id/log-workout', asyncHandler(async (req, res) => {
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
app.use(express.static(path.join(__dirname, '..', 'frontend')));
app.get(/^(?!\/api).*/, (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

// --- INICIAR SERVIDOR ---
const startServer = async () => {
    await connectDb(); // Conecta a la base de datos primero
    await seedDatabase(); // Puebla la base de datos con ejercicios
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
        console.log('Conectado a la base de datos MongoDB.');
    });
};

startServer();