function newGame(){
    return new Game();
}

function generateWinningNumber(){
    let winningNum = Math.floor(Math.random()*100 + 1);
    return winningNum? winningNum : 1;
}

function shuffle(arr){
    let arrLength = arr.length;
    let temp, randomIndex;

    while(arrLength){
        //pick a random remaining element (from the front)
        randomIndex = Math.floor( Math.random() * arrLength--);

        //place in its new location (in the back).
        temp = arr[arrLength];
        arr[arrLength] = arr[randomIndex];
        arr[randomIndex] = temp;
    }
//We use the back of the array to store the shuffled elements,
// and the front of the array to store the remaining elements
    return arr;
}

function Game(){
    this.playersGuess = null;
    this.pastGuesses = [];
    this.winningNumber = generateWinningNumber();
}

Game.prototype.difference = function(){
    return Math.abs(this.playersGuess - this.winningNumber);
}

Game.prototype.isLower = function(){
    return this.playersGuess < this.winningNumber? true : false;
}

Game.prototype.provideHint = function(){
    let hintsArr = [this.winningNumber];

    for(let i = 0; i < 2; i++){
        hintsArr.push(generateWinningNumber());
    }
    shuffle(hintsArr);
    return hintsArr;
}

Game.prototype.playersGuessSubmission = function(playerInput){
    if(playerInput < 1 || playerInput > 100 || typeof playerInput !== "number"){
        throw("That is an invalid guess.");        
    }
    this.playersGuess = playerInput;
    
    return this.checkGuess();

}

Game.prototype.checkGuess = function(){
    let verdict = "";

    if(this.playersGuess === this.winningNumber){
        $('#submit , #hint, #player-input').prop("disabled", true);
        // $('#player-input').prop
        verdict = "You Win!";        
        $('#subtitle').html("Press the reset button to play again!!");
    } 
    else{
        if(this.pastGuesses.includes(this.playersGuess)){
            verdict = "You have already guessed that number."            
        }  
        else{
            this.pastGuesses.push(this.playersGuess);
            $('#guess-list li:nth-child('+ this.pastGuesses.length +')').text(this.playersGuess);
            
            if(this.pastGuesses.length === 5){
                $('#submit , #hint, #player-input').prop("disabled", true);
                verdict = "You Lose.";
                $('#subtitle').text("Number was " + this.winningNumber + " !! Press the reset button to play again!!");
            }
            else{
                if(this.isLower()){
                    $('#subtitle').html("Guess a higher Number!");
                }else{
                    $('#subtitle').html("Guess a lower Number!");
                }

                if(this.difference() < 10){
                    verdict = "You\'re burning up!";
                }
                else if(this.difference() < 25 ){
                    verdict = "You\'re lukewarm."
                }
                else if(this.difference() < 50){
                    verdict = "You\'re a bit chilly."
                }
                else{
                    verdict = "You\'re ice cold!";
                }
            }
        }
    }   
    return verdict;
}

function makingAGuess(newGame){
    let playerInp = $('#player-input').val();
    $('#player-input').val("");
    if(Number.isNaN(parseInt(playerInp,10)) || parseInt(playerInp,10) > 100){
        $('#title-tag').html("Please Enter a Valid Number!");
        $('#subtitle').text('Guess a number between 1 and 100');
    }
    else{
        let checkedGuess = newGame.playersGuessSubmission(parseInt(playerInp,10));
        return checkedGuess;
    }
    
}

function displayCurrentState(currentState){
    $('#title-tag').html(currentState);
}

// Checking if DOM is finished Laoding
$(document).ready(function(){
    let currentState;
    let hintState = false;
    //create a new Game instance
    let newGame = new Game();

    $('#submit').click(function(arg){    
        currentState = makingAGuess(newGame);
        displayCurrentState(currentState);
    });

    $('#player-input').keypress(function(event){    
        if(event.which == 13){
            currentState = makingAGuess(newGame);
            displayCurrentState(currentState);
        }
    });

    $('#reset').click(function(){
        //Start a new Game by resetting
        newGame = new Game();
        hintState = false;
        // Resetting the environment
        $('#title-tag').text('Guessing Game!');
        $('#subtitle').text('Guess a number between 1 - 100');
        $('.guess').html('-');
        $('#submit , #hint, #player-input').prop("disabled",false);
    });

    $('#hint').click(function(){
        if(!hintState){
            let hints = newGame.provideHint();
            $('#title-tag').text(`Your Winning Number is ${hints[0]}, ${hints[1]} or ${hints[2]}`);
            hintState = true;
        }
        
    })

    
})
