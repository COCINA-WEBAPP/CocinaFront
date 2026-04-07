/**
 * Respuestas predeterminadas del ChefBot.
 *
 * En el futuro este módulo será reemplazado por llamadas a una API de IA.
 * Por ahora ofrece respuestas basadas en palabras clave para estas funciones:
 *   1. Sustitución de ingredientes
 *   2. Explicación de términos culinarios
 *   3. Tips y técnicas de cocción
 *   4. Conversiones de medidas
 *   5. Seguridad alimentaria
 */

// ─── Sustituciones de ingredientes ────────────────────────────────────────────

export const INGREDIENT_SUBSTITUTIONS: Record<
  string,
  { substitute: string; note: string }
> = {
  huevo: {
    substitute: "1 cucharada de semillas de chía o lino remojadas en 3 cucharadas de agua (por cada huevo)",
    note: "Funciona muy bien en repostería. También puedes usar 1/4 de taza de puré de manzana o medio plátano maduro machacado.",
  },
  mantequilla: {
    substitute: "La misma cantidad de aceite de coco o aceite de oliva",
    note: "Para repostería, el aceite de coco aporta textura similar. En platillos salados, el aceite de oliva es ideal.",
  },
  leche: {
    substitute: "Leche de avena, almendra, soja o coco en la misma cantidad",
    note: "La leche de avena es la más neutra en sabor. La de coco aporta cremosidad extra.",
  },
  harina: {
    substitute: "Harina de almendra, avena molida o harina de arroz",
    note: "La harina de almendra funciona bien en repostería. La de arroz es ideal para rebozados crujientes.",
  },
  "harina de trigo": {
    substitute: "Harina de espelta, harina de centeno, o mezcla sin gluten (arroz + tapioca)",
    note: "La espelta tiene gluten pero es más digestiva. Para celíacos, usa siempre harinas certificadas sin gluten.",
  },
  azucar: {
    substitute: "Miel, jarabe de arce o stevia",
    note: "Usa 3/4 de la cantidad si usas miel o jarabe de arce, ya que son más dulces. Reduce también los líquidos de la receta ligeramente.",
  },
  "azucar moreno": {
    substitute: "Azúcar blanca + 1 cucharada de melaza por cada taza, o panela rallada",
    note: "La panela rallada es la alternativa más natural. Si no tienes melaza, unas gotas de miel oscura funcionan.",
  },
  crema: {
    substitute: "Leche de coco (la parte espesa de la lata) o yogur griego",
    note: "La crema de coco es perfecta para salsas y postres. El yogur griego funciona bien en aderezos.",
  },
  "crema de leche": {
    substitute: "Leche de coco espesa o anacardos remojados y licuados",
    note: "La leche de coco da una textura muy cremosa. Los anacardos licuados son ideales para salsas veganas.",
  },
  queso: {
    substitute: "Levadura nutricional para sabor a queso, o tofu firme rallado",
    note: "La levadura nutricional aporta un sabor umami similar al parmesano. Para fundir, existen quesos veganos comerciales.",
  },
  "queso parmesano": {
    substitute: "Levadura nutricional, queso pecorino o queso curado de cabra",
    note: "La levadura nutricional es la opción vegana por excelencia. El pecorino tiene un sabor similar pero más intenso.",
  },
  "pan rallado": {
    substitute: "Avena molida, harina de almendra o copos de maíz triturados",
    note: "Los copos de maíz triturados dan un rebozado extra crujiente.",
  },
  ajo: {
    substitute: "1/8 de cucharadita de ajo en polvo por cada diente de ajo",
    note: "El ajo en polvo es más suave. Si buscas más intensidad, usa ajo granulado.",
  },
  cebolla: {
    substitute: "1 cucharadita de cebolla en polvo o puerro picado",
    note: "El puerro ofrece un sabor más suave. Los chalotes son otra buena alternativa.",
  },
  limon: {
    substitute: "Vinagre de manzana o lima en la misma cantidad",
    note: "El vinagre de manzana funciona bien en aderezos. La lima es casi intercambiable con el limón.",
  },
  vino: {
    substitute: "Caldo de pollo o verduras con un chorrito de vinagre",
    note: "Usa la misma cantidad de caldo. El vinagre aporta la acidez que normalmente da el vino.",
  },
  "vino blanco": {
    substitute: "Caldo de pollo con un chorrito de limón, o vinagre de arroz",
    note: "El ácido del limón imita la acidez del vino. Para platos de mariscos, el caldo de pescado es ideal.",
  },
  "vino tinto": {
    substitute: "Caldo de res con una cucharada de vinagre balsámico",
    note: "El vinagre balsámico aporta profundidad similar al vino tinto. El jugo de uva sin azúcar es otra opción.",
  },
  "salsa de soja": {
    substitute: "Aminos de coco o salsa tamari (sin gluten)",
    note: "Los aminos de coco son más suaves y ligeramente dulces. El tamari tiene un sabor muy similar a la soja.",
  },
  maicena: {
    substitute: "Harina de arrurruz o harina común (usa el doble de cantidad)",
    note: "El arrurruz da un acabado más brillante a las salsas. La harina común necesita más cocción.",
  },
  gelatina: {
    substitute: "Agar-agar (1 cucharadita de agar por cada cucharada de gelatina)",
    note: "El agar-agar es vegano y gelifica más firme que la gelatina. Se disuelve en líquido caliente y cuaja al enfriar.",
  },
  miel: {
    substitute: "Jarabe de arce, jarabe de agave o melaza clara",
    note: "El jarabe de arce es el sustituto más versátil. El agave es más líquido y neutro en sabor.",
  },
  yogur: {
    substitute: "Yogur de coco, yogur de soja o crema agria",
    note: "El yogur de coco funciona bien en repostería. Para marinadas, la crema agria da un resultado muy similar.",
  },
  nata: {
    substitute: "Anacardos remojados y licuados, o leche de coco espesa",
    note: "Para nata montada vegana, la crema de coco refrigerada toda la noche se puede batir con azúcar glas.",
  },
  chocolate: {
    substitute: "Cacao en polvo + aceite de coco (3 cdas de cacao + 1 cda de aceite por cada 30g de chocolate)",
    note: "Ajusta el azúcar según si el chocolate original era con leche o amargo. La algarroba es otra alternativa.",
  },
  "pasta de tomate": {
    substitute: "Tomates frescos reducidos, kétchup (reduciendo azúcar de la receta) o pimiento rojo asado licuado",
    note: "Para lograr la intensidad del concentrado, reduce los tomates frescos a la mitad de su volumen.",
  },
  caldo: {
    substitute: "Agua con una cucharadita de salsa de soja y una pizca de ajo en polvo",
    note: "Para más profundidad, añade un trozo de kombu (alga) o unas gotas de vinagre.",
  },
  "caldo de pollo": {
    substitute: "Caldo de verduras, agua con miso disuelto o caldo de hongos",
    note: "El miso blanco da un sabor umami muy similar al caldo de pollo. Usa 1 cucharada por taza de agua.",
  },
  arroz: {
    substitute: "Quinoa, cuscús, bulgur o coliflor rallada (para bajo en carbohidratos)",
    note: "La quinoa aporta más proteína. La coliflor rallada es ideal para dietas keto.",
  },
  pasta: {
    substitute: "Fideos de calabacín (zoodles), fideos de arroz o pasta de legumbres",
    note: "Los zoodles no necesitan cocción larga, solo 2-3 minutos en la sartén. La pasta de lentejas aporta extra proteína.",
  },
  "pan": {
    substitute: "Tortillas de maíz, hojas de lechuga (para wraps) o pan de nube (cloud bread)",
    note: "Las hojas de lechuga iceberg son excelentes para wraps crujientes y bajos en carbohidratos.",
  },
  vinagre: {
    substitute: "Jugo de limón o lima en la misma cantidad",
    note: "El limón es más suave que el vinagre. Para vinagretas, el jugo de naranja también puede funcionar.",
  },
  jengibre: {
    substitute: "1/4 cucharadita de jengibre en polvo por cada cucharada de jengibre fresco rallado",
    note: "El jengibre en polvo es más concentrado. También puedes usar una pizca de pimienta de Jamaica.",
  },
  cilantro: {
    substitute: "Perejil fresco con un chorrito de limón, o albahaca tailandesa",
    note: "Si eres de los que perciben el cilantro como jabón (es genético), el perejil con limón es tu mejor opción.",
  },
  "salsa worcestershire": {
    substitute: "Salsa de soja + un chorrito de vinagre + una pizca de azúcar",
    note: "Para versión vegana, mezcla salsa de soja, vinagre de manzana, melaza y una pizca de ajo en polvo.",
  },
};

