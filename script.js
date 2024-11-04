// Initialize question index, responses storage, and scores
let currentQuestionIndex = 0;
const responses = {}; // Stores responses by question index
let examPrefix = ""; // Store the user prefix
let countdown; // Holds the setInterval reference for the countdown timer
let timeLeft = 10; // Countdown time in seconds

const scores = {
    Openness: 0, Conscientiousness: 0, Extraversion: 0, Agreeableness: 0, Neuroticism: 0,
    Intellect: 0, Receptivity: 0, Industriousness: 0, Orderliness: 0, Enthusiasm: 0,
    Assertiveness: 0, Compassion: 0, Politeness: 0, Volatility: 0, Withdrawal: 0
};

// Chart instances
let barBig5ChartInstance = null;
let barBig10ChartInstance = null;
let pieBig5ChartInstance = null;
let pieBig10ChartInstance = null;

document.addEventListener('DOMContentLoaded', initializeApp);

function initializeApp() {
    if (!questions || !Array.isArray(questions) || questions.length === 0) {
        console.error("Questions are not defined or empty.");
        alert("Failed to load questions. Please reload the page.");
        return;
    }
    document.getElementById("usage-agreement").style.display = "flex";
}

// Accept agreement, get prefix, and display the first question
function acceptAgreement() {
    const prefixInput = document.getElementById("prefix-input").value.trim();

    // Validate prefix - it should be 3 characters and will be converted to uppercase
    if (prefixInput.length === 3) {
        examPrefix = prefixInput.toUpperCase();
    } else {
        alert("Please enter a 3-character prefix.");
        return;
    }
    document.getElementById("usage-agreement").style.display = "none";
    document.getElementById("test-section").style.display = "block";
    document.getElementById("score-header").style.display = "flex";
    displayQuestion();
}

// Display the current question and start the countdown timer
function displayQuestion() {
    if (currentQuestionIndex >= questions.length) {
        showFinalReport();
        return;
    }

    const question = questions[currentQuestionIndex];
    document.getElementById("current-question-header").innerText =
        `Question ${currentQuestionIndex + 1} of ${questions.length}`;
    
    const questionTextElement = document.getElementById("question-text");
    questionTextElement.style.fontSize = "1.5em";
    questionTextElement.innerText = question.question;

    selectedResponse = responses[currentQuestionIndex] || null;
    updateLikertSelection();
    setupLikertListeners();

    // Reset and start the countdown timer for each question
    timeLeft = 10;
    updateTimerDisplay();
    startTimer();
}

// Timer-related functions
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

// Update the timer display in the UI
function updateTimerDisplay() {
    const timerElement = document.getElementById("timer");
    timerElement.innerText = `Time left: ${timeLeft}s`;
}

// Save a default response of 0 if the timer expires
function saveDefaultResponse() {
    if (!responses[currentQuestionIndex]) {
        selectedResponse = 0; // Default to 0 if unanswered
        saveResponse();
    }
}

// Set up Likert scale selection listeners
function setupLikertListeners() {
    const segments = document.querySelectorAll('.bar-segment');
    segments.forEach(segment => {
        segment.removeEventListener('click', handleLikertClick);
        segment.removeEventListener('keydown', handleBarSegmentKeydown);
        segment.addEventListener('click', handleLikertClick);
        segment.addEventListener('keydown', handleBarSegmentKeydown);
    });
}

function handleLikertClick(event) {
    selectedResponse = parseInt(event.target.getAttribute('data-value'), 10);
    updateLikertSelection();
    saveResponse(); // Save and auto-advance on selection
    autoAdvance();
}

function handleBarSegmentKeydown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        event.target.click();
    }
}

// Update Likert scale selection
function updateLikertSelection() {
    document.querySelectorAll('.bar-segment').forEach(segment => {
        segment.classList.toggle('selected', segment.getAttribute('data-value') === selectedResponse?.toString());
    });
}

// Automatically proceed to the next question or show final report if last question
function autoAdvance() {
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        displayQuestion();
    } else {
        clearInterval(countdown); // Clear any remaining timer interval
        showFinalReport(); // Show report if last question
    }
}

