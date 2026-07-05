FROM node:22-slim
ENV NODE_ENV=production
WORKDIR /app
COPY package*.json ./
RUN npm install --no-audit --no-fund
COPY . .
RUN npm run build
EXPOSE 7860
ENV HOST=0.0.0.0
ENV PORT=7860
ENV NITRO_HOST=0.0.0.0
ENV NITRO_PORT=7860
CMD ["node", ".output/server/index.mjs"]
