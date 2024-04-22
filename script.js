//HUY XUAN PHAM / 000899551 / Assignment 4
//constants and variables
const gameContainer = document.getElementById('game-container');
const basketWidth = 100;//set width and height for the bucket
const basketHeight = 50;
const fruitRadius = 20;//set the radius of the circle (fruits)
const basketSpeed = 8;//set the moving speed of 
const gameTime = 30; //total game time in seconds (30s)
let fruitSpeed = 4; //set falling speed of fruits
let score = 0; //set default score as 0
let gameTimer;//varibale to hold the game timer
let gameStarted = false;//set boolean to false so game won't start until a certain action
let animationStarted = false;

//this function is to handle the color change event of the color picker
//color of fruits will be changed base on selected option of color
function changeColor(event) {
    const color = event.value;
    const fruits = document.getElementsByClassName('fruit');
    for (let i = 0; i < fruits.length; i++) {
        fruits[i].setAttribute('fill', color);
    }
}

//this function is to display the instruction message, asking player to press keys to start the game
function showStartMessage() {
    document.getElementById('start-message').style.display = 'block';
    document.getElementById('replay-message').style.display = 'none';
}

//this function is to hide the instruction message during the game play
function hideStartMessage() {
    document.getElementById('start-message').style.display = 'none';
}

//thi function is to handle the startgame event using keyboard
//game only starts if user press either Enter or Space key on keyboard
function startGame(event) {
    if (event.key === ' ' || event.key === 'Enter') {
        //check if the game is not already started
        if (!gameStarted) {
            startGame();//call the start game function
        } else {
            //set the gamestarted flag to true
            gameStarted = true;
            hideStartMessage();//hide the instruction message
            updateScore();//update the score displayed
            updateFruitSpeed();//update the falling speed base on current score
            startTimer();//start the timer
            gameLoop();//start the game loop to move the fruits
            spawnFruit();//spawn new fruits at random intervals
        }
    }
}


// this function is to start the game
function startGame() {
    gameStarted = true;
    hideStartMessage();
    updateScore();
    updateFruitSpeed();
    startTimer();
    gameLoop();
    spawnFruit();
}

// this function is to end the game
function endGame() {
    gameStarted = false;//set the flag to false to show that the game has ended
    showStartMessage();//the instruction message is shown again
    clearInterval(gameTimer);//clear the timer to stop the countdown
    //display the final score
    alert(`Time issss ovaaaaaaaa!\nYou've caught: ${score} fruits!!`);
    //reset score and timer display
    //after the game is done, it will be restarted and then reset the score from previous game back to 0
    score = 0;
    updateScore();
    //reset the timer display to show let user know that they have 0s left
    document.getElementById('timer').innerText = 'Time left: 0s';
    //show the replay m,essage and hide the start message after a delay
    document.getElementById('replay-message').style.display = 'block';
    setTimeout(() => {
        document.getElementById('replay-message').style.display = 'none';
        document.getElementById('start-message').style.display = 'block';
    }, 0);
}

//this function is to handle the game reset when space bar or enter key is pressed
function resetGame(event) {
    //check if the game is not started and the spacebar or enter key is pressed
    if (!gameStarted && (event.key === ' ' || event.key === 'Enter')) {
        startGame();//start the game when the conditions are met
    }
}
//add an event listener for keydown to trigger the game reset function
document.addEventListener('keydown', resetGame);

//this function is to create the basket and add it to the game container
function createBasket(x, y) {
    //create a new SVG rec element for the basket
    const basket = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    //set the class attribute of the basket element
    basket.setAttribute('class', 'basket');
    //set the initial x and y position of the basket
    basket.setAttribute('x', x);
    basket.setAttribute('y', y);
    //set the width and height of the baskett
    basket.setAttribute('width', basketWidth);
    basket.setAttribute('height', basketHeight);
    //fill the basket with color
    basket.setAttribute('fill', '#ffcc00');
    //add the basket to the game container
    const borderWidth = 3; //set the width of the border
    const borderColor = 'rgb(255, 255, 255)'; //set the color of the border
    basket.setAttribute('border', borderWidth);
    basket.setAttribute('stroke', borderColor);
    gameContainer.appendChild(basket);
    //return the basket element
    return basket;
}

//this function is to create a new fruit and addd it to the game container
function createFruit(color) {
    //generate a random x-coordinate within the game container for the fruit
    const x = Math.random() * (gameContainer.getAttribute('width') - fruitRadius * 2);
    //create a new SVG circle element for the fruits
    const fruit = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    fruit.setAttribute('class', 'fruit');//set the class attribute
    fruit.setAttribute('cx', x + fruitRadius);//set x and y cooordinates of the fruit
    fruit.setAttribute('cy', -fruitRadius);
    fruit.setAttribute('r', fruitRadius);//and the radius of the fruit
    fruit.style.fill = color; //set the fill color of the fruit using the provided color parameter
    const borderWidth = 2;
    const borderColor = 'black'; //color of the border
    fruit.setAttribute('border', borderWidth);
    fruit.setAttribute('stroke', borderColor);
    gameContainer.appendChild(fruit);//add the fruit to the game container

    //add a click event listener to the fruit
    fruit.addEventListener('click', () => {
        gameContainer.removeChild(fruit);//remove the caught fruits
        score++;//increment the score when a fruit is caught
        updateScore();//update score display
        updateFruitSpeed(); //update fruitSpeed when the score changes
    });
    return fruit;
}

