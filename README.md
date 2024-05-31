# Credly ReadME Widget
![demo](https://credly.scg.skku.ac.kr?name=seungryel-sim&col=5)

## How to Use
- API Endpoint : `https://credly.scg.skku.ac.kr`
- Query Params :
    - `name` : YOUR_CREDLY_USERNAME
    - `col` : NUMBER_OF_BADGES_PER_COLUMNS (default : 4)
```markdown
[![img](https://credly.scg.skku.ac.kr?name=YOUR_CREDLY_USERNAME&col=NUMBER_OF_BADGES_PER_COLUMNS)](https://credly.com/users/YOUR_CREDLY_USERNAME)

or

<a target="_blank" href="https://credly.com/users/YOUR_CREDLY_USERNAME"><img src="https://credly.scg.skku.ac.kr?name=YOUR_CREDLY_USERNAME&col=NUMBER_OF_BADGES_PER_COLUMNS" /></a>
```

## Examples
- ```markdown
  # col=4(default)
  [![img](https://credly.scg.skku.ac.kr?name=hyunsu-ko)](https://credly.com/users/hyunsu-ko)
  ```
  [![img](https://credly.scg.skku.ac.kr?name=hyunsu-ko)](https://credly.com/users/hyunsu-ko)
- ```markdown
  # col=6
  [![img](https://credly.scg.skku.ac.kr?name=hyunsu-ko&col=6)](https://credly.com/users/hyunsu-ko)
  ```
  [![img](https://credly.scg.skku.ac.kr?name=hyunsu-ko&col=6)](https://credly.com/users/hyunsu-ko)

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
