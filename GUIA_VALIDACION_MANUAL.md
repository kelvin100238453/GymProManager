# Guía de Validación Manual - Sistema de Notificaciones y Simulador Holográfico

## Estado de Testing Automatizado
✅ **Testing Básico Completado:** Sistema funcionando correctamente
⚠️ **Testing Avanzado Pendiente:** Requiere validación manual de colores del simulador

---

## PARTE 1: VALIDACIÓN DEL SIMULADOR HOLOGRÁFICO

### Objetivo
Validar que el simulador corporal holográfico muestra colores dinámicos según los cambios en las mediciones corporales.

### Pasos de Validación Manual

#### PASO 1: Acceder al Sistema
1. Ir a: https://gympromanager.onrender.com
2. Login como entrenador:
   - Email: `kelvin100238453@gmail.com`
   - Password: `12345678`
3. Hacer clic en "Clientes" en el menú

#### PASO 2: Seleccionar o Crear Cliente
4. Seleccionar un cliente existente O crear uno nuevo
5. Hacer clic en el cliente para ver sus detalles
6. Ir a la pestaña "Progreso"

#### PASO 3: Agregar Primera Medición (Base de Comparación)
7. Scroll down hasta "Añadir Medición"
8. Llenar el formulario con valores iniciales:
   ```
   Peso: 150 lb
   Cintura: 75 cm
   Pecho: 90 cm
   Caderas: 95 cm
   Bíceps D: 32 cm
   Bíceps I: 31 cm
   Muslo D: 50 cm
   Muslo I: 49 cm
   Gemelo D: 35 cm
   Gemelo I: 34 cm
   ```
9. Click en "Guardar Medición"

#### PASO 4: Verificar Estado Inicial del Simulador
10. Scroll up para ver el "Simulador Corporal"
11. **ESPERADO:** El simulador debe mostrar la figura humana completamente en AZUL (sin colores de cambio)
12. **RAZÓN:** No hay medición anterior para comparar
13. ✅ Tomar captura de pantalla

#### PASO 5: Agregar Segunda Medición (Con Cambios)
14. Scroll down nuevamente al formulario
15. Llenar con valores que muestran cambios claros:
   ```
   Peso: 148 lb        (-2) DISMINUCIÓN
   Cintura: 73 cm      (-2) DISMINUCIÓN ← DEBE SER ROJO
   Pecho: 92 cm        (+2) AUMENTO     ← DEBE SER VERDE
   Caderas: 93 cm      (-2) DISMINUCIÓN ← DEBE SER ROJO
   Bíceps D: 34 cm     (+2) AUMENTO     ← DEBE SER VERDE
   Bíceps I: 33 cm     (+2) AUMENTO     ← DEBE SER VERDE
   Muslo D: 51 cm      (+1) AUMENTO     ← DEBE SER VERDE
   Muslo I: 50 cm      (+1) AUMENTO     ← DEBE SER VERDE
   Gemelo D: 35 cm     (0)  SIN CAMBIO  ← DEBE SER AZUL
   Gemelo I: 34 cm     (0)  SIN CAMBIO  ← DEBE SER AZUL
   ```
16. Click en "Guardar Medición"
17. Esperar 2-3 segundos

#### PASO 6: VALIDACIÓN CRÍTICA - Verificar Colores del Simulador
18. Scroll up para ver el "Simulador Corporal"
19. **VALIDAR COLORES DE CADA ÁREA:**

   **Áreas que DEBEN ser VERDES (aumento):**
   - ✅ Pecho (torso superior)
   - ✅ Brazo derecho (bíceps D)
   - ✅ Brazo izquierdo (bíceps I)
   - ✅ Muslo derecho
   - ✅ Muslo izquierdo

   **Áreas que DEBEN ser ROJAS (disminución):**
   - ✅ Cintura (torso medio)
   - ✅ Caderas (torso inferior)

   **Áreas que DEBEN ser AZULES (sin cambio):**
   - ✅ Pantorrilla derecha (gemelo D)
   - ✅ Pantorrilla izquierda (gemelo I)
   - ✅ Cabeza (siempre azul)

20. **VERIFICAR EFECTOS HOLOGRÁFICOS:**
   - ✅ Fondo oscuro con gradiente gris
   - ✅ Grid holográfico visible (líneas azules)
   - ✅ Partículas de luz animadas (puntos brillantes)
   - ✅ Efecto de brillo (glow) alrededor de cada área
   - ✅ Leyenda de colores visible (Disminución/Sin cambio/Aumento)

21. ✅ Tomar captura de pantalla COMPLETA del simulador

#### PASO 7: Verificar Tabla de Historial
22. Verificar en la tabla que ambas mediciones aparecen
23. **VERIFICAR INDICADORES DE CAMBIO:**
   - Debe mostrar flechas ↑ (verde) para aumentos
   - Debe mostrar flechas ↓ (rojo) para disminuciones
   - Valores sin cambio: sin flechas
24. ✅ Tomar captura de pantalla de la tabla

