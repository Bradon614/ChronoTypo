const paragraphs = {
    easy: [
        "Stand in the ashes of a trillion dead souls, and ask the ghosts if honor matters. The silence is your answer.",
        "Even in dark times, we cannot relinquish the things that make us human."
    ],
    medium: [
        "Men must be free to do what they believe. It is not our right to punish them for thinking what they do, no matter how much we disagree.",
        "Aimer, ce n’est pas regarder l’un l’autre, mais regarder ensemble dans la même direction."
    ],
    hard: [
        "Ny fahombiazana dia tsy vokatra amin’ny herim-pamoretana, fa amin’ny fahaizana miatrika sy mandresy ny sakana. Raha tonga amin’ny fotoana sarotra ianao, tsarovy fa io no fotoana hanaporofoanao ny herinao. Miezaha foana, satria ny ezaka dia mamorona ny ho avy.",
        "Where other men blindly follow the truth, remember, nothing is true. Where other men are limited by morality or law, remember, everything is permitted. We work in the dark to serve the light. We are assassins.",
    ]
};

const modeSelect = document.getElementById("select-mode");
const typingText = document.querySelector(".typing-text p");
const inpField = document.querySelector(".wrapper .input-field");
const tryAgainBtn = document.querySelector(".content button");
const timeTag = document.querySelector(".time span b");
const mistakeTag = document.querySelector(".mistake span");
const wpmTag = document.querySelector(".wpm span");
const accuracyTag = document.querySelector(".accuracy span");

let timer;
let maxTime = 60;
let timeLeft = maxTime;
let charIndex = mistakes = isTyping = 0;

const ctx = document.getElementById('statsChart').getContext('2d');
const statsChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'WPM',
            borderColor: 'rgb(75, 192, 192)',
            data: [],
            fill: false
        }]
    },
    options: {
        responsive: true,
        scales: {
            x: { title: { display: true, text: 'Time (s)' }},
            y: { title: { display: true, text: 'WPM' }, beginAtZero: true }
        }
    }
});

function loadParagraph() {
    const selectedMode = modeSelect.value || "easy"; 
    const paragraphList = paragraphs[selectedMode];
    const ranIndex = Math.floor(Math.random() * paragraphList.length);
    
    typingText.innerHTML = "";
    paragraphList[ranIndex].split("").forEach(char => {
        let span = `<span>${char}</span>`;
        typingText.innerHTML += span;
    });

    typingText.querySelectorAll("span")[0].classList.add("active");
    document.addEventListener("keydown", () => inpField.focus());
    typingText.addEventListener("click", () => inpField.focus());
}

function initTyping() {
    let characters = typingText.querySelectorAll("span");
    let typedChar = inpField.value.split("")[charIndex];

    if (charIndex < characters.length - 1 && timeLeft > 0) {
        if (!isTyping) {
            timer = setInterval(initTimer, 1000);
            isTyping = true;
        }

        if (typedChar == null) {
            if (charIndex > 0) {
                charIndex--;
                if (characters[charIndex].classList.contains("incorrect")) {
                    mistakes--;
                }
                characters[charIndex].classList.remove("correct", "incorrect");
            }
        } else {
            if (characters[charIndex].innerText == typedChar) {
                characters[charIndex].classList.add("correct");
            } else {
                mistakes++;
                characters[charIndex].classList.add("incorrect");
            }
            charIndex++;
        }

        characters.forEach(span => span.classList.remove("active"));
        characters[charIndex].classList.add("active");

        let wpm = Math.round(((charIndex - mistakes) / 5) / (maxTime - timeLeft) * 60);
        wpm = wpm < 0 || !wpm || wpm === Infinity ? 0 : wpm;

        let accuracy = ((charIndex - mistakes) / charIndex) * 100;
        accuracy = accuracy < 0 || !accuracy || accuracy === Infinity ? 0 : accuracy;

        wpmTag.innerText = wpm;
        mistakeTag.innerText = mistakes;
        accuracyTag.innerText = accuracy.toFixed(2) + "%"; 
    } else {
        clearInterval(timer);
        inpField.value = "";
    }
}

function initTimer() {
    if (timeLeft > 0) {
        timeLeft--;
        timeTag.innerText = timeLeft;
        let wpm = Math.round(((charIndex - mistakes) / 5) / (maxTime - timeLeft) * 60);

        let accuracy = ((charIndex - mistakes) / charIndex) * 100;
        accuracy = accuracy < 0 || !accuracy || accuracy === Infinity ? 0 : accuracy;

        wpmTag.innerText = wpm;
        accuracyTag.innerText = accuracy.toFixed(2) + "%";

        updateStatsGraph(wpm, maxTime - timeLeft);
    } else {
        clearInterval(timer);
    }
}

function updateStatsGraph(wpm, time) {
    if (statsChart.data.labels.length > 60) { 
        statsChart.data.labels.shift();
        statsChart.data.datasets[0].data.shift();
    }

    statsChart.data.labels.push(time);
    statsChart.data.datasets[0].data.push(wpm);
    statsChart.update();
}

function resetGame() {
    loadParagraph();
    clearInterval(timer);
    timeLeft = maxTime;
    charIndex = mistakes = isTyping = 0;
    inpField.value = "";
    timeTag.innerText = timeLeft;
    wpmTag.innerText = 0;
    mistakeTag.innerText = 0;
    accuracyTag.innerText = "0%"; 
}

modeSelect.addEventListener("change", loadParagraph);
inpField.addEventListener("input", initTyping);
tryAgainBtn.addEventListener("click", resetGame);

loadParagraph();