===============================================================================
 BASE DE DATOS DOCUMENTAL EN LA NUBE - FIREBASE FIRESTORE
 Proyecto: resultado-academico
===============================================================================

1. DESCRIPCIÓN GENERAL
-------------------------------------------------------------------------------
Sistema para registrar los resultados académicos de estudiantes de enseñanza
básica en "desafíos" de Matemática, Lenguaje y Velocidad Lectora.

Firestore es una base de datos NoSQL documental: los datos se guardan en
DOCUMENTOS (objetos JSON con campos) agrupados en COLECCIONES. Cada documento
tiene un ID único generado por Firestore (o el UID de Firebase Authentication
en el caso de los usuarios).

  - Colecciones raíz: 6
  - Subcolecciones:   ninguna
  - Total documentos: 53

Se optó por un modelo PLANO (todas las colecciones en la raíz) y las relaciones
se representan guardando el ID del documento relacionado en un campo
(ej. estudiantes.id_curso). Esto permite consultar, por ejemplo, todos los
resultados de un curso o de un desafío con una sola consulta where(), sin tener
que recorrer subcolecciones.


2. ESTRUCTURA DE COLECCIONES
------------------------------------------------------------------------------  
usuarios/{uid}                                            
     Personal del colegio que accede al sistema. El ID del documento es el UID
     del usuario en Firebase Authentication.
       nombre          string
       apellido        string
       correo          string   correo con el que inicia sesión
       rol             string   "admin" | "utp" | "profesor"
       uid             string   copia del ID del documento (opcional)

cursos/{docId}                                           
       nombre_curso    string   ej. "1° Básico"
       profesores      array    lista de UIDs -> usuarios   (relación N:M)

estudiantes/{docId}                                      
       nombre          string
       apellido        string
       id_curso        string   -> cursos                   (relación N:1)

desafios/{docId}                                         
     Definición de una prueba y de sus puntajes de corte.
       nombre          string
       tipo            string   "Matemática" | "Lenguaje" | "Velocidad Lectora"
       puntaje_maximo  number
       adecuado_desde  number   puntaje mínimo para nivel "Adecuado"
       logrado_desde   number   puntaje mínimo para nivel "Logrado"
       cantidad_dias   number|null   (solo Matemática)
       campos          array    nombres de los campos de puntaje que tendrá
                                cada resultado (ej. ["dia1","dia2","dia3"])
       etiquetas       array    textos visibles de esos campos
       max_localizar   number|null   (solo Lenguaje)
       max_interpretar number|null   (solo Lenguaje)
       max_reflexionar number|null   (solo Lenguaje)
       fecha_creacion  timestamp

evaluaciones/{docId}                                      
     Aplicación de un desafío a un curso en una fecha.
       id_curso          string   -> cursos                 (N:1)
       id_desafio        string   -> desafios               (N:1)
       fecha_aplicacion  string   formato AAAA-MM-DD
       anio              number   (presente en 6 de 9 documentos)
       fecha_creacion    timestamp

resultados/{docId}                                      
     Puntaje de un estudiante en una evaluación.
       id_evaluacion     string   -> evaluaciones           (N:1)
       id_estudiante     string   -> estudiantes            (N:1)
       id_curso          string   -> cursos   (desnormalizado para filtrar)
       id_desafio        string   -> desafios (desnormalizado para filtrar)
       puntaje_obtenido  number
       puntaje_maximo    number   (copiado del desafío)
       nivel_desempeno   string   "Insuficiente" | "Adecuado" | "Logrado"
       + campos DINÁMICOS según desafios.campos:
           Matemática:          dia1, dia2, dia3, dia4        (number)
           Lenguaje:            localizar, interpretar, reflexionar (number)
           Velocidad Lectora:   palabras                      (number)

Relaciones (resumen):
   usuarios  <--N:M--  cursos  <--N:1--  estudiantes
   cursos    <--N:1--  evaluaciones  --N:1-->  desafios
   evaluaciones <--N:1-- resultados --N:1--> estudiantes

Decisiones de modelado:
   - id_curso, id_desafio y puntaje_maximo se repiten en "resultados"
     (desnormalización) para poder generar reportes con una sola consulta,
     ya que Firestore no tiene JOIN.
   - nivel_desempeno se calcula al guardar comparando puntaje_obtenido con
     adecuado_desde / logrado_desde del desafío.
   - Los campos de puntaje de "resultados" varían según el tipo de desafío;
     un modelo documental permite esquemas flexibles sin columnas vacías.
