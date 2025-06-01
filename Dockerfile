# Usa una imagen oficial de Node.js (alpine es ligera)
FROM node:18-alpine

# Establece el directorio de trabajo en el contenedor
WORKDIR /app

# Copia package.json y package-lock.json (si existe) para instalar dependencias primero
COPY package*.json ./

# Instala dependencias (solo producción)
RUN npm install --production

# Copia el resto de los archivos de tu proyecto
COPY . .

# Expone el puerto en el que corre tu app (3000)
EXPOSE 3000

# Comando para arrancar la app
CMD ["node", "server.js"]
