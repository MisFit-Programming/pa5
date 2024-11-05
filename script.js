// script.js - Main application logic for PersonaMap

// Initialize global state variables
let currentQuestionIndex = 0;
let selectedQuestions = []; // Selected questions set based on user choices
let selectedResponse = null;
let countdown;
let timeLeft = 10;
let isFirstQuestion = true;  // Flag to identify the first question
const responses = {};
let examPrefix = "";

// Define the webhook URL for Discord
const DISCORD_ERROR_URL = "https://discord.com/api/webhooks/1303100385174749214/lalkBBYn46ZNHNEn0CoOza3elEG4NnI2mRTy7lwNR2H8G86SG4h3ffhvs1OA0y6Yc-RX"; // Replace with actual webhook URL

// Initialize scores for traits and facets
const scores = {
    Openness: 0, Conscientiousness: 0, Extraversion: 0, Agreeableness: 0, Neuroticism: 0,
    Intellect: 0, Receptivity: 0, Industriousness: 0, Orderliness: 0, Enthusiasm: 0,
    Assertiveness: 0, Compassion: 0, Politeness: 0, Volatility: 0, Withdrawal: 0
};
const facetScores = {}; // Track facet-level scores

// Initialize the app on DOM content load
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    if (!questions || !Array.isArray(questions) || questions.length === 0) {
        console.error("Questions are not defined or empty.");
        alert("Failed to load questions. Please reload the page.");
        return;
    }
    // Show only the usage agreement initially
    showSection("usage-agreement");
}

// Function to show a specific section and hide others
function showSection(sectionId) {
    const sections = ["usage-agreement", "question-selection", "test-section", "final-report", "score-header"];
    sections.forEach(id => {
        document.getElementById(id).style.display = id === sectionId ? (id === "score-header" ? "flex" : "block") : "none";
    });
}

// Accept the user agreement and prefix
function acceptAgreement() {
    const prefixInput = document.getElementById("prefix-input").value.trim();
    if (prefixInput.length === 3) {
        examPrefix = prefixInput.toUpperCase();
        showSection("question-selection"); // Show question selection modal
    } else {
        alert("Please enter a 3-character prefix.");
    }
}

// Function to shuffle and select questions based on user input
function randomizeQuestions(numPerFacet) {
    const facets = {};

    questions.forEach(q => {
        if (!facets[q.facet.name]) facets[q.facet.name] = [];
        facets[q.facet.name].push(q);
    });

    selectedQuestions = Object.values(facets).flatMap(facetQuestions => 
        shuffleArray(facetQuestions).slice(0, numPerFacet === "all" ? facetQuestions.length : numPerFacet)
    );

    showSection("test-section");
    displayQuestion();
}

// Utility function to shuffle an array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Display the current question and start or pause the timer based on the question index
function displayQuestion() {
    showSection("score-header");
    document.getElementById("test-section").style.display = "block";

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

    // Show the message for the first question only and prevent duplicates
    if (isFirstQuestion) {
        showFirstQuestionMessage();
    } else {
        // Start the timer immediately for other questions
        timeLeft = 10;
        updateTimerDisplay();
        startTimer();
    }
    // Update progress bar
    updateProgressBar();
}

// Display a message for the first question and pause the timer
function showFirstQuestionMessage() {
    if (!document.getElementById("first-question-message")) { // Prevent duplicate messages
        const messageElement = document.createElement("p");
        messageElement.innerText = "The timer will begin after you answer the first question.";
        messageElement.id = "first-question-message";
        messageElement.style.color = "blue";
        messageElement.style.fontSize = "1.2em";
        document.getElementById("question-container").prepend(messageElement);
    }
}

// Function to handle the user's response to the first question and start the timer after
function handleFirstAnswer() {
    // Remove the first-question message
    const messageElement = document.getElementById("first-question-message");
    if (messageElement) messageElement.remove();

    isFirstQuestion = false; // Set flag to false to allow timer on subsequent questions

    // Start the timer for the next question
    timeLeft = 10;
    startTimer();
}

// Timer management functions
function startTimer() {
    clearInterval(countdown);
    countdown = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();

        if (timeLeft <= 0) {
            clearInterval(countdown);
            saveDefaultResponse();
            autoAdvance();
        }
    }, 1000);
}

// Update the timer display with a color gradient
function updateTimerDisplay() {
    const timerElement = document.getElementById("timer");
    timerElement.innerText = `Time left: ${timeLeft}s`;

    const green = Math.floor((timeLeft / 10) * 255);
    const red = 255 - green;
    timerElement.style.color = `rgb(${red}, ${green}, 0)`;
}

// Default response if timer expires
function saveDefaultResponse() {
    if (!responses[currentQuestionIndex]) {
        selectedResponse = 0;
        saveResponse();
    }
}