---

## PARTE 2: VALIDACIÓN DE NOTIFICACIONES AUTOMÁTICAS

### Objetivo
Validar que el sistema de limpieza automática de notificaciones funciona correctamente.

### Verificación de Campos en Base de Datos

**Nota:** Esta validación requiere acceso directo a la base de datos MongoDB o verificación del código backend.

#### Verificación de Código (Ya Implementado)
✅ **Campos agregados a notificaciones:**
```javascript
{
    id: "notif-xxx",
    message: "Mensaje de la notificación",
    type: "info",
    read: false,
    date: "2025-11-16T...",
    createdAt: Date,      // ← NUEVO
    viewedAt: null        // ← NUEVO (se establece al marcar como vista)
}
```

#### Verificación de Limpieza Automática

**MÉTODO 1: Verificar Logs del Servidor**
1. Acceder a los logs de Render (Panel de Render)
2. Buscar líneas similares a:
   ```
   [2025-11-16T...] Limpieza automática: X no vistas (>7 días), Y vistas (>4 horas)
   ```
3. Confirmar que el mensaje aparece cada 1 hora

**MÉTODO 2: Prueba de Endpoint Manual**
1. Usar herramienta como Postman o curl
2. Obtener token de autenticación (login)
3. Llamar endpoint:
   ```bash
   DELETE https://gympromanager.onrender.com/api/notifications/cleanup
   Authorization: Bearer <token>
   ```
4. Verificar respuesta:
   ```json
   {
       "message": "Limpieza completada",
       "deletedUnviewed": X,
       "deletedViewed": Y
   }
   ```

**MÉTODO 3: Prueba Funcional (Requiere Tiempo)**
1. Crear notificación de prueba
2. Marcarla como vista
3. Esperar 4+ horas
4. Verificar que desaparece automáticamente
5. Crear otra notificación y NO marcarla
6. Esperar 7+ días (no práctico para testing inmediato)

---

## CRITERIOS DE ÉXITO

### Simulador Holográfico ✅
- [ ] Fondo oscuro con gradiente visible
- [ ] Grid holográfico (líneas azules) visible
- [ ] Al menos 3 partículas de luz animadas
- [ ] Colores correctos según cambios:
  - [ ] Verde para aumentos
  - [ ] Rojo para disminuciones
  - [ ] Azul para sin cambio
- [ ] Efecto de brillo (glow) alrededor de áreas
- [ ] Leyenda de colores visible y correcta
- [ ] Campos de Pecho y Caderas funcionales

### Notificaciones Automáticas ✅
- [ ] Campos `createdAt` y `viewedAt` presentes en código
- [ ] Endpoint `/api/notifications/cleanup` responde
- [ ] Logs de limpieza automática aparecen cada hora
- [ ] Notificaciones vistas se marcan con `viewedAt`

---

## RESULTADOS DEL TESTING AUTOMATIZADO

### ✅ Testing Básico Completado

**Verificaciones Exitosas:**
1. ✅ Aplicación accesible y funcionando
2. ✅ Login de entrenador exitoso
3. ✅ Dashboard del entrenador carga correctamente
4. ✅ Gestión de clientes operativa
5. ✅ Simulador corporal visible en vista de progreso
6. ✅ Formulario de mediciones incluye campos nuevos:
   - ✅ Pecho (cm)
   - ✅ Caderas (cm)
7. ✅ Diseño holográfico confirmado:
   - ✅ Fondo oscuro con gradiente
   - ✅ Figura humana con efecto de resplandor azul
   - ✅ Estilo futurista implementado

**Elementos Técnicos Verificados:**
- ✅ ServiceWorker registrado
- ✅ API refrescando datos automáticamente
- ✅ Sin errores críticos en consola
- ✅ Navegación fluida

---

## CAPTURAS REQUERIDAS

Para validación completa, tomar capturas de:
1. ✅ Simulador con primera medición (todo azul)
2. ✅ Simulador con segunda medición (colores dinámicos)
3. ✅ Tabla de historial mostrando flechas de cambio
4. ✅ Formulario completo con 10 campos de medición
5. ⚠️ Logs de Render mostrando limpieza automática

---

## PRÓXIMOS PASOS

1. **Usuario debe realizar validación manual de colores** siguiendo esta guía
2. Tomar capturas de pantalla en cada paso
3. Verificar que todos los criterios de éxito se cumplen
4. Reportar cualquier discrepancia o problema visual
5. Si todo es correcto: ✅ Marcar implementación como COMPLETA

---

## CONTACTO Y SOPORTE

Si encuentra algún problema durante la validación:
- Tomar captura de pantalla del error
- Anotar los pasos exactos que llevaron al problema
- Verificar la consola del navegador (F12) para errores
- Reportar al equipo de desarrollo

---

**Última actualización:** 2025-11-16  
**Versión del sistema:** v2.0 - Simulador Holográfico + Notificaciones Automáticas  
**URL de producción:** https://gympromanager.onrender.com
