let selectedQuestionCount = 'all'; // Default to selecting all questions per facet
let questions = []; // Global variable to store the selected question set

// Display the question selection modal when the page loads
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById("question-selection").style.display = "flex";
});

// Function to start the quiz after the user selects a question count
function startQuiz() {
    selectedQuestionCount = document.querySelector('input[name="question-count"]:checked').value;

    switch (selectedQuestionCount) {
        case '1':
            questions = smallQuestions;
            break;
        case '2':
            questions = mediumQuestions;
            break;
        case 'all':
            questions = fullQuestions;
            break;
        default:
            console.error("Invalid selection");
            return;
    }

    initializeQuiz();
}

// Function to initialize and start displaying the quiz after loading questions
function initializeQuiz() {
    // Shuffle questions for randomized order
    selectedQuestions = shuffleArray(questions); 

    document.getElementById("question-selection").style.display = "none";
    document.getElementById("test-section").style.display = "block";

    setupLikertListeners(); // Call this only once at the start

    currentQuestionIndex = 0; // Reset for a new quiz session
    displayQuestion();
}

// Helper function to shuffle an array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
