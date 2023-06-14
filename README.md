
<a href="https://en.wikipedia.org/wiki/Argon">
    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Das_Audi_Forum_Ingolstadt.JPG/1280px-Das_Audi_Forum_Ingolstadt.JPG" alt="Audi" align="right" height="180" />
</a>

# Proveedores Audi Trend-IT!

## Requerimientos

* Node 20/18
* Git
* Docker
* Google Cloud

## Setup

Clone el repositorio e instale las dependencias.

```bash
git clone 
cd ingestador_web
npm run install:clean
```

## - DEV

- Si es la primera vez que descargas este repositorio puedes empezar por aqui, ya que esta tarea elimina la carpeta node_modules, el archivo package-lock.json, re instala las dependencias he inicia el ambiente de desarrollo. Si deseas  limpiar y re instalar tambien es util.

```bash 
npm run install:clean
```

- Instalacion de dependencias

```bash 
npm install
```

- Inicio del serviciol en el servicio 3000.

```bash 
npm run start
```

- Construccion del de los servicios y compilacion del front.

```bash 
npm run build
```

- Inicia el servicio para el ambiente de desarrollo.

```bash 
npm run dev
```

## - Produccion

- Deploya en Google Cloud Run usando la imagen definida en el el Dockerfile.

```bash 
npm run deploy-cloud-run
```

- Tarea para iniciar el servicio en dentro del contenedor.

```bash 
npm run start-cloud-run
```
