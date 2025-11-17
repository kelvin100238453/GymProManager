#!/usr/bin/env python3
"""
Script para recrear el cliente M con estructura correcta
Incluye tanto _id (ObjectId) como id (UUID string) para compatibilidad con JWT
"""

import os
import uuid
import hashlib
import bcrypt
from pymongo import MongoClient

# Configuración
MONGODB_URI = "mongodb+srv://8092073906kgmailcom:Kp100238453@gympromanager.hnzbnst.mongodb.net/?appName=GymProManager"
DB_NAME = "GymProManager"
COLLECTION_NAME = "clients"

def create_client_m():
    """Crear cliente M con estructura correcta"""
    try:
        # Conectar a MongoDB
        client = MongoClient(MONGODB_URI)
        db = client[DB_NAME]
        collection = db[COLLECTION_NAME]
        
        print("🔗 Conectando a MongoDB Atlas...")
        
        # Verificar si ya existe cliente M
        existing_m = collection.find_one({"username": "M"})
        if existing_m:
            print(f"⚠️ Cliente M ya existe con _id: {existing_m['_id']}")
            print(f"   - Verificando estructura...")
            
            # Verificar si tiene campo 'id' (UUID string)
            if 'id' in existing_m:
                print("✅ Cliente M ya tiene campo 'id' - estructura correcta")
                return existing_m['_id']
            else:
                print("❌ Cliente M falta campo 'id' - eliminando y recreando...")
                collection.delete_one({"username": "M"})
        
        # Generar campos únicos
        client_id = str(uuid.uuid4())  # UUID string para JWT
        
        # Hashear contraseña
        password = "1"
        password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        
        # Crear documento del cliente
        client_data = {
            "id": client_id,           # UUID string para JWT
            "username": "M",           # Usuario para login
            "password": password_hash, # Contraseña hasheada
            "active": True,            # Estado activo
            "created_at": "2025-11-17T11:01:24.000Z"  # Fecha de creación
        }
        
        print("📝 Creando cliente M con estructura correcta...")
        
        # Insertar en la base de datos
        result = collection.insert_one(client_data)
        
        print(f"✅ Cliente M creado exitosamente!")
        print(f"   - _id (ObjectId): {result.inserted_id}")
        print(f"   - id (UUID): {client_id}")
        print(f"   - username: M")
        print(f"   - password: 1")
        print(f"   - active: True")
        
        return result.inserted_id
        
    except Exception as e:
        print(f"❌ Error al crear cliente M: {str(e)}")
        return None
    
    finally:
        if 'client' in locals():
            client.close()
            print("🔒 Conexión MongoDB cerrada")

def verify_client_m():
    """Verificar que el cliente M existe con estructura correcta"""
    try:
        client = MongoClient(MONGODB_URI)
        db = client[DB_NAME]
        collection = db[COLLECTION_NAME]
        
        print("\n🔍 Verificando cliente M...")
        
        # Buscar cliente M
        m_client = collection.find_one({"username": "M"})
        
        if not m_client:
            print("❌ Cliente M no encontrado en la base de datos")
            return False
        
        print(f"✅ Cliente M encontrado:")
        print(f"   - _id: {m_client['_id']}")
        print(f"   - id: {m_client.get('id', 'FALTA')}")
        print(f"   - username: {m_client['username']}")
        print(f"   - password: {len(m_client['password'])} caracteres (hash)")
        print(f"   - active: {m_client['active']}")
        
        # Verificar estructura
        has_uuid = 'id' in m_client
        has_objectid = '_id' in m_client
        has_username = 'username' in m_client
        has_password = 'password' in m_client
        is_active = m_client['active']
        
        print(f"\n📋 Verificación de estructura:")
        print(f"   - Campo 'id' (UUID): {'✅' if has_uuid else '❌'}")
        print(f"   - Campo '_id' (ObjectId): {'✅' if has_objectid else '❌'}")
        print(f"   - Campo 'username': {'✅' if has_username else '❌'}")
        print(f"   - Campo 'password': {'✅' if has_password else '❌'}")
        print(f"   - Campo 'active': {'✅' if is_active else '❌'}")
        
        # Prueba de contraseña
        print(f"\n🧪 Prueba de contraseña:")
        try:
            password_match = bcrypt.checkpw("1".encode('utf-8'), m_client['password'].encode('utf-8'))
            print(f"   - Password '1': {'✅ CORRECTA' if password_match else '❌ INCORRECTA'}")
        except Exception as e:
            print(f"   - Error en prueba: {e}")
        
        all_good = has_uuid and has_objectid and has_username and has_password and is_active and password_match
        print(f"\n🎯 Estado final: {'✅ LISTO PARA USAR' if all_good else '❌ PROBLEMAS DETECTADOS'}")
        
        return all_good
        
    except Exception as e:
        print(f"❌ Error al verificar cliente M: {str(e)}")
        return False
    
    finally:
        if 'client' in locals():
            client.close()

if __name__ == "__main__":
    print("🚀 RECREACIÓN CLIENTE M - ESTRUCTURA CORRECTA")
    print("=" * 50)
    
    # Crear cliente M
    created_id = create_client_m()
    
    # Verificar resultado
    if created_id:
        print(f"\n✅ Cliente M creado con ID: {created_id}")
        verify_client_m()
    else:
        print(f"\n❌ No se pudo crear el cliente M")
    
    print(f"\n🎉 Proceso completado")