// Function to save response and update scores
function saveResponse() {
    const question = selectedQuestions[currentQuestionIndex];
    responses[currentQuestionIndex] = selectedResponse;

    // Update trait and facet scores
    for (const [aspect, baseScore] of Object.entries(question.facet.scores)) {
        if (scores[aspect] !== undefined) {
            scores[aspect] += baseScore * selectedResponse;
        }
    }

    // Update facet scores
    const facetName = question.facet.name;
    if (!facetScores[facetName]) facetScores[facetName] = 0;
    facetScores[facetName] += selectedResponse;

    updateBig5Scores();

    // If this was the first question, handle the first answer logic
    if (isFirstQuestion) {
        handleFirstAnswer();
    }
}

// Update the scores for Big 5 categories
function updateBig5Scores() {
    scores.Openness = scores.Intellect + scores.Receptivity;
    scores.Conscientiousness = scores.Industriousness + scores.Orderliness;
    scores.Extraversion = scores.Enthusiasm + scores.Assertiveness;
    scores.Agreeableness = scores.Compassion + scores.Politeness;
    scores.Neuroticism = scores.Volatility + scores.Withdrawal;
}

// Auto advance to the next question or show the final report
function autoAdvance() {
    if (currentQuestionIndex < selectedQuestions.length - 1) {
        currentQuestionIndex++;
        displayQuestion();
    } else {
        clearInterval(countdown);
        showFinalReport();
    }
}

// Show the final report, render charts, and display facet scores
function showFinalReport() {
    console.log("Showing Final Report");
    showSection("final-report");
    renderAllCharts();
    displayFacetTotals();
}

// Display facet totals in a grid format in the final report, sorted by highest to lowest
function displayFacetTotals() {
    const facetScoresContainer = document.getElementById("facet-scores");
    facetScoresContainer.innerHTML = ""; // Clear previous content

    // Convert facetScores object to an array and sort by score
    const sortedFacetScores = Object.entries(facetScores).sort((a, b) => b[1] - a[1]);

    // Create grid header
    const headerRow = document.createElement("div");
    headerRow.className = "facet-grid-header";
    headerRow.innerHTML = `
        <div class="facet-grid-item"><strong>Facet</strong></div>
        <div class="facet-grid-item"><strong>Score</strong></div>
    `;
    facetScoresContainer.appendChild(headerRow);

    // Display each facet in grid format with appropriate aspect color
    sortedFacetScores.forEach(([facet, score]) => {
        const facetRow = document.createElement("div");
        facetRow.className = "facet-grid-row";

        const aspect = findAspectForFacet(facet); // Find the aspect for the facet
        const color = aspectColors[aspect] || "#ddd"; // Default to light gray if no color found

        facetRow.innerHTML = `
            <div class="facet-grid-item" style="background-color: ${color};">${facet}</div>
            <div class="facet-grid-item">${score.toFixed(2)}</div>
        `;
        facetScoresContainer.appendChild(facetRow);
    });
}

// Helper function to find the aspect based on facet name
function findAspectForFacet(facetName) {
    const question = questions.find(q => q.facet.name === facetName);
    return question ? question.aspect : null;
}

// Display timer in UI on each question
document.addEventListener('DOMContentLoaded', () => {
    const timerElement = document.createElement('div');
    timerElement.id = 'timer';
    timerElement.style.fontSize = '1.2em';
    timerElement.style.margin = '10px 0';
    document.getElementById("question-container").prepend(timerElement);
});

// Update progress bar on each question
function updateProgressBar() {
    const progressBar = document.getElementById("progress-bar");
    const progressPercent = ((currentQuestionIndex + 1) / selectedQuestions.length) * 100;

    progressBar.style.width = `${progressPercent}%`;

    // Change color to green if progress is complete
    if (progressPercent === 100) {
        progressBar.classList.add("progress-completed");
    }
}
// Function to send error report to Discord
async function sendErrorReportToDiscord(questionText) {
    if (!DISCORD_ERROR_URL) {
        console.error("Discord webhook URL is not defined.");
        return;
    }

    const payload = {
        content: `=-=-=-=-=-=-=-=-=\n**Error Report**\n**Issue with Question:** ${questionText}`,
        username: "Error Reporter",
        avatar_url: "https://example.com/avatar.png"
    };

    try {
        const response = await fetch(DISCORD_ERROR_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            console.log("Error report sent to Discord successfully.");
        } else {
            console.error("Failed to send error report to Discord:", response.statusText);
        }
    } catch (error) {
        console.error("Error occurred while sending error report:", error);
    }
}

// Event listener for the Report Issue button
document.getElementById("report-issue-button").addEventListener("click", () => {
    const questionText = document.getElementById("question-text")?.innerText || "Unknown Question";
    console.log("Report Issue button clicked. Question text:", questionText);
    
    if (questionText) {
        sendErrorReportToDiscord(questionText);
    } else {
        alert("No question found to report.");
    }
});