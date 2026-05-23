FROM node:22-alpine
WORKDIR /app

# Install production dependencies only
COPY package*.json ./
RUN npm install --omit=dev

# Copy all source files
COPY . .

# Expose port and configure environment
EXPOSE 4000
ENV PORT=4000
ENV NODE_ENV=production

CMD ["npm", "start"]
