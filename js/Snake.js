class Snake {
    /**
     * @class Snake
     * @param {*} params{
     * el: Canvas Element
     * }
     */
    constructor(params) {
        this.canvas = params.el;
        this.canvas.width = params.width;
        this.canvas.height = params.height;
        this.scoreEl = params.scoreEl;
        this.timerEl = params.timerEl;
        this.ctx = this.canvas.getContext('2d');
        this.gameStatus = "playing"
        this.hasMoved = false;
        this.timestamp = 0;
        
        this.blockQuantity = params.blockQuantity;
        this.blocks = [];
        this.blockSize = {
            w: this.canvas.width / this.blockQuantity.x,
            h: this.canvas.height / this.blockQuantity.y
        }

        this.snakes = [];
        this.snakesTemp = [];
        this.snakeColor = params.snakeColor;
        this.snakeLength = params.length;
        this.snakeDirection = "right";
        this.snakeBorderColor = params.snakeBorderColor;
        this.snakeDx = this.blockSize.w;
        this.snakeDy = 0;
        this.snakeSpeed = 250; // milliseconds
        this.snakePositions = [];


        this.foodQuantity = 3;
        this.foods = [];
        this.foodColor = params.foodColor;
        this.generateFoodEvery = params.generateFoodEvery;

        this.secondsPassed = 0;
    }


    /**
     * Init the game
     */
    init() {
        // Create Blocks
        for(let i = 0; i < this.blockQuantity.y; i++) {
            let row =  [];
            for(let j = 0; j < this.blockQuantity.x; j++) {
                let background = (i%2 == 0  && j%2==1) || (i%2 == 1 && j%2==0)? '#1c4e6b' : '#133954'
                row.push({
                    background,
                    x: j * this.blockSize.w,
                    y: i * this.blockSize.h,
                });
            }
            this.blocks.push(row);
        }       
        
        // Init Snake 
        for(let i =0; i < this.snakeLength; i++) {
            let block = this.blocks[this.blockQuantity.y/2][this.blockQuantity.x/2-i]
            this.snakes.push({
                x: block.x,
                y: block.y,
            });
        } 

        // Draw Initial Foods
        for(let i = 1; i <= this.foodQuantity; i++) {
            this.generateFood();
        }

        // Events
        this.events();
    }

    /**
     * Draw Blocks
     */
    drawBlocks() {
        this.blocks.forEach((row, rowIndex) => {
            row.forEach((col,colIndex) => {
                this.ctx.fillStyle = col.background;
                this.ctx.fillRect(col.x,col.y,this.blockSize.w,this.blockSize.h);
            })
        })
    }

    /**
     * Draw the Snake
     */
    drawSnake() {
        this.snakes.forEach(snake => {
            this.ctx.beginPath()
            this.ctx.fillStyle = this.snakeColor;
            this.ctx.strokeStyle = "#808e9b";
            this.ctx.rect(snake.x, snake.y, this.blockSize.w, this.blockSize.h);
            this.ctx.fill();
            this.ctx.stroke();
            this.ctx.closePath()
        });
    }
    
    /**
     * Draw Foods
     */
    drawFoods() {
        this.foods.forEach(food => {
            this.ctx.fillStyle = this.foodColor;
            this.ctx.fillRect(food.x,food.y,this.blockSize.w,this.blockSize.h)
        })
    }

    /**
     * Draw all
     */
    draw() {
        this.drawBlocks();
        this.drawSnake();
        this.drawFoods();
    }

    /**
     * Game start when user click start button
     */
    start() {
        requestAnimationFrame((timestamp) => {
            this.secondsPassed = 0;
            this.render(0);
        });
    }

    /**
     * 
     * Save the snake every seconds for rewind purpose
     */
    saveSnakePosition() {
        if(this.snakePositions.length > 5) {
            // Not saving the position
            this.snakePositions.shift();
        }
        let newSnake = this.snakes.slice();
        this.snakePositions.push(newSnake);
    }
    
    /**
     * 
     * Update the snake position
     */
    updateSnake() {
        // Create new head
        let newHead = { x: this.snakes[0].x + this.snakeDx, y: this.snakes[0].y + this.snakeDy };
        this.snakes.unshift(newHead)


        // Check if snake hit walls
        if(newHead.x  < 0) this.snakes[0].x = this.canvas.width
        else if(newHead.y < 0) this.snakes[0].y = this.canvas.height;
        else if(newHead.x + this.blockSize.w > this.canvas.width) this.snakes[0].x = 0
        else if(newHead.y + this.blockSize.h > this.canvas.height) this.snakes[0].y = 0
        

        // Is the snake eat the food?
        let isEat = this.isSnakeEatFood();
        if(!isEat) 
            this.snakes.pop();


        // Check if the head touch the snake's body
        this.snakes.forEach((snake,index) => {
            if(index > 0) {
                if(newHead.x == snake.x &&
                    newHead.y == snake.y) {
                        this.gameOver();
                    }
            } 
        })
        
        
        // Update the temporary position
        this.snakesTemp = this.snakes;
    }

    /**
     * 
     * Update Score Value
     */
    updateScore() {
        this.scoreEl.innerText = this.snakes.length;
    }

    /**
     * 
     * Update the timer and display it in timer element.
     */
    updateTimer(timestamp) {
        var milliseconds = timestamp % 1000;
        var seconds = Math.floor((timestamp / 1000) % 60);
        var minutes = Math.floor((timestamp / (60 * 1000)) % 60);
        var hours = Math.floor((timestamp % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  
      
        this.timerEl.innerText = `${hours<10?0:''}${hours}:${minutes<10?0:''}${minutes}:${seconds<10?0:''}${seconds}`
    }

    /**
     * 
     * The Game is Over
     */
    gameOver() {
        let highScore = localStorage.getItem('highscore') == undefined ? 0 : localStorage.getItem('highscore');

        // Save Highscore
        if(this.snakes.length > highScore) localStorage.setItem('highscore', this.snakes.length);

        highScore = localStorage.getItem('highscore');

        alert('Game Over. Your highscore: '+highScore);
        this.gameStatus = 'over'
    }

    /**
     * 
     * Update All Element
     */
    update(timestamp) {
        this.updateSnake();
        this.updateScore();
        this.updateTimer(timestamp)
    }

    /**
     * 
     * Render and the loop goes here
     */
    render(timestamp) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.timestamp = timestamp;
        this.draw();
        if(timestamp - this.secondsPassed > this.snakeSpeed && this.gameStatus == 'playing') {
            this.secondsPassed = timestamp;
            this.update(timestamp)
        }
        requestAnimationFrame((timestampe) => {
            this.render(timestampe)
        })
    }

    /**
     * Check if any food is eaten by the snake
     * 
     * @returns boolean
     */
    isSnakeEatFood() {
        let head = this.snakes[0];
        let eaten = false;
        let foodEatenIndex = null;

        this.foods.forEach((food,index) => {
            if(head.x == food.x &&
                head.y == food.y ) {
                    eaten = true;
                    foodEatenIndex = index;
                    return true
                }
        })
        if(foodEatenIndex !== null) this.foods.splice(foodEatenIndex,1);
        return eaten;
    }

    /**
     * 
     * Generate new Food
     */
    generateFood() {
        let food = this.blocks[this.randomInt(1, this.blockQuantity.y-2)][this.randomInt(1, this.blockQuantity.x-2)]
        
        // Food cannot generated in snake location
        if(this.snakes.every(snake => snake.x == food.x && snake.y == food.y)) {
            return this.generateFood();
        }
        this.foods.push(food);
    }

    /**
     * 
     * Client-side events
     */
    events() {
        let _this = this;

        // Keyboard Click
        this.canvas.addEventListener('keyup', function(e) {
            if((e.key == 'w' || e.key == 'ArrowUp') && _this.snakeDirection !== 'down') {
                _this.snakeDy = -_this.blockSize.h;
                _this.snakeDx = 0;
                _this.snakeDirection = 'up'
                _this.update(_this.timestamp.valueOf())
            }else if((e.key == 's' || e.key == 'ArrowDown') && _this.snakeDirection !== 'up') {
                _this.snakeDy = _this.blockSize.h;
                _this.snakeDx = 0;
                _this.snakeDirection = 'down'
                _this.update(_this.timestamp.valueOf())
            }else if((e.key == 'd' || e.key == 'ArrowRight') && _this.snakeDirection !== 'left') {
                _this.snakeDy = 0;
                _this.snakeDx = _this.blockSize.w;
                _this.snakeDirection = 'right'
                _this.update(_this.timestamp.valueOf())
            }else if((e.key == 'a' || e.key == 'ArrowLeft') && _this.snakeDirection !== 'right') {
                _this.snakeDy = 0;
                _this.snakeDx = -_this.blockSize.w;
                _this.snakeDirection = 'left'
                _this.update(_this.timestamp.valueOf())
            }   
        });

        // Generate Food Every 3 Seconds
        setInterval(() => {
            if(this.foods.length >= 5) {
                return
            }
            this.generateFood();
        }, this.generateFoodEvery); 

        // Save snake position every 1 seconds
        setInterval(() => {
            if(this.gameStatus == 'playing') {
                this.saveSnakePosition();
            }
        },1000)
    }
    
    /**
     * Utilities for get random number with range
     * 
     * @param {*} min 
     * @param {*} max 
     */
    randomInt(min,max) {
        return Math.floor(Math.random() * max) + min;
    }
}