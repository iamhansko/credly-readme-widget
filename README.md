# Credly ReadME Widget
![Demo](https://credly.awskorea.kr?name=seungryel-sim&size=s&col=3&line=1)

## How to Use
- API Endpoint : `https://credly.awskorea.kr`
- Query Params :
    - `name` : YOUR_CREDLY_USERNAME (`required`)
    - `line` : LINE_NUMBER_TO_DISPLAY (`required`) (if line is positive integer, only selected line displayed)
    - `col` : NUMBER_OF_BADGES_PER_COLUMNS (default : 4)
    - `size` : BADGE_SIZE ('s' or 'm' or 'l', default: 'm')

```markdown
[![img](https://credly.awskorea.kr?name=YOUR_CREDLY_USERNAME&line=NUMBER_OF_LINE&col=NUMBER_OF_BADGES_PER_COLUMNS&size=BADGE_SIZE)](https://credly.com/users/YOUR_CREDLY_USERNAME)

or

<a target="_blank" href="https://credly.com/users/YOUR_CREDLY_USERNAME"><img src="https://credly.awskorea.kr?name=YOUR_CREDLY_USERNAME&line=NUMBER_OF_LINE&col=NUMBER_OF_BADGES_PER_COLUMNS&size=BADGE_SIZE" /></a>

or

<!-- If Badges are Too Many to Display in a Single PNG -->
![line1](https://credly.awskorea.kr/?name=YOUR_CREDLY_USERNAME&col=NUMBER_OF_BADGES_PER_COLUMNS&line=1)<br/>
![line2](https://credly.awskorea.kr/?name=YOUR_CREDLY_USERNAME&col=NUMBER_OF_BADGES_PER_COLUMNS&line=2)<br/>
![line3](https://credly.awskorea.kr/?name=YOUR_CREDLY_USERNAME&col=NUMBER_OF_BADGES_PER_COLUMNS&line=3)<br/>
![line4](https://credly.awskorea.kr/?name=YOUR_CREDLY_USERNAME&col=NUMBER_OF_BADGES_PER_COLUMNS&line=4)<br/>
![line5](https://credly.awskorea.kr/?name=YOUR_CREDLY_USERNAME&col=NUMBER_OF_BADGES_PER_COLUMNS&line=5)<br/>
...
```

## Examples
- ```markdown
  # col=4(default)
  [![img](https://credly.awskorea.kr?name=hyunsu-ko&line=1)](https://credly.com/users/hyunsu-ko)
  ```
  [![img](https://credly.awskorea.kr?name=hyunsu-ko&line=1)](https://credly.com/users/hyunsu-ko)
- ```markdown
  # col=6 & size=s
  [![img](https://credly.awskorea.kr?name=hyunsu-ko&col=8&size=s&line=1)](https://credly.com/users/hyunsu-ko)
  ```
  [![img](https://credly.awskorea.kr?name=hyunsu-ko&col=8&size=s&line=1)](https://credly.com/users/hyunsu-ko)

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
docker run -dp 5000:5000 --restart always DOCKERHUB_USERNAME/credly-readme-widget
```
