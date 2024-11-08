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

const facetScores = {
    Openness: {
        Quickness: 0, Creativity: 0, Expertise: 0, Inquisitiveness: 0, Ingenuity: 0,
        Capability: 0, Introspection: 0, Depth: 0, Flexibility: 0, Functionality: 0,
        "Self-Awareness": 0, Fantasy: 0, Mindfulness: 0, Imagination: 0, Aesthetics: 0
    },
    Conscientiousness: {
        Purposefulness: 0, Efficiency: 0, Willpower: 0, Competence: 0, Organization: 0,
        "Achievement Striving": 0, Dutifulness: 0, Deliberation: 0, Rationality: 0,
        Cautiousness: 0, Perfectionism: 0, Patterned: 0, Integrity: 0, Systematic: 0
    },
    Extraversion: {
        Friendliness: 0, Warmth: 0, Gregariousness: 0, Poise: 0, Cheerfulness: 0,
        "Self-Disclosure": 0, Sociability: 0, Activity: 0, Talkativeness: 0, 
        "Excitement Seeking": 0, Provocativeness: 0, Forcefullness: 0, Leadership: 0
    },
    Agreeableness: {
        Caring: 0, Sympathy: 0, Understanding: 0, Empathy: 0, Altruism: 0,
        Tenderness: 0, Utopian: 0, Trusting: 0, Modesty: 0, Straightforwardness: 0,
        Cooperative: 0, Pleasant: 0, Compliant: 0, Moral: 0, Nuturing: 0
    },
    Neuroticism: {
        "Angry Hostility": 0, "Self-Consciousness": 0, Anxiety: 0, Vulnerability: 0,
        Depression: 0, Impulsiveness: 0
    },
    Stability: {
        Stability: 0, Calmness: 0, Tranquility: 0, "Impulse control": 0, Moderation: 0,
        Imperturbability: 0, Acceptance: 0, Toughness: 0, Happiness: 0
    }
};


const facetTraitMapping = {
    Stability: "Stability",
    Calmness: "Stability",
    Tranquility: "Stability",
    "Impulse control": "Stability",
    Moderation: "Stability",
    Imperturbability: "Stability",
    Acceptance: "Stability",
    Toughness: "Stability",
    Happiness: "Stability",
    // Other facets follow their natural trait; e.g., Quickness belongs to Openness, etc.
};


// Initialize the app on DOM content load
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    // Show only the usage agreement initially
    if(BYPASS_LOGIN) {showSection("usage-agreement");}
        else 
    {showSection("login-overlay");}
}


// Function to show a specific section and hide others
function showSection(sectionId) {
    const sections = ["usage-agreement", "question-selection", "test-section", "final-report", "score-header"];
    sections.forEach(id => {
        document.getElementById(id).style.display = id === sectionId ? (id === "score-header" ? "flex" : "block") : "none";
    }); 
}

