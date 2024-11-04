// Define chart instances at the top to ensure global access across functions
let barBig5ChartInstance = null;
let barBig10ChartInstance = null;
let pieBig5ChartInstance = null;
let pieBig10ChartInstance = null;

// Display the final report and render all charts
function showFinalReport() {
    document.getElementById("test-section").style.display = "none";
    document.getElementById("score-header").style.display = "none";
    document.getElementById("final-report").style.display = "block";
    renderAllCharts();
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

// Render all charts (Big 5 Traits and Big 10 Clusters in both bar and pie formats)
function renderAllCharts() {
    const big5Traits = ["Openness", "Conscientiousness", "Extraversion", "Agreeableness", "Neuroticism"];
    const big10Clusters = ["Intellect", "Receptivity", "Industriousness", "Orderliness", "Enthusiasm", "Assertiveness", "Compassion", "Politeness", "Volatility", "Withdrawal"];

    const barBig5Data = big5Traits.map(trait => scores[trait] || 0);
    const barBig10Data = big10Clusters.map(cluster => scores[cluster] || 0);

    // Destroy existing chart instances before creating new ones
    destroyCharts([barBig5ChartInstance, barBig10ChartInstance, pieBig5ChartInstance, pieBig10ChartInstance]);

    // Create and store new chart instances
    barBig5ChartInstance = createBarChart('barBig5Chart', big5Traits, barBig5Data, 'Big 5 Traits Scores', big5Traits.map(trait => traitColors[trait]));
    barBig10ChartInstance = createBarChart('barBig10Chart', big10Clusters, barBig10Data, 'Big 10 Clusters Scores', big10Clusters.map(cluster => aspectColors[cluster]));
    pieBig5ChartInstance = createPieChart('pieBig5Chart', big5Traits, barBig5Data, 'Big 5 Traits Distribution', big5Traits.map(trait => traitColors[trait]));
    pieBig10ChartInstance = createPieChart('pieBig10Chart', big10Clusters, barBig10Data, 'Big 10 Clusters Distribution', big10Clusters.map(cluster => aspectColors[cluster]));
}

// Function to destroy existing chart instances
function destroyCharts(charts) {
    charts.forEach(chart => chart?.destroy());
}

// Function to create a bar chart with specified colors
function createBarChart(chartId, labels, data, title, colors) {
    const ctx = getCanvasContext(chartId);
    if (!ctx) return null;

    return new Chart(ctx, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [{
                label: title,
                data: data,
                backgroundColor: colors,
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

// Function to create a pie chart with specified colors
function createPieChart(chartId, labels, data, title, colors) {
    const ctx = getCanvasContext(chartId);
    if (!ctx) return null;

    return new Chart(ctx, {
        type: "pie",
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colors,
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

// Helper function to get the 2D context of a canvas element by its ID
function getCanvasContext(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) {
        console.warn(`Canvas with ID ${canvasId} not found.`);
        return null;
    }
    return canvas.getContext("2d");
}
