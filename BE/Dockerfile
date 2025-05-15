# Menggunakan image Node.js dari Docker Hub
FROM node:16

# Install build tools (jika perlu)
RUN apt-get update && apt-get install -y build-essential

# Menentukan direktori kerja
WORKDIR /app

# Menyalin package.json dan package-lock.json untuk instalasi dependensi
COPY package*.json ./

# Instal dependensi
RUN npm install

# Menyalin semua file sumber ke dalam container
COPY . .

# Menentukan port yang akan digunakan
EXPOSE 3000

CMD ["npx", "nodemon", "server.js"]

