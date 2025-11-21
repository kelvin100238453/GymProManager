// SCRIPT PARA CREAR EL USUARIO 8092073906k@gmail.com EN MONGODB ATLAS
require('dotenv').config();
const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');

async function createTrainerUser() {
    const MONGO_URL = process.env.MONGODB_URI;
    
    if (!MONGO_URL) {
        console.error('Error: La variable de entorno MONGODB_URI no está definida.');
        process.exit(1);
    }

    const client = new MongoClient(MONGO_URL);
    
    try {
        await client.connect();
        const db = client.db();
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
        
        // Listar todos los entrenadores para verificar
        const allTrainers = await trainersCollection.find({}).toArray();
        console.log('\n=== ENTRENADORES EN LA BASE DE DATOS ===');
        allTrainers.forEach(trainer => {
            console.log(`- ${trainer.name} (${trainer.email})`);
        });
        
    } catch (error) {
        console.error('Error al crear el usuario:', error);
        process.exit(1);
    } finally {
        await client.close();
    }
}

// Ejecutar la función
createTrainerUser();