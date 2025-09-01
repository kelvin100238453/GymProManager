const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const path = require('path');
const crypto = require('crypto');
const bcrypt = require('bcrypt');

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
        // No enviar la contraseña hasheada al cliente
        const { password, ...clientData } = client;
        res.json(clientData);
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
        // No enviar la contraseña hasheada al cliente
        const { password, ...trainerData } = trainer;
        res.json(trainerData);
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
    
    // No enviar la contraseña hasheada al cliente
    const { password: _, ...responseData } = newTrainer;
    res.status(201).json(responseData);
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
    
    const newClient = {
        id: `client-${crypto.randomUUID()}`,
        ...clientData,
        trainerId,
        role: 'client',
        measurements: [],
        customRoutine: [],
        workoutLogs: []
    };

    // Hashear contraseña si se proporciona al crear
    if (clientData.password) {
        const salt = await bcrypt.genSalt(10);
        newClient.password = await bcrypt.hash(clientData.password, salt);
    }

    await db.collection('clients').insertOne(newClient);
    
    const { password, ...responseData } = newClient;
    res.status(201).json(responseData);
}));

app.put('/api/clients/:id', asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { password, ...restOfBody } = req.body;
    
    const updateData = { ...restOfBody };
    
    // Si se está actualizando la contraseña, hashearla
    if (password) {
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
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
        console.log('Conectado a la base de datos MongoDB.');
    });
};

startServer();