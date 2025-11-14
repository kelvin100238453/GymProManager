// Nueva biblioteca de ejercicios organizados por grupos musculares
// Descansos ahora en MINUTOS (no segundos)

const newExercisesLibrary = [
    // ==================== CARDIO ====================
    { 
        id: 'ex-cardio-01', 
        name: 'Caminata (Caminadora) - LISS', 
        category: 'Cardio', 
        tags: ['Cardio', 'LISS'], 
        description: 'Caminata de intensidad baja y constante en caminadora. Ideal para quemar grasa y mejorar resistencia cardiovascular.',
        time: 1800, // 25-45 min (usamos 30 min como default)
        rest: 0, // constancia
        formato_sugerido: 'LISS - 25-45 min'
    },
    { 
        id: 'ex-cardio-02', 
        name: 'Caminata (Caminadora) - Intervalos', 
        category: 'Cardio', 
        tags: ['Cardio', 'Intervalos'], 
        description: 'Intervalos de caminata alternando velocidad rápida y lenta. Ejemplo: 3 min rápido / 2 min lento.',
        time: 1500, // 20-30 min (usamos 25 min)
        rest: 0,
        formato_sugerido: 'Intervalos - 20-30 min (Ej: 3 min rápido/2 min lento)'
    },
    { 
        id: 'ex-cardio-03', 
        name: 'Escaladora (Stair Climber) - LISS', 
        category: 'Cardio', 
        tags: ['Cardio', 'LISS'], 
        description: 'Escaladora a ritmo constante y moderado para trabajar piernas y glúteos mientras quemas calorías.',
        time: 1350, // 15-30 min (usamos 22.5 min)
        rest: 0,
        formato_sugerido: 'LISS - 15-30 min'
    },
    { 
        id: 'ex-cardio-04', 
        name: 'Escaladora (Stair Climber) - HIIT', 
        category: 'Cardio', 
        tags: ['Cardio', 'HIIT'], 
        description: 'Intervalos de alta intensidad en escaladora. Ejemplo: 1 min rápido / 1 min lento.',
        time: 750, // 10-15 min (usamos 12.5 min)
        rest: 0,
        formato_sugerido: 'HIIT - 10-15 min (Ej: 1 min rápido/1 min lento)'
    },
    { 
        id: 'ex-cardio-05', 
        name: 'Elíptica (Elliptical) - LISS', 
        category: 'Cardio', 
        tags: ['Cardio', 'LISS'], 
        description: 'Entrenamiento cardiovascular de bajo impacto en elíptica, ideal para todas las edades.',
        time: 1800, // 20-40 min (usamos 30 min)
        rest: 0,
        formato_sugerido: 'LISS - 20-40 min'
    },
    { 
        id: 'ex-cardio-06', 
        name: 'Bicicleta Estática - LISS', 
        category: 'Cardio', 
        tags: ['Cardio', 'LISS'], 
        description: 'Ciclismo estacionario a ritmo constante. Mantener cadencia de 80-100 RPM.',
        time: 2250, // 30-45 min (usamos 37.5 min)
        rest: 0,
        formato_sugerido: 'LISS - 30-45 min (Cadencia 80-100 RPM)'
    },
    { 
        id: 'ex-cardio-07', 
        name: 'Máquina de Remo - Intervalos', 
        category: 'Cardio', 
        tags: ['Cardio', 'Intervalos'], 
        description: 'Intervalos en máquina de remo. Ejemplo: 500m rápido / 1 min descanso.',
        time: 1050, // 15-20 min (usamos 17.5 min)
        rest: 1,
        formato_sugerido: 'Intervalos - 15-20 min (Ej: 500m rápido/1min descanso)'
    },
    { 
        id: 'ex-cardio-08', 
        name: 'Saltar la Cuerda - Intervalos', 
        category: 'Cardio', 
        tags: ['Cardio', 'Intervalos'], 
        description: 'Saltos de cuerda en intervalos. Ejemplo: 1 min saltando / 30 seg descanso.',
        time: 750, // 10-15 min (usamos 12.5 min)
        rest: 0.5,
        formato_sugerido: 'Intervalos - 10-15 min (Ej: 1 min saltando/30 seg descanso)'
    },
    { 
        id: 'ex-cardio-09', 
        name: 'Correr (Trotar) - LISS', 
        category: 'Cardio', 
        tags: ['Cardio', 'LISS'], 
        description: 'Carrera a ritmo constante y moderado para mejorar resistencia cardiovascular.',
        time: 1800, // 20-40 min (usamos 30 min)
        rest: 0,
        formato_sugerido: 'LISS - 20-40 min (Ritmo constante)'
    },

    // ==================== PECHO ====================
    { id: 'ex-chest-01', name: 'Press de Banca con Barra', category: 'Pecho', tags: ['Pecho'], description: 'Ejercicio fundamental para desarrollar el pecho completo, especialmente la parte media.', sets: 4, reps: '8-12', rest: 2 },
    { id: 'ex-chest-02', name: 'Press de Banca con Mancuernas', category: 'Pecho', tags: ['Pecho'], description: 'Permite un mayor rango de movimiento que la barra, beneficiando el desarrollo pectoral.', sets: 4, reps: '8-12', rest: 2 },
    { id: 'ex-chest-03', name: 'Press de Banca Inclinado con Barra', category: 'Pecho', tags: ['Pecho'], description: 'Enfoca el trabajo en la parte superior del pecho.', sets: 4, reps: '8-12', rest: 2 },
    { id: 'ex-chest-04', name: 'Press de Banca Inclinado con Mancuernas', category: 'Pecho', tags: ['Pecho'], description: 'Excelente para desarrollar el pectoral superior con mayor rango de movimiento.', sets: 4, reps: '8-12', rest: 2 },
    { id: 'ex-chest-05', name: 'Press de Banca Declinado con Barra', category: 'Pecho', tags: ['Pecho'], description: 'Trabaja la parte inferior del pectoral.', sets: 4, reps: '8-12', rest: 1.5 },
    { id: 'ex-chest-06', name: 'Press de Banca Declinado con Mancuernas', category: 'Pecho', tags: ['Pecho'], description: 'Enfoca el trabajo en el pectoral inferior con mayor activación muscular.', sets: 4, reps: '8-12', rest: 1.5 },
    { id: 'ex-chest-07', name: 'Aperturas con Mancuernas (Banco Plano)', category: 'Pecho', tags: ['Pecho'], description: 'Aislamiento del pectoral con énfasis en el estiramiento muscular.', sets: 4, reps: '10-15', rest: 1.5 },
    { id: 'ex-chest-08', name: 'Aperturas con Mancuernas (Banco Inclinado)', category: 'Pecho', tags: ['Pecho'], description: 'Aperturas enfocadas en la parte superior del pecho.', sets: 4, reps: '10-15', rest: 1.5 },
    { id: 'ex-chest-09', name: 'Cruces de Polea (Altos a Bajos)', category: 'Pecho', tags: ['Pecho'], description: 'Trabaja el pectoral inferior con tensión constante.', sets: 4, reps: '10-15', rest: 1.5 },
    { id: 'ex-chest-10', name: 'Cruces de Polea (Medios)', category: 'Pecho', tags: ['Pecho'], description: 'Aislamiento del pectoral medio con máxima contracción.', sets: 4, reps: '10-15', rest: 1.5 },
    { id: 'ex-chest-11', name: 'Cruces de Polea (Bajos a Altos)', category: 'Pecho', tags: ['Pecho'], description: 'Enfoca el trabajo en la parte superior del pecho.', sets: 4, reps: '10-15', rest: 1.5 },
    { id: 'ex-chest-12', name: 'Fondos en Paralelas (Enfocado a Pecho)', category: 'Pecho', tags: ['Pecho', 'Tríceps'], description: 'Ejercicio de peso corporal excelente para pecho y tríceps. Inclinar el torso hacia adelante.', sets: 4, reps: '8-12', rest: 2 },
    { id: 'ex-chest-13', name: 'Flexiones (Push-ups)', category: 'Pecho', tags: ['Pecho', 'Hombros', 'Tríceps'], description: 'Ejercicio de peso corporal fundamental para el tren superior.', sets: 4, reps: '10-20', rest: 1.5 },
    { id: 'ex-chest-14', name: 'Flexiones Inclinadas (Manos elevadas)', category: 'Pecho', tags: ['Pecho'], description: 'Variación más fácil de flexiones, enfoca trabajo en pectoral inferior.', sets: 4, reps: '10-15', rest: 1.5 },
    { id: 'ex-chest-15', name: 'Flexiones Declinadas (Pies elevados)', category: 'Pecho', tags: ['Pecho'], description: 'Variación más difícil que enfoca el pectoral superior.', sets: 4, reps: '8-12', rest: 1.5 },
    { id: 'ex-chest-16', name: 'Flexiones con Agarre Cerrado', category: 'Pecho', tags: ['Pecho', 'Tríceps'], description: 'Variación que enfoca más el trabajo en tríceps.', sets: 4, reps: '8-12', rest: 1.5 },
    { id: 'ex-chest-17', name: 'Press en Máquina (Tipo Hammer)', category: 'Pecho', tags: ['Pecho'], description: 'Movimiento guiado ideal para enfocarse en la contracción.', sets: 4, reps: '8-12', rest: 1.5 },
    { id: 'ex-chest-18', name: 'Press en Máquina Inclinado', category: 'Pecho', tags: ['Pecho'], description: 'Máquina para trabajar el pectoral superior de forma segura.', sets: 4, reps: '8-12', rest: 1.5 },
    { id: 'ex-chest-19', name: 'Press de Suelo (Floor Press) con Barra', category: 'Pecho', tags: ['Pecho', 'Tríceps'], description: 'Variación del press de banca que reduce el rango de movimiento y protege los hombros.', sets: 4, reps: '6-10', rest: 2 },
    { id: 'ex-chest-20', name: 'Press de Suelo (Floor Press) con Mancuernas', category: 'Pecho', tags: ['Pecho', 'Tríceps'], description: 'Variación con mancuernas del floor press.', sets: 4, reps: '8-12', rest: 2 },

    // ==================== ESPALDA ====================
    { id: 'ex-back-01', name: 'Dominadas (Pull-ups) Agarre Prono', category: 'Espalda', tags: ['Espalda', 'Dorsales'], description: 'Ejercicio fundamental para desarrollar amplitud y fuerza en la espalda.', sets: 4, reps: '6-12', rest: 2 },
    { id: 'ex-back-02', name: 'Dominadas (Chin-ups) Agarre Supino', category: 'Espalda', tags: ['Espalda', 'Dorsales', 'Bíceps'], description: 'Variación que involucra más los bíceps y facilita el movimiento.', sets: 4, reps: '6-12', rest: 2 },
    { id: 'ex-back-03', name: 'Dominadas Agarre Neutro', category: 'Espalda', tags: ['Espalda', 'Dorsales'], description: 'Agarre más cómodo para las muñecas, trabaja bien los dorsales.', sets: 4, reps: '6-12', rest: 2 },
    { id: 'ex-back-04', name: 'Dominadas Asistidas', category: 'Espalda', tags: ['Espalda', 'Dorsales'], description: 'Versión accesible de las dominadas para construir fuerza progresivamente.', sets: 4, reps: '8-12', rest: 2 },
    { id: 'ex-back-05', name: 'Jalón al Pecho (Polea Alta, Agarre Ancho)', category: 'Espalda', tags: ['Espalda', 'Dorsales'], description: 'Desarrolla la amplitud de la espalda (dorsales).', sets: 4, reps: '8-12', rest: 1.5 },
    { id: 'ex-back-06', name: 'Jalón al Pecho (Agarre Supino)', category: 'Espalda', tags: ['Espalda', 'Dorsales', 'Bíceps'], description: 'Variación que activa más los bíceps.', sets: 4, reps: '8-12', rest: 1.5 },
    { id: 'ex-back-07', name: 'Jalón al Pecho (Agarre Neutro V)', category: 'Espalda', tags: ['Espalda', 'Dorsales'], description: 'Agarre cómodo que enfoca el trabajo en el centro de la espalda.', sets: 4, reps: '8-12', rest: 1.5 },
    { id: 'ex-back-08', name: 'Jalón Tras Nuca', category: 'Espalda', tags: ['Espalda', 'Dorsales'], description: 'Variación avanzada que requiere buena movilidad de hombros.', sets: 4, reps: '10-12', rest: 1.5 },
    { id: 'ex-back-09', name: 'Remo con Barra (Pendlay Row)', category: 'Espalda', tags: ['Espalda'], description: 'Remo explosivo desde el suelo que desarrolla fuerza y potencia en la espalda.', sets: 4, reps: '6-10', rest: 2 },
    { id: 'ex-back-10', name: 'Remo con Barra (Yates Row, Supino)', category: 'Espalda', tags: ['Espalda'], description: 'Variación con agarre supino que activa más los bíceps y el dorsal inferior.', sets: 4, reps: '8-12', rest: 2 },
    { id: 'ex-back-11', name: 'Remo con Mancuerna (a una mano)', category: 'Espalda', tags: ['Espalda'], description: 'Aislamiento unilateral perfecto para corregir asimetrías.', sets: 4, reps: '8-12', rest: 1.5 },
    { id: 'ex-back-12', name: 'Remo con Mancuernas (ambos brazos)', category: 'Espalda', tags: ['Espalda'], description: 'Remo bilateral con mancuernas para trabajo de espalda media.', sets: 4, reps: '10-12', rest: 1.5 },
    { id: 'ex-back-13', name: 'Remo en Punta (T-Bar Row)', category: 'Espalda', tags: ['Espalda'], description: 'Excelente para desarrollar grosor en la espalda media.', sets: 4, reps: '8-12', rest: 2 },
    { id: 'ex-back-14', name: 'Remo Sentado en Polea (Agarre V)', category: 'Espalda', tags: ['Espalda'], description: 'Trabaja la densidad y grosor de la espalda media.', sets: 4, reps: '8-12', rest: 1.5 },
    { id: 'ex-back-15', name: 'Remo Sentado en Polea (Agarre Ancho)', category: 'Espalda', tags: ['Espalda'], description: 'Variación con agarre ancho para trabajar la parte externa de los dorsales.', sets: 4, reps: '10-12', rest: 1.5 },
    { id: 'ex-back-16', name: 'Remo en Máquina (Tipo Hammer)', category: 'Espalda', tags: ['Espalda'], description: 'Movimiento guiado ideal para enfocarse en la contracción.', sets: 4, reps: '8-12', rest: 1.5 },
    { id: 'ex-back-17', name: 'Remo en Máquina (Agarre prono)', category: 'Espalda', tags: ['Espalda'], description: 'Variación de máquina con agarre prono.', sets: 4, reps: '8-12', rest: 1.5 },
    { id: 'ex-back-18', name: 'Remo Invertido (Bodyweight Row)', category: 'Espalda', tags: ['Espalda'], description: 'Ejercicio de peso corporal excelente para principiantes.', sets: 4, reps: '10-15', rest: 1.5 },
    { id: 'ex-back-19', name: 'Peso Muerto Convencional', category: 'Espalda', tags: ['Espalda', 'Piernas', 'Glúteos'], description: 'Ejercicio compuesto fundamental para fuerza general y desarrollo de espalda baja.', sets: 5, reps: '4-8', rest: 3 },
    { id: 'ex-back-20', name: 'Peso Muerto Sumo', category: 'Espalda', tags: ['Espalda', 'Piernas', 'Glúteos'], description: 'Variación con postura amplia que reduce estrés en la espalda baja.', sets: 5, reps: '4-8', rest: 3 },
    { id: 'ex-back-21', name: 'Peso Muerto Rumano', category: 'Espalda', tags: ['Espalda', 'Femorales', 'Glúteos'], description: 'Enfatiza el trabajo en los isquiotibiales y glúteos con menos carga en la espalda baja.', sets: 4, reps: '8-12', rest: 2 },
    { id: 'ex-back-22', name: 'Encogimientos (Shrugs) con Barra', category: 'Espalda', tags: ['Espalda', 'Trapecios'], description: 'Aislamiento de trapecios para desarrollar la parte superior de la espalda.', sets: 4, reps: '10-15', rest: 1.5 },
    { id: 'ex-back-23', name: 'Encogimientos (Shrugs) con Mancuernas', category: 'Espalda', tags: ['Espalda', 'Trapecios'], description: 'Variación con mancuernas para mayor rango de movimiento.', sets: 4, reps: '10-15', rest: 1.5 },
    { id: 'ex-back-24', name: 'Face Pulls', category: 'Espalda', tags: ['Espalda', 'Hombros'], description: 'Mejora la salud del hombro y la postura, trabajando el deltoides posterior y manguito rotador.', sets: 4, reps: '12-20', rest: 1 },
    { id: 'ex-back-25', name: 'Pullover con Polea Alta', category: 'Espalda', tags: ['Espalda', 'Dorsales'], description: 'Aislamiento del dorsal con tensión constante.', sets: 4, reps: '10-15', rest: 1.5 },

    // ==================== HOMBROS ====================
    { id: 'ex-shoulders-01', name: 'Press Militar con Barra (de pie)', category: 'Hombros', tags: ['Hombros'], description: 'Ejercicio fundamental para la fuerza y tamaño de los hombros.', sets: 4, reps: '6-10', rest: 2 },
    { id: 'ex-shoulders-02', name: 'Press Militar con Barra (sentado)', category: 'Hombros', tags: ['Hombros'], description: 'Variación sentada que permite enfocarse más en los hombros.', sets: 4, reps: '8-12', rest: 2 },
    { id: 'ex-shoulders-03', name: 'Press Militar con Mancuernas (sentado)', category: 'Hombros', tags: ['Hombros'], description: 'Mayor rango de movimiento y trabajo unilateral.', sets: 4, reps: '8-12', rest: 2 },
    { id: 'ex-shoulders-04', name: 'Press Arnold', category: 'Hombros', tags: ['Hombros'], description: 'Variación del press con rotación que trabaja todas las cabezas del deltoides.', sets: 4, reps: '8-12', rest: 2 },
    { id: 'ex-shoulders-05', name: 'Press en Máquina', category: 'Hombros', tags: ['Hombros'], description: 'Movimiento guiado ideal para principiantes o trabajo de alta intensidad.', sets: 4, reps: '8-12', rest: 1.5 },
    { id: 'ex-shoulders-06', name: 'Elevaciones Laterales con Mancuernas', category: 'Hombros', tags: ['Hombros'], description: 'Aísla la cabeza media del deltoides, dando amplitud a los hombros.', sets: 5, reps: '10-15', rest: 1.5 },
    { id: 'ex-shoulders-07', name: 'Elevaciones Laterales en Polea', category: 'Hombros', tags: ['Hombros'], description: 'Tensión constante en el deltoides medio.', sets: 5, reps: '12-15', rest: 1 },
    { id: 'ex-shoulders-08', name: 'Elevaciones Laterales en Máquina', category: 'Hombros', tags: ['Hombros'], description: 'Aislamiento del deltoides medio con movimiento guiado.', sets: 4, reps: '10-15', rest: 1.5 },
    { id: 'ex-shoulders-09', name: 'Elevaciones Frontales con Mancuernas', category: 'Hombros', tags: ['Hombros'], description: 'Trabaja la cabeza anterior del deltoides.', sets: 4, reps: '10-12', rest: 1.5 },
    { id: 'ex-shoulders-10', name: 'Elevaciones Frontales con Barra', category: 'Hombros', tags: ['Hombros'], description: 'Variación con barra para mayor carga.', sets: 4, reps: '10-12', rest: 1.5 },
    { id: 'ex-shoulders-11', name: 'Elevaciones Frontales con Disco', category: 'Hombros', tags: ['Hombros'], description: 'Ejercicio funcional para el deltoides anterior.', sets: 4, reps: '10-15', rest: 1.5 },
    { id: 'ex-shoulders-12', name: 'Elevaciones Frontales en Polea', category: 'Hombros', tags: ['Hombros'], description: 'Tensión constante en el deltoides anterior.', sets: 4, reps: '10-15', rest: 1 },
    { id: 'ex-shoulders-13', name: 'Pájaros (Deltoides Posterior) con Mancuernas', category: 'Hombros', tags: ['Hombros', 'Espalda'], description: 'Enfocado en el deltoides posterior, clave para una buena postura.', sets: 4, reps: '12-15', rest: 1.5 },
    { id: 'ex-shoulders-14', name: 'Pájaros en Máquina', category: 'Hombros', tags: ['Hombros', 'Espalda'], description: 'Aislamiento del deltoides posterior con movimiento guiado.', sets: 4, reps: '12-15', rest: 1 },
    { id: 'ex-shoulders-15', name: 'Face Pulls', category: 'Hombros', tags: ['Hombros', 'Espalda'], description: 'Mejora la salud del hombro y la postura, trabajando el deltoides posterior y manguito rotador.', sets: 4, reps: '12-20', rest: 1 },

    // ==================== PIERNAS - CUÁDRICEPS ====================
    { id: 'ex-legs-quad-01', name: 'Sentadilla (Squat) con Barra', category: 'Piernas', tags: ['Piernas', 'Cuádriceps', 'Glúteos'], description: 'El rey de los ejercicios de piernas. Desarrolla fuerza y masa muscular completa.', sets: 5, reps: '6-12', rest: 3 },
    { id: 'ex-legs-quad-02', name: 'Sentadilla Frontal', category: 'Piernas', tags: ['Piernas', 'Cuádriceps'], description: 'Mayor énfasis en cuádriceps y core, más amigable para la espalda baja.', sets: 4, reps: '6-10', rest: 3 },
    { id: 'ex-legs-quad-03', name: 'Sentadilla Goblet', category: 'Piernas', tags: ['Piernas', 'Cuádriceps'], description: 'Variación con mancuerna que ayuda a mantener una postura correcta.', sets: 4, reps: '8-12', rest: 2 },
    { id: 'ex-legs-quad-04', name: 'Sentadilla Búlgara', category: 'Piernas', tags: ['Piernas', 'Cuádriceps', 'Glúteos'], description: 'Excelente para el glúteo y cuádriceps, trabaja de forma unilateral.', sets: 4, reps: '8-12', rest: 1.5 },
    { id: 'ex-legs-quad-05', name: 'Sentadilla Hack', category: 'Piernas', tags: ['Piernas', 'Cuádriceps'], description: 'Máquina que permite enfocarse en los cuádriceps con seguridad.', sets: 4, reps: '8-15', rest: 2 },
    { id: 'ex-legs-quad-06', name: 'Prensa de Piernas 45°', category: 'Piernas', tags: ['Piernas', 'Cuádriceps', 'Glúteos'], description: 'Permite mover cargas pesadas con gran seguridad para las piernas.', sets: 4, reps: '8-15', rest: 2 },
    { id: 'ex-legs-quad-07', name: 'Prensa de Piernas Horizontal', category: 'Piernas', tags: ['Piernas', 'Cuádriceps'], description: 'Variación horizontal de la prensa de piernas.', sets: 4, reps: '10-15', rest: 2 },
    { id: 'ex-legs-quad-08', name: 'Zancadas con Barra', category: 'Piernas', tags: ['Piernas', 'Cuádriceps', 'Glúteos'], description: 'Ejercicio funcional que trabaja piernas y glúteos de forma dinámica.', sets: 4, reps: '8-12', rest: 2 },
    { id: 'ex-legs-quad-09', name: 'Zancadas con Mancuernas', category: 'Piernas', tags: ['Piernas', 'Cuádriceps', 'Glúteos'], description: 'Variación más accesible de las zancadas.', sets: 4, reps: '10-12', rest: 2 },
    { id: 'ex-legs-quad-10', name: 'Extensiones de Cuádriceps', category: 'Piernas', tags: ['Piernas', 'Cuádriceps'], description: 'Aísla los cuádriceps para definirlos y fortalecerlos.', sets: 4, reps: '12-20', rest: 1.5 },

    // ==================== PIERNAS - ISQUIOTIBIALES Y GLÚTEOS ====================
    { id: 'ex-legs-ham-01', name: 'Peso Muerto Rumano (RDL)', category: 'Piernas', tags: ['Piernas', 'Femorales', 'Glúteos'], description: 'Enfatiza el trabajo en los isquiotibiales y glúteos.', sets: 4, reps: '8-12', rest: 2 },
    { id: 'ex-legs-ham-02', name: 'Peso Muerto Rumano a una pierna', category: 'Piernas', tags: ['Piernas', 'Femorales', 'Glúteos'], description: 'Variación unilateral que mejora el equilibrio y corrige asimetrías.', sets: 4, reps: '8-12', rest: 1.5 },
    { id: 'ex-legs-ham-03', name: 'Curl Femoral Tumbado', category: 'Piernas', tags: ['Piernas', 'Femorales'], description: 'Aísla los isquiotibiales de forma efectiva.', sets: 4, reps: '10-15', rest: 1.5 },
    { id: 'ex-legs-ham-04', name: 'Curl Femoral Sentado', category: 'Piernas', tags: ['Piernas', 'Femorales'], description: 'Variación sentada que enfoca el trabajo en los isquiotibiales.', sets: 4, reps: '10-15', rest: 1.5 },
    { id: 'ex-legs-ham-05', name: 'Curl Nórdico', category: 'Piernas', tags: ['Piernas', 'Femorales'], description: 'Ejercicio avanzado de peso corporal para isquiotibiales.', sets: 4, reps: '6-10', rest: 2 },
    { id: 'ex-legs-glute-01', name: 'Hip Thrust con Barra', category: 'Piernas', tags: ['Piernas', 'Glúteos'], description: 'Ejercicio clave para la fuerza y el tamaño de los glúteos.', sets: 5, reps: '8-15', rest: 2 },
    { id: 'ex-legs-glute-02', name: 'Hip Thrust con Mancuerna', category: 'Piernas', tags: ['Piernas', 'Glúteos'], description: 'Variación más accesible del hip thrust.', sets: 4, reps: '10-15', rest: 2 },
    { id: 'ex-legs-glute-03', name: 'Puente de Glúteo', category: 'Piernas', tags: ['Piernas', 'Glúteos'], description: 'Ejercicio de activación que se puede usar para calentar o como finisher.', sets: 4, reps: '10-20', rest: 1.5 },
    { id: 'ex-legs-glute-04', name: 'Patada de Glúteo en Polea', category: 'Piernas', tags: ['Piernas', 'Glúteos'], description: 'Aísla el glúteo mayor para una máxima contracción.', sets: 4, reps: '12-15', rest: 1 },

    // ==================== PIERNAS - PANTORRILLAS ====================
    { id: 'ex-legs-calves-01', name: 'Elevación de Talones de Pie', category: 'Piernas', tags: ['Piernas', 'Pantorrillas'], description: 'Ejercicio principal para desarrollar los gemelos.', sets: 5, reps: '10-20', rest: 1.5 },
    { id: 'ex-legs-calves-02', name: 'Elevación de Talones Sentado', category: 'Piernas', tags: ['Piernas', 'Pantorrillas'], description: 'Trabaja el sóleo (músculo de la pantorrilla profundo).', sets: 5, reps: '15-25', rest: 1.5 },
    { id: 'ex-legs-calves-03', name: 'Elevación de Talones en Prensa', category: 'Piernas', tags: ['Piernas', 'Pantorrillas'], description: 'Variación que permite usar cargas más pesadas.', sets: 5, reps: '10-20', rest: 1.5 },

    // ==================== BÍCEPS ====================
    { id: 'ex-biceps-01', name: 'Curl de Bíceps con Barra Recta', category: 'Brazos', tags: ['Brazos', 'Bíceps'], description: 'Ejercicio fundamental para el desarrollo de los bíceps.', sets: 4, reps: '8-12', rest: 1.5 },
    { id: 'ex-biceps-02', name: 'Curl de Bíceps con Barra Z', category: 'Brazos', tags: ['Brazos', 'Bíceps'], description: 'Reduce la tensión en las muñecas mientras se trabaja el bíceps.', sets: 4, reps: '8-12', rest: 1.5 },
    { id: 'ex-biceps-03', name: 'Curl de Bíceps con Mancuernas (Alterno)', category: 'Brazos', tags: ['Brazos', 'Bíceps'], description: 'Permite máxima concentración en cada brazo.', sets: 4, reps: '8-12', rest: 1.5 },
    { id: 'ex-biceps-04', name: 'Curl de Bíceps con Mancuernas (Simultáneo)', category: 'Brazos', tags: ['Brazos', 'Bíceps'], description: 'Trabajo bilateral con mancuernas.', sets: 4, reps: '8-12', rest: 1.5 },
    { id: 'ex-biceps-05', name: 'Curl Martillo con Mancuernas', category: 'Brazos', tags: ['Brazos', 'Bíceps', 'Antebrazo'], description: 'Trabaja el braquial y el antebrazo además del bíceps.', sets: 4, reps: '8-12', rest: 1.5 },
    { id: 'ex-biceps-06', name: 'Curl Martillo en Polea', category: 'Brazos', tags: ['Brazos', 'Bíceps', 'Antebrazo'], description: 'Tensión constante en el bíceps y braquial.', sets: 4, reps: '10-15', rest: 1 },
    { id: 'ex-biceps-07', name: 'Curl en Banco Scott con Barra Z', category: 'Brazos', tags: ['Brazos', 'Bíceps'], description: 'Aislamiento total del bíceps eliminando el impulso.', sets: 4, reps: '8-12', rest: 1.5 },
    { id: 'ex-biceps-08', name: 'Curl en Banco Scott con Mancuerna', category: 'Brazos', tags: ['Brazos', 'Bíceps'], description: 'Aislamiento unilateral en banco Scott.', sets: 4, reps: '10-12', rest: 1 },
    { id: 'ex-biceps-09', name: 'Curl en Banco Scott (Máquina)', category: 'Brazos', tags: ['Brazos', 'Bíceps'], description: 'Variación guiada del banco Scott.', sets: 4, reps: '10-15', rest: 1.5 },
    { id: 'ex-biceps-10', name: 'Curl Concentrado', category: 'Brazos', tags: ['Brazos', 'Bíceps'], description: 'Máximo aislamiento del bíceps con pico de contracción.', sets: 4, reps: '10-12', rest: 1 },
    { id: 'ex-biceps-11', name: 'Curl en Polea Baja', category: 'Brazos', tags: ['Brazos', 'Bíceps'], description: 'Tensión constante durante todo el movimiento.', sets: 4, reps: '10-15', rest: 1 },
    { id: 'ex-biceps-12', name: 'Curl Araña', category: 'Brazos', tags: ['Brazos', 'Bíceps'], description: 'Variación del curl en banco inclinado que enfoca la parte inferior del bíceps.', sets: 4, reps: '10-15', rest: 1.5 },
    { id: 'ex-biceps-13', name: 'Curl "21s"', category: 'Brazos', tags: ['Brazos', 'Bíceps'], description: 'Técnica de entrenamiento intenso: 7 reps mitad inferior + 7 reps mitad superior + 7 reps completas.', sets: 3, reps: '21', rest: 1.5 },
    { id: 'ex-biceps-14', name: 'Curl Zottman', category: 'Brazos', tags: ['Brazos', 'Bíceps', 'Antebrazo'], description: 'Combina curl supino con bajada prona para trabajar bíceps y antebrazos.', sets: 4, reps: '10-12', rest: 1.5 },

    // ==================== TRÍCEPS ====================
    { id: 'ex-triceps-01', name: 'Extensión de Tríceps en Polea (con Cuerda)', category: 'Brazos', tags: ['Brazos', 'Tríceps'], description: 'Excelente para aislamiento del tríceps con máxima contracción.', sets: 4, reps: '10-15', rest: 1.5 },
    { id: 'ex-triceps-02', name: 'Extensión de Tríceps en Polea (Barra V)', category: 'Brazos', tags: ['Brazos', 'Tríceps'], description: 'Variación con barra V para cambio de ángulo.', sets: 4, reps: '10-15', rest: 1.5 },
    { id: 'ex-triceps-03', name: 'Extensión de Tríceps en Polea (Barra Recta)', category: 'Brazos', tags: ['Brazos', 'Tríceps'], description: 'Variación clásica con barra recta.', sets: 4, reps: '10-15', rest: 1.5 },
    { id: 'ex-triceps-04', name: 'Extensión de Tríceps Invertida', category: 'Brazos', tags: ['Brazos', 'Tríceps'], description: 'Variación con agarre inverso que cambia el énfasis muscular.', sets: 4, reps: '10-15', rest: 1.5 },
    { id: 'ex-triceps-05', name: 'Press Francés con Barra Z', category: 'Brazos', tags: ['Brazos', 'Tríceps'], description: 'Ejercicio fundamental para desarrollar masa en los tríceps.', sets: 4, reps: '8-12', rest: 2 },
    { id: 'ex-triceps-06', name: 'Press Francés con Mancuernas', category: 'Brazos', tags: ['Brazos', 'Tríceps'], description: 'Variación con mancuernas para mayor rango de movimiento.', sets: 4, reps: '8-12', rest: 2 },
    { id: 'ex-triceps-07', name: 'Copa de Tríceps (a dos manos)', category: 'Brazos', tags: ['Brazos', 'Tríceps'], description: 'Excelente para trabajar la cabeza larga del tríceps.', sets: 4, reps: '10-12', rest: 1.5 },
    { id: 'ex-triceps-08', name: 'Copa de Tríceps (a una mano)', category: 'Brazos', tags: ['Brazos', 'Tríceps'], description: 'Variación unilateral de la copa de tríceps.', sets: 4, reps: '10-12', rest: 1 },
    { id: 'ex-triceps-09', name: 'Extensión de Tríceps Tras Nuca', category: 'Brazos', tags: ['Brazos', 'Tríceps'], description: 'Trabaja intensamente la cabeza larga del tríceps.', sets: 4, reps: '10-15', rest: 1.5 },
    { id: 'ex-triceps-10', name: 'Fondos en Paralelas (Enfoque Tríceps)', category: 'Brazos', tags: ['Brazos', 'Tríceps', 'Pecho'], description: 'Ejercicio de peso corporal fundamental. Mantener el torso vertical para enfocar tríceps.', sets: 4, reps: '8-12', rest: 2 },
    { id: 'ex-triceps-11', name: 'Fondos entre Bancos', category: 'Brazos', tags: ['Brazos', 'Tríceps'], description: 'Variación accesible de los fondos para tríceps.', sets: 4, reps: '10-15', rest: 1.5 },
    { id: 'ex-triceps-12', name: 'Patada de Tríceps con Mancuerna', category: 'Brazos', tags: ['Brazos', 'Tríceps'], description: 'Aislamiento del tríceps con máxima contracción.', sets: 4, reps: '10-15', rest: 1 },
    { id: 'ex-triceps-13', name: 'Patada de Tríceps en Polea', category: 'Brazos', tags: ['Brazos', 'Tríceps'], description: 'Tensión constante en el tríceps durante todo el movimiento.', sets: 4, reps: '10-15', rest: 1 },
    { id: 'ex-triceps-14', name: 'Press de Banca con Agarre Cerrado', category: 'Brazos', tags: ['Brazos', 'Tríceps', 'Pecho'], description: 'Ejercicio compuesto excelente para fuerza de tríceps.', sets: 4, reps: '6-10', rest: 2 },
    { id: 'ex-triceps-15', name: 'Flexiones Diamante', category: 'Brazos', tags: ['Brazos', 'Tríceps'], description: 'Variación de flexiones enfocada en tríceps.', sets: 4, reps: '8-15', rest: 1.5 },
];

module.exports = { newExercisesLibrary };
