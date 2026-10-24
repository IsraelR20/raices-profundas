# Raíces profundas para días difíciles

Presentación web interactiva de seis secciones para una prédica virtual de 20 minutos, dirigida a adolescentes. Texto base: Colosenses 2:6–7.

## Abrir hoy mismo

1. Extrae el ZIP en una carpeta.
2. Abre `index.html` con Chrome, Edge o Firefox. Conserva `styles.css`, `app.js`, `tree.js` y `tree-canvas.js` junto a él.
3. Comparte la ventana del navegador en tu videollamada.

No requiere instalaciones, API, cuenta, conexión a internet ni compilación. El árbol se construye con geometría procedural: ramas tubulares suaves, corteza y miles de hojas individuales. Usa WebGL cuando está disponible y una alternativa con proyección 3D en Canvas cuando no lo está. No descarga bibliotecas ni modelos externos.

## Controles

- Flechas izquierda/derecha: cambiar de sección. También hay botones, índice y seis puntos de navegación.
- F: pantalla completa en navegadores compatibles. Escape permite salir.
- Arrastra el árbol para girarlo. Su tronco, ramas, raíces y follaje tienen volumen y sombreado tridimensional.
- «Activar viento» permite ilustrar las dificultades.
- El botón junto al viento pausa o reanuda la animación. Se respeta la preferencia de reducir movimiento.
- En la sección 3, cambia la profundidad de las raíces.
- En la sección 4, abre las tarjetas. En la 5, explora las opciones y la reflexión. En la 6, elige un paso y abre la oración.

## Diseño adaptable

En computadora se muestran contenido y árbol en dos columnas. En teléfono el árbol aparece sobre el contenido, las tarjetas y los controles se ajustan al ancho y la navegación queda accesible en la parte inferior. Puedes desplazarte verticalmente para leer cada sección. Se comprobó la ausencia de desbordamiento horizontal en vistas de teléfono de 320 y 390 píxeles.

## Guía para quien predica

Consulta `GUIA-PREDICADOR.md` por separado. La web no incluye notas privadas, temporizador, indicaciones de conducción ni atajo para mostrar ayudas del predicador.

## Participación del grupo

Las opciones son interacciones locales. No hay servidor, cuentas, formulario de datos personales ni votos sincronizados. Si todos abren el enlace, cada uno controla su propia presentación. Para conducir juntos, comparte pantalla y pide las respuestas por el chat de la videollamada.

La selección del paso personal no se almacena después de recargar ni se transmite. Evita pedir confesiones o experiencias sensibles en público.

## Distribución del tiempo

1. Lo que no se ve: 3 minutos.
2. Colosenses 2:6–7: 2 minutos.
3. Raíces en Cristo: 4 minutos.
4. Cuidado diario: 4 minutos.
5. Decisiones bajo presión: 4 minutos.
6. Aplicación y oración: 3 minutos.

La pantalla del pasaje contiene una paráfrasis identificada. Lean el texto completo en la versión bíblica utilizada por su congregación. La profundidad de las raíces es una ilustración, no una medición de la fe. Las prácticas responden a la gracia de Dios, no compran su amor.

## Publicar en GitHub Pages

1. Crea un repositorio, por ejemplo `raices-profundas`. En el plan gratuito de GitHub utiliza un repositorio público para Pages.
2. Sube los archivos extraídos a la raíz del repositorio: `index.html`, `styles.css`, `app.js`, `tree.js`, `tree-canvas.js` y, si deseas, este README. No subas solamente el ZIP. `index.html` debe estar directamente en la raíz, no dentro de otra carpeta.
3. Guarda los archivos con un commit en la rama `main`.
4. Entra a Settings → Pages.
5. En Build and deployment → Source, selecciona Deploy from a branch.
6. Selecciona la rama `main` y la carpeta `/(root)`. Pulsa Save.
7. Espera a que GitHub termine el despliegue y abre el enlace que aparece en Pages.

Los enlaces de recursos son relativos, por lo que funciona en una dirección de proyecto de GitHub Pages. Al actualizar los archivos y guardar un nuevo commit, Pages volverá a publicar desde la rama configurada.

Guía oficial consultada: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

## Editar

- `index.html`: contenido, títulos, actividades y oración.
- `styles.css`: colores, tamaños, disposición y adaptación móvil.
- `app.js`: navegación y respuestas a las actividades.
- `tree.js`: geometría 3D y renderizado WebGL con luz, textura de corteza, hojas y viento.
- `tree-canvas.js`: alternativa con proyección espacial, hojas nervuradas y ramas iluminadas para navegadores sin WebGL.

Diseñado para pantalla compartida y con adaptación a pantallas pequeñas. No es un producto oficial ni utiliza la identidad gráfica de Asambleas de Dios del Perú.

## Detalle y movimiento del árbol

Las copas ya no son bloques poligonales. Las hojas tienen forma, orientación y tonos propios. El tronco y las raíces se afinan con curvas continuas. El viento cambia de intensidad gradualmente y la rotación se suaviza al arrastrar. La animación se detiene cuando la escena está fuera de la pantalla o la pestaña no está visible.

La apariencia depende del renderizador disponible. En la revisión visual de este entorno se utilizó la alternativa Canvas porque su navegador no permite WebGL; se comprobaron el viento, las raíces y la pausa. La ruta WebGL se entrega con comprobación de sintaxis, sin validación visual en este entorno.
