const typingText = document.getElementById("word-display");
const inpField = document.querySelector(".input-field");
const tryAgainBtn = document.getElementById("try-again");
const timeTag = document.querySelector(".result-details li:nth-child(1) span b");
const mistakeTag = document.querySelector(".mistake span");
const wpmTag = document.querySelector(".wpm span");
const modeSelect = document.getElementById("mode");
const cardContainer = document.querySelector(".card__container"); 

let timer, startTime = null;
let maxTime = 60, timeLeft = maxTime;
let charIndex = mistakes = isTyping = 0;


function loadText(level) {
    let text;
    switch (level) {
        case "easy":
            text = "Ceci est un texte facile à taper. Amusez-vous bien !";
            break;
        case "medium":
            text = "Ceci est un texte de difficulté moyenne. Bonne chance !";
            break;
        case "hard":
            text = "Ceci est un texte difficile à taper. Préparez-vous !";
            break;
        default:
            text = "Sélectionnez un niveau pour commencer.";
    }

    typingText.innerHTML = "";
    text.split("").forEach(char => {
        let span = `<span>${char}</span>`;
        typingText.innerHTML += span;
    });

    typingText.querySelectorAll("span")[0].classList.add("active");
    cardContainer.style.display = "none"; 
}


function startTimer() {
    if (!startTime) {
        startTime = Date.now();
        timer = setInterval(() => {
            if (timeLeft > 0) {
                timeLeft--;
                timeTag.innerText = timeLeft;
            } else {
                clearInterval(timer);
            }
        }, 1000);
    }
}


function initTyping() {
    let characters = typingText.querySelectorAll("span");
    let typedChar = inpField.value.split("")[charIndex];

    if (charIndex < characters.length - 1 && timeLeft > 0) {
        startTimer();

        if (typedChar == null) {
            if (charIndex > 0) {
                charIndex--;
                if (characters[charIndex].classList.contains("incorrect")) {
                    mistakes--;
                }
                characters[charIndex].classList.remove("correct", "incorrect");
            }
        } else {
            characters[charIndex].classList.add(typedChar === characters[charIndex].innerText ? "correct" : "incorrect");
            if (typedChar !== characters[charIndex].innerText) mistakes++;
            charIndex++;
        }

        characters.forEach(span => span.classList.remove("active"));
        characters[charIndex].classList.add("active");

        let wpm = Math.round(((charIndex - mistakes) / 5) / (maxTime - timeLeft) * 60) || 0;
        let accuracy = charIndex > 0 ? ((charIndex - mistakes) / charIndex) * 100 : 100;

        wpmTag.innerText = wpm;
        mistakeTag.innerText = mistakes;
    } else {
        clearInterval(timer);
        inpField.value = "";
    }
}


function resetGame() {
    cardContainer.style.display = "flex"; 
    loadText("easy"); 
    clearInterval(timer);
    timeLeft = maxTime;
    charIndex = mistakes = isTyping = 0;
    inpField.value = "";
    timeTag.innerText = timeLeft;
    wpmTag.innerText = 0;
    mistakeTag.innerText = 0;
}


inpField.addEventListener("input", initTyping);
tryAgainBtn.addEventListener("click", resetGame);


loadText("easy");
