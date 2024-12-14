
const images = [
    "./assets/img/bau.png",
    "./assets/img/cua.png",
    "./assets/img/tom.png",
    "./assets/img/ca.png",
    "./assets/img/huou.png",
    "./assets/img/ga.png",
];

const boxRandom = document.querySelectorAll('.random .box');
const spinButton = document.querySelector('.run button');
const betBoxes = document.querySelectorAll(".a-choice");
const btnReset = document.querySelector('.reset button');
let totalBetPoints = 0;


function getRandom() {
    const randomIndex = Math.floor(Math.random() * images.length);
    return images[randomIndex];
}

function updateBetPoints() {
    totalBetPoints = 0;  
    for (let i = 0; i < betBoxes.length; i++) {  
        const box = betBoxes[i];  
        totalBetPoints += parseInt(box.querySelector(".count").textContent); 
    }
}


function handleBetClick(event) {
    const box = event.currentTarget; 
    const countElement = box.querySelector(".count");
    let currentBet = parseInt(countElement.textContent); 

    if (totalBetPoints < 3 && currentBet < 3) {
        currentBet++;
        countElement.textContent = currentBet;
        updateBetPoints();
    }
}


let isSpinning = false;  

function spin() {
    if (totalBetPoints === 0) {
        alert("Mời bạn đặt cược!");
        return;
    }

    if (isSpinning) return; 
    isSpinning = true; 
    spinButton.disabled = true; 
    btnReset.disabled = true; 
    betBoxes.forEach(box => box.removeEventListener("click", handleBetClick)); 

    let count = 0;
    const interval = setInterval(() => {
        boxRandom.forEach((box) => {
            const image = box.querySelector('img');
            image.src = getRandom();
        });
        count += 1;
        if (count > 100) {
            clearInterval(interval);
            isSpinning = false; 
            spinButton.disabled = false; 
            btnReset.disabled = false; 
            betBoxes.forEach(box => box.addEventListener("click", handleBetClick)); 
            checkResult();  
        }
    }, 50);
}

function checkResult() {
    const results = Array.from(boxRandom).map(box => box.querySelector('img').src);
    
    let correctBets = [];  
    let incorrectBets = [];  
    let playerBets = [];

    
    betBoxes.forEach((box) => {
        const betCount = parseInt(box.querySelector('.count').textContent);
        const boxImage = box.querySelector('img').src;

        if (betCount > 0) {
            playerBets.push({ image: boxImage, count: betCount });
        }
    });


    playerBets.forEach(bet => {
        const { image, count } = bet;
        const imageName = image.split('/').pop().split('.')[0]; 
        
        const occurrences = results.filter(result => result === image).length;
    
        if (occurrences === count) {
            correctBets.push(`${imageName} ${count}`);
        } else {
            incorrectBets.push(`${imageName} ${count}`);
        }
    });

    
    if (correctBets.length === playerBets.length) {
        console.log("Bạn đã đoán đúng:", correctBets.join(", "));
    }

    else if (incorrectBets.length === playerBets.length) {
        console.log("Bạn đã đoán sai:", incorrectBets.join(", "));
    }

    else {
        let resultText = "Bạn đã đoán đúng: ";
        resultText += correctBets.length > 0 ? correctBets.join(", ") : "Không có cược đúng";

        resultText += " và bạn đã đoán sai: ";
        resultText += incorrectBets.length > 0 ? incorrectBets.join(", ") : "Không có cược sai";

        console.log(resultText);  
    }
}

function reset() {
    if (isSpinning) return; 
    betBoxes.forEach((box) => {
        box.querySelector('.count').textContent = '0';
    });
    updateBetPoints();
}

spinButton.addEventListener('click', spin);
btnReset.addEventListener('click', reset);
betBoxes.forEach((box) => {
    box.addEventListener("click", handleBetClick);
});
