# BTG Front

Este es el proyecto frontend para BTG, construido con React y TypeScript.

## Requisitos previos

- Node.js (versión recomendada: 14.x o superior)
- npm (normalmente viene con Node.js) o yarn

## Instalación

1. Clone el repositorio:

   ```bash
   git clone https://github.com/armitageCash/btg-frontend.git
   cd btg-frontend
   ```

2. Instale las dependencias:
   ```bash
   npm install
   ```
   o si usa yarn:
   ```bash
   yarn install
   ```

## Desarrollo

Para iniciar el servidor de desarrollo:

```bash
npm start
```

o

```bash
yarn start
```

Esto iniciará la aplicación en modo de desarrollo. Abra [http://localhost:3000](http://localhost:3000) para verla en el navegador.

## Construcción del proyecto

Para crear una versión de producción optimizada:

```bash
npm run build
```

o

```bash
yarn build
```

Esto generará una carpeta `build` con los archivos estáticos listos para ser desplegados.

## Pruebas

Para ejecutar las pruebas:

```bash
npm test
```

o

```bash
yarn test
```

## Pipeline de Despliegue

Cuando se realiza un pull request a la rama `main`, se activa automáticamente el pipeline de despliegue. Este proceso incluye los siguientes pasos:

1. Ejecución de pruebas
2. Construcción del proyecto
3. Despliegue de los archivos estáticos a un bucket S3 de AWS

Nota: Asegúrese de que las credenciales de AWS estén correctamente configuradas en el entorno de CI/CD para permitir el despliegue al bucket S3.

## Tecnologías principales

- React
- TypeScript
- Ant Design
- Axios
- Zustand (para manejo de estado)

## Scripts disponibles

- `npm start` o `yarn start`: Inicia el servidor de desarrollo
- `npm build` o `yarn build`: Crea una versión de producción
- `npm test` o `yarn test`: Ejecuta las pruebas
- `npm run eject` o `yarn eject`: Expone las configuraciones de Create React App (use con precaución)

## Configuración de ESLint

Este proyecto utiliza la configuración de ESLint extendida de Create React App.

## Compatibilidad de navegadores

La configuración de producción está orientada a navegadores con más del 0.2% de cuota de mercado global, excluyendo versiones antiguas y Opera Mini.

Para desarrollo, se apunta a las últimas versiones de Chrome, Firefox y Safari.

## Contribuciones

Las contribuciones son bienvenidas. Por favor, asegúrese de que las pruebas pasen antes de enviar un pull request.