// Save response with scoring adjustment for each question
function saveResponse() {
    const question = questions[currentQuestionIndex];
    
    if (responses[currentQuestionIndex]) removePreviousScore();
    responses[currentQuestionIndex] = selectedResponse;

    // Apply multiplier for each aspect score and add to respective scores
    for (const [aspect, baseScore] of Object.entries(question.facet.scores)) {
        if (scores[aspect] !== undefined) {
            scores[aspect] += baseScore * selectedResponse;
        } else {
            console.warn(`Aspect ${aspect} not found in scores object.`);
        }
    }
    updateBig5Scores();
}

// Update Big 5 scores based on respective aspects
function updateBig5Scores() {
    scores.Openness = scores.Intellect + scores.Receptivity;
    scores.Conscientiousness = scores.Industriousness + scores.Orderliness;
    scores.Extraversion = scores.Enthusiasm + scores.Assertiveness;
    scores.Agreeableness = scores.Compassion + scores.Politeness;
    scores.Neuroticism = scores.Volatility + scores.Withdrawal;

    updateScores();
}

// Update the displayed scores in the UI
function updateScores() {
    document.getElementById("openness-score").innerText = scores.Openness;
    document.getElementById("conscientiousness-score").innerText = scores.Conscientiousness;
    document.getElementById("extraversion-score").innerText = scores.Extraversion;
    document.getElementById("agreeableness-score").innerText = scores.Agreeableness;
    document.getElementById("neuroticism-score").innerText = scores.Neuroticism;
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

// Show the final report and render all charts
function showFinalReport() {
    document.getElementById("test-section").style.display = "none";
    document.getElementById("score-header").style.display = "none";
    document.getElementById("final-report").style.display = "block";
    renderAllCharts();
}

// Render charts in the final report
function renderAllCharts() {
    const barBig5Ctx = document.getElementById("barBig5Chart").getContext("2d");
    const barBig10Ctx = document.getElementById("barBig10Chart").getContext("2d");
    const pieBig5Ctx = document.getElementById("pieBig5Chart").getContext("2d");
    const pieBig10Ctx = document.getElementById("pieBig10Chart").getContext("2d");

    const big5Traits = ["Openness", "Conscientiousness", "Extraversion", "Agreeableness", "Neuroticism"];
    const big10Clusters = ["Intellect", "Receptivity", "Industriousness", "Orderliness", "Enthusiasm", "Assertiveness", "Compassion", "Politeness", "Volatility", "Withdrawal"];
    const barBig5Data = big5Traits.map(trait => scores[trait]);
    const barBig10Data = big10Clusters.map(cluster => scores[cluster]);

    [barBig5ChartInstance, barBig10ChartInstance, pieBig5ChartInstance, pieBig10ChartInstance].forEach(chart => chart?.destroy());

    barBig5ChartInstance = createBarChart(barBig5Ctx, big5Traits, barBig5Data, 'Big 5 Traits Scores');
    barBig10ChartInstance = createBarChart(barBig10Ctx, big10Clusters, barBig10Data, 'Big 10 Clusters Scores');
    pieBig5ChartInstance = createPieChart(pieBig5Ctx, big5Traits, barBig5Data, 'Big 5 Traits Distribution');
    pieBig10ChartInstance = createPieChart(pieBig10Ctx, big10Clusters, barBig10Data, 'Big 10 Clusters Distribution');
}

function createBarChart(ctx, labels, data, title) {
    const backgroundColors = labels.map(label => aspectColors[label] || traitColors[label] || "#cccccc");

    return new Chart(ctx, {
        type: 'bar',
        data: { 
            labels, 
            datasets: [{
                label: title,
                data: data,
                backgroundColor: backgroundColors,
                borderWidth: 1
            }]
        },
        options: { 
            responsive: true,
            scales: { 
                y: { 
                    beginAtZero: true
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: title
                }
            }
        }
    });
}

function createPieChart(ctx, labels, data, title) {
    const backgroundColors = labels.map(label => aspectColors[label] || traitColors[label] || "#cccccc");

    return new Chart(ctx, {
        type: 'pie',
        data: { 
            labels, 
            datasets: [{
                data: data,
                backgroundColor: backgroundColors,
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: title
                }
            }
        }
    });
}

// Export report to PDF with all charts
async function exportToPDF() {
    const loadingIndicator = document.getElementById("pdf-loading");
    loadingIndicator.style.display = 'flex';

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: 'a4'
    });

    const examNumber = generateExamNumber();

    pdf.setFontSize(22);
    pdf.text('Big 5 Personality Test Report', 40, 40);
    pdf.setFontSize(12);
    pdf.text(`Exam Number: ${examNumber}`, 40, 60);
    pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, 40, 80);
    pdf.setLineWidth(0.5);
    pdf.line(40, 90, pdf.internal.pageSize.width - 40, 90);

    async function addChartToPDF(chartId, title, yOffset = 110, maxWidth = 500) {
        const chartCanvas = document.getElementById(chartId);
        if (!chartCanvas) {
            console.warn(`Chart with ID ${chartId} not found.`);
            return;
        }

        return new Promise((resolve) => {
            setTimeout(() => {
                const imgData = chartCanvas.toDataURL('image/png', 1.0);
                const canvasWidth = chartCanvas.width;
                const canvasHeight = chartCanvas.height;
                const aspectRatio = canvasWidth / canvasHeight;

                let displayWidth = maxWidth;
                let displayHeight = maxWidth / aspectRatio;

                const maxHeight = 400;
                if (displayHeight > maxHeight) {
                    displayHeight = maxHeight;
                    displayWidth = maxHeight * aspectRatio;
                }

                const pageWidth = pdf.internal.pageSize.width;
                const xOffset = (pageWidth - displayWidth) / 2;

                pdf.setFontSize(16);
                pdf.text(title, xOffset, yOffset);
                pdf.addImage(imgData, 'PNG', xOffset, yOffset + 10, displayWidth, displayHeight);
                resolve(yOffset + displayHeight + 40);
            }, 100);
        });
    }

    try {
        let yOffset = 110;
        yOffset = await addChartToPDF('barBig5Chart', 'Big 5 Traits - Bar Chart', yOffset);
        pdf.addPage();
        yOffset = await addChartToPDF('barBig10Chart', 'Big 10 Clusters - Bar Chart', 110);

        pdf.addPage();
        yOffset = await addChartToPDF('pieBig5Chart', 'Big 5 Traits - Pie Chart', 110);
        pdf.addPage();
        await addChartToPDF('pieBig10Chart', 'Big 10 Clusters - Pie Chart', 110);

        pdf.save(`Personality_Test_Report_${examNumber}.pdf`);
    } catch (error) {
        console.error("Error generating PDF:", error);
        alert("An error occurred while generating the PDF.");
    } finally {
        loadingIndicator.style.display = 'none';
    }
}

