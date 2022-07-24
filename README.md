# Snake HTML5
Snake HTML5 Game Made with Canvas

![screenshot](https://raw.githubusercontent.com/zuramai/snake-html5/main/design/Jakarta_GameBoard_2.png)

## Features
- Player's name
- Rewind the snake (available rewind only 5 secs before)
- Highscore system
- Snake appear on opposite wall if hit the wall

## How to download
1. Clone Repository
```bash
git clone https://github.com/zuramai/snake-html5.git
```
2. Open `snake-html5/index.html` in your browser

## Snake.js Example Usage
```javascript
let snake = new Snake({
    el: document.getElementById('canvas'),
    length: 6,
    width: 960,
    height: 600,
    snakeColor: '#ffd32a',
    snakeBorderColor: '#ffd32a',
    foodColor: "rgba(255,255,255,.7)",
    moveSpeed: 250, //milliseconds
    generateFoodEvery: 3000, //milliseconds
    timerEl: document.getElementById('timer'),
    scoreEl: document.getElementById('score'),
    blockQuantity: {
        x:48,
        y:30,
    }
})
```

## Snake.js API
| Property | Type | Description |
| -------- | ---- | ----------- |
| el       | Element | Canvas element |
| width    | Number | Set the width of canvas |
| height   | Number | Set the height of canvas|
| blockQuantity | Number | Object of block quantity (horizontal is x, vertical is y) |
| snakeColor | String | Color of the snake. Could be Hex, RGB, RGBA, or [linear-gradient](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/createLinearGradient) |
| snakeBorderColor | String | Border color of the snake. Could be Hex, RGB, RGBA, or [linear-gradient](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/createLinearGradient) |
| foodColor | String | Color of the snake's food. Could be Hex, RGB, RGBA, or [linear-gradient](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/createLinearGradient) |
| moveSpeed | Number | Snake move speed (in milliseconds) |
| generateFoodEvery | Number | The interval for generating food every time (in milliseconds) |
| timerEl | Element | Element to display the play time elapsed |
| scoreEl | Element | Element to display the player's score |
