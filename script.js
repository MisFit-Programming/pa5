let currentQuestionIndex = 0;
const responses = {}; // Store responses by question index

// Initialize Scores
const scores = {
    // Big 5 Traits
    Openness: 0,
    Conscientiousness: 0,
    Extraversion: 0,
    Agreeableness: 0,
    Neuroticism: 0,
    // Big 10 Clusters
    Intellect: 0,
    Receptivity: 0,
    Industriousness: 0,
    Orderliness: 0,
    Enthusiasm: 0,
    Assertiveness: 0,
    Compassion: 0,
    Politeness: 0,
    Volatility: 0,
    Withdrawal: 0
};

// Variable to store selected response value
let selectedResponse = null;

// Show the main test section and load the first question
function acceptAgreement() {
    document.getElementById("usage-agreement").style.display = "none";
    document.getElementById("test-section").style.display = "block";
    document.getElementById("score-header").style.display = "block";
    displayQuestion();
}

// Display the current question and header
function displayQuestion() {
    const question = questions[currentQuestionIndex];
    document.getElementById("question-text").innerText = question.question;
    document.getElementById("current-question-header").innerText = 
        `Trait: ${question.trait} | Cluster: ${question.cluster} | Facet: ${question.facet}`;

    // Clear the previously selected response
    selectedResponse = responses[currentQuestionIndex] || null;
    updateLikertSelection();

    // Re-bind event listeners for the Likert scale segments
    document.querySelectorAll('.bar-segment').forEach(segment => {
        segment.removeEventListener('click', handleLikertClick); // Remove existing listeners to avoid duplicates
        segment.addEventListener('click', handleLikertClick);
    });
}

// Handle click events for the Likert scale segments
function handleLikertClick(event) {
    selectedResponse = parseInt(event.target.getAttribute('data-value'));
    updateLikertSelection();
}

// Highlight the selected segment on the Likert scale
function updateLikertSelection() {
    document.querySelectorAll('.bar-segment').forEach(segment => {
        segment.classList.remove('selected');
        if (selectedResponse && segment.getAttribute('data-value') === selectedResponse.toString()) {
            segment.classList.add('selected');
        }
    });
}

// Move to the next question, ensuring a response has been selected
function nextQuestion() {
    if (selectedResponse === null) {
        alert("Please select an answer before proceeding to the next question.");
        return; // Stop if no response is selected
    }

    saveResponse();
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        displayQuestion();
    } else {
        alert("Test complete! Thank you for participating.");
        showFinalReport();
    }
}

// Move to the previous question and adjust scores by removing the previous response
function prevQuestion() {
    if (currentQuestionIndex > 0) {
        removePreviousScore(); // Remove the current question's score before going back
        currentQuestionIndex--;
        displayQuestion();
    }
}

// Save the response and update scores
function saveResponse() {
    if (selectedResponse !== null) {
        const scoreValue = selectedResponse;
        const question = questions[currentQuestionIndex];
        
        // If there was a previous response, remove its points
        if (responses[currentQuestionIndex]) {
            removePreviousScore();
        }

        // Save response and update scores
        responses[currentQuestionIndex] = scoreValue;
        scores[question.trait] += scoreValue;    // Big 5 score update
        scores[question.cluster] += scoreValue;  // Big 10 score update
        
        updateScores();
    }
}

// Remove the points of the previous response for the current question
function removePreviousScore() {
    const previousScore = responses[currentQuestionIndex];
    if (previousScore) {
        const question = questions[currentQuestionIndex];
        scores[question.trait] -= previousScore;    // Big 5 score update
        scores[question.cluster] -= previousScore;  // Big 10 score update

        // Remove saved response for the current question
        delete responses[currentQuestionIndex];

        updateScores();
    }
}

// Update displayed scores in the header
function updateScores() {
    // Big 5 Trait Scores
    document.getElementById("openness-score").innerText = scores.Openness;
    document.getElementById("conscientiousness-score").innerText = scores.Conscientiousness;
    document.getElementById("extraversion-score").innerText = scores.Extraversion;
    document.getElementById("agreeableness-score").innerText = scores.Agreeableness;
    document.getElementById("neuroticism-score").innerText = scores.Neuroticism;

    // Big 10 Cluster Scores
    document.getElementById("intellect-score").innerText = scores.Intellect;
    document.getElementById("receptivity-score").innerText = scores.Receptivity;
    document.getElementById("industriousness-score").innerText = scores.Industriousness;
    document.getElementById("orderliness-score").innerText = scores.Orderliness;
    document.getElementById("enthusiasm-score").innerText = scores.Enthusiasm;
    document.getElementById("assertiveness-score").innerText = scores.Assertiveness;
    document.getElementById("compassion-score").innerText = scores.Compassion;
    document.getElementById("politeness-score").innerText = scores.Politeness;
    document.getElementById("volatility-score").innerText = scores.Volatility;
    document.getElementById("withdrawal-score").innerText = scores.Withdrawal;
}

// Show the final report with a chart and PDF export option
function showFinalReport() {
    document.getElementById("final-report").style.display = "block";
    renderChart();
}

// Render a bar chart with Chart.js for the Big 5 and Big 10 scores
function renderChart() {
    const ctx = document.getElementById("resultsChart").getContext("2d");

    // Data for Big 5 and Big 10 scores
    const labels = ["Openness", "Conscientiousness", "Extraversion", "Agreeableness", "Neuroticism",
                    "Intellect", "Receptivity", "Industriousness", "Orderliness", "Enthusiasm",
                    "Assertiveness", "Compassion", "Politeness", "Volatility", "Withdrawal"];
    const data = [
        scores.Openness, scores.Conscientiousness, scores.Extraversion, scores.Agreeableness, scores.Neuroticism,
        scores.Intellect, scores.Receptivity, scores.Industriousness, scores.Orderliness, scores.Enthusiasm,
        scores.Assertiveness, scores.Compassion, scores.Politeness, scores.Volatility, scores.Withdrawal
    ];

    // Destroy previous chart instance if it exists
    if (window.resultsChart) {
        window.resultsChart.destroy();
    }

    window.resultsChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [{
                label: "Personality Scores",
                data: data,
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 25 // Adjust as needed based on your scoring range
                }
            }
        }
    });
}

// Export the chart as a PDF
function exportToPDF() {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();

    pdf.text("Personality Test Results", 10, 10);
    pdf.text("Big 5 and Big 10 Scores", 10, 20);

    // Convert chart to image and add to PDF
    pdf.addImage(window.resultsChart.toBase64Image(), "PNG", 10, 30, 180, 160);
    pdf.save("Personality_Test_Report.pdf");
}

// Function to toggle the display of the scores section with a smooth transition
function toggleScores() {
    const scoreboard = document.getElementById("scoreboard");
    const toggleButton = document.getElementById("toggle-button");

    if (scoreboard.classList.contains("show")) {
        scoreboard.classList.remove("show");
        toggleButton.innerText = "Show Scores";
    } else {
        scoreboard.classList.add("show");
        toggleButton.innerText = "Hide Scores";
    }
}
