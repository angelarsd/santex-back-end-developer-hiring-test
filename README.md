# Santex BackEnd Developer Hiring Challeng


## Introducción 📄

Esta es mi solución al desafío de Santex 🚀, que consiste en desarrollarun proyecto que exponga una API construida con REST API, con una mutación y algunas consultas. En caso de que no estés familiarizado con REST API, puedes realizar esta prueba con un GraphQL de tipo REST.

Vamos a utilizar la API [football-data.org](http://www.football-data.org/) (puedes consultar la documentación en el sitio, usa la API v4) para llenar localmente los datos y luego exponerlos.

## Pensamiento y Decisiones 🤔

¡Hola! 👋 Aquí te cuento un poco sobre las decisiones que tomé y cómo abordé este proyecto.

### Elección de Tecnologías

Opté por utilizar NestJS porque es un framework versátil y fácil de armar y estructurar. Me permitió desarrollar este proyecto rápidamente, teniendo en cuenta las características requeridas.

### Base de Datos con Docker Compose

Para la base de datos, elegí MongoDB y utilicé Docker Compose para su configuración. Elegí MongoDB porque tengo experiencia en bases de datos noSQL. Puedes ajustar todas las configuraciones de conexión y puertos desde el archivo [.env](https://github.com/angelarsd/santex-back-end-developer-hiring-test/blob/master/.env).

### Desafíos y Descubrimientos

Este proyecto fue un desafío divertido y exigente. Mientras trabajaba en cada punto, me di cuenta de que no todos los requerimientos estaban completamente definidos, lo cual simula un escenario muy real. Por ejemplo, en el documento de requerimientos se menciona:

>Puede suceder que al importar un determinado leagueCode, la liga tenga equipos participantes que ya han sido importados (ya que cada equipo puede pertenecer a una o más ligas). Para estos casos, se debe agregar la relación entre la liga y el/los equipo(s) (y omitir el proceso de los equipos preexistentes y sus jugadores).


También descubrí que un jugador puede pertenecer a varios equipos, como en el caso de importar la competición `WC` (FIFA World Cup) que implica seleccionados internacionales, no clubes. Aunque no incluí la lógica para relacionar un jugador con múltiples equipos debido a limitaciones de tiempo y no salirme de scope, se podría abordar de manera similar a la relación entre competiciones y equipos.

### Test Unitarios y End-to-End

Hubiera querido incluir pruebas unitarias por servicio y pruebas end-to-end para cada endpoint, pero debido a restricciones de tiempo, no pude abordarlos en esta versión que estoy entregando, pero en próximas versiones podría entregar estas pruebas en jest de ser necesario.

¡Gracias por revisar mi proyecto! 😊

## Requisitos 💻

- Node.js instalado en tu sistema. Puedes descargarlo desde [nodejs.org](https://nodejs.org/).
- Docker y Docker Compose instalados.

## Instrucciones de Ejecución 👨‍💻

Sigue estos pasos para ejecutar la solución:

1. Clona este repositorio en tu máquina local:

   ```bash
   > git clone https://github.com/angelarsd/santex-back-end-developer-hiring-test
   ```

2. Navega al directorio del proyecto

   ```bash
   > cd santex-back-end-developer-hiring-test
   ```

3. Asegúrate de tener Docker y Docker Compose instalados y correctamente configurados. Luego, ejecuta el siguiente comando:
   ```bash
   > docker-compose up
   ```

## Uso de la API 💬

La API ofrece las siguientes rutas y funcionalidades:

- `POST /importLeague`: Consulta la API [football-data.org](http://www.football-data.org/) a partir del parámetro `leagueCode` en el cuerpo de la request, importa y al macena en la base datos, la competición los equipos, jugadores y el entrenador:

  - body: { `leagueCode`:  "WC" |  "CL" | "BL1" | "DED" | "BSA" | "PD" | "FL1" | "ELC" | "PPL" | "EC" | "SA" | "PL" | "CLI" }

  ```cURL
  curl --location 'http://localhost:3000/importLeague' \
    --header 'Content-Type: application/json' \
    --data '{
      "leagueCode": "CL"
    }'
  ```
&nbsp;
- `GET /players/:leagueCode`: Obtiene todo el listado de juegadores que pertenecen a la liga especificada en el parámetro `:leagueCode`.

    - `:leagueCode`: "WC" |  "CL" | "BL1" | "DED" | "BSA" | "PD" | "FL1" | "ELC" | "PPL" | "EC" | "SA" | "PL" | "CLI"

  ```cURL
  curl --location 'http://localhost:3000/players/CL'
  ```
&nbsp;
- `GET /team/:teamName`: Obtiene el detalle de equipo especificado en el parámetro `:teamName`y tambien puede devolver el listado de de jugadores si la queryParams `?includePlayers` se le asigna el valor true.

    - `:teamName`: string
    - `?includePlayers`[optional]: true | false

  ```cURL
  curl --location 'http://localhost:3000/team/Barcelona?includePlayers=true'
  ```
&nbsp;

### Postman Colletion

También hemos incluido una colección de Postman en el repositorio que puedes utilizar para realizar pruebas. Puedes importar el archivo [santex-back-end-developer-hiring-test.json](https://github.com/angelarsd/santex-back-end-developer-hiring-test/blob/master/santex-back-end-developer-hiring-test.postman_collection.json) en Postman.

## Pruebas (Tests) 🧪

Si deseas ejecutar las pruebas, utiliza los siguientes comando:

```bash
> npm install
> npm test
```
