// quiz.js - Handles question display and interaction

function displayQuestion() {
    if (currentQuestionIndex >= selectedQuestions.length) {
        showFinalReport();
        return;
    }

    const question = selectedQuestions[currentQuestionIndex];
    document.getElementById("current-question-header").innerText = `Question ${currentQuestionIndex + 1} of ${selectedQuestions.length}`;
    document.getElementById("question-text").innerText = question.question;

    selectedResponse = responses[currentQuestionIndex] || null;
    updateLikertSelection();
    setupLikertListeners();

    timeLeft = 10;
    updateTimerDisplay();
    startTimer();
}

function setupLikertListeners() {
    document.querySelectorAll('.bar-segment').forEach(segment => {
        segment.removeEventListener('click', handleLikertClick);
        segment.addEventListener('click', handleLikertClick);
    });
}

function handleLikertClick(event) {
    selectedResponse = parseInt(event.target.getAttribute('data-value'), 10);
    updateLikertSelection();
    saveResponse();
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
        saveResponse(); // Save the response if necessary
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
