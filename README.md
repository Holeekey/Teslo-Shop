<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# Teslo API

1. Clonar proyecto
2. ```yarn install```
3. Clonar el archvio __.env.template__ y renombrar a __.env__
4. Establecer variables de entorno
5. Levantar base de datos

```
docker-compose up -d
```
6. Activar modo desarrollo
```
yarn start:dev
```
7. Ejecutar Seed 
```
http://localhost:3000/api/seed
```

# Production notes

__Railway__
1. Crear proyecto en Railway
2. Crear repositorio en GitHub con la aplicación
3. Crear base de datos PostgresSQL en proyecto de Railway
4. Conectar repositorio con proyecto de Railway
5. Configurar variables de entorno
6. Desplegar

__Netlify__
1. Desplegar app de frontend de ws con Vite en Netlify