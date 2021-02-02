let userMax;
let tooLowArray;
let tooHighArray;
let hiddenNumber;
let guessArray;
let guessObj;

const gamePrompt=document.querySelector("#game-prompt");
const maxHolder=document.querySelector("#max-holder");
const guessHolder=document.querySelector("#guess-holder");
const maxErrorDiv=document.querySelector("#max-error-holder");
const guessErrorDiv=document.querySelector("#guess-error-holder");
const resultsMessages=document.querySelector("#results-messages");
const finalGuessHolder=document.querySelector("#final-guess-holder");
const playAgain=document.querySelector("#play-again")
const guessForm=document.querySelector("#guess-form");
const maxForm=document.querySelector("#max-form");
const tooHigh=document.querySelector("#too-high");
const tooLow=document.querySelector("#too-low");
const maxInput=document.querySelector("#max");
const guessInput=document.querySelector("#guess");
const guessCount=document.querySelector("#guess-count");
const hintButton=document.querySelector("#hint-button");
const hintBox=document.querySelector("#hint-box");

function init() {
    userMax=null;
    hiddenNumber=null;
    guessArray=[];
    tooLowArray=[1];
    tooHighArray=[];
    guessObj={};
    
    maxHolder.style.display="block";
    guessHolder.style.display="none";
    playAgain.style.display="none";

    resultsMessages.innerHTML="";
    finalGuessHolder.innerHTML="";
    guessCount.innerText="";
    gamePrompt.innerText="Please choose the max by entering an integer between 1 and 1,000,000.";

    maxForm.addEventListener("submit", handleMaxSubmit);
    guessForm.addEventListener("submit", handleGuessSubmit);
    hintButton.addEventListener("click", toggleHintBox);
}

function stringFormat(num) {
    num=String(num);
    const rez=[];
    for (let i=num.length;i>0;i-=3) {
        rez.unshift(num.slice(Math.max(0,i-3),i));
    }
    return rez.join(",");
}

function setHintBoxText() {
    const lowerBound = Math.max(...tooLowArray);
    const upperBound = Math.min(...tooHighArray);
    hintBox.innerHTML = `The number midway between ${lowerBound} and ${upperBound} is: ${Math.floor((lowerBound + upperBound) / 2)}.`;

}

function toggleHintBox() {
    setHintBoxText();
    if (hintBox.style.display==="none") {
        hintBox.style.display = "block";
        hintButton.innerText = "Hide Hint";
    }
    else {
        hintBox.style.display="none";
        hintButton.innerText="Show Hint";
    }
}

function handleMaxSubmit(e) {
    e.preventDefault();
    const input=document.querySelector("#max");
    const maxEntry = parseInt(input.value);
    const maxEntryForm = stringFormat(maxEntry);
    if (!Number.isInteger(maxEntry)) {
        maxErrorDiv.innerText="That is not an integer!";
    }
    else if (maxEntry<2) {
        maxErrorDiv.innerText=`${maxEntryForm} is too low.`;
    }
    else if (maxEntry>1000000) {
        maxErrorDiv.innerText=`${maxEntryForm} is too high.`;
    }
    else {
        tooHighArray.push(maxEntry);
        maxErrorDiv.innerText="";
        userMax=maxEntry;
        gamePrompt.innerText=`Choose an integer between 1 and ${maxEntryForm}.`;
        hiddenNumber = Math.ceil(userMax * Math.random());
        maxHolder.style.display="none";
        guessHolder.style.display="block";
    }
    input.value="";
}

function handleGuessSubmit(e) {
    e.preventDefault();
    const input = document.querySelector("#guess");
    const guess = parseInt(input.value);
    const guessForm = stringFormat(guess);
    if (!Number.isInteger(guess)) {
        guessErrorDiv.innerText="That is not a number!";
    }
    else if (guess<1 || guess>userMax) {
        guessErrorDiv.innerText=`${guessForm} is not in range, try again.`;
    }
    else {
        guessErrorDiv.innerText="";
        if (guessObj[guess]) {
            guessErrorDiv.innerText=`You have already guessed ${guessForm}. Choose a new number.`;
        }
        else {
            hintBox.style.display="none";
            guessArray.push(guess);
            guessObj[guess]=(guessObj[guess] || 0) + 1
            guessCount.innerText=`Guess Count: ${guessArray.length}`;
            if (guess>hiddenNumber) {
                tooHighArray.push(guess);
                guessErrorDiv.innerText=`${guessForm} is too high - choose a lower number!`;
                tooHigh.innerHTML+=`<div class="too-high">${guessForm}</div>`;
            }
            else if (guess<hiddenNumber) {
                tooLowArray.push(guess);
                guessErrorDiv.innerText=`${guessForm} is too low - choose a higher number!`;
                tooLow.innerHTML+=`<div class="too-low">${guessForm}</div>`;
            }
            else if (guess===hiddenNumber) {
                gamePrompt.innerText=`Congrats, you guessed it! The number was ${stringFormat(hiddenNumber)}.`;
                const guessCount = guessArray.length;
                const expectedGuesses = Math.ceil(Math.log2(userMax));

                const guessArrayMap=guessArray.map(guess=>{
                    let className;
                    if (guess>hiddenNumber) className="too-high";
                    else if (guess<hiddenNumber) className="too-low"
                    else className="right-on";
                    return `<div class="${className}">${stringFormat(guess)}</div>`
                })
                finalGuessHolder.innerHTML = guessArrayMap.join("");

                let performanceEval;
                if (guessCount<expectedGuesses) {
                    performanceEval=`You did ${expectedGuesses-guessCount} better than expected!`;
                }
                else if (guessCount>expectedGuesses) {
                    performanceEval=`You did ${guessCount-expectedGuesses} worse than expected.`;
                }
                else {
                    performanceEval="You did about as expected.";
                }

                resultsMessages.innerHTML+=`<p>It took you ${guessCount} tries. ${performanceEval}</p>`;
                resultsMessages.innerHTML+=`<p>Here were your guesses.</p>`;

                playAgain.style.display="block";
                guessHolder.style.display="none";
                tooHigh.innerHTML="";
                tooLow.innerHTML="";
            }
        }
    }
    input.value="";
}