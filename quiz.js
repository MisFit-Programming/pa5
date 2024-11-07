// quiz.js - Handles question display and interaction

// In quiz.js, replace selectedQuestions with questions to use directly
function displayQuestion() {
    if (currentQuestionIndex >= questions.length) {
        showFinalReport();
        return;
    }

    const question = questions[currentQuestionIndex];
    document.getElementById("current-question-header").innerText = `Question ${currentQuestionIndex + 1} of ${questions.length}`;
    document.getElementById("question-text").innerText = question.question;

    selectedResponse = responses[currentQuestionIndex] || null;
    updateLikertSelection();
    setupLikertListeners();

    timeLeft = 10;
    updateTimerDisplay();
    startTimer();
}


function setupLikertListeners() {
    //console.log("Setting up Likert listeners"); // Should log only once
    document.querySelectorAll('.bar-segment').forEach(segment => {
        segment.removeEventListener('click', handleLikertClick); // Prevent multiple bindings
        segment.addEventListener('click', handleLikertClick);    // Set up the listener once
    });
}

function handleLikertClick(event) {
    //console.log("handleLikertClick triggered"); // Should log only once per click
    selectedResponse = parseInt(event.target.getAttribute('data-value'), 10);
    updateLikertSelection();
    saveResponse(); // Only call saveResponse here
    autoAdvance();
}

// JavaScript for updating the selected segment
function updateLikertSelection() {
    document.querySelectorAll('.bar-segment').forEach(segment => {
        segment.classList.toggle('selected', segment.getAttribute('data-value') === selectedResponse?.toString());
    });
}

// Add event listeners to each segment for selection handling
document.querySelectorAll('.bar-segment').forEach(segment => {
    segment.addEventListener('click', event => {
        selectedResponse = parseInt(event.target.getAttribute('data-value'), 10);
        updateLikertSelection();
    });
});

function autoAdvance() {
    if (currentQuestionIndex < selectedQuestions.length - 1) {
        currentQuestionIndex++;
        displayQuestion();
    } else {
        clearInterval(countdown);
        showFinalReport();
    }
}