// Store prefix when user accepts the agreement
function acceptAgreement() {
    const prefixInput = document.getElementById("prefix-input").value.trim().toUpperCase();
    
    if (prefixInput.length === 3) {
        localStorage.setItem("prefix", prefixInput); // Save the prefix
        document.getElementById("usage-agreement").style.display = "none";
        document.getElementById("question-selection").style.display = "block";
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

    questions = Object.values(facets).flatMap(facetQuestions => 
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

    // Show the message for the first question only and prevent duplicates
    if (isFirstQuestion) {
        showFirstQuestionMessage();
    } else {
        // Start the timer immediately for other questions
        timeLeft = 10;
        updateTimerDisplay();
        startTimer();
    }

    updateProgressBar(); // Update the progress bar with each question
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

// Function to log and compare current facet names with the defined facetScores structure
function logFacetScores() {
    console.log(`\n--- Facet Name Comparison after Question ${currentQuestionIndex + 1} ---`);
    
    selectedQuestions.forEach((question, index) => {
        const trait = question.trait;
        const facetNameFromQuestion = question.facet.name.trim(); // Get and trim facet name from questions
        const facetExistsInScores = facetScores[trait] && facetScores[trait][facetNameFromQuestion] !== undefined;

        // Log each comparison to check for mismatches
        if (facetExistsInScores) {
            console.log(`Match: Question ${index + 1} - Trait: ${trait}, Facet: "${facetNameFromQuestion}"`);
        } else {
            console.warn(`Mismatch or Missing: Question ${index + 1} - Trait: ${trait}, Facet: "${facetNameFromQuestion}" not found in facetScores`);
        }
    });
    
    console.log("\n--- End of Comparison ---\n");
}

function saveResponse() {
    //console.trace("Tracing saveResponse calls"); // Add this at the beginning of saveResponse
    //console.log("saveResponse called"); // This should appear only once per click

    const question = selectedQuestions[currentQuestionIndex];
    responses[currentQuestionIndex] = selectedResponse;

    for (const [aspect, baseScore] of Object.entries(question.facet.scores)) {
        if (scores[aspect] !== undefined) {
            scores[aspect] += baseScore * selectedResponse;
        }
    }

    const trait = question.trait;
    const facetName = question.facet.name.trim();
    const targetTrait = facetTraitMapping[facetName] || trait;

    if (facetScores[targetTrait] && facetScores[targetTrait][facetName] !== undefined) {
        facetScores[targetTrait][facetName] += selectedResponse;
        //console.log(`Updated ${targetTrait} - ${facetName}: ${facetScores[targetTrait][facetName]}`);
    } else {
        console.warn(`Facet "${facetName}" under trait "${trait}" not found in facetScores.`);
    }

    updateBig5Scores();
    if (isFirstQuestion) handleFirstAnswer();
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

function displayFacetTotals() {
    const facetScoresContainer = document.getElementById("facet-scores");
    facetScoresContainer.innerHTML = ""; // Clear previous content

    // Define color mapping directly within the function for use in inline styling
    const traitColors = {
        Openness: "#fefa92",
        Conscientiousness: "#80c7aa",
        Extraversion: "#ffe9bc",
        Agreeableness: "#bbeaff",
        Neuroticism: "#e0cedd",
        Stability: "#d3d3f5"
    };

    Object.keys(facetScores).forEach(trait => {
        // Create a column container for each trait
        const traitColumn = document.createElement("div");
        traitColumn.className = `trait-column trait-${trait.toLowerCase()}`;
        
        // Apply the background color inline
        traitColumn.style.backgroundColor = traitColors[trait] || "#ffffff"; // Default to white if color is not found

        // Trait header
        const traitHeader = document.createElement("div");
        traitHeader.className = "trait-column-header";
        traitHeader.textContent = trait;
        traitColumn.appendChild(traitHeader);

        // Sort facets by score within each trait and include zero scores
        const sortedFacets = Object.entries(facetScores[trait])
            .map(([facet, score]) => ({ facet, score })) // Map all entries, including zeros
            .sort((a, b) => b.score - a.score); // Sort in descending order

        // Display each facet as a row within the column
        sortedFacets.forEach(({ facet, score }) => {
            const facetRow = document.createElement("div");
            facetRow.className = "facet-row";

            // Facet name
            const facetName = document.createElement("div");
            facetName.className = "facet-name";
            facetName.textContent = facet;

            // Facet score
            const facetScore = document.createElement("div");
            facetScore.className = "facet-score";
            facetScore.textContent = score.toFixed(2); // Display zero scores

            // Append facet name and score to row, then row to column
            facetRow.appendChild(facetName);
            facetRow.appendChild(facetScore);
            traitColumn.appendChild(facetRow);
        });

        // Append the trait column to the main container
        facetScoresContainer.appendChild(traitColumn);
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

// Generate the test number and current date dynamically
async function sendErrorReportToDiscord(issueType) {
    if (!DISCORD_ERROR_URL) {
        console.error("Discord webhook URL is not defined.");
        return;
    }

    const questionText = document.getElementById("question-text")?.innerText || "Unknown Question";
    const payload = {
        content: `=-=-=-=-=-=-=-=-=\n**Error Report**\n**Issue Type:** ${issueType}\n**Question Text:** ${questionText}`,
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
            alert(`Report sent: ${issueType}`);
            console.log("Error report sent to Discord successfully.");
        } else {
            console.error("Failed to send error report to Discord:", response.statusText);
        }
    } catch (error) {
        console.error("Error occurred while sending error report:", error);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    // Populate test number and date fields if values are available
    document.getElementById("test-number").textContent = examPrefix || "TST-0001";
    document.getElementById("test-date").textContent = new Date().toLocaleDateString();
});