// ─── Términos culinarios ──────────────────────────────────────────────────────

export const CULINARY_TERMS: Record<string, string> = {
  blanquear:
    "Sumergir brevemente un alimento en agua hirviendo y luego pasarlo a agua con hielo para detener la cocción. Se usa para pelar tomates, fijar el color de vegetales verdes o precocinar antes de congelar.",
  glasear:
    "Cubrir un alimento con una capa brillante, ya sea de azúcar, chocolate, jugo reducido o una salsa. En repostería se refiere a la cobertura dulce de pasteles; en cocina salada, a bañar carnes o vegetales con su propio jugo.",
  sofreir:
    "Cocinar alimentos cortados en trozos pequeños en una sartén con poco aceite a fuego medio-alto, removiendo frecuentemente. Es la base de muchos guisos y salsas.",
  saltear:
    "Cocinar rápidamente alimentos cortados pequeños en una sartén muy caliente con poco aceite, moviéndolos constantemente. Similar a sofreír pero a mayor temperatura y por menos tiempo.",
  juliana:
    "Técnica de corte que consiste en cortar alimentos en tiras finas y alargadas de unos 5 cm de largo y 2-3 mm de grosor. Muy usada para vegetales en ensaladas y salteados.",
  brunoise:
    "Corte en cubos muy pequeños y uniformes de aproximadamente 2-3 mm por lado. Se usa frecuentemente para vegetales en salsas, guarniciones y rellenos.",
  reducir:
    "Hervir un líquido (caldo, salsa, vino) a fuego medio-alto sin tapar para que se evapore parte del agua, concentrando su sabor y espesando la consistencia.",
  marinar:
    "Sumergir un alimento (generalmente carne, pollo o pescado) en una mezcla líquida con especias, aceite y un ácido (limón, vinagre) durante un tiempo para ablandarlo y darle sabor.",
  emulsionar:
    "Mezclar dos líquidos que normalmente no se combinan (como aceite y agua/vinagre) hasta obtener una mezcla homogénea. Ejemplos: mayonesa, vinagreta. Se logra batiendo vigorosamente o con un emulsionante como la yema de huevo.",
  escalfar:
    "Cocinar un alimento sumergiéndolo en un líquido (agua, caldo, leche) a temperatura baja, justo por debajo del punto de ebullición (70-80°C). Muy usado para huevos y pescado.",
  flamear:
    "Rociar un alimento con un licor y prenderle fuego para quemar el alcohol. Aporta sabor y un toque de espectacularidad al plato. Común con crêpes, carnes y postres.",
  desglasar:
    "Añadir un líquido (vino, caldo, agua) a una sartén caliente después de cocinar carne para disolver los jugos caramelizados del fondo. Es la base de muchas salsas deliciosas.",
  confitar:
    "Cocinar un alimento lentamente sumergido en grasa (aceite de oliva o grasa de pato) a baja temperatura (60-90°C) durante un tiempo prolongado. El resultado es muy tierno y jugoso.",
  temperar:
    "Elevar o bajar gradualmente la temperatura de un ingrediente para evitar un cambio brusco. En chocolate, se refiere al proceso de fundir y enfriar controladamente para lograr un acabado brillante y crujiente.",
  mise_en_place:
    "Expresión francesa que significa 'todo en su lugar'. Se refiere a tener todos los ingredientes medidos, cortados y preparados antes de empezar a cocinar. Es una práctica fundamental en cocina profesional.",
  napar:
    "Cubrir un alimento con una salsa espesa de manera uniforme, de modo que la salsa se adhiera y lo envuelva por completo.",
  chiffonade:
    "Técnica de corte para hierbas y hojas verdes: se apilan, se enrollan firmemente y se cortan en tiras muy finas. Ideal para albahaca, espinaca y menta como decoración.",
  bano_maria:
    "Método de cocción indirecta donde un recipiente con el alimento se coloca dentro de otro más grande con agua caliente. Se usa para fundir chocolate, hacer flanes o calentar salsas delicadas sin quemarlas.",
  macerar:
    "Sumergir frutas, verduras u otros alimentos en un líquido (jugo, licor, almíbar) durante horas para que absorban sabor y se ablanden. Muy común en postres con frutas.",
  bridar:
    "Atar un alimento (generalmente aves enteras) con hilo de cocina para que mantenga su forma durante la cocción y se cocine de manera uniforme.",
  tornear:
    "Dar forma ovalada y uniforme a vegetales (papas, zanahorias, calabacines) usando un cuchillo puntilla. Es una técnica clásica de la cocina francesa para guarniciones elegantes.",
  concasse:
    "Preparación de tomates: se pelan (blanqueándolos), se retiran las semillas y se cortan en cubos pequeños. Es la base de muchas salsas y guarniciones mediterráneas.",
  papillote:
    "Técnica de cocción donde el alimento se envuelve en papel aluminio o papel de horno creando un paquete cerrado. Al hornear, el vapor interno cocina el alimento manteniéndolo muy jugoso.",
  caramelizar:
    "Cocinar azúcar o alimentos con azúcares naturales (cebollas, zanahorias) a fuego medio hasta que se doren y desarrollen un sabor dulce y profundo. Las cebollas caramelizadas tardan unos 30-45 minutos.",
  gratinar:
    "Dorar la superficie de un plato bajo el grill del horno (o con soplete) para crear una costra crujiente y dorada. Se suele usar queso, pan rallado o bechamel encima.",
  estofar:
    "Cocinar lentamente alimentos (generalmente carnes duras) en un recipiente cerrado con poco líquido a fuego bajo. El vapor atrapado hace la cocción. Ideal para cortes duros que se vuelven tiernos.",
  escaldar:
    "Verter agua hirviendo sobre un alimento o sumergirlo muy brevemente. Se usa para pelar tomates, almendras o para higienizar vegetales. Similar a blanquear pero sin paso por agua fría.",
  adobar:
    "Sumergir carne o pescado en una mezcla de vinagre, aceite, especias (pimentón, orégano, ajo) y sal. Además de dar sabor, el adobo actuaba tradicionalmente como conservante.",
  brasear:
    "Cocinar a fuego lento en un recipiente tapado con una pequeña cantidad de líquido, después de sellar el alimento. Combina calor seco (sellar) y húmedo (guisar). Perfecto para cortes de carne grandes.",
  sellar:
    "Dorar rápidamente la superficie de una carne a temperatura muy alta para crear una costra que atrape los jugos internos. Se hace en sartén muy caliente con poco aceite por 1-2 minutos por lado.",
  mechar:
    "Introducir tiras de tocino, jamón o vegetales en el interior de una pieza de carne usando una aguja mechadora. Aporta jugosidad y sabor a cortes que tienden a secarse.",
  ligar:
    "Espesar o dar consistencia a una salsa o crema añadiendo un elemento ligante como harina, maicena disuelta, yema de huevo o mantequilla. La salsa debe quedar suave y homogénea.",
  rectificar:
    "Probar y ajustar el punto de sal, pimienta, acidez o dulzor de un plato justo antes de servir. Es uno de los pasos más importantes de la cocina profesional.",
  cernir:
    "Pasar harina, azúcar glas u otros ingredientes secos por un colador o tamiz para eliminar grumos y airear. Es fundamental en repostería para lograr masas suaves y uniformes.",
  montar:
    "Batir enérgicamente claras de huevo o crema para incorporar aire y aumentar su volumen. Las claras a punto de nieve deben estar firmes; la crema montada debe formar picos suaves.",
  pochar:
    "Cocinar lentamente en un líquido que apenas burbujea (80-90°C). Se diferencia de hervir porque el líquido no llega a ebullición fuerte. Ideal para huevos, pescados y frutas delicadas.",
  roux:
    "Base para salsas hecha con cantidades iguales de mantequilla y harina cocinadas juntas. Hay tres tipos según el color: blanco (1-2 min), rubio (3-5 min) y oscuro (8-10 min). Es la base de la bechamel.",
  bechamel:
    "Salsa madre de la cocina francesa hecha con un roux (mantequilla + harina) al que se añade leche caliente poco a poco. Se sazona con sal, pimienta y nuez moscada. Base de gratinados, croquetas y lasañas.",
  fumet:
    "Caldo concentrado de pescado hecho con espinas, cabezas y recortes de pescado hervidos con verduras, vino blanco y hierbas. Se cocina máximo 20-30 minutos para evitar amargor.",
  mirepoix:
    "Mezcla aromática base de la cocina francesa: 50% cebolla, 25% zanahoria y 25% apio, cortados en trozos medianos. Se usa como base de caldos, salsas, guisos y sopas.",
  bouquet_garni:
    "Ramillete de hierbas aromáticas atadas con hilo de cocina (típicamente tomillo, laurel y perejil). Se añade a caldos y guisos durante la cocción y se retira antes de servir.",
  sofrito:
    "Base aromática de la cocina mediterránea y latinoamericana: cebolla, ajo, tomate y pimiento cocinados lentamente en aceite de oliva. Varía según la región.",
  majado:
    "Mezcla de ingredientes machacados en un mortero. En la cocina española, suele incluir ajo, perejil, pan frito y especias. Se añade a guisos y sopas para dar sabor y espesar.",
  duxelles:
    "Preparación francesa de champiñones finamente picados, salteados con chalota y mantequilla hasta que se evapore toda la humedad. Se usa como relleno (ej. Beef Wellington) o base de salsas.",
  coulis:
    "Salsa fina y suave hecha de frutas o verduras trituradas y coladas. El coulis de frambuesa o de tomate son los más comunes. Se usa para decorar y dar sabor a platos y postres.",
  chutney:
    "Condimento agridulce originario de la India hecho con frutas o verduras cocidas con vinagre, azúcar y especias. El chutney de mango es el más conocido. Acompaña carnes, quesos y curries.",
  carpaccio:
    "Plato de carne cruda (originalmente res) o pescado cortado en láminas extremadamente finas, aliñado con aceite de oliva, limón y, a veces, parmesano o rúcula.",
  ceviche:
    "Plato latinoamericano de pescado o mariscos crudos marinados ('cocidos') en jugo de limón o lima con cebolla, cilantro y ají. El ácido cítrico desnaturaliza las proteínas del pescado.",
  tartare:
    "Preparación de carne cruda (res) o pescado (atún, salmón) cortada en cubos pequeños y sazonada con mostaza, alcaparras, cebolla y yema de huevo. Se sirve frío.",
  tempura:
    "Técnica japonesa de fritura ligera: los alimentos se sumergen en una masa fría y aireada (harina, agua helada, huevo) y se fríen en aceite muy caliente. El resultado es un rebozado crujiente y delicado.",
  wok:
    "Sartén cóncava de origen asiático. La técnica de cocción en wok implica fuego muy alto y movimiento constante. Los alimentos se cortan pequeños y se cocinan en 2-5 minutos conservando su textura.",
  sous_vide:
    "Técnica de cocción al vacío: el alimento se sella en una bolsa de plástico sin aire y se cocina en agua a temperatura controlada y constante durante largo tiempo. Logra texturas perfectas y uniformes.",
  fermentar:
    "Proceso donde microorganismos (bacterias, levaduras) transforman los alimentos. Ejemplos: pan (levadura), yogur (bacterias), kimchi (lactobacilos). Aporta sabor, conservación y beneficios para la salud.",
  curar:
    "Preservar alimentos (carnes, pescados) con sal, azúcar, nitratos o humo. Ejemplos: jamón serrano, salmón ahumado, bacalao en salazón. Además de conservar, transforma textura y sabor.",
  ahumar:
    "Exponer alimentos al humo de maderas aromáticas para dar sabor, color y conservarlos. El ahumado en frío (< 30°C) no cocina; el ahumado en caliente (> 70°C) cocina y ahúma a la vez.",
  infusionar:
    "Sumergir un ingrediente aromático (hierbas, especias, cáscara de cítrico) en un líquido caliente (aceite, leche, crema) para transferir su sabor. Se deja reposar y luego se cuela.",
  rebozar:
    "Cubrir un alimento con harina, huevo batido y pan rallado (en ese orden) antes de freír. La triple capa crea una costra crujiente que protege el interior y mantiene la jugosidad.",
  emplatar:
    "Disponer y presentar los alimentos en el plato de forma estética antes de servir. En cocina profesional se cuida el equilibrio de colores, texturas, alturas y el espacio negativo del plato.",
  filetear:
    "Separar la carne de un pescado de su espina central y piel, obteniendo porciones limpias sin huesos. También se usa para cortar frutas como mangos o naranjas separando la pulpa.",
};

