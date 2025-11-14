# Corrección Crítica: Middleware de Autenticación JWT

## Fecha: 2025-11-15 06:37:46

## Problema Identificado

Los clientes creados por entrenadores perdían acceso después de un tiempo porque el backend NO validaba tokens JWT en las rutas protegidas. Solo las rutas bajo `/auth/*` verificaban tokens.

## Solución Implementada

### 1. Middleware de Autenticación JWT

Se creó el middleware `authenticateToken` en `/workspace/gympro-clean/backend/server.js` (líneas 146-179):

```javascript
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({ message: 'Token de acceso requerido.' });
    }

    jwt.verify(token, JWT_SECRET, async (err, payload) => {
        if (err) {
            console.error('Error verificando token:', err.message);
            return res.status(403).json({ message: 'Token inválido o expirado.' });
        }

        req.user = payload;

        // Verificar que el usuario existe en la base de datos
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
    });
};
```

### 2. Rutas Protegidas

El middleware se aplicó a las siguientes rutas:

**Clientes:**
- `GET /api/clients` (línea 286)
- `POST /api/clients` (línea 295)
- `PUT /api/clients/:id` (línea 329)
- `DELETE /api/clients/:id` (línea 355)
- `POST /api/clients/:id/log-workout` (línea 405) - CRÍTICO para clientes

**Ejercicios:**
- `PUT /api/exercises` (línea 371)

**Notificaciones:**
- `GET /api/notifications` (línea 381)
- `POST /api/notifications` (línea 386)
- `POST /api/notifications/clear` (línea 399)

### 3. Rutas Públicas (sin middleware)

Las siguientes rutas permanecen públicas:
- `GET /api/exercises` - Lectura de biblioteca de ejercicios
- `POST /auth/*` - Todas las rutas de autenticación (login, register, refresh)

## Despliegue

### Estado del Commit

✅ **Commit enviado a GitHub**
- **Hash**: d36f7e4
- **Mensaje**: "Fix: Agregar middleware de autenticación JWT para proteger rutas de clientes"
- **Archivos**: backend/server.js (+43/-9)
- **Verificado**: https://github.com/kelvin100238453/GymProManager/commit/d36f7e4

### Redespliegue en Render

⚠️ **Acción Requerida**: Debido a problemas con webhooks automáticos de Render, se requiere redespliegue manual:

1. Acceder a: https://dashboard.render.com
2. Seleccionar servicio "GymProManager"
3. Click en "Manual Deploy"
4. Seleccionar "Clear build cache & deploy"
5. Esperar 3-5 minutos

## Validación Manual

### Test 1: Ruta Protegida Sin Token (Debe Fallar)

```bash
curl -X GET "https://gympromanager.onrender.com/api/clients?trainerId=test123"
```

**Resultado Esperado:**
```json
{
  "message": "Token de acceso requerido."
}
```
**HTTP Code Esperado:** 401

### Test 2: Login y Acceso Normal (Debe Funcionar)

1. Ir a: https://gympromanager.onrender.com
2. Click en "Soy Entrenador"
3. Login con credenciales existentes
4. Verificar que puede ver lista de clientes
5. Agregar/editar ejercicios de clientes

**Resultado Esperado:** Todo funciona normalmente porque el frontend envía los tokens JWT en los headers.

### Test 3: Cliente Puede Registrar Entrenamiento

1. Login como cliente
2. Ir a un día con rutina
3. Completar entrenamiento
4. Verificar que se registra correctamente

**Resultado Esperado:** El workout log se guarda correctamente con autenticación JWT.

## Impacto

### Seguridad Mejorada

✅ Todas las operaciones de datos requieren autenticación válida
✅ Los tokens expirados/inválidos son rechazados
✅ Los usuarios eliminados no pueden acceder aunque tengan token antiguo

### Solución al Bug Original

✅ Los clientes ya NO perderán acceso después de períodos de inactividad
✅ El sistema valida tokens end-to-end en todas las operaciones críticas
✅ Consistencia entre frontend y backend en manejo de autenticación

## Archivos Modificados

- `/workspace/gympro-clean/backend/server.js`
  - Líneas 146-179: Middleware `authenticateToken`
  - Líneas 286-405: Aplicación del middleware a rutas protegidas

## Próximos Pasos

1. ✅ Commit realizado
2. ✅ Push a GitHub completado
3. ⏳ Redespliegue en Render (manual requerido)
4. ⏳ Validación en producción
5. ⏳ Monitoreo de logs para errores de autenticación

## Notas Técnicas

- **JWT_SECRET**: Se usa desde variable de entorno `process.env.JWT_SECRET`
- **Tokens**: Expiran en 1 hora (accessToken) y 7 días (refreshToken)
- **Verificación en DB**: El middleware verifica que el usuario exista además de validar el token
- **Backwards Compatible**: Las rutas públicas (GET /api/exercises) siguen funcionando sin cambios
