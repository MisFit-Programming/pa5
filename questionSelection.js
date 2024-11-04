let selectedQuestionCount = 'all'; // Default to selecting all questions per facet

// Display the question selection modal when the page loads
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById("question-selection").style.display = "flex";
});

// Function to start the quiz after the user selects a question count
function startQuiz() {
    // Get the selected question count from the modal
    selectedQuestionCount = document.querySelector('input[name="question-count"]:checked').value;

    // Filter and shuffle questions based on the selected count
    selectedQuestions = filterQuestions(selectedQuestionCount);

    // Hide the selection modal and show the test section
    document.getElementById("question-selection").style.display = "none";
    document.getElementById("test-section").style.display = "block";
    
    // Display the first question
    displayQuestion();
}

// Function to shuffle an array in-place
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Function to filter and shuffle questions based on the selected count per facet
function filterQuestions(countSelection) {
    const questionsByFacet = {};

    // Group questions by their facet
    questions.forEach(question => {
        const facet = question.facet.name;
        if (!questionsByFacet[facet]) {
            questionsByFacet[facet] = [];
        }
        questionsByFacet[facet].push(question);
    });

    // Select questions based on the chosen count per facet
    let filteredQuestions = [];
    Object.values(questionsByFacet).forEach(facetQuestions => {
        const count = countSelection === 'all' ? facetQuestions.length : parseInt(countSelection);
        filteredQuestions = filteredQuestions.concat(shuffleArray(facetQuestions).slice(0, count));
    });

    // Return the final shuffled set of filtered questions
    return shuffleArray(filteredQuestions);
}