// ─── Tips y técnicas de cocción ───────────────────────────────────────────────

export const COOKING_TIPS: Record<string, string> = {
  arroz: "Para un arroz suelto: lava el arroz hasta que el agua salga clara, usa proporción 1:1.5 (arroz:agua), hierve, baja a mínimo, tapa y cocina 15-18 min sin destapar. Deja reposar 5 min tapado.",
  pasta: "Usa abundante agua (1L por cada 100g), salada como el mar. Nunca añadas aceite al agua. Cocina 1 minuto menos de lo indicado (al dente). Reserva un vaso del agua de cocción para ligar la salsa.",
  carne: "Saca la carne del refrigerador 30 min antes de cocinar para que alcance temperatura ambiente. Seca bien la superficie con papel para un mejor sellado. No la muevas constantemente en la sartén.",
  pollo: "El pollo está listo cuando al pincharlo con un cuchillo el jugo sale transparente (sin rastro de rosa). La temperatura interna segura es de 74°C. Déjalo reposar 5 min antes de cortar.",
  pescado: "El pescado está cocido cuando la carne se separa fácilmente con un tenedor y se vuelve opaca. Cocínalo a fuego medio; el fuego alto lo seca. Regla general: 10 min de cocción por cada 2.5 cm de grosor.",
  verduras: "No cocines las verduras en exceso: deben quedar al dente y con color vivo. Saltearlas a fuego alto es la forma más rápida. Al vapor conservan más nutrientes que hervidas.",
  huevos: "Huevo pasado por agua: 6-7 min. Huevo duro: 10-12 min (partiendo de agua fría). Para pelar fácil, sumérgelos en agua helada inmediatamente. Huevos revueltos: fuego bajo y paciencia, retira antes de que se vean 'listos'.",
  salsas: "Las 5 salsas madre de la cocina son: bechamel, velouté, española (demi-glace), holandesa y de tomate. Todas las demás salsas derivan de estas. Para espesar: usa roux, maicena disuelta o reducción.",
  fritura: "El aceite debe estar entre 170-180°C. Si no tienes termómetro, echa un trozo de pan: debe burbujear inmediatamente. No llenes la sartén en exceso o bajarás la temperatura. Escurre sobre rejilla, no papel.",
  horno: "Precalienta siempre el horno al menos 10-15 min antes. La posición central es la más uniforme. Para repostería, no abras la puerta los primeros 15-20 min o el bizcocho podría hundirse.",
  sal: "Sal al inicio para que los sabores penetren; rectifica al final. La pasta y el agua de vegetales deben salarse generosamente. En repostería, una pizca de sal realza los sabores dulces.",
  especias: "Tuesta las especias enteras en sartén seca a fuego medio 1-2 min antes de moler para intensificar su aroma. Las especias molidas pierden potencia tras 6 meses. Guárdalas lejos de la luz y el calor.",
  cuchillos: "Un cuchillo afilado es más seguro que uno sin filo (requiere menos fuerza y resbala menos). Afila regularmente con chaira. Los tres esenciales: cuchillo de chef (20cm), puntilla y de sierra.",
  cebolla: "Para llorar menos al cortar cebolla: enfríala 15 min en el congelador antes, usa un cuchillo bien afilado, y corta cerca de una llama o vela encendida. Corta con la raíz intacta para que se desarme menos.",
  ajo: "Para pelar ajo fácilmente, aplasta el diente con el lateral del cuchillo. Nunca dores el ajo a fuego alto (se vuelve amargo en segundos). Añádelo al final del sofrito. Un diente = ~1/2 cucharadita de ajo picado.",
  legumbres: "Remoja las legumbres (lentejas no lo necesitan) al menos 8 horas. Cambia el agua antes de cocinar. Cocina a fuego bajo sin sal (la sal endurece la piel). Añade sal al final. Un trozo de kombu ayuda a la digestión.",
  masa: "Para masas con levadura: la temperatura del líquido debe ser tibia (35-40°C). Amasa hasta que sea elástica y no se pegue. Deja crecer en un lugar tibio cubierto con un paño húmedo hasta que duplique su volumen.",
  reposteria: "En repostería, la precisión importa: pesa los ingredientes, no los midas por volumen. Ingredientes a temperatura ambiente se integran mejor. No sobrebatas las masas con harina o quedarán duras (exceso de gluten).",
  parrilla: "Precalienta la parrilla 15-20 min. Limpia la rejilla con un cepillo cuando está caliente. Engrasa la comida, no la rejilla. Para marcas bonitas, no muevas la carne los primeros 2-3 min.",
  plancha: "La plancha debe estar muy caliente antes de poner los alimentos. Seca bien los ingredientes. No presiones las hamburguesas con la espátula (pierden jugo). Da vuelta solo una vez.",
  vapor: "La cocción al vapor es la más saludable: conserva vitaminas, minerales y color. El agua no debe tocar los alimentos. Corta todo en tamaños similares para cocción uniforme. Verduras: 5-8 min. Pescado: 8-12 min.",
};

