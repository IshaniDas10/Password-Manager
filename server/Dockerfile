FROM node:20-alpine

WORKDIR /app

# Copy the entire project first
COPY . .

# Install dependencies
RUN npm install

# Generate Prisma Client
RUN npx prisma generate

# Expose port
EXPOSE 5000

# Start the server
CMD ["npm", "start"]