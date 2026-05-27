import type { Problem } from "./types";

export const problems: Problem[] = [
  {
    id: "pr-001",
    title: {
      es: "Consumo excesivo de aceite y humo azulado",
      en: "Excessive oil consumption and blue smoke",
    },
    severity: "critical",
    motor: "F8",
    km: "120.000 - 180.000 km",
    symptom: {
      es: "Consumo de aceite superior a 1.5 litros cada 1000 km. Humo de color azulado por el tubo de escape al acelerar tras una retención prolongada o al arrancar en frío.",
      en: "Oil consumption exceeding 1.5 liters per 1000 km. Blue smoke from the exhaust when accelerating after prolonged idling or during cold starts.",
    },
    cause: {
      es: "Desgaste prematuro o resecamiento de los retenes de guía de válvula de la culata. Con kilometrajes elevados, desgaste o atasco de los segmentos de rascado de aceite en los pistones debido a intervalos de cambio de aceite prolongados.",
      en: "Premature wear or drying of the valve stem seals on the cylinder head. With high mileage, wear or sticking of the oil scraper rings on the pistons due to extended oil change intervals.",
    },
    solution: {
      es: "1. Reemplazar los retenes de válvulas. En el motor F8 SOHC se puede realizar quitando el árbol de levas y manteniendo las válvulas arriba inyectando aire comprimido en los cilindros (sin levantar la culata).\n2. Si el consumo persiste, se requiere abrir el motor, bruñir los cilindros y sustituir los segmentos de los pistones junto con casquillos de biela. Usar recambios de calidad Mazda F8.",
      en: "1. Replace the valve stem seals. On the F8 SOHC engine this can be done by removing the camshaft and holding the valves up by injecting compressed air into the cylinders (without removing the cylinder head).\n2. If consumption persists, the engine must be opened, cylinders honed, and piston rings replaced together with connecting rod bushings. Use quality Mazda F8 parts.",
    },
    cost: "150 € - 650 €",
    difficulty: "Alta",
    category: "engine",
    reports: 47,
  },
  {
    id: "pr-002",
    title: {
      es: "Palanca de la caja de transferencia bloqueada en 4WD",
      en: "Transfer case lever stuck in 4WD",
    },
    severity: "warn",
    motor: "ambos",
    km: "80.000 - 150.000 km",
    symptom: {
      es: "Imposibilidad de mover la palanca pequeña de la transfer para volver a 2H tras circular por pistas en 4H o 4L. Sensación de palanca dura o atascada mecánicamente.",
      en: "Unable to move the small transfer case lever back to 2H after driving on trails in 4H or 4L. Feels stiff or mechanically stuck.",
    },
    cause: {
      es: "1. Tensión de transmisión (diferencia de giro acumulada entre ejes al circular en 4x4 sobre superficies adherentes como asfalto seco).\n2. Desgaste o falta de engrase en las articulaciones externas de varillaje bajo la carrocería.\n3. Desgaste de la rótula de teflón de la propia palanca.",
      en: "1. Driveline windup (accumulated rotational difference between axles when driving in 4x4 on high-traction surfaces like dry asphalt).\n2. Wear or lack of lubrication on the external linkage joints under the body.\n3. Wear of the Teflon ball joint of the lever itself.",
    },
    solution: {
      es: "1. Para liberar la tensión acumulada instantáneamente: dar marcha atrás en línea recta 15-20 metros, pisar el embrague a fondo e intentar desenganchar.\n2. Subir el coche a un elevador, rociar limpiador y aplicar grasa de litio en spray a todo el varillaje que conecta la palanca con la caja de transferencia.\n3. Si hay holgura, desmontar la consola central interior, retirar la palanca y reemplazar el casquillo esférico de plástico del pivote.",
      en: "1. To instantly release accumulated windup: reverse in a straight line for 15-20 meters, press the clutch fully and try to disengage.\n2. Lift the vehicle on a hoist, spray cleaner and apply lithium spray grease to all the linkage connecting the lever to the transfer case.\n3. If there is play, remove the interior center console, take out the lever and replace the plastic ball socket on the pivot.",
    },
    cost: "5 € - 40 €",
    difficulty: "Fácil",
    category: "transmission",
    reports: 38,
  },
  {
    id: "pr-003",
    title: {
      es: "Temperatura elevada o refrigerante expulsado al vaso de expansión",
      en: "High temperature or coolant expelled into expansion tank",
    },
    severity: "critical",
    motor: "R2",
    km: "150.000 - 220.000 km",
    symptom: {
      es: "La aguja de temperatura sube a la zona roja bajo esfuerzo (subidas o autopista). Burbujeo constante en el vaso de expansión de refrigerante, expulsión de líquido hacia afuera por el rebosadero y manguitos superiores extremadamente duros en caliente.",
      en: "The temperature needle rises into the red zone under load (hills or highway). Constant bubbling in the coolant expansion tank, fluid expelled through the overflow, and upper hoses extremely hard when hot.",
    },
    cause: {
      es: "El motor Mazda R2 es propenso a agrietar la fundición de la culata entre los asientos de válvulas o a alabear la superficie si sufre un calentamiento prolongado por fallo de termostato o radiador obstruido.",
      en: "The Mazda R2 engine is prone to cracking the cylinder head casting between the valve seats or warping the surface if it suffers prolonged overheating due to thermostat failure or a clogged radiator.",
    },
    solution: {
      es: "1. Realizar test de presencia de CO2 en el refrigerante para confirmar fuga de gases de combustión.\n2. Desmontar culata, llevar a taller rectificador para prueba de presión de fisuras. Si está agrietada, se debe comprar una culata nueva armada (fácil de encontrar en aftermarket para motor Mazda R2 2.2D).\n3. Reemplazar junta de culata, tornillos nuevos, termostato nuevo a 82°C y limpiar el radiador principal.",
      en: "1. Perform a CO2 test in the coolant to confirm combustion gas leakage.\n2. Remove the cylinder head, take it to a machine shop for crack pressure testing. If cracked, purchase a new assembled cylinder head (easily found in the aftermarket for the Mazda R2 2.2D engine).\n3. Replace the head gasket with new bolts, a new 82°C thermostat, and clean the main radiator.",
    },
    cost: "400 € - 900 €",
    difficulty: "Alta",
    category: "engine",
    reports: 53,
  },
  {
    id: "pr-004",
    title: {
      es: "Holgura excesiva en el volante de dirección",
      en: "Excessive play in the steering wheel",
    },
    severity: "warn",
    motor: "ambos",
    km: "100.000 - 200.000 km",
    symptom: {
      es: "Movimiento libre de la dirección de más de 3-5 cm en el volante sin que las ruedas delanteras cambien de dirección. El coche es inestable a partir de 80 km/h y requiere corrección constante en línea recta.",
      en: "Free steering movement of more than 3-5 cm at the wheel without the front wheels changing direction. The vehicle becomes unstable above 80 km/h and requires constant correction to maintain a straight line.",
    },
    cause: {
      es: "1. Desgaste en los engranajes internos de la caja de dirección de recirculación de bolas.\n2. Desgaste en las rótulas del varillaje de dirección (rótulas exteriores, brazo Pitman o brazo auxiliar desgastados).",
      en: "1. Wear in the internal gears of the recirculating ball steering box.\n2. Wear in the steering linkage ball joints (worn tie rod ends, Pitman arm, or idler arm).",
    },
    solution: {
      es: "1. Revisar rótulas: levantar el eje delantero y mover las ruedas con las manos a las 9 y a las 3 en punto para detectar rótulas con juego. Reemplazar si hay holgura.\n2. Ajuste de la caja de dirección: en la parte superior de la caja de dirección hay un perno con una ranura de destornillador plano bloqueado por una contratuerca de 14 mm. Aflojar contratuerca, girar el tornillo interior en sentido horario 1/8 de vuelta, apretar contratuerca y probar. **Nota:** No apretar demasiado o la dirección se volverá dura y no retornará sola al salir de una curva.",
      en: "1. Check ball joints: lift the front axle and turn the steering wheel to check for play at the tie rod ends. Replace if loose.\n2. Steering box adjustment: on top of the steering box there is a bolt with a flathead screwdriver slot locked by a 14 mm lock nut. Loosen the lock nut, turn the inner screw clockwise 1/8 of a turn, tighten the lock nut and test. **Note:** Do not overtighten or the steering will become stiff and will not self-center when exiting a corner.",
    },
    cost: "0 € - 120 €",
    difficulty: "Media",
    category: "suspension",
    reports: 62,
  },
  {
    id: "pr-005",
    title: {
      es: "Velocímetro oscila o no funciona",
      en: "Speedometer fluctuates or does not work",
    },
    severity: "info",
    motor: "ambos",
    km: "140.000 - 250.000 km",
    symptom: {
      es: "La aguja del velocímetro oscila bruscamente a baja velocidad o directamente se queda a cero permanentemente. El odómetro de kilómetros tampoco avanza.",
      en: "The speedometer needle fluctuates wildly at low speed or stays at zero permanently. The odometer also stops advancing.",
    },
    cause: {
      es: "1. Rotura del núcleo interno de acero flexible del cable del velocímetro.\n2. Desgaste del piñón de plástico de accionamiento del velocímetro situado en la salida trasera de la caja de transferencia.",
      en: "1. Breakage of the inner flexible steel core of the speedometer cable.\n2. Wear of the plastic drive gear for the speedometer located at the rear output of the transfer case.",
    },
    solution: {
      es: "1. Desconectar el cable detrás del cuadro de instrumentos y en la transfer. Sacar el cable flexible de su funda metálica. Si está roto, sustituir el conjunto de cable (el de Mazda B2200 sirve pero suele requerir sujetar el ojal con brida).\n2. Si el cable está sano, desenroscar el piñón de plástico de la caja transfer, inspeccionar los dientes de plástico. Si están lisos, cambiar el engranaje del piñón.",
      en: "1. Disconnect the cable behind the instrument cluster and at the transfer case. Remove the flexible cable from its metal sheath. If broken, replace the cable assembly (the Mazda B2200 one fits but may require securing the grommet with a zip tie).\n2. If the cable is intact, unscrew the plastic drive gear from the transfer case, inspect the plastic teeth. If they are worn smooth, replace the gear.",
    },
    cost: "15 € - 45 €",
    difficulty: "Fácil",
    category: "electrical",
    reports: 29,
  },
];
