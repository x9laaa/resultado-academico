# Sistema Web de Gestión y Análisis de Resultados Académicos

Plataforma web para registrar, consultar y analizar los resultados de los desafíos
académicos de los estudiantes de 1° a 6° básico de la Escuela Subteniente Julio Montt
Salamanca.

El sistema centraliza la información de cursos, estudiantes, desafíos, evaluaciones y
resultados, calcula automáticamente los puntajes y niveles de desempeño, y presenta
indicadores mediante dashboards para apoyar el seguimiento pedagógico.

## Funcionalidades

- Autenticación con perfiles diferenciados de Administrador, Profesor y UTP.
- Gestión de usuarios, cursos, estudiantes y desafíos académicos.
- Definición de desafíos de estructura variable (Matemática, Lenguaje y Velocidad
  Lectora), con umbrales configurables para los niveles de desempeño.
- Registro de evaluaciones y de los resultados obtenidos por cada estudiante.
- Cálculo automático de puntaje y nivel de desempeño (Logrado, Adecuado, Insuficiente).
- Tablero de evaluaciones pendientes, con el avance de registro por curso.
- Reportes por curso y desafío: promedio, distribución por nivel, comparativa entre
  estudiantes y evolución en el tiempo.
- Ficha individual del estudiante con su historial completo agrupado por desafío.

## Tecnologías

- React 19 y React Router 7
- Vite como herramienta de construcción
- Firebase Authentication para el control de acceso
- Cloud Firestore como base de datos
- CSS sin librerías de estilos
- Netlify para el despliegue

## Requisitos

- Node.js 18 o superior
- npm
- Un proyecto de Firebase con Authentication y Cloud Firestore habilitados

## Despliegue

El proyecto se publica en Netlify. El archivo `netlify.toml` define el comando de
construcción, la carpeta publicada y la reescritura de rutas hacia `index.html`, necesaria
porque el enrutamiento se resuelve en el cliente.

## Estructura del proyecto

```
src/
├── components/   Componentes de interfaz, agrupados por módulo
├── context/      Contextos de sesión y de notificaciones
├── hooks/        Estado y lógica de cada módulo
├── pages/        Páginas asociadas a las rutas
├── services/     Acceso a Cloud Firestore
├── utils/        Funciones de cálculo de desempeño, desafíos y fechas
├── AppRoutes.jsx Definición de rutas y control de acceso por rol
└── config.js     Inicialización de Firebase
```

La arquitectura separa las capas de forma estricta: los componentes no acceden a
Firestore directamente, sino que consumen hooks, y estos delegan el acceso a datos en los
servicios.