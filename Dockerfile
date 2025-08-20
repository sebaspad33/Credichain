# Etapa 1: Build de Angular
FROM node:20-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build -- --configuration=production

# Etapa 2: Servidor web para producción
FROM nginx:alpine

# Remueve default nginx static
RUN rm -rf /usr/share/nginx/html/*

# Copia el build de Angular
COPY --from=build /app/dist/nph-dashboard/browser /usr/share/nginx/html

#Configuración de nginx personalizada
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer el puerto 80
EXPOSE 80

# Comando por defecto para correr Nginx
CMD ["nginx", "-g", "daemon off;"]