// ─── Conversiones de medidas ──────────────────────────────────────────────────

export const MEASUREMENT_CONVERSIONS: Record<string, string> = {
  taza: "1 taza = 240 ml = 16 cucharadas. En harina: ~120g. En azúcar: ~200g. En arroz: ~185g. En líquidos: ~240g.",
  cucharada: "1 cucharada (cda/tbsp) = 15 ml = 3 cucharaditas. En sal: ~18g. En azúcar: ~12g. En aceite: ~14g. En mantequilla: ~14g.",
  cucharadita: "1 cucharadita (cdta/tsp) = 5 ml. En sal: ~6g. En levadura en polvo: ~4g. En especias molidas: ~2-3g.",
  onza: "1 onza (oz) = 28.35 gramos. En líquidos: 1 fl oz = 30 ml. Así, 8 oz líquidas = 1 taza (240 ml).",
  libra: "1 libra (lb) = 453.6 gramos = 16 onzas. Medio kilo ≈ 1.1 libras.",
  gramo: "Referencia rápida: 100g de mantequilla ≈ 7 cucharadas. 100g de harina ≈ 3/4 taza + 1 cda. 100g de azúcar ≈ 1/2 taza.",
  litro: "1 litro = 1000 ml ≈ 4.2 tazas ≈ 33.8 fl oz. 1 ml de agua = 1 gramo.",
  pizca: "Una pizca = la cantidad que puedes tomar entre el pulgar y el índice ≈ 1/16 de cucharadita. Una pizca generosa ≈ 1/8 de cucharadita.",
  temperatura: "Conversión de °F a °C: resta 32, multiplica por 5/9. Ej: 350°F = 175°C, 400°F = 200°C, 450°F = 230°C. Gas mark 4 = 180°C = 350°F.",
  manojo: "Un manojo de hierbas frescas ≈ 25-30g ≈ 1/2 taza picada. Un manojo de espinacas ≈ 250-300g.",
  diente: "Un diente de ajo ≈ 3-5g ≈ 1/2 cucharadita picado ≈ 1/8 cucharadita de ajo en polvo.",
};

