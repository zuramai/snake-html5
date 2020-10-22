let canvas = document.getElementById('canvas');
let nameInput = document.getElementById('name');
let btnStart = document.getElementById('btn-start');
let instructions = document.getElementById('instructions')
let playground = document.getElementById('playground')
let btnRewind = document.getElementById('btn-rewind');
let btnCancel = document.getElementById('btn-cancel');
let rewindRange = document.getElementById('rewindRange')
let scoreEl = document.getElementById('score');
let timerEl = document.getElementById('timer');


// Create new Snake Game
let snake = new Snake({
    el: canvas,
    length: 6,
    width: 960,
    height: 600,
    snakeColor: '#ffd32a',
    snakeBorderColor: '#ffd32a',
    foodColor: "rgba(255,255,255,.7)",
    moveSpeed: 250, //milliseconds
    generateFoodEvery: 3000, //milliseconds
    timerEl,
    scoreEl,
    blockQuantity: {
        x:48,
        y:30,
    }
})

// Start Button Onclick
btnStart.addEventListener('click', function() {
    instructions.style.display='none';
    playground.style.display='flex';
    
    // Start the game
    snake.init();
    snake.start();
});

// Rewind button onclick
btnRewind.addEventListener('click', function(e) {
    if(snake.gameStatus == 'playing') {
        rewindRange.style.display = 'block'
        btnCancel.style.display = 'block'
        snake.gameStatus = 'paused'
        rewindRange.value = 5;
    }else if(snake.gameStatus == 'paused'){
        snake.gameStatus = 'playing';
        snake.snakesTemp = snake.snakes;
        rewindRange.style.display = 'none'
        btnCancel.style.display = 'none'
    }

});

// If user changed the range when the rewind is activated
rewindRange.addEventListener('input', function(e) {
    let val = e.target.value;
    snake.snakes = snake.snakePositions[val] == undefined ? snake.snakes : snake.snakePositions[val];
    console.log('move to index ',val)
})

// Cancel button click event
btnCancel.addEventListener('click', function(e) {
    snake.snakes = snake.snakesTemp;
    snake.gameStatus = 'playing'

    rewindRange.style.display = 'none'
    btnCancel.style.display = 'none'

})

// On name type
nameInput.addEventListener('input', function(e) {
    if(e.target.value == '')
        // Disable the button if user haven't type the name
        btnStart.setAttribute('disabled',true) 
    else
        // Enable the button if user have type the name
        btnStart.removeAttribute('disabled')
})