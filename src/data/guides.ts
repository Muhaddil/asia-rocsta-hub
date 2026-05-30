import type { Guide } from "./types";
import timingImg from "@/assets/guide-timing-belt.jpg";
import hubsImg from "@/assets/guide-4wd-hubs.jpg";

export const guides: Guide[] = [
  {
    id: "g-001",
    slug: "correa-distribucion-r2",
    title: {
      es: "Sustitución de la correa de distribución (Mazda R2)",
      en: "Timing Belt Replacement (Mazda R2)",
    },
    description: {
      es: "Guía paso a paso para alinear las marcas de distribución del Mazda R2 2.2D y ajustar el tensor.",
      en: "Step-by-step guide to align the timing marks on the Mazda R2 2.2D and adjust the tensioner.",
    },
    level: "Intermedio",
    time: "2.5 h",
    image: timingImg,
    motor: "R2",
    category: "engine",
    tools: [
      {
        es: "Llave de carraca con vasos de 10, 12, 14 y 17 mm",
        en: "Ratchet wrench with 10, 12, 14 and 17 mm sockets",
      },
      { es: "Llave dinamométrica (20-120 Nm)", en: "Torque wrench (20-120 Nm)" },
      {
        es: "Pasador de bloqueo de bomba inyectora (o broca de 6 mm)",
        en: "Injection pump locking pin (or 6 mm drill bit)",
      },
      { es: "Destornillador plano grande o palanca", en: "Large flat-head screwdriver or pry bar" },
      {
        es: "Rotulador permanente o corrector blanco (para marcar)",
        en: "Permanent marker or white correction pen (for marking)",
      },
    ],
    steps: [
      {
        title: {
          es: "Paso 1: Desmontaje de componentes periféricos",
          en: "Step 1: Remove peripheral components",
        },
        content: {
          es: "Desconectar la batería por seguridad. Vaciar parcialmente el refrigerante y retirar el radiador para ganar espacio de trabajo óptimo en el frente del motor. Desmontar las correas de accesorios (alternador, bomba de dirección) y retirar el ventilador viscoso junto con su polea (4 tuercas de 10 mm).",
          en: "Disconnect the battery for safety. Partially drain the coolant and remove the radiator to gain optimal working space at the front of the engine. Remove the accessory belts (alternator, power steering pump) and remove the viscous fan together with its pulley (4 x 10 mm nuts).",
        },
      },
      {
        title: {
          es: "Paso 2: Retirada de las tapas de distribución",
          en: "Step 2: Remove the timing covers",
        },
        content: {
          es: "Quitar los tornillos de 10 mm de las carcasas plásticas superior e inferior de la distribución. Examinar el estado de las juntas de goma de las carcasas y reemplazarlas si están agrietadas o empapadas en aceite.",
          en: "Remove the 10 mm screws from the upper and lower plastic timing covers. Inspect the condition of the rubber gaskets on the covers and replace them if they are cracked or soaked in oil.",
        },
      },
      {
        title: {
          es: "Paso 3: Alineación de las marcas de tiempo",
          en: "Step 3: Align the timing marks",
        },
        content: {
          es: "Girar el cigüeñal manualmente en el sentido de las agujas del reloj usando un vaso de 17 mm en el perno de la polea del cigüeñal. Alinear las marcas de sincronización:\n1. Marca del árbol de levas alineada con la muesca de la culata a las 12 en punto.\n2. Marca del cigüeñal alineada con la flecha del bloque a las 12 en punto.\n3. Insertar una broca o pasador de 6 mm en el orificio de la polea de la bomba inyectora para bloquearla contra el soporte.",
          en: "Rotate the crankshaft clockwise by hand using a 17 mm socket on the crankshaft pulley bolt. Align the timing marks:\n1. Camshaft mark aligned with the cylinder head notch at 12 o'clock.\n2. Crankshaft mark aligned with the block arrow at 12 o'clock.\n3. Insert a 6 mm drill bit or pin into the injection pump pulley hole to lock it against the bracket.",
        },
      },
      {
        title: {
          es: "Paso 4: Aflojar el tensor y retirar la correa vieja",
          en: "Step 4: Loosen the tensioner and remove the old belt",
        },
        content: {
          es: "Aflojar el perno del rodillo tensor (14 mm). Empujar el rodillo tensor hacia atrás para comprimir el muelle y apretar ligeramente el perno para mantenerlo bloqueado en la posición floja. Deslizar la correa de distribución hacia afuera con cuidado de no mover los engranajes.",
          en: "Loosen the tensioner pulley bolt (14 mm). Push the tensioner pulley back to compress the spring and lightly tighten the bolt to keep it locked in the loose position. Slide the timing belt off, being careful not to move the gears.",
        },
      },
      {
        title: {
          es: "Paso 5: Instalación de la nueva correa y tensión",
          en: "Step 5: Install the new belt and tension",
        },
        content: {
          es: "Instalar la correa comenzando por el cigüeñal, pasando por el rodillo guía, el engranaje de la bomba inyectora, el árbol de levas y finalmente sobre el rodillo tensor. Asegurarse de que el lado de tracción (derecho) quede completamente tenso.\nAflojar el perno del tensor para permitir que el muelle aplique presión automática. Girar el cigüeñal dos vueltas completas para asentar la correa. Verificar que todas las marcas sigan perfectamente alineadas y apretar el perno del rodillo tensor a 38 Nm.",
          en: "Install the belt starting at the crankshaft, passing around the guide pulley, the injection pump gear, the camshaft, and finally over the tensioner pulley. Make sure the traction side (right side) is completely taut.\nLoosen the tensioner bolt to allow the spring to apply automatic pressure. Rotate the crankshaft two full turns to seat the belt. Verify that all marks remain perfectly aligned and tighten the tensioner pulley bolt to 38 Nm.",
        },
      },
      {
        title: { es: "Paso 6: Reensamblado completo", en: "Step 6: Complete reassembly" },
        content: {
          es: "Montar las tapas de la distribución (apriete suave a 9 Nm). Volver a instalar la polea del cigüeñal, polea de ventilador, correas auxiliares (ajustar la tensión adecuada) y el radiador. Rellenar refrigerante, purgar el circuito y arrancar el motor para verificar el funcionamiento suave.",
          en: "Install the timing covers (gently tighten to 9 Nm). Reinstall the crankshaft pulley, fan pulley, accessory belts (adjust to proper tension) and the radiator. Refill coolant, bleed the system and start the engine to verify smooth operation.",
        },
      },
    ],
    tags: ["distribución", "mantenimiento", "mazda r2", "motor"],
    contributions: 124,
  },
  {
    id: "g-002",
    slug: "mantenimiento-cubos-manuales",
    title: {
      es: "Mantenimiento de los cubos de bloqueo manual delanteros",
      en: "Manual Front Locking Hub Maintenance",
    },
    description: {
      es: "Limpieza, engrase y reconstrucción de los cubos libres (free-wheel hubs) delanteros mecánicos AVM / Warn.",
      en: "Cleaning, greasing and rebuilding of mechanical AVM / Warn front free-wheel hubs.",
    },
    level: "Intermedio",
    time: "1.0 h",
    image: hubsImg,
    motor: "ambos",
    category: "transmission",
    tools: [
      { es: "Llave Allen de 4 mm (para tapa del cubo)", en: "4 mm Allen key (for hub cover)" },
      { es: "Llave de vaso o estrella de 12 mm", en: "12 mm socket or wrench" },
      { es: "Alicates para circlips (anillos elásticos)", en: "Circlip pliers (snap ring pliers)" },
      { es: "Desengrasante / Limpiador de frenos", en: "Degreaser / Brake cleaner" },
      { es: "Grasa de litio EP2 de alta calidad", en: "High-quality EP2 lithium grease" },
      { es: "Trapos limpios", en: "Clean rags" },
    ],
    steps: [
      {
        title: { es: "Paso 1: Desmontaje de la tapa del cubo", en: "Step 1: Remove the hub cover" },
        content: {
          es: "Poner el vehículo en superficie plana y aplicar freno de mano. Girar el dial del cubo a la posición 'FREE'. Retirar los 6 tornillos Allen pequeños de la tapa externa. Retirar la tapa con cuidado; si está pegada, dar pequeños golpes con un martillo de goma.",
          en: "Park the vehicle on a level surface and engage the parking brake. Turn the hub dial to the 'FREE' position. Remove the 6 small Allen screws from the outer cover. Carefully remove the cover; if it is stuck, tap it gently with a rubber mallet.",
        },
      },
      {
        title: {
          es: "Paso 2: Extracción del cuerpo interno",
          en: "Step 2: Remove the internal body",
        },
        content: {
          es: "Retirar el circlip grande del extremo del palier utilizando los alicates de anillos elásticos. A continuación, retirar los 6 pernos de 12 mm que sujetan el cuerpo del cubo al buje de la rueda. Retirar todo el conjunto mecánico interno deslizándolo hacia afuera.",
          en: "Remove the large circlip from the end of the axle shaft using snap ring pliers. Then remove the 6 x 12 mm bolts securing the hub body to the wheel hub. Slide the entire internal mechanical assembly outward.",
        },
      },
      {
        title: {
          es: "Paso 3: Limpieza profunda y desengrase",
          en: "Step 3: Deep cleaning and degreasing",
        },
        content: {
          es: "Sumergir todas las piezas mecánicas (engranaje deslizante, muelle, anillo estriado) en desengrasante o limpiador de frenos. Limpiar con un cepillo hasta eliminar por completo la grasa vieja reseca, óxido, tierra y partículas metálicas. Dejar secar completamente al aire.",
          en: "Submerge all mechanical parts (sliding gear, spring, splined ring) in degreaser or brake cleaner. Scrub with a brush until all old dried grease, rust, dirt and metal particles are completely removed. Allow to air dry completely.",
        },
      },
      {
        title: { es: "Paso 4: Inspección de desgaste", en: "Step 4: Wear inspection" },
        content: {
          es: "Verificar visualmente que los dientes de engranaje no estén astillados o excesivamente redondeados. Asegurarse de que el muelle interno mantenga una buena tensión y que el dial de selección gire libremente entre FREE y LOCK sin atascos.",
          en: "Visually check that the gear teeth are not chipped or excessively rounded. Make sure the internal spring maintains good tension and that the selector dial rotates freely between FREE and LOCK without binding.",
        },
      },
      {
        title: {
          es: "Paso 5: Engrase moderado e instalación",
          en: "Step 5: Moderate greasing and installation",
        },
        content: {
          es: "Aplicar una capa **fina** de grasa EP2 en los dientes deslizantes y estrías. **¡Atención!** No rellenar el cubo de grasa en exceso; demasiada grasa densa impedirá que el muelle empuje el engranaje correctamente en invierno y causará fallos de tracción 4x4.\nDeslizar el cuerpo interno en el buje, apretar los 6 pernos de 12 mm a 25 Nm en estrella. Instalar el circlip del palier.",
          en: "Apply a **thin** layer of EP2 grease to the sliding teeth and splines. **Warning!** Do not overfill the hub with grease; too much thick grease will prevent the spring from pushing the gear correctly in winter and will cause 4x4 traction failure.\nSlide the internal body into the hub, tighten the 6 x 12 mm bolts to 25 Nm in a star pattern. Install the axle circlip.",
        },
      },
      {
        title: { es: "Paso 6: Ajuste final y prueba", en: "Step 6: Final adjustment and test" },
        content: {
          es: "Colocar la junta nueva de papel o aplicar una fina película de formador de juntas. Montar la tapa externa y apretar los tornillos Allen a 5 Nm. Probar el funcionamiento levantando la rueda del suelo: en FREE la rueda debe girar libremente sin arrastrar el palier; en LOCK, al girar la rueda debe girar el palier delantero correspondiente.",
          en: "Install a new paper gasket or apply a thin film of gasket maker. Mount the outer cover and tighten the Allen screws to 5 Nm. Test operation by lifting the wheel off the ground: in FREE the wheel should spin freely without turning the axle shaft; in LOCK, turning the wheel should rotate the corresponding front axle shaft.",
        },
      },
    ],
    tags: ["4x4", "transmisión", "cubos libres", "warn", "avm"],
    contributions: 42,
  },
  {
    id: "g-003",
    slug: "limpieza-valvula-egr",
    title: {
      es: "Anulación o limpieza de la válvula EGR (Mazda R2)",
      en: "EGR Valve Cleaning or Removal (Mazda R2)",
    },
    description: {
      es: "Cómo descarbonizar la válvula de recirculación de gases de escape para reducir humo negro y recuperar potencia.",
      en: "How to decarburize the exhaust gas recirculation valve to reduce black smoke and restore power.",
    },
    level: "Principiante",
    time: "45 min",
    motor: "R2",
    category: "engine",
    tools: [
      { es: "Llave fija o de estrella de 12 mm", en: "12 mm open-end or box wrench" },
      { es: "Cepillo metálico pequeño", en: "Small wire brush" },
      {
        es: "Spray descarbonizante o limpiador de hornos",
        en: "Decarbonizing spray or oven cleaner",
      },
      { es: "Destornillador plano", en: "Flat-head screwdriver" },
    ],
    steps: [
      {
        title: { es: "Paso 1: Localización de la EGR", en: "Step 1: Locate the EGR valve" },
        content: {
          es: "La válvula EGR se encuentra en el lado derecho del colector de admisión del motor R2. Es un platillo metálico de vacío con un tubo conectado que viene del colector de escape.",
          en: "The EGR valve is located on the right side of the intake manifold of the R2 engine. It is a metal vacuum disc with a connected pipe coming from the exhaust manifold.",
        },
      },
      {
        title: { es: "Paso 2: Desmontaje de la válvula", en: "Step 2: Remove the valve" },
        content: {
          es: "Desconectar la manguera fina de vacío de la parte superior. Quitar las dos tuercas de 12 mm que sujetan la válvula a la brida del colector de admisión. Retirar la válvula con cuidado de no romper la junta metálica original.",
          en: "Disconnect the thin vacuum hose from the top. Remove the two 12 mm nuts securing the valve to the intake manifold flange. Carefully remove the valve without damaging the original metal gasket.",
        },
      },
      {
        title: { es: "Paso 3: Limpieza de la carbonilla", en: "Step 3: Clean the carbon deposits" },
        content: {
          es: "Rociar el interior de la válvula con limpiador descarbonizante. Dejar actuar durante 10 minutos. Raspar la carbonilla acumulada con un destornillador plano y el cepillo metálico hasta que la aguja interna pueda subir y bajar libremente al empujarla manualmente.",
          en: "Spray the inside of the valve with decarbonizing cleaner. Let it sit for 10 minutes. Scrape off the accumulated carbon deposits with a flat-head screwdriver and wire brush until the internal needle can move up and down freely when pushed by hand.",
        },
      },
      {
        title: {
          es: "Paso 4: Montaje (o anulación opcional)",
          en: "Step 4: Reassembly (or optional removal)",
        },
        content: {
          es: "Si se desea mantener original: volver a montar la válvula con su junta metálica limpia y apretar a 20 Nm. Si se opta por anularla (bajo responsabilidad en base a normativa local): fabricar una pletina ciega de chapa de aluminio de 1.5mm con la misma forma de la junta metálica pero sin el orificio central, colocándola entre el tubo de escape y la EGR, además de taponar la manguera de vacío con un rodamiento pequeño.",
          en: "To keep it original: reassemble the valve with the clean metal gasket and tighten to 20 Nm. To remove it (at your own risk based on local regulations): make a blind plate from 1.5 mm aluminum sheet with the same shape as the metal gasket but without the center hole, placing it between the exhaust pipe and the EGR, and plug the vacuum hose with a small bearing.",
        },
      },
    ],
    tags: ["admisión", "motor", "egr", "humo negro"],
    contributions: 31,
  },
];