// ─── Seguridad alimentaria ────────────────────────────────────────────────────

export const FOOD_SAFETY_TIPS: Record<string, string> = {
  temperaturas:
    "Zona de peligro: entre 4°C y 60°C las bacterias se multiplican rápido. No dejes alimentos cocidos fuera del refrigerador más de 2 horas. Temperatura de refrigerador: 0-4°C. Congelador: -18°C o menos.",
  carnes:
    "Temperaturas internas seguras: Pollo/pavo: 74°C. Cerdo: 63°C (+ 3 min reposo). Res/cordero: 63°C (medio), 71°C (bien cocido). Carne molida: 71°C. Usa un termómetro de cocina.",
  "contaminacion cruzada":
    "Nunca uses la misma tabla o cuchillo para carne cruda y alimentos listos para comer sin lavarlos antes. Usa tablas de colores diferentes: roja para carne, verde para verduras, azul para pescado.",
  "cadena de frio":
    "No recongeles alimentos que ya se descongelaron (pierden calidad y pueden ser peligrosos). Descongela en el refrigerador (nunca a temperatura ambiente). En urgencia, descongela bajo chorro de agua fría.",
  "lavado de manos":
    "Lávate las manos con jabón al menos 20 segundos antes y después de manipular alimentos crudos, especialmente carne, pollo, huevos y pescado.",
  sobras:
    "Las sobras deben refrigerarse dentro de las 2 horas posteriores a la cocción. Consúmelas en un máximo de 3-4 días. Recalienta a al menos 74°C. No recalientes más de una vez.",
  huevos:
    "Guarda los huevos en el refrigerador. Descarta huevos con la cáscara rajada. Para verificar frescura: sumérgelo en agua — si flota, está viejo. Nunca uses huevos crudos en preparaciones para niños, embarazadas o personas mayores.",
  conservas:
    "Nunca consumas alimentos de latas abombadas, oxidadas o que hagan un sonido de escape al abrirlas. Los alimentos caseros en conserva deben seguir estrictamente los protocolos de esterilización.",
  mariscos:
    "Los mariscos frescos deben oler a mar, no a amoníaco. Los mejillones y almejas deben estar cerrados antes de cocinar (descarta los abiertos que no cierren al golpearlos). Deben abrirse al cocinar.",
  frutas:
    "Lava siempre las frutas y verduras bajo agua corriente antes de consumirlas, incluso si vas a pelarlas. La superficie contaminada puede transferir bacterias al cortarlas.",
};