//this function is to move the fruits downward and handle collisions
function moveFruits() {
    //get all the fruit element in the game container
    const fruits = document.getElementsByClassName('fruit');
    //loop through each fruit
    for (let i = 0; i < fruits.length; i++) {
        const fruit = fruits[i];//get the current fruit element
        const y = parseFloat(fruit.getAttribute('cy'));//get the current y coordinate of the fruit
        fruit.setAttribute('cy', y + fruitSpeed);//move the fruit downward by updating the 'cy' attr

        //check if the fruit is out of bounds
        if (y >= parseFloat(gameContainer.getAttribute('height'))) {
            gameContainer.removeChild(fruit);//remove that fruit if it's out of bounds

        } else if (checkCollision(document.getElementsByClassName('basket')[0], fruit)) {
            //check if there's a collision between the fruit and the basket
            //if there is, remove the fruit from the game container
            gameContainer.removeChild(fruit);
            score++;//increment the score
            updateScore();//update the score
            updateFruitSpeed(); //update fruitSpeed when the score changes
        }
    }
}

//this function is to check if there's a collision between fruit and the basket
function checkCollision(basket, fruit) {
    //get x, y coordinates of the basket and fruits
    const basketX = parseFloat(basket.getAttribute('x'));
    const basketY = parseFloat(basket.getAttribute('y'));
    const fruitX = parseFloat(fruit.getAttribute('cx'));
    const fruitY = parseFloat(fruit.getAttribute('cy'));

    //chekc if the fruit's x coordinate is within the range of the basket's x coordinate
    const collisionX = fruitX >= basketX && fruitX <= basketX + basketWidth;
    //check if the fruit's y coordinate is within the range of the basket's y coordinate
    const collisionY = fruitY + fruitRadius >= basketY && fruitY + fruitRadius <= basketY + basketHeight;
    //return true if there's a collision, otherwise return false
    return collisionX && collisionY;
}

//this function is to update the score 
function updateScore() {
    //get the element with the id 'score' and update its inner text
    document.getElementById('score').innerText = `Score: ${score}`;
}
//this function is to update the fruit's speed base on the current score
function updateFruitSpeed() {
    if (score >= 55) {
        fruitSpeed = 12; //maximum fruit speed (12) when score is 55 or more
    } else {
        //increase fruit speed based on the score in increments of 2
        fruitSpeed = 4 + Math.floor(score / 10) * 2;
    }
}


//this function is to start the game timer
function startTimer() {
    let timeRemaining = gameTime;//initialize the time remaining to the total game time
    const timerElement = document.getElementById('timer');//get the element by id


    //this function is to update the timer display with the current time remaining
    function updateTimerDisplay() {
        timerElement.innerText = `Time left: ${timeRemaining}s`;
    }

    //call the function 
    updateTimerDisplay();

    //set the gameTimer using setInterval to update the timer every sec
    gameTimer = setInterval(() => {
        timeRemaining--;//decrease the time remaining by 1 sec
        if (timeRemaining >= 0) {//check if there's still time
            updateTimerDisplay();//update the timer base on current time remaining
        } else {
            clearInterval(gameTimer);//if time's up, clear the gameTimer and trigger the endGame function
            endGame();
        }
    }, 1000); //1000ms (1 second) interval for the timer
}

//this function is to continuously drop the fruits and update the game state
function gameLoop() {
    if (gameStarted) {//the fruits keep falling as long as the game is still on
        moveFruits();
        requestAnimationFrame(gameLoop);//request the next animation frame to continue the game loop
    }
}

//this function is to spawn fruits at random intervals as long as the game is still on
function spawnFruit() {
    if (gameStarted) {
        //random number of fruits between 2 and 3
        const numberOfFruits = Math.floor(Math.random() * 2) + 2; 
        //get the selected color from the selector
        const color = document.querySelector('select[name="colors"]').value; 
        //create the specified number of fruits with the selected color
        //after selecting a different color, the current fruits stay the same color but the new one
        //will be spawned with new color
        for (let i = 0; i < numberOfFruits; i++) {
            createFruit(color); //pass the selected color to the createFruit function
        }
        //random timeout for the next spawn,between 300ms and 600ms
        setTimeout(spawnFruit, Math.random() * 300 + 300); 
    }
}

//this function is to move the basket horizontally based on mouse movement
function moveBasket(event) {
    //get the basket element using its class name
    const basket = document.getElementsByClassName('basket')[0];
    //get the left position of the game container/distance from the container to left side of screen
    const containerX = gameContainer.getBoundingClientRect().left;
    //calculate the mouse position relative to the game container
    const mouseX = event.clientX - containerX;
    //get the x coordinate of the basket
    const basketX = parseFloat(basket.getAttribute('x'));
    //get the new x coordinate for the basket based on the mouse position
    const newBasketX = mouseX - basketWidth / 2;

    //check if the new basket position is within the bounds of the game container
    if (newBasketX >= 0 && newBasketX + basketWidth <= parseFloat(gameContainer.getAttribute('width'))) {
        //if it is, update the x attribute of the basket to move it
        basket.setAttribute('x', newBasketX);
    }
}

document.addEventListener('mousemove', moveBasket); //add the event listener for basket movement

//start the game by creating the basket and displaying the start message
createBasket(gameContainer.getAttribute('width') / 2 - basketWidth / 2, gameContainer.getAttribute('height') - basketHeight);
showStartMessage(); //display the start message when the page is loaded