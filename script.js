// global constants
const clueHoldTime = 1000; //how long to hold each clue's light/sound
const cluePauseTime = 333; //how long to pause in between clues
const nextClueWaitTime = 1000; //how long to wait before starting playback of the clue sequence

// Global Variables
var pattern = [];
var progress = 0;
var gamePlaying = false;
var tonePlaying = false;
var volume = 0.5;  //must be between 0.0 and 1.0
var guessCounter = 0;
var highScore = 0;
var currentscore = 0;
var buttons = 8;
var tries = 3;
var rounds = 10;

function startGame() {
    progress = 0;
    tries = 3;
    gamePlaying = true;
  
    document.getElementById("startBtn").classList.add("hidden");
    document.getElementById("stopBtn").classList.remove("hidden"); 
    
    for(let i = 0; i < rounds; i++){
      pattern.push(Math.floor((Math.random() * 8) + 1));
    }
    
    playClueSequence();
  }

function stopGame() {
    gamePlaying = false;
    tries = 3;

    document.getElementById("startBtn").classList.remove("hidden");
    document.getElementById("stopBtn").classList.add("hidden");
}

// Sound Synthesis Functions
const freqMap = {
    1: 200,
    2: 234,
    3: 288,
    4: 330,
    5: 389,
    6: 427,
    7: 475,
    8: 507
  }
function playTone(btn,len){ 
    o.frequency.value = freqMap[btn];
    g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025);
    context.resume();
    tonePlaying = true;
    setTimeout(function(){
      stopTone();
    }, len);
}
function startTone(btn){
    if(!tonePlaying){
      context.resume();
      o.frequency.value = freqMap[btn];
      g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025);
      context.resume();
      tonePlaying = true;
    }
}
function stopTone(){
    g.gain.setTargetAtTime(0,context.currentTime + 0.05,0.025);
    tonePlaying = false;
}
  
function lightButton(btn){
    document.getElementById("button"+btn).classList.add("lit");
}
function clearButton(btn){
    document.getElementById("button"+btn).classList.remove("lit");
}

function playSingleClue(btn){
    if(gamePlaying){
      lightButton(btn);
      playTone(btn,clueHoldTime);
      setTimeout(clearButton,clueHoldTime,btn);
    }
}

function playClueSequence(){
    guessCounter = 0;
    context.resume();
    let delay = nextClueWaitTime; //set delay to initial wait time
    for(let i =  0; i <= progress; i++){ // for each clue that is revealed so far
      console.log("play single clue: " + pattern[i] + " in " + delay + "ms");
      setTimeout(playSingleClue,delay,pattern[i]); // set a timeout to play that clue
      delay += clueHoldTime;
      delay += cluePauseTime;
    }
}

function loseGame(){
    if (tries == 0){
      stopGame();
      alert("Game Over. You lost.");
    }
    else{
      if (tries != 1)
        alert("Incorrect, you have " + tries + " more attempts.")
      else
        alert("Incorrect, you have " + tries + " attempt left.")
    }
      
    progress = 0;
    updateScore();
}

function winGame(){

    highScore = pattern[buttons].length;

    stopGame();
    alert("Amazing! You won!");

    progress = 0;
    updateScore();
}

function guess(btn){
    console.log("user guessed: " + btn);
    if(!gamePlaying){
        return;
    }

    if (btn == pattern[guessCounter]){
        // Guess was correct
        if (guessCounter == progress){
            if (progress == pattern.length - 1){
                // GAME OVER: WIN!
                winGame();
            }else{
                // add next turn
                progress += 1
                currentscore = progress;
                updateScore();

                if (currentscore > highScore) {
                    highScore = currentscore;
                    updateMax();
                }

                playClueSequence();
            }
        }
        else{
            guessCounter += 1;
        }
    }
    else{
    // guess was incorrect
    // gameover: lose
    tries--;
    updateTries();
    loseGame();
    }
}
// Page Initialization
// Init Sound Synthesizer
var AudioContext = window.AudioContext || window.webkitAudioContext;
var context = new AudioContext();
var o = context.createOscillator();
var g = context.createGain();
g.connect(context.destination);
g.gain.setValueAtTime(0,context.currentTime);
o.connect(g);
o.start(0);

function updateScore(){
    document.getElementById("currentScore").innerHTML = progress;
}

function updateMax(){
    document.getElementById("highScore").innerHTML = highScore;
}

function updateTries(){
    document.getElementById("tries").innerHTML = tries;
}