// ─── Función principal de respuesta ───────────────────────────────────────────

/**
 * Genera una respuesta del ChefBot basándose en el mensaje del usuario.
 * Usa búsqueda por palabras clave para decidir el tipo de respuesta.
 *
 * En el futuro esta función será reemplazada por una llamada a la API de IA.
 */
export function getChefBotResponse(message: string): string {
  const normalized = message
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // quitar acentos para matching
    .trim();

  // ── 1. Sustitución de ingredientes ──────────────────────────────────────
  const substitutionKeywords = [
    "sustituir",
    "reemplazar",
    "reemplazo",
    "cambiar",
    "alternativa",
    "en vez de",
    "en lugar de",
    "no tengo",
    "sin",
    "sustituto",
  ];

  const isSubstitutionQuery = substitutionKeywords.some((kw) =>
    normalized.includes(kw)
  );

  if (isSubstitutionQuery) {
    for (const [ingredient, data] of Object.entries(INGREDIENT_SUBSTITUTIONS)) {
      const ingredientNorm = ingredient
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      if (normalized.includes(ingredientNorm)) {
        return `Para sustituir **${ingredient}** puedes usar:\n\n${data.substitute}\n\n*${data.note}*`;
      }
    }
    return "Entiendo que quieres sustituir un ingrediente, pero no pude identificar cuál. Intenta preguntarme de forma más específica, por ejemplo: *\"¿Con qué puedo reemplazar el huevo?\"*";
  }

  // ── 2. Conversiones de medidas ────────────────────────────────────────
  const conversionKeywords = [
    "cuanto es",
    "cuantos",
    "cuantas",
    "convertir",
    "conversion",
    "equivale",
    "equivalencia",
    "medida",
    "medidas",
    "cuanto pesa",
    "cuanto mide",
    "gramos a",
    "tazas a",
    "onzas a",
  ];

  const isConversionQuery = conversionKeywords.some((kw) =>
    normalized.includes(kw)
  );

  if (isConversionQuery) {
    for (const [unit, info] of Object.entries(MEASUREMENT_CONVERSIONS)) {
      const unitNorm = unit
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      if (normalized.includes(unitNorm)) {
        return `**${unit.charAt(0).toUpperCase() + unit.slice(1)}**: ${info}`;
      }
    }
    return "Puedo ayudarte con conversiones. Pregunta por unidades como: *taza, cucharada, cucharadita, onza, libra, gramo, litro, pizca o temperatura*. Ejemplo: *\"¿Cuánto es una taza en gramos?\"*";
  }

  // ── 3. Seguridad alimentaria ──────────────────────────────────────────
  const safetyKeywords = [
    "seguridad",
    "seguro",
    "peligro",
    "peligroso",
    "intoxicacion",
    "bacteria",
    "contamina",
    "caduca",
    "vencido",
    "temperatura segura",
    "cuanto dura",
    "se puede comer",
    "esta malo",
    "esta bueno",
    "higiene",
    "lavar",
    "congelar",
    "descongelar",
    "recongelar",
    "sobras",
    "recalentar",
  ];

  const isSafetyQuery = safetyKeywords.some((kw) =>
    normalized.includes(kw)
  );

  if (isSafetyQuery) {
    for (const [topic, tip] of Object.entries(FOOD_SAFETY_TIPS)) {
      const topicNorm = topic
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      if (normalized.includes(topicNorm)) {
        return `**Seguridad alimentaria — ${topic}**: ${tip}`;
      }
    }
    // Try to find a relevant safety tip based on common words
    if (normalized.includes("pollo") || normalized.includes("carne") || normalized.includes("cerdo") || normalized.includes("res")) {
      return `**Seguridad alimentaria — carnes**: ${FOOD_SAFETY_TIPS.carnes}`;
    }
    if (normalized.includes("huevo")) {
      return `**Seguridad alimentaria — huevos**: ${FOOD_SAFETY_TIPS.huevos}`;
    }
    if (normalized.includes("marisco") || normalized.includes("camaron") || normalized.includes("mejillon")) {
      return `**Seguridad alimentaria — mariscos**: ${FOOD_SAFETY_TIPS.mariscos}`;
    }
    return `Aquí tienes un consejo general de seguridad alimentaria:\n\n${FOOD_SAFETY_TIPS.temperaturas}\n\nPuede preguntarme sobre: *temperaturas seguras, contaminación cruzada, cadena de frío, sobras, huevos, carnes, mariscos, frutas o conservas*.`;
  }

  // ── 4. Tips y técnicas de cocción ─────────────────────────────────────
  const tipKeywords = [
    "tip",
    "tips",
    "consejo",
    "consejos",
    "truco",
    "trucos",
    "como cocino",
    "como cocinar",
    "como hago",
    "como preparo",
    "como preparar",
    "como se cocina",
    "como se hace",
    "como se prepara",
    "secreto",
    "secretos",
    "punto exacto",
    "punto justo",
    "queda mejor",
  ];

  const isTipQuery = tipKeywords.some((kw) => normalized.includes(kw));

  if (isTipQuery) {
    for (const [topic, tip] of Object.entries(COOKING_TIPS)) {
      const topicNorm = topic
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      if (normalized.includes(topicNorm)) {
        return `**Tip de cocina — ${topic}**: ${tip}`;
      }
    }
    return "Tengo tips sobre: *arroz, pasta, carne, pollo, pescado, verduras, huevos, salsas, fritura, horno, sal, especias, cuchillos, cebolla, ajo, legumbres, masa, repostería, parrilla, plancha y vapor*. ¿Sobre qué tema quieres un consejo?";
  }

  // ── 5. Términos culinarios (con keywords explícitos) ──────────────────
  const termKeywords = [
    "que es",
    "que significa",
    "que quiere decir",
    "a que se refiere",
    "definicion de",
    "significa",
    "explicame",
    "explicar",
    "termino",
  ];

  const isTermQuery = termKeywords.some((kw) => normalized.includes(kw));

  if (isTermQuery) {
    for (const [term, definition] of Object.entries(CULINARY_TERMS)) {
      const termNorm = term
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/_/g, " ");
      if (normalized.includes(termNorm)) {
        const displayTerm = term.replace(/_/g, " ");
        return `**${displayTerm.charAt(0).toUpperCase() + displayTerm.slice(1)}**: ${definition}`;
      }
    }
    return "No encontré ese término culinario en mi base de datos. Conozco más de 50 términos como: *blanquear, juliana, brunoise, reducir, marinar, desglasar, confitar, roux, bechamel, mirepoix, papillote, sous vide, tempura, ceviche* y muchos más. ¿Cuál te interesa?";
  }

  // ── 6. Coincidencia directa con un término (sin keyword de pregunta) ──
  for (const [term, definition] of Object.entries(CULINARY_TERMS)) {
    const termNorm = term
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/_/g, " ");
    if (normalized === termNorm) {
      const displayTerm = term.replace(/_/g, " ");
      return `**${displayTerm.charAt(0).toUpperCase() + displayTerm.slice(1)}**: ${definition}`;
    }
  }

  // ── 7. Coincidencia directa con un tip de cocción ────────────────────
  for (const [topic, tip] of Object.entries(COOKING_TIPS)) {
    const topicNorm = topic
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    if (normalized === topicNorm) {
      return `**Tip de cocina — ${topic}**: ${tip}`;
    }
  }

  // ── 8. Saludo ─────────────────────────────────────────────────────────
  const greetings = ["hola", "buenas", "hey", "buenos dias", "buenas tardes", "buenas noches", "saludos"];
  if (greetings.some((g) => normalized.includes(g))) {
    return "Hola, soy **ChefBot**, tu asistente de cocina. Puedo ayudarte con:\n\n• **Sustituir ingredientes** — *\"¿Con qué reemplazo la mantequilla?\"*\n• **Explicar términos culinarios** — *\"¿Qué significa desglasar?\"*\n• **Tips de cocción** — *\"Dame un consejo para cocinar arroz\"*\n• **Convertir medidas** — *\"¿Cuánto es una taza en gramos?\"*\n• **Seguridad alimentaria** — *\"¿A qué temperatura se cocina el pollo?\"*\n\n¿En qué puedo ayudarte?";
  }

  // ── 9. Detección de temas no relacionados con cocina ──────────────────
  const nonCookingKeywords = [
    "politica", "futbol", "deporte", "musica", "pelicula",
    "clima", "tiempo", "noticias", "dinero", "banco",
    "programacion", "codigo", "software", "computadora",
    "matematica", "fisica", "quimica",
  ];

  const isOffTopic = nonCookingKeywords.some((kw) => normalized.includes(kw));

  if (isOffTopic) {
    return "Soy **ChefBot** y solo puedo ayudarte con temas de cocina. Mi especialidad es:\n\n• Sustituir ingredientes\n• Explicar términos culinarios\n• Tips y técnicas de cocción\n• Conversiones de medidas\n• Seguridad alimentaria\n\n¡Pregúntame algo relacionado con cocina!";
  }

  // ── 10. Respuesta genérica ────────────────────────────────────────────
  return "No estoy seguro de cómo ayudarte con eso. Puedo asistirte con:\n\n• **Sustituir ingredientes** — *\"¿Con qué puedo reemplazar el huevo?\"*\n• **Explicar términos culinarios** — *\"¿Qué significa juliana?\"*\n• **Tips de cocción** — *\"¿Cómo cocino el arroz perfecto?\"*\n• **Conversiones de medidas** — *\"¿Cuánto es una onza en gramos?\"*\n• **Seguridad alimentaria** — *\"¿Cuánto duran las sobras en el refrigerador?\"*\n\nPrueba a preguntarme algo de ese estilo.";
}
