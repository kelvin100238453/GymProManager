#!/usr/bin/env python3
"""
Script para crear un cliente de prueba con el nuevo formato
"""

import os
import uuid
import bcrypt
from pymongo import MongoClient

# Configuración
MONGODB_URI = "mongodb+srv://8092073906kgmailcom:Kp100238453@gympromanager.hnzbnst.mongodb.net/?appName=GymProManager"
DB_NAME = "GymProManager"
COLLECTION_NAME = "clients"

def create_test_client():
    """Crear cliente de prueba"""
    try:
        client = MongoClient(MONGODB_URI)
        db = client[DB_NAME]
        collection = db[COLLECTION_NAME]
        
        print("🔗 Conectando a MongoDB Atlas...")
        
        # Verificar si ya existe
        existing = collection.find_one({"username": "Cliente_Prueba"})
        if existing:
            print(f"⚠️ Cliente_Prueba ya existe, eliminando...")
            collection.delete_one({"username": "Cliente_Prueba"})
        
        # Generar datos
        client_id = str(uuid.uuid4())
        password = "test123"
        password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        
        client_data = {
            "id": client_id,
            "username": "Cliente_Prueba",
            "password": password_hash,
            "active": True,
            "created_at": "2025-11-17T11:06:00.000Z"
        }
        
        print("📝 Creando cliente de prueba...")
        result = collection.insert_one(client_data)
        
        print(f"✅ Cliente de prueba creado!")
        print(f"   - Usuario: Cliente_Prueba")
        print(f"   - Contraseña: test123")
        print(f"   - ID: {result.inserted_id}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False
    
    finally:
        if 'client' in locals():
            client.close()

if __name__ == "__main__":
    create_test_client()
