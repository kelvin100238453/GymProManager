# 📖 Instrucciones de Uso - GymProManager Mejorado

## 🚀 Cómo Iniciar el Servidor

### Opción 1: Servidor Local (Desarrollo)
```bash
cd /workspace/GymProManager/backend
NODE_PATH=./lib/node_modules/backend/node_modules node server.js
```

El servidor se iniciará en: **http://localhost:1000**

### Opción 2: Servidor de Producción
El servidor ya está configurado para desplegarse en:
**https://gympromanager.onrender.com**

## 📚 Cómo Usar la Nueva Biblioteca de Ejercicios

### 1. Acceder a la Biblioteca (Vista de Entrenador)
1. Inicia sesión como entrenador
2. Ve a la pestaña "Ejercicios"
3. Verás todos los grupos musculares **colapsados**
4. **Click en un grupo** para expandir y ver los ejercicios

### 2. Buscar Ejercicios
- Usa la barra de búsqueda en la parte superior
- Los resultados se filtrarán en tiempo real
- Los grupos sin resultados no se mostrarán

### 3. Añadir Ejercicios a una Rutina
1. Ve a un cliente → Calendario
2. Selecciona un día
3. Click en "Añadir Ejercicios"
4. **Búsqueda mejorada:**
   - Escribe en la barra de búsqueda
   - Expande los grupos que te interesen
   - Selecciona múltiples ejercicios
   - Verás el contador de seleccionados
5. Click en "Añadir Seleccionados"

### 4. Crear Nuevos Ejercicios
1. En la biblioteca, click en "Añadir Ejercicio"
2. Completa los campos:
   - **Nombre:** Nombre del ejercicio
   - **Categoría:** Elige el grupo muscular
   - **Series:** Número de series
   - **Reps:** Número de repeticiones (o rango como "8-12")
   - **Tiempo (min):** Para ejercicios de cardio (en minutos)
   - **Descanso (min):** Tiempo de descanso en MINUTOS
3. Guardar

## 📊 Estructura de Grupos Musculares

### Cardio (10 ejercicios)
- LISS (intensidad baja sostenida)
- Intervalos
- HIIT

### Pecho (20 ejercicios)
- Press de banca (variaciones)
- Aperturas
- Flexiones
- Cruces de polea

### Espalda (26 ejercicios)
- Dominadas
- Jalones
- Remos
- Peso muerto

### Hombros (16 ejercicios)
- Press militar
- Elevaciones laterales
- Elevaciones frontales
- Pájaros

### Piernas (27 ejercicios)
**Cuádriceps:**
- Sentadillas
- Prensa de piernas
- Extensiones

**Isquiotibiales:**
- Curls femorales
- Peso muerto rumano

**Pantorrillas:**
- Elevaciones de talones

### Brazos (31 ejercicios)
**Bíceps:**
- Curls (variaciones)
- Banco Scott

**Tríceps:**
- Extensiones
- Fondos
- Press cerrado

### Glúteos (6 ejercicios)
- Hip thrust
- Patadas de glúteo
- Abducción de cadera

### Abdomen y Core (4 ejercicios)
- Plancha
- Elevación de piernas
- Crunch
- Rueda abdominal

## ⚙️ Valores Predeterminados

### Ejercicios de Fuerza
- **Series:** 3-5
- **Reps:** 6-20 (depende del ejercicio)
- **Descanso:** 1-3 minutos

### Ejercicios de Cardio
- **Tiempo:** 10-45 minutos
- **Descanso:** 0-2 minutos (según tipo)
- **Formato:** LISS, Intervalos o HIIT

## 🔍 Tips de Uso

1. **Organización:** Los grupos colapsados ayudan a navegar fácilmente
2. **Búsqueda:** Usa palabras clave como "press", "curl", "sentadilla"
3. **Selección múltiple:** Puedes seleccionar ejercicios de diferentes grupos
4. **Contador visual:** Siempre verás cuántos ejercicios has seleccionado
5. **Edición:** Los ejercicios en las rutinas se pueden editar individualmente

## 🛠️ Solución de Problemas

### El servidor no inicia
```bash
# Verificar que las dependencias están instaladas
cd /workspace/GymProManager/backend
npm install

# Verificar que el archivo .env existe
cat .env

# Iniciar con NODE_PATH correcto
NODE_PATH=./lib/node_modules/backend/node_modules node server.js
```

### Los grupos no se colapsan
- Verifica que estás usando un navegador moderno
- Intenta refrescar la página (Ctrl+F5)

### Los descansos aparecen incorrectos
- Los descansos ahora están en MINUTOS
- 1.5 min = 90 segundos
- 0.8 min = 48 segundos

## 📞 Soporte

Para cualquier problema o pregunta:
1. Revisa este documento
2. Verifica el archivo MEJORAS_BIBLIOTECA_EJERCICIOS.md
3. Consulta el backup en: backend/backup-1763091961698.json

---

**Versión:** 1.1.0  
**Última actualización:** 2025-11-14
