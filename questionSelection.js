let selectedQuestionCount = 'all'; // Default to selecting all questions per facet
let questions = []; // Global variable to store the selected question set

// Display the question selection modal when the page loads
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById("question-selection").style.display = "flex";
});

// Function to start the quiz after the user selects a question count
// After selecting the question set, initialize the quiz correctly
function startQuiz() {
    selectedQuestionCount = document.querySelector('input[name="question-count"]:checked').value;

    // Assign the appropriate question set based on selection
    switch (selectedQuestionCount) {
        case '1':
            questions = smallQuestions; // Use from Small_Questions.js
            break;
        case '2':
            questions = mediumQuestions; // Use from Medium_Questions.js
            break;
        case 'all':
            questions = fullQuestions; // Use from Full_Questions.js
            break;
        default:
            console.error("Invalid selection");
            return;
    }

    // Call initializeQuiz to start the quiz after questions are assigned
    initializeQuiz();
}



// Function to initialize and start displaying the quiz after loading questions
function initializeQuiz() {
    selectedQuestions = questions; // Use all questions as filtered by selection in startQuiz
    document.getElementById("question-selection").style.display = "none";
    document.getElementById("test-section").style.display = "block";

    setupLikertListeners(); // Call this only once at the start

    currentQuestionIndex = 0; // Reset for a new quiz session
    displayQuestion();
}

