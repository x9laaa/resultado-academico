Sistema Web de Gestión y Análisis de Resultados Académicos

1. Descripción del proyecto

Sistema web desarrollado para registrar, consultar y analizar los resultados de desafíos académicos de estudiantes de 1° a 6° básico de la Escuela Subteniente Julio Montt Salamanca.

La aplicación centraliza la información de usuarios, cursos, estudiantes, desafíos, evaluaciones y resultados. Además, permite calcular automáticamente los puntajes y niveles de desempeño y visualizar información mediante reportes y dashboards.

2. Funcionalidades principales

Autenticación de usuarios mediante Firebase Authentication.

Perfiles diferenciados:

Administrador

Profesor

UTP

Gestión de usuarios.

Gestión de cursos.

Gestión de estudiantes.

Gestión de desafíos académicos.

Registro de evaluaciones.

Registro de resultados de estudiantes.

Cálculo automático del puntaje obtenido.

Cálculo del nivel de desempeño:

Insuficiente

Adecuado

Logrado

Consulta de evaluaciones pendientes.

Reportes por curso y desafío.

Visualización de distribución de niveles.

Comparación de resultados.

Evolución de resultados.

Ficha individual del estudiante con historial.

3. Tecnologías utilizadas

Frontend

React 19

React Router 7

Vite

JavaScript

CSS

Servicios y persistencia

Firebase Authentication

Cloud Firestore

Despliegue

Netlify

4. Requisitos para ejecutar el proyecto

Antes de ejecutar el proyecto se requiere:

Node.js

npm

Un proyecto de Firebase.

Firebase Authentication habilitado.

Cloud Firestore habilitado.

5. Instalación

Ingresar a la carpeta del frontend:

cd Frontend

Instalar las dependencias:

npm install

6. Ejecución en ambiente de desarrollo

Ejecutar:

npm run dev

Luego abrir en el navegador la dirección indicada por Vite, normalmente:

http://localhost:5173

7. Compilación para producción

Para generar la versión de producción:

npm run build

Para realizar una vista previa de la compilación:

npm run preview

8. Configuración de Firebase

La aplicación utiliza Firebase para autenticación y almacenamiento de información.

La configuración se encuentra en:

Frontend/src/config.js

Servicios utilizados:

Firebase Authentication
Cloud Firestore

El proyecto Firebase utilizado corresponde a:

resultado-academico

Para una instalación en otro proyecto Firebase se debe reemplazar la configuración de Firebase por la correspondiente al nuevo proyecto y verificar las reglas de seguridad de Authentication y Firestore.

9. Base de datos

La aplicación utiliza Cloud Firestore como base de datos NoSQL documental.

Colecciones principales:

usuarios
cursos
estudiantes
desafios
evaluaciones
resultados

Relaciones principales

usuarios
   │
   └── cursos

cursos
   ├── estudiantes
   └── evaluaciones

desafios
   └── evaluaciones

evaluaciones
   └── resultados

estudiantes
   └── resultados

Las relaciones se representan mediante identificadores de documentos, por ejemplo:

id_curso
id_desafio
id_evaluacion
id_estudiante

La exportación de datos utilizada para la entrega se encuentra en:

Base de datos/db.json

10. Estructura del proyecto

Proyecto/
│
├── Frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── utils/
│   │   └── config.js
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── netlify.toml
│   └── vite.config.js
│
├── Base de datos/
│   ├── db.json
│   ├── README.txt
│   └── ...
│
└── README.md

11. Arquitectura

La aplicación organiza la lógica mediante componentes, páginas, hooks, contextos, servicios y utilidades.

Flujo general:

Usuario
   ↓
Interfaz React
   ↓
Componentes / Páginas
   ↓
Hooks / Contextos
   ↓
Servicios
   ↓
Firebase
   ├── Authentication
   └── Cloud Firestore

Los componentes no acceden directamente a Firestore. El acceso a los datos se concentra en los servicios correspondientes.

12. Roles del sistema

Administrador

Permite gestionar elementos administrativos del sistema, como usuarios, cursos, estudiantes y desafíos.

Profesor

Permite trabajar con los cursos asignados, evaluaciones y registro de resultados de estudiantes.

UTP

Permite consultar información consolidada mediante dashboards, reportes y seguimiento de resultados.

13. Desafíos académicos

El sistema permite trabajar con diferentes tipos de desafíos:

Matemática

Lenguaje

Velocidad Lectora

Los desafíos pueden utilizar diferentes estructuras de puntaje. Por ejemplo, Matemática puede utilizar registros por día, mientras que Lenguaje puede considerar dimensiones como localizar, interpretar/inferir y reflexionar.

14. Cálculo del desempeño

El sistema almacena el puntaje obtenido y determina el nivel de desempeño de acuerdo con los valores de corte definidos para cada desafío.

Los niveles utilizados son:

Insuficiente
Adecuado
Logrado

15. Despliegue

El proyecto está preparado para ser desplegado en Netlify.

La configuración se encuentra en:

Frontend/netlify.toml

Comando de construcción:

npm run build

Directorio publicado:

dist

También se utiliza una regla de reescritura hacia index.html para permitir el funcionamiento del enrutamiento del lado del cliente.

16. Datos y usuarios para la demostración

Para la demostración del proyecto se deben utilizar los usuarios de prueba configurados en Firebase Authentication.

Los perfiles deben permitir demostrar las funcionalidades correspondientes a:

Administrador
Profesor
UTP

Las credenciales de acceso no se incluyen en este README. Deben entregarse por el medio indicado por la comisión evaluadora o mantenerse como información de prueba separada.

17.Autor

Nombre: Alex Carreño

Proyecto: Sistema Web de Gestión y Análisis de Resultados Académicos

Año: 2026