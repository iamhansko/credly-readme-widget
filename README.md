# Credly ReadME Widget

## Development Stage
```bash
# Requirements : Node v20
npm install
npm run dev
```

## Production Stage
```bash
# Requirements : Node v20
npm install
npm run start
```

## Docker
```bash
# Requirements : Docker or Docker Desktop

docker build -t credly-readme-widget .
docker run -dp 5000:5000 credly-readme-widget

# Multi-Platform Build (x86, ARM, ...)
docker buildx create --name builder --bootstrap --use
docker buildx build --platform linux/amd64,linux/arm64 -t DOCKERHUB_USERNAME/credly-readme-widget --push .
docker run -dp 5000:5000 DOCKERHUB_USERNAME/credly-readme-widget
```