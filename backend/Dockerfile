# ==========================================
# BACKEND DOCKERFILE (Optimizado para prod)
# ==========================================
FROM node:18-alpine

WORKDIR /app

# Copiar package.json y restaurar dependencias
COPY package*.json ./
RUN npm install --production

# Copiar el resto del código
COPY . .

# Directorio donde se guardará el JSON persistente (opcional, pero útil si se reinicia)
RUN mkdir -p /app/data

EXPOSE 3001

# Iniciar aplicación
CMD ["node", "src/index.js"]
