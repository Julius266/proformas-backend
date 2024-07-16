<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# Comparación de Proformas API

Esta es una aplicación construida con [NestJS](https://nestjs.com/) que proporciona una API para la comparación de proformas utilizando la API de OpenAI.

## Requisitos

- Node.js (>= 12.0.0)
- npm (>= 6.0.0)
- NestJS CLI (opcional, pero recomendado para el desarrollo)

## Instalación

1. Clona el repositorio:

   ```bash
   git clone https://github.com/LuisRoft/proformas-backend.git
   ```

2. Navega al directorio del proyecto:

   ```bash
   cd proformas-backend
   ```

3. Instala las dependencias:

   ```bash
   npm install
   ```

## Configuración

1. Crea un archivo `.env` en la raíz del proyecto.
2. Añade tu clave API de OpenAI al archivo `.env` con el nombre `OPENAI_API_KEY`. El contenido del archivo `.env` debería verse como sigue:

   ```env
   OPENAI_API_KEY=tu-clave-api-de-openai
   ```

## Uso

1. Inicia la aplicación:

   ```bash
   npm run start
   ```

   La aplicación se ejecutará en `http://localhost:3000`.

2. Utiliza la API para comparar proformas enviando solicitudes HTTP a los endpoints definidos. Asegúrate de proporcionar la información necesaria en el cuerpo de la solicitud según se requiera.

## Endpoints

### POST /analyze

Este endpoint recibe archivos de imagen en el cuerpo de la solicitud y utiliza la API de OpenAI para analizar y comparar las proformas contenidas en las imágenes.

- **URL**: `/analyze`
- **Método**: `POST`
- **Cuerpo de la solicitud**:

  - Clave: `images`
  - Tipo: `file`
  - Descripción: Archivos de imagen que contienen las proformas a comparar.

- **Ejemplo de solicitud usando cURL**:

  ```bash
  curl -X POST http://localhost:3000/analyze \
  -F "images=@/ruta/a/tu/imagen1.png" \
  -F "images=@/ruta/a/tu/imagen2.png"
  ```

- **Respuesta exitosa**:
  ```json
  {
    "resultado": "Resultado de la comparación proporcionado por OpenAI"
  }
  ```

## Desarrollo

Para iniciar la aplicación en modo de desarrollo, ejecuta:

```bash
npm run start:dev

```