// Generate a 16-digit numeric exam number with prefix
function generateExamNumber() {
    let numericExamNumber = "";
    for (let i = 0; i < 16; i++) {
        numericExamNumber += Math.floor(Math.random() * 10);
    }
    return `${examPrefix}-${numericExamNumber}`;
}

// Define colors for Big 5 traits and their respective Big 10 aspects
const traitColors = {
    Openness: "#fefa92",
    Conscientiousness: "#80c7aa",
    Extraversion: "#ffe9bc",
    Agreeableness: "#bbeaff",
    Neuroticism: "#e0cedd"
};

const aspectColors = {
    Intellect: traitColors.Openness,
    Receptivity: traitColors.Openness,
    Industriousness: traitColors.Conscientiousness,
    Orderliness: traitColors.Conscientiousness,
    Enthusiasm: traitColors.Extraversion,
    Assertiveness: traitColors.Extraversion,
    Compassion: traitColors.Agreeableness,
    Politeness: traitColors.Agreeableness,
    Volatility: traitColors.Neuroticism,
    Withdrawal: traitColors.Neuroticism
};

// Display timer in UI
document.addEventListener('DOMContentLoaded', () => {
    const timerElement = document.createElement('div');
    timerElement.id = 'timer';
    timerElement.style.fontSize = '1.2em';
    timerElement.style.margin = '10px 0';
    document.getElementById("question-container").prepend(timerElement);
    displayQuestion();